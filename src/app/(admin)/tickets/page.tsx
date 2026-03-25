import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Search, Ticket, User, Clock, ChevronRight, MessageCircle } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminTickets() {
  const session = await getServerSession(authOptions);

  if ((session?.user as any)?.role !== "ADMIN") return <div>Not authorized</div>;

  const tickets = await prisma.ticket.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, _count: { select: { messages: true } } },
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-display text-slate-900 tracking-tight">Support Tickets</h1>
        <p className="text-slate-500 mt-1">Manage customer inquiries and support requests.</p>
      </div>

      {/* Grid of Tickets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map((ticket) => (
          <Link
            key={ticket.id}
            href={`/admin/tickets/${ticket.id}`}
            className="group bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                  ticket.status === "OPEN"
                    ? "bg-rose-50 text-rose-600 border-rose-100"
                    : ticket.status === "PENDING"
                    ? "bg-orange-50 text-orange-600 border-orange-100"
                    : "bg-slate-50 text-slate-600 border-slate-100"
                }`}
              >
                {ticket.status}
              </div>
              <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Clock size={12} />
                {new Date(ticket.createdAt).toLocaleDateString()}
              </div>
            </div>

            <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-1">
              {ticket.subject}
            </h3>

            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-50">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs shrink-0">
                {ticket.user.name?.charAt(0) || "C"}
              </div>
              <div className="flex-1 truncate">
                <div className="text-xs font-bold text-slate-700 truncate">{ticket.user.name}</div>
                <div className="text-[10px] text-slate-400 truncate">{ticket.user.email}</div>
              </div>
              <div className="flex items-center gap-1 text-slate-400 group-hover:text-blue-500 transition-colors">
                <MessageCircle size={14} />
                <span className="text-xs font-bold">{ticket._count.messages}</span>
              </div>
            </div>
          </Link>
        ))}
        {tickets.length === 0 && (
          <div className="col-span-full py-20 bg-white border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400">
            <Ticket size={40} className="mb-4 opacity-50" />
            <p className="font-medium">No support tickets found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
