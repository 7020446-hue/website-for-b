"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, Lock, ArrowRight, Star, ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Welcome back!");
        // We'll trust the session to determine where to go, but for now simple check:
        // usually we'd fetch the user's role from a separate api or just redirect to a middleman
        router.push("/products"); // Default redirect, middleware or sidebar will handle the rest
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row items-stretch overflow-hidden">
      {/* Left: Brand & Info */}
      <div className="w-full md:w-1/2 p-16 bg-gradient-to-br from-blue-700 to-indigo-800 text-white flex flex-col justify-between relative overflow-hidden group">
         <div className="relative z-10 transition-transform duration-1000 group-hover:translate-x-2">
            <Link href="/" className="text-4xl font-black font-display tracking-tighter bg-white text-blue-700 px-4 py-2 rounded-2xl block w-fit shadow-2xl">SaaS<span className="text-slate-900">Manager</span></Link>
         </div>

         <div className="space-y-8 relative z-10 max-w-lg mb-20 animate-in fade-in slide-in-from-left-10 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-blue-100 text-[10px] font-black uppercase tracking-widest shadow-xl">
               <ShieldCheck size={14} className="text-blue-300" />
               Enterprise Security Standards
            </div>
            <h1 className="text-6xl font-black tracking-tight leading-[1.1]">The center of your <br /><span className="text-blue-200">commercial workflow.</span></h1>
            <p className="text-blue-100/70 text-lg leading-relaxed font-medium">Streamline your procurement process with our integrated request, invoice, and support system. Managed at scale, designed for simplicity.</p>
         </div>

         {/* Decorative elements */}
         <div className="absolute -bottom-20 -left-20 bg-blue-500/20 w-[400px] h-[400px] rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000" />
         <div className="absolute top-20 right-20 bg-indigo-500/10 w-[300px] h-[300px] rounded-full blur-[80px] group-hover:scale-110 transition-transform duration-1000 delay-100" />
      </div>

      {/* Right: Login Form */}
      <div className="w-full md:w-1/2 bg-white p-12 md:p-24 flex flex-col justify-center animate-in fade-in slide-in-from-right-5 duration-1000">
        <div className="max-w-md w-full mx-auto space-y-12">
            <div>
               <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">Welcome <br />Back.</h2>
               <p className="text-slate-500 text-sm mt-4 font-medium">Continue your enterprise journey with your credentials.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
               <div className="space-y-8">
                  <div className="space-y-2 group/input">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within/input:text-blue-600 transition-colors">Business Email</label>
                     <div className="relative">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-blue-500 transition-colors" size={20} />
                        <input
                           name="email"
                           type="email"
                           required
                           className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[20px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all placeholder:text-slate-300 font-bold text-slate-900"
                           placeholder="name@company.com"
                        />
                     </div>
                  </div>
                  <div className="space-y-2 group/input">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within/input:text-blue-600 transition-colors">Secret Password</label>
                     <div className="relative">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-blue-500 transition-colors" size={20} />
                        <input
                           name="password"
                           type="password"
                           required
                           className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[20px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all placeholder:text-slate-300 font-bold text-slate-900"
                           placeholder="••••••••"
                        />
                     </div>
                  </div>
               </div>

               <div className="pt-4 space-y-6">
                  <button
                     disabled={loading}
                     className="group w-full py-5 bg-slate-900 hover:bg-blue-600 text-white rounded-[24px] font-black text-lg shadow-2xl shadow-slate-950/20 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-4"
                  >
                     {loading ? (
                        <Loader2 size={24} className="animate-spin" />
                     ) : (
                        <>
                           Sign Into Console
                           <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </>
                     )}
                  </button>
                  <p className="text-center text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer tracking-wide uppercase">Forgot password recovery center</p>
               </div>
            </form>

            <div className="pt-12 mt-12 border-t border-slate-50 flex items-center justify-between font-bold">
               <span className="text-xs text-slate-400 uppercase tracking-widest">No account?</span>
               <Link href="/signup" className="text-sm text-blue-600 hover:text-blue-700 bg-blue-50 px-6 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95">Enroll Now</Link>
            </div>
        </div>
      </div>
    </div>
  );
}
