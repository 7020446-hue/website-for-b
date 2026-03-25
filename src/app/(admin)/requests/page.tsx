import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  MoreVertical,
  ArrowRightCircle,
} from "lucide-react";
import { updateRequestStatus, convertToInvoice } from "@/actions/requests";

export default async function AdminRequests() {
  const session = await getServerSession(authOptions);

  if ((session?.user as any)?.role !== "ADMIN") return <div>Not authorized</div>;

  const requests = await prisma.quoteRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: true },
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-display text-slate-900 tracking-tight">Quote Requests</h1>
        <p className="text-slate-500 mt-1">Review and manage incoming customer inquiries.</p>
      </div>

      {/* Requests Table/List */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Customer</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Product</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Qty</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {requests.map((req) => (
                <tr key={req.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{req.name}</div>
                    <div className="text-xs text-slate-500">{req.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-700">
                      {req.product?.name || "Custom Project"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-mono">{req.quantity}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                        req.status === "NEW"
                          ? "bg-blue-50 text-blue-600 border-blue-100"
                          : req.status === "COMPLETED"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : req.status === "REJECTED"
                          ? "bg-rose-50 text-rose-600 border-rose-100"
                          : "bg-slate-50 text-slate-600 border-slate-100"
                      }`}
                    >
                      {req.status === "NEW" && <Clock size={10} />}
                      {req.status === "COMPLETED" && <CheckCircle size={10} />}
                      {req.status === "REJECTED" && <XCircle size={10} />}
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {req.status !== "COMPLETED" && req.userId && (
                        <form action={convertToInvoice.bind(null, req.id)} method="POST">
                          <button
                            type="submit"
                            title="Convert to Invoice"
                            className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            <ArrowRightCircle size={18} />
                          </button>
                        </form>
                      )}
                      <button className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-slate-400">
                    <div className="flex flex-col items-center">
                      <Clock size={40} className="mb-4 opacity-50" />
                      <p className="font-medium">No requests yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
