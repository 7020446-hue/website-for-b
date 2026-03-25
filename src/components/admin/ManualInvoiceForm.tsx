"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Plus, Trash2, ArrowLeft, FilePlus, UserCheck, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const invoiceSchema = z.object({
  userId: z.string().min(1, "User is required"),
  items: z.array(z.object({
    name: z.string().min(1, "Item name is required"),
    quantity: z.number().min(1),
    price: z.number().min(0.01),
  })).min(1),
  dueDate: z.string().optional(),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

export default function ManualInvoiceForm({ users }: { users: any[] }) {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      userId: "",
      items: [{ name: "", quantity: 1, price: 0 }],
      dueDate: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchedItems = watch("items");
  const subtotal = watchedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      // Direct POST to api for simplicity or server action
      // I'll assume an api route to handle it as well
      const res = await fetch("/api/admin/invoices", {
        method: "POST",
        body: JSON.stringify({ ...data, subtotal, tax, total }),
      });
      if (res.ok) {
        toast.success("Invoice created successfully!");
        router.push("/admin/invoices");
        router.refresh();
      } else {
        toast.error("Failed to create invoice.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20">
      <Link
        href="/admin/invoices"
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-all font-bold text-sm group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Return to Financial Management
      </Link>

      <div className="flex items-center gap-6">
         <div className="w-16 h-16 rounded-3xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-2xl shadow-blue-500/20">
            <FilePlus size={32} />
         </div>
         <div>
            <h1 className="text-4xl font-black font-display text-slate-900 tracking-tight leading-none mb-1">Issue <br />Financial Document.</h1>
            <div className="flex items-center gap-2 mt-2">
               <ShieldCheck size={14} className="text-blue-500" />
               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Administrative Billing Control Center</span>
            </div>
         </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        {/* User Selection */}
        <div className="p-8 bg-white border border-slate-200 rounded-[40px] shadow-sm space-y-6">
           <div className="flex items-center gap-3 mb-4">
              <UserCheck size={20} className="text-blue-600" />
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Select Commercial Entity</h3>
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Enterprise Target</label>
              <select
                {...register("userId")}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all font-bold text-slate-900"
              >
                <option value="">Select a customer...</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
              {errors.userId && <p className="text-xs text-rose-500 font-bold mt-1 ml-1">{errors.userId.message}</p>}
           </div>
        </div>

        {/* Line Items */}
        <div className="p-8 bg-white border border-slate-200 rounded-[40px] shadow-sm space-y-8">
           <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                 <Zap size={20} className="text-blue-600" />
                 <h3 className="text-lg font-black text-slate-900 tracking-tight">Line Items & Services</h3>
              </div>
              <button
                type="button"
                onClick={() => append({ name: "", quantity: 1, price: 0 })}
                className="px-6 py-3 bg-blue-50 text-blue-600 rounded-xl font-black text-xs hover:bg-blue-100 transition-all active:scale-95"
              >
                + ADD LINE
              </button>
           </div>

           <div className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-6 gap-6 items-end p-6 bg-slate-50/50 rounded-3xl border border-slate-100 group">
                  <div className="md:col-span-3 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</label>
                    <input
                      {...register(`items.${index}.name`)}
                      className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 font-bold text-sm"
                      placeholder="e.g. Enterprise Software License"
                    />
                  </div>
                  <div className="md:col-span-1 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Qty</label>
                    <input
                      type="number"
                      {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                      className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 font-bold text-sm"
                    />
                  </div>
                  <div className="md:col-span-1 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Unit Cost</label>
                    <input
                      type="number"
                      step="0.01"
                      {...register(`items.${index}.price`, { valueAsNumber: true })}
                      className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 font-bold text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="md:col-span-1 p-3.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-colors flex items-center justify-center group/del"
                  >
                    <Trash2 size={18} className="group-hover/del:scale-110 transition-transform" />
                  </button>
                </div>
              ))}
           </div>
        </div>

        {/* Totals */}
        <div className="p-8 bg-slate-900 text-white rounded-[40px] shadow-2xl space-y-8 relative overflow-hidden group/total">
           <div className="absolute right-0 bottom-0 opacity-10 -translate-x-10 translate-y-10 group-hover/total:scale-110 transition-transform duration-1000 rotate-12">
              <Zap size={200} />
           </div>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
              <div className="space-y-1">
                 <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Subtotal Summary</div>
                 <div className="text-xl font-black">${subtotal.toLocaleString()}</div>
              </div>
              <div className="space-y-1">
                 <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Tax Liability (10%)</div>
                 <div className="text-xl font-black">${tax.toLocaleString()}</div>
              </div>
              <div className="md:col-span-2 space-y-1 text-right">
                 <div className="text-[10px] font-black uppercase tracking-widest text-blue-400">Total Commercial Obligation</div>
                 <div className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white">${total.toLocaleString()}</div>
              </div>
           </div>

           <div className="pt-8 border-t border-white/10 relative z-10">
              <button
                disabled={loading}
                className="w-full py-6 bg-white hover:bg-blue-50 text-slate-950 rounded-[28px] font-black text-xl shadow-2xl transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-4"
              >
                {loading ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  <>
                    <FilePlus size={24} />
                    Issue & Finalize Statement
                  </>
                )}
              </button>
           </div>
        </div>
      </form>
    </div>
  );
}
