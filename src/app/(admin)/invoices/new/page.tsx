import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ManualInvoiceForm from "@/components/admin/ManualInvoiceForm";
import { redirect } from "next/navigation";

export default async function NewInvoicePage() {
  const session = await getServerSession(authOptions);

  if ((session?.user as any)?.role !== "ADMIN") {
    redirect("/login");
  }

  const users = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    select: { id: true, name: true, email: true },
  });

  return (
    <div className="py-6 min-h-screen bg-slate-50">
      <ManualInvoiceForm users={users} />
    </div>
  );
}
