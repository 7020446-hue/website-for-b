"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { sendMessage, updateTicketStatus } from "@/actions/tickets";
import { Send, Clock, User, CheckCircle, XCircle } from "lucide-react";

export default function TicketMessageThread({ ticket, initialMessages }: { ticket: any; initialMessages: any[] }) {
  const { data: session } = useSession();
  const [messages, setMessages] = React.useState(initialMessages);
  const [content, setContent] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const isAdmin = (session?.user as any)?.role === "ADMIN";

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || loading) return;

    setLoading(true);
    try {
      await sendMessage(ticket.id, content);
      setMessages([...messages, { 
        id: Math.random().toString(), 
        content, 
        senderId: (session?.user as any).id, 
        createdAt: new Date().toISOString() 
      }]);
      setContent("");
      
      // Auto-scroll to bottom
      setTimeout(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }, 100);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (status: string) => {
     await updateTicketStatus(ticket.id, status);
  };

  return (
    <div className="flex flex-col h-[70vh] bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/20">
            <User size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-slate-900 tracking-tight line-clamp-1">{ticket.subject}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                  ticket.status === "OPEN"
                    ? "bg-rose-50 text-rose-600 border-rose-100"
                    : ticket.status === "PENDING"
                    ? "bg-orange-50 text-orange-600 border-orange-100"
                    : "bg-slate-50 text-slate-600 border-slate-100"
                }`}>
                {ticket.status}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Ticket ID: #{ticket.id.substring(0, 8)}</span>
            </div>
          </div>
        </div>
        {isAdmin && (
           <div className="flex gap-2">
             <button onClick={() => handleStatusChange("CLOSED")} className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-500 group transition-all" title="Close Ticket">
               <CheckCircle size={20} className="group-hover:text-emerald-500 transition-colors" />
             </button>
           </div>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300">
        {messages.map((msg) => {
          const isMe = msg.senderId === (session?.user as any)?.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"} group`}>
              <div className={`max-w-[70%] space-y-2 ${isMe ? "items-end text-right" : "items-start text-left"}`}>
                <div className={`p-4 rounded-3xl text-sm font-medium leading-relaxed shadow-sm ${
                    isMe 
                      ? "bg-blue-600 text-white rounded-tr-none" 
                      : "bg-slate-100 text-slate-700 rounded-tl-none border border-slate-200/50"
                  }`}>
                  {msg.content}
                </div>
                <div className="flex items-center gap-1.5 px-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                   <Clock size={10} className="text-slate-400" />
                   <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="p-6 border-t border-slate-100 bg-slate-50/50">
        <form onSubmit={handleSend} className="flex gap-4 relative items-center">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 pl-6 pr-14 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="absolute right-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all transform active:scale-90 disabled:opacity-50 disabled:grayscale"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
