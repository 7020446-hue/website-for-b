"use client";

import React from "react";
import { signUp } from "@/actions/signup";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, Lock, User, ArrowRight, Star, GraduationCap, Building2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function SignupPage() {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    setLoading(true);
    try {
      await signUp(formData);
      toast.success("Account created! Please sign in.");
      router.push("/login");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row-reverse items-stretch overflow-hidden">
      {/* Right: Brand & Info */}
      <div className="w-full md:w-1/2 p-16 bg-gradient-to-br from-indigo-700 to-blue-900 text-white flex flex-col justify-between relative overflow-hidden group">
         <div className="relative z-10">
            <Link href="/" className="text-4xl font-black font-display tracking-tighter bg-white text-blue-700 px-4 py-2 rounded-2xl block w-fit shadow-2xl transition-all hover:scale-105 active:scale-95">SaaS<span className="text-slate-900">Manager</span></Link>
         </div>

         <div className="space-y-8 relative z-10 max-w-lg mb-20 animate-in fade-in slide-in-from-right-10 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-blue-100 text-[10px] font-black uppercase tracking-widest shadow-xl">
               <Building2 size={14} className="text-blue-300" />
               Join 5,000+ Scalable Enterprises
            </div>
            <h1 className="text-6xl font-black tracking-tight leading-[1.1]">The console for your <br /><span className="text-blue-200">business growth.</span></h1>
            <p className="text-blue-100/70 text-lg leading-relaxed font-medium tracking-wide">Accelerate procurement, streamline invoicing, and get priority support from our dedicated team. Everything you need to scale, in one unified interface.</p>
         </div>

         {/* Decorative elements */}
         <div className="absolute top-20 left-20 bg-blue-500/20 w-[400px] h-[400px] rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000" />
         <div className="absolute -bottom-20 -right-20 bg-indigo-500/10 w-[300px] h-[300px] rounded-full blur-[80px] group-hover:scale-110 transition-transform duration-1000 delay-100" />
      </div>

      {/* Left: Signup Form */}
      <div className="w-full md:w-1/2 bg-white p-12 md:p-24 flex flex-col justify-center animate-in fade-in slide-in-from-left-5 duration-1000">
        <div className="max-w-md w-full mx-auto space-y-12">
            <div>
               <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">Create your <br />Enterprise ID.</h2>
               <p className="text-slate-500 text-sm mt-4 font-medium leading-relaxed">Join our high-performance network of innovative businesses and start requesting custom proposals today.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="space-y-6">
                  <div className="space-y-2 group/input">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within/input:text-blue-600 transition-colors">Full Name</label>
                     <div className="relative">
                        <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-blue-500 transition-colors" size={18} />
                        <input
                           name="name"
                           required
                           className="w-full pl-16 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[20px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all placeholder:text-slate-300 font-bold text-slate-900"
                           placeholder="Johnathan Doe"
                        />
                     </div>
                  </div>
                  <div className="space-y-2 group/input">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within/input:text-blue-600 transition-colors">Business Email</label>
                     <div className="relative">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-blue-500 transition-colors" size={18} />
                        <input
                           name="email"
                           type="email"
                           required
                           className="w-full pl-16 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[20px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all placeholder:text-slate-300 font-bold text-slate-900"
                           placeholder="ceo@company.com"
                        />
                     </div>
                  </div>
                  <div className="space-y-2 group/input">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within/input:text-blue-600 transition-colors">Secret Password</label>
                     <div className="relative">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-blue-500 transition-colors" size={18} />
                        <input
                           name="password"
                           type="password"
                           required
                           className="w-full pl-16 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[20px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all placeholder:text-slate-300 font-bold text-slate-900"
                           placeholder="••••••••"
                        />
                     </div>
                  </div>
               </div>

               <div className="pt-6 space-y-6">
                  <button
                     disabled={loading}
                     className="group w-full py-5 bg-slate-900 hover:bg-indigo-600 text-white rounded-[24px] font-black text-lg shadow-2xl shadow-slate-950/20 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-4"
                  >
                     {loading ? (
                        <Loader2 size={24} className="animate-spin" />
                     ) : (
                        <>
                           Enroll New Organization
                           <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </>
                     )}
                  </button>
                  <p className="text-center text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-wider">By enrolling, you agree to our Enterprise Terms of Service and Professional Privacy Safeguards center.</p>
               </div>
            </form>

            <div className="pt-12 mt-12 border-t border-slate-50 flex items-center justify-between font-bold">
               <span className="text-xs text-slate-400 uppercase tracking-widest">Already enrolled?</span>
               <Link href="/login" className="text-sm text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-6 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95">Console Login</Link>
            </div>
        </div>
      </div>
    </div>
  );
}
