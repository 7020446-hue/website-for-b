import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  Clock,
  CheckCircle,
  XCircle,
  Package,
  Plus,
  ArrowRight,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default async function CustomerRequests() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  if (!userId) return <div>Not authorized</div>;

  const requests = await prisma.quoteRequest.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { product: true },
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-900 tracking-tight">My Requests</h1>
          <p className="text-slate-500 mt-1 font-medium">Tracking your bespoke project inquiries and quotes.</p>
        </div>
        <Link
          href="/products"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 group transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-blue-500/10"
        >
          <Plus size={18} />
          New Request
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((req) => (
          <div
            key={req.id}
            className="group bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                    req.status === "NEW"
                      ? "bg-blue-50 text-blue-600 border-blue-100"
                      : req.status === "COMPLETED"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                      : "bg-slate-50 text-slate-600 border-slate-100"
                  }`}
                >
                  {req.status}
                </span>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Clock size={12} />
                  {new Date(req.createdAt).toLocaleDateString()}
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                {req.product?.name || "Bespoke Solution Inquiry"}
              </h3>
              <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed font-medium">
                {req.description}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Quantity</div>
                <div className="text-lg font-black text-slate-900">{req.quantity} Units</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Reference No.</div>
                <div className="text-xs font-bold text-slate-900 font-mono">#{req.id.substring(0, 8)}</div>
              </div>
            </div>
          </div>
        ))}
        {requests.length === 0 && (
          <div className="col-span-full py-20 bg-white border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400">
             <ClipboardList size={40} className="mb-4 opacity-50 transition-transform group-hover:scale-110" />
             <p className="font-bold text-lg">No inquiries made yet.</p>
             <Link href="/products" className="text-blue-600 font-bold mt-2 hover:underline">Browse our catalog to start.</Link>
          </div>
        )}
      </div>
    </div>
  );
}
