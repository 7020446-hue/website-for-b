import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Search, Ticket, User, Clock, ChevronRight, MessageCircle, Plus, SearchCheck } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function CustomerTickets() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  if (!userId) return <div>Not authorized</div>;

  const tickets = await prisma.ticket.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { messages: true } } },
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-900 tracking-tight leading-tight">Support <br /><span className="text-indigo-600">Center.</span></h1>
          <p className="text-slate-500 mt-2 font-medium">Get priority help from our enterprise engineers.</p>
        </div>
        <Link
          href="/customer/tickets/new"
          className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black flex items-center justify-center gap-3 transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-indigo-500/20"
        >
          <Plus size={20} />
          Open Ticket
        </Link>
      </div>

      {/* Grid of Tickets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map((ticket) => (
          <Link
            key={ticket.id}
            href={`/customer/tickets/${ticket.id}`}
            className="group bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 p-8"
          >
            <div className="flex items-start justify-between mb-6">
              <div
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-dashed transition-all group-hover:border-solid ${
                  ticket.status === "OPEN"
                    ? "bg-rose-50 text-rose-600 border-rose-100"
                    : ticket.status === "PENDING"
                    ? "bg-orange-50 text-orange-600 border-orange-100"
                    : "bg-slate-50 text-slate-600 border-slate-100"
                }`}
              >
                {ticket.status}
              </div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Clock size={12} />
                {new Date(ticket.createdAt).toLocaleDateString()}
              </div>
            </div>

            <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors mb-4 line-clamp-1 leading-tight tracking-tight">
              {ticket.subject}
            </h3>

            <div className="flex items-center gap-3 mt-8 pt-8 border-t border-slate-50">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 font-black text-xs shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:rotate-12">
                 <Ticket size={16} />
              </div>
              <div className="flex-1 truncate">
                 <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">Internal Reference</div>
                 <div className="text-xs font-bold text-slate-900 mt-1">TIC-{ticket.id.substring(0, 8).toUpperCase()}</div>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-indigo-500 transition-colors">
                <MessageCircle size={16} />
                <span className="text-xs font-black tracking-widest">{ticket._count.messages}</span>
              </div>
            </div>
          </Link>
        ))}
        {tickets.length === 0 && (
          <div className="col-span-full py-24 bg-white border-2 border-dashed border-slate-200 rounded-[40px] flex flex-col items-center justify-center text-slate-400 group hover:border-black transition-colors duration-500">
            <SearchCheck size={64} className="mb-6 opacity-30 group-hover:scale-110 transition-transform" />
            <p className="font-black text-xl text-slate-900 tracking-tight">No support inquiries.</p>
            <p className="text-xs font-bold uppercase tracking-widest mt-2 px-6 text-center leading-relaxed">Everything looks clear. If you have any technical or billing questions, reach out below.</p>
            <Link href="/customer/tickets/new" className="mt-8 text-indigo-600 font-black text-sm uppercase tracking-widest hover:text-indigo-700 flex items-center gap-2 group/link animate-bounce">
               Start A New Dialogue
               <ChevronRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
