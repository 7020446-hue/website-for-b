"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function createProduct(formData: FormData) {
  await checkAdmin();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string) || null;
  const category = formData.get("category") as string;
  const minQuantity = parseInt(formData.get("minQuantity") as string) || 1;
  const type = formData.get("type") as string;
  const imageUrl = formData.get("imageUrl") as string;

  await prisma.product.create({
    data: {
      name,
      description,
      price,
      category,
      minQuantity,
      type,
      images: imageUrl, // Storing single URL for now
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  await checkAdmin();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string) || null;
  const category = formData.get("category") as string;
  const minQuantity = parseInt(formData.get("minQuantity") as string) || 1;
  const type = formData.get("type") as string;
  const imageUrl = formData.get("imageUrl") as string;

  await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      price,
      category,
      minQuantity,
      type,
      images: imageUrl,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath(`/products/${id}`);
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await checkAdmin();

  await prisma.product.delete({
    where: { id },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
}
