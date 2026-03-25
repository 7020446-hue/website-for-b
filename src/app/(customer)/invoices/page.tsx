import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import CustomerInvoiceListClient from "@/components/customer/CustomerInvoiceListClient";

export default async function CustomerInvoices() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  if (!userId) return <div>Not authorized</div>;

  const invoices = await prisma.invoice.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black font-display text-slate-900 tracking-tight leading-[1.1]">Financial <br /><span className="text-blue-600">Statements.</span></h1>
        <p className="text-slate-500 mt-2 font-medium max-w-sm">Manage your commercial invoicing and legal billing documents securely.</p>
      </div>

      <CustomerInvoiceListClient initialInvoices={invoices} user={session.user} />
    </div>
  );
}
