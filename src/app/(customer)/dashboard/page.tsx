import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  ClipboardList,
  FileText,
  Ticket,
  ChevronRight,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

export default async function CustomerDashboard() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  if (!userId) return <div>Not logged in</div>;

  const requestsCount = await prisma.quoteRequest.count({ where: { userId } });
  const invoicesCount = await prisma.invoice.count({ where: { userId } });
  const ticketsCount = await prisma.ticket.count({ where: { userId, status: "OPEN" } });

  const stats = [
    { label: "My Requests", value: requestsCount.toString(), icon: ClipboardList, color: "bg-blue-100 text-blue-600" },
    { label: "My Invoices", value: invoicesCount.toString(), icon: FileText, color: "bg-orange-100 text-orange-600" },
    { label: "Open Tickets", value: ticketsCount.toString(), icon: Ticket, color: "bg-emerald-100 text-emerald-600" },
  ];

  const recentRequests = await prisma.quoteRequest.findMany({
    where: { userId },
    take: 3,
    orderBy: { createdAt: "desc" },
    include: { product: true },
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-display text-slate-900 tracking-tight">Customer Portal</h1>
        <p className="text-slate-500 mt-1">Manage your business requests, invoices, and support from one place.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-lg transition-all group overflow-hidden relative">
            <div className="flex items-center gap-4">
              <div className={stat.color + " p-3 rounded-2xl shrink-0 transition-transform group-hover:scale-110"}>
                <stat.icon size={24} />
              </div>
              <div>
                 <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
                 <h3 className="text-2xl font-bold text-slate-900 leading-tight mt-0.5">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900">Recent Requests</h2>
                <Link href="/customer/requests" className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full transition-colors">
                  View all
                </Link>
             </div>
             <div className="space-y-3">
               {recentRequests.map(req => (
                 <div key={req.id} className="p-4 rounded-2xl border border-slate-100 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold shrink-0">{req.name.charAt(0)}</div>
                       <div>
                          <div className="font-bold text-slate-900">{req.product?.name || "Custom Price Quote"}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{new Date(req.createdAt).toLocaleDateString()}</div>
                       </div>
                    </div>
                    <div>
                       <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border ${
                          req.status === "NEW" ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                        }`}>
                         {req.status}
                       </span>
                    </div>
                 </div>
               ))}
               {recentRequests.length === 0 && (
                 <div className="py-10 text-center text-slate-400 text-sm">No recent requests found.</div>
               )}
             </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="p-8 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl shadow-xl text-white relative overflow-hidden group">
              <div className="relative z-10">
                 <h3 className="text-xl font-bold mb-4">Need Help?</h3>
                 <p className="text-sm text-blue-100 mb-6 leading-relaxed opacity-90">Our support engineers are ready to assist you. Open a new ticket for dedicated help.</p>
                 <Link href="/customer/tickets/new" className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                    <Ticket size={18} />
                    Open Support Ticket
                 </Link>
              </div>
              <div className="absolute -right-10 -bottom-10 opacity-20 transform rotate-12 group-hover:scale-110 transition-transform duration-700">
                <Ticket size={160} />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
