"use client";

import React from "react";
import { createTicket } from "@/actions/tickets";
import { ArrowLeft, Loader2, Send, Ticket } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewTicketPage() {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    if (!subject || !message) return;

    setLoading(true);
    try {
      const ticket = await createTicket(subject, message);
      router.push(`/customer/tickets/${ticket.id}`);
    } catch (err) {
      console.error(err);
      alert("Error creating ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-5 duration-700">
      <Link
        href="/customer/dashboard"
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-8 text-sm font-medium group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/20">
            <Ticket size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Open Support Ticket</h1>
            <p className="text-slate-500 text-sm mt-0.5 font-medium">Briefly describe your issue and our team will help.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Subject</label>
            <input
              name="subject"
              required
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:bg-white outline-none transition-all placeholder:text-slate-400 font-medium"
              placeholder="e.g. Question about my recent invoice"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Message</label>
            <textarea
              name="message"
              required
              rows={6}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:bg-white outline-none transition-all placeholder:text-slate-400 font-medium resize-none"
              placeholder="Provide more details here..."
            />
          </div>

          <div className="pt-4">
            <button
              disabled={loading}
              className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all transform active:scale-95 disabled:opacity-50 disabled:grayscale group shadow-xl shadow-indigo-500/20"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              )}
              Submit Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
