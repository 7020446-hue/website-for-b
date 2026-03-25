import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import TicketMessageThread from "@/components/shared/TicketMessageThread";
import { ArrowLeft, User, Mail, Calendar } from "lucide-react";
import Link from "next/link";

interface TicketPageProps {
  params: { id: string };
}

export default async function AdminTicketDetailPage({ params }: TicketPageProps) {
  const session = await getServerSession(authOptions);

  if ((session?.user as any)?.role !== "ADMIN") return <div>Not authorized</div>;

  const ticket = await prisma.ticket.findUnique({
    where: { id: params.id },
    include: { user: true, messages: { orderBy: { createdAt: "asc" } } },
  });

  if (!ticket) return <div>Ticket not found</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <Link
        href="/admin/tickets"
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6 text-sm font-medium group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Support Center
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <TicketMessageThread ticket={ticket} initialMessages={ticket.messages} />
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
               Customer Profile
            </h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold shrink-0">
                    {ticket.user.name?.charAt(0)}
                 </div>
                 <div>
                    <div className="font-bold text-slate-900">{ticket.user.name}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Account Active</div>
                 </div>
              </div>
              
              <div className="space-y-4 pt-6 border-t border-slate-50">
                 <div className="flex items-center gap-3 text-slate-600">
                    <Mail size={16} className="text-slate-400" />
                    <span className="text-sm font-medium">{ticket.user.email}</span>
                 </div>
                 <div className="flex items-center gap-3 text-slate-600">
                    <Calendar size={16} className="text-slate-400" />
                    <span className="text-sm font-medium">Joined {new Date(ticket.user.createdAt).toLocaleDateString()}</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
