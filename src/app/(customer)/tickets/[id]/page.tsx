import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import TicketMessageThread from "@/components/shared/TicketMessageThread";
import { ArrowLeft, User, MessageCircle, Clock, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface TicketPageProps {
  params: { id: string };
}

export default async function CustomerTicketDetailPage({ params }: TicketPageProps) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  if (!userId) return <div>Not authorized</div>;

  const ticket = await prisma.ticket.findUnique({
    where: { id: params.id },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  if (!ticket || ticket.userId !== userId) return <div>Ticket not found</div>;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <Link
        href="/customer/tickets"
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-all font-bold text-sm group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Support Center
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        <div className="lg:col-span-2">
          <TicketMessageThread ticket={ticket} initialMessages={ticket.messages} />
        </div>

        <div className="lg:col-span-1 space-y-8">
          <div className="p-8 bg-white border border-slate-200 rounded-[40px] shadow-sm">
            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
               <ShieldCheck size={24} className="text-indigo-600" />
               Ticket Audit
            </h3>
            <div className="space-y-8">
              <div className="flex items-center gap-5">
                 <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 font-black shrink-0">
                    <Clock size={24} />
                 </div>
                 <div>
                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Created At</div>
                    <div className="text-sm font-black text-slate-900">{new Date(ticket.createdAt).toLocaleString()}</div>
                 </div>
              </div>
              
              <div className="flex items-center gap-5 pt-8 border-t border-slate-50">
                 <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 font-black shrink-0">
                    <MessageCircle size={24} />
                 </div>
                 <div>
                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Total Signals</div>
                    <div className="text-sm font-black text-slate-900">{ticket.messages.length} System Messages</div>
                 </div>
              </div>
            </div>
            
            <div className="mt-12 p-6 bg-slate-50 border border-slate-100 rounded-3xl border-dashed">
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">Your message is securely encrypted and routed directly to our specialized infrastructure team for immediate review.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
