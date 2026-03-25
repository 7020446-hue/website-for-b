"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Send, CheckCircle, Package, ArrowRight, ClipboardList } from "lucide-react";
import { submitRequest } from "@/actions/requests";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";

const quoteSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Please provide a valid email"),
  quantity: z.number().min(1),
  description: z.string().min(10, "Please describe your requirements"),
  productId: z.string().optional(),
  fileUrl: z.string().optional(),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

interface QuoteRequestFormProps {
  product?: any;
  user?: any;
}

export default function QuoteRequestForm({ product, user }: QuoteRequestFormProps) {
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      quantity: product?.minQuantity || 1,
      description: "",
      productId: product?.id || "",
      fileUrl: "",
    },
  });

  const onSubmit = async (data: QuoteFormData) => {
    setLoading(true);
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, (data as any)[key]);
    });

    try {
      await submitRequest(formData);
      setSubmitted(true);
      toast.success("Request submitted successfully!");
      
      if (user) {
        setTimeout(() => router.push("/customer/dashboard"), 2000);
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during submission.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-10 bg-emerald-50 border border-emerald-100 rounded-[40px] text-center space-y-6 animate-in zoom-in-95 duration-700">
         <div className="w-20 h-20 bg-emerald-500 rounded-[28px] flex items-center justify-center text-white mx-auto shadow-2xl shadow-emerald-500/30">
            <CheckCircle size={40} />
         </div>
         <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Request Received!</h3>
            <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto font-medium">Thank you for your inquiry. Our team will review your project details and respond within 24 hours.</p>
         </div>
         {user && (
           <div className="pt-4 flex flex-col items-center gap-4">
              <Link href="/customer/dashboard" className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-sm transition-all transform active:scale-95 group flex items-center gap-2 shadow-xl shadow-slate-900/10">
                 Manage Requests
                 <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
           </div>
         )}
      </div>
    );
  }

  return (
    <div className="bg-white p-10 border border-slate-200 rounded-[40px] shadow-2xl shadow-slate-200/50 space-y-10 relative overflow-hidden group/form">
       {/* Background Decoration */}
       <div className="absolute right-0 top-0 opacity-[0.03] -translate-y-10 translate-x-10 group-hover/form:scale-110 transition-transform duration-1000 rotate-12">
          <ClipboardList size={300} />
       </div>

       <div className="relative z-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Request Your Proposal</h2>
          <p className="text-slate-500 font-medium text-sm">Tell us about your project or order requirements.</p>
       </div>

       <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Full Name</label>
                <input
                  {...register("name")}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[18px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all placeholder:text-slate-400 font-medium text-slate-900"
                  placeholder="John Doe"
                />
                {errors.name && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest mt-1 ml-1">{errors.name.message}</p>}
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Email Address</label>
                <input
                  {...register("email")}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[18px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all placeholder:text-slate-400 font-medium text-slate-900"
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest mt-1 ml-1">{errors.email.message}</p>}
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Target Quantity</label>
                <input
                  type="number"
                  {...register("quantity", { valueAsNumber: true })}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[18px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all placeholder:text-slate-400 font-medium text-slate-900"
                  placeholder="1"
                />
                {errors.quantity && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest mt-1 ml-1">{errors.quantity.message}</p>}
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Requesting</label>
                <div className="w-full px-6 py-4 bg-slate-100 border border-slate-200 rounded-[18px] font-bold text-slate-500 text-sm truncate flex items-center gap-3">
                   <Package size={16} />
                   {product?.name || "Bespoke Service"}
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">External Document URL (Optional)</label>
                <input
                  {...register("fileUrl")}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[18px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all placeholder:text-slate-400 font-medium text-slate-900"
                  placeholder="https://docs.google.com/..."
                />
             </div>
          </div>

          <div className="space-y-2">
             <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Project Requirements & Details</label>
             <textarea
               {...register("description")}
               rows={5}
               className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[24px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all placeholder:text-slate-400 font-medium text-slate-900 resize-none leading-relaxed"
               placeholder="Briefly describe what you're looking for, specific needs, or integration requirements..."
             />
             {errors.description && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest mt-1 ml-1">{errors.description.message}</p>}
          </div>

          <div className="pt-6">
             <button
               disabled={loading}
               className="group w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[24px] font-black text-lg shadow-2xl shadow-blue-500/20 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-4"
             >
                {loading ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  <>
                    <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    Submit Formal Request
                  </>
                )}
             </button>
          </div>
       </form>
    </div>
  );
}
