"use client";

import React from "react";
import { formatCurrency } from "@/lib/utils";
import { generateInvoicePDF } from "@/lib/pdf-utils";
import { Download, MoreVertical, CreditCard, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function InvoiceListClient({ initialInvoices }: { initialInvoices: any[] }) {
  const [invoices, setInvoices] = React.useState(initialInvoices);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PAID": return <CheckCircle size={14} className="text-emerald-500" />;
      case "SENT": return <Clock size={14} className="text-blue-500" />;
      case "OVERDUE": return <AlertCircle size={14} className="text-rose-500" />;
      default: return <CreditCard size={14} className="text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "SENT": return "bg-blue-50 text-blue-600 border-blue-100";
      case "OVERDUE": return "bg-rose-50 text-rose-600 border-rose-100";
      default: return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Invoice ID</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Customer</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Total</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {invoices.map((inv) => (
              <tr key={inv.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-mono text-xs text-slate-900 font-semibold truncate max-w-[120px]">
                    #{inv.id.substring(0, 8)}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {new Date(inv.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-900 leading-tight">{inv.user.name}</div>
                  <div className="text-xs text-slate-500">{inv.user.email}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-slate-900">{formatCurrency(inv.total)}</div>
                  <div className="text-[10px] text-slate-400">Tax {formatCurrency(inv.tax)}</div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(
                      inv.status
                    )}`}
                  >
                    {getStatusIcon(inv.status)}
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => generateInvoicePDF(inv, inv.user)}
                      className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Download PDF"
                    >
                      <Download size={18} />
                    </button>
                    <button className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-slate-400">
                  <div className="flex flex-col items-center">
                    <CreditCard size={40} className="mb-4 opacity-50" />
                    <p className="font-medium">No invoices yet.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
