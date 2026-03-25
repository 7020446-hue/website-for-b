import ProductForm from "@/components/admin/ProductForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewProductPage() {
  const session = await getServerSession(authOptions);

  if ((session?.user as any)?.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="py-6">
      <ProductForm />
    </div>
  );
}
