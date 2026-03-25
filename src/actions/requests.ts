"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function submitRequest(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const productId = formData.get("productId") as string || null;
  const quantity = parseInt(formData.get("quantity") as string) || 1;
  const description = formData.get("description") as string;
  const fileUrl = formData.get("fileUrl") as string || null;

  const session = await getServerSession(authOptions);

  await prisma.quoteRequest.create({
    data: {
      name,
      email,
      productId,
      quantity,
      description,
      fileUrl,
      userId: (session?.user as any)?.id || null,
    },
  });

  revalidatePath("/admin/requests");
  revalidatePath("/customer/dashboard");
  revalidatePath("/customer/requests");
}

export async function updateRequestStatus(id: string, status: any) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.quoteRequest.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin/requests");
  revalidatePath("/customer/requests");
}

export async function convertToInvoice(requestId: string) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") throw new Error("Unauthorized");

  const request = await prisma.quoteRequest.findUnique({
    where: { id: requestId },
    include: { product: true },
  });

  if (!request) throw new Error("Request not found");
  if (!request.userId) throw new Error("Request must be linked to a user to create invoice");

  const items = [
    {
      name: request.product?.name || "Custom Project",
      quantity: request.quantity,
      price: request.product?.price || 0,
    },
  ];

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const invoice = await prisma.invoice.create({
    data: {
      requestId: request.id,
      userId: request.userId,
      items: JSON.stringify(items),
      subtotal,
      tax,
      total,
      status: "DRAFT",
    },
  });

  await prisma.quoteRequest.update({
    where: { id: requestId },
    data: { status: "COMPLETED" },
  });

  revalidatePath("/admin/invoices");
  revalidatePath("/admin/requests");
  redirect(`/admin/invoices`);
}
