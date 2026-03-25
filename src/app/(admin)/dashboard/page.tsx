import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  ClipboardList,
  FileText,
  DollarSign,
  Ticket,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if ((session?.user as any)?.role !== "ADMIN") {
    return <div>Not authorized</div>;
  }

  const requestsCount = await prisma.quoteRequest.count();
  const invoicesCount = await prisma.invoice.count();
  const ticketsCount = await prisma.ticket.count({
    where: { status: "OPEN" },
  });

  const paidInvoices = await prisma.invoice.findMany({
    where: { status: "PAID" },
  });
  const revenue = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);

  const stats = [
    {
      label: "Total Requests",
      value: requestsCount.toString(),
      icon: ClipboardList,
      color: "bg-blue-100 text-blue-600",
      change: "+12.5%",
      trend: "up",
    },
    {
      label: "Total Invoices",
      value: invoicesCount.toString(),
      icon: FileText,
      color: "bg-orange-100 text-orange-600",
      change: "+8.2%",
      trend: "up",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(revenue),
      icon: DollarSign,
      color: "bg-emerald-100 text-emerald-600",
      change: "+24.0%",
      trend: "up",
    },
    {
      label: "Open Tickets",
      value: ticketsCount.toString(),
      icon: Ticket,
      color: "bg-purple-100 text-purple-600",
      change: "-5.3%",
      trend: "down",
    },
  ];

  const recentRequests = await prisma.quoteRequest.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { product: true },
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-display text-slate-900 tracking-tight">
          Admin Overview
        </h1>
        <p className="text-slate-500 mt-1">
          Welcome back, {session?.user?.name}. Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow group overflow-hidden relative"
          >
            <div className="flex items-center gap-4">
              <div className={stat.color + " p-3 rounded-xl shrink-0 group-hover:scale-110 transition-transform duration-300"}>
                <stat.icon size={24} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {stat.value}
                  </h3>
                  <span
                    className={`text-xs font-semibold flex items-center ${
                      stat.trend === "up" ? "text-emerald-500" : "text-rose-500"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <ArrowUpRight size={14} className="mr-0.5" />
                    ) : (
                      <ArrowDownRight size={14} className="mr-0.5" />
                    )}
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
            {/* Subtle background decoration */}
            <div className="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
              <stat.icon size={100} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Recent Requests & Invoices Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Recent Requests</h2>
              <Link
                href="/admin/requests"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full transition-colors"
                aria-label="View all requests"
              >
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {recentRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-xl border border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm shrink-0">
                      {req.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 leading-tight">
                        {req.name}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {req.product?.name || "Custom Project"} &bull; {req.quantity} units
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md mb-1 inline-block ${
                        req.status === "NEW"
                          ? "bg-blue-100 text-blue-600"
                          : req.status === "COMPLETED"
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {req.status}
                    </span>
                    <div className="text-xs text-slate-400">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
              {recentRequests.length === 0 && (
                <div className="text-center py-10 text-slate-400 text-sm">
                  No requests found.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h2 className="text-lg font-bold mb-4 opacity-90">Quick Actions</h2>
              <div className="grid grid-cols-1 gap-3">
                <Link
                  href="/admin/products/new"
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-xl flex items-center gap-3 transition-colors border border-white/10 group/btn"
                >
                  <Box size={18} className="text-blue-200" />
                  <span className="text-sm font-medium">Add New Product</span>
                  <ArrowUpRight
                    size={14}
                    className="ml-auto opacity-0 group-hover/btn:opacity-100 -translate-x-2 group-hover/btn:translate-x-0 transition-all"
                  />
                </Link>
                <Link
                  href="/admin/invoices/new"
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-xl flex items-center gap-3 transition-colors border border-white/10 group/btn"
                >
                  <FileText size={18} className="text-blue-200" />
                  <span className="text-sm font-medium">Create Invoice</span>
                  <ArrowUpRight
                    size={14}
                    className="ml-auto opacity-0 group-hover/btn:opacity-100 -translate-x-2 group-hover/btn:translate-x-0 transition-all"
                  />
                </Link>
                <Link
                  href="/admin/tickets"
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-xl flex items-center gap-3 transition-colors border border-white/10 group/btn"
                >
                  <Ticket size={18} className="text-blue-200" />
                  <span className="text-sm font-medium">Support Center</span>
                  <ArrowUpRight
                    size={14}
                    className="ml-auto opacity-0 group-hover/btn:opacity-100 -translate-x-2 group-hover/btn:translate-x-0 transition-all"
                  />
                </Link>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 opacity-20 transform rotate-12 group-hover:scale-110 transition-transform duration-700">
              <TrendingUp size={200} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Box = ({ size, className }: { size: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
);
