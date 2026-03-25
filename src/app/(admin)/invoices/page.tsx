import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import InvoiceListClient from "@/components/admin/InvoiceListClient";

export default async function AdminInvoices() {
  const session = await getServerSession(authOptions);

  if ((session?.user as any)?.role !== "ADMIN") return <div>Not authorized</div>;

  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-display text-slate-900 tracking-tight">Invoices</h1>
        <p className="text-slate-500 mt-1">Manage billing, payments, and document generation.</p>
      </div>

      <InvoiceListClient initialInvoices={invoices} />
    </div>
  );
}
