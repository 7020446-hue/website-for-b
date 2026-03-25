"use client";

import React from "react";
import { formatCurrency } from "@/lib/utils";
import { generateInvoicePDF } from "@/lib/pdf-utils";
import { Download, CreditCard, Clock, CheckCircle, AlertCircle, FileText } from "lucide-react";

export default function CustomerInvoiceListClient({ initialInvoices, user }: { initialInvoices: any[], user: any }) {
  const [invoices] = React.useState(initialInvoices);

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
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <th className="px-8 py-6">Statement Reference</th>
              <th className="px-8 py-6">Financial Summary</th>
              <th className="px-8 py-6">Processing Status</th>
              <th className="px-8 py-6 text-right">Archival Download</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {invoices.map((inv) => (
              <tr key={inv.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                <td className="px-8 py-6">
                  <div className="font-mono text-xs text-slate-900 font-black truncate max-w-[120px] bg-slate-100 px-2 py-1 rounded-lg w-fit">
                    #{inv.id.substring(0, 10)}
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 ml-1">
                    Issued {new Date(inv.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="text-xl font-black text-slate-900 tracking-tight">{formatCurrency(inv.total)}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Inclusive Tax {formatCurrency(inv.tax)}</div>
                </td>
                <td className="px-8 py-6">
                  <span
                    className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-dashed transition-all group-hover:border-solid ${getStatusColor(
                      inv.status
                    )}`}
                  >
                    {getStatusIcon(inv.status)}
                    {inv.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                   <button
                     onClick={() => generateInvoicePDF(inv, user)}
                     className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs shadow-lg shadow-blue-500/20 transition-all transform active:scale-95 group/btn"
                     title="Download Official PDF"
                   >
                     <Download size={14} className="group-hover:-translate-y-0.5 transition-transform" />
                     SECURE PDF
                   </button>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr>
                <td colSpan={4} className="px-8 py-32 text-center text-slate-400">
                  <div className="flex flex-col items-center">
                    <FileText size={64} className="mb-6 opacity-30" />
                    <p className="font-black text-xl text-slate-900 tracking-tight">No commercial invoices yet.</p>
                    <p className="text-xs font-bold uppercase tracking-widest mt-2">When our team issues a proposal, it will appear here for download.</p>
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
