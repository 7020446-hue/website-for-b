import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Clock, Package, ShoppingCart, Star, ShieldCheck, Zap } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import QuoteRequestForm from "@/components/customer/QuoteRequestForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface ProductDetailPageProps {
  params: { id: string };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const session = await getServerSession(authOptions);
  
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });

  if (!product) return <div>Product not found</div>;

  const features = [
    { title: "Enterprise Grade", desc: "Reliability and scalability for large-scale operations.", icon: ShieldCheck },
    { title: "Priority Support", desc: "Dedicated support channel for all enterprise clients.", icon: Clock },
    { title: "Fast Deployment", desc: "Quick setup and integration into your existing workflow.", icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="p-6 border-b border-slate-200 bg-white/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
           <Link href="/products" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-sm group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Catalog
           </Link>
           <div className="flex items-center gap-4">
              {!session && <Link href="/login" className="text-sm font-bold text-slate-500 hover:text-slate-900">Sign In</Link>}
              <Link href="/signup" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95">Get Started</Link>
           </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
         {/* Left: Product Image & Info */}
         <div className="space-y-12 animate-in fade-in slide-in-from-left-5 duration-1000">
            <div className="aspect-square bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 relative group">
               <img
                  src={product.images || "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=800"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  alt={product.name}
               />
               <div className="absolute top-8 left-8">
                  <span className="px-4 py-2 bg-blue-600/90 backdrop-blur-xl text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-2xl">
                    {product.category}
                  </span>
               </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
               {features.map((f, i) => (
                  <div key={i} className="p-6 bg-white border border-slate-200/50 rounded-3xl flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow group">
                     <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-blue-600 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                        <f.icon size={24} />
                     </div>
                     <div>
                        <h4 className="font-bold text-slate-900">{f.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{f.desc}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Right: Pricing & Quote Form */}
         <div className="lg:sticky lg:top-32 space-y-8 animate-in fade-in slide-in-from-right-5 duration-1000">
            <div className="space-y-4">
               <div className="inline-flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest px-3 py-1 bg-blue-50 rounded-lg">
                  <Star size={14} fill="currentColor" />
                  New Product
               </div>
               <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">{product.name}</h1>
               <div className="flex items-center gap-3">
                  <div className="text-3xl font-black text-slate-900">
                     {product.price ? formatCurrency(product.price) : "Variable Project Pricing"}
                  </div>
                  <div className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-lg ${product.type === 'fixed' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                     {product.type === 'fixed' ? 'Fixed Cost' : 'Custom Service'}
                  </div>
               </div>
               <p className="text-slate-500 text-lg leading-relaxed max-w-xl">{product.description}</p>
            </div>

            <div className="pt-8 border-t border-slate-100">
               <QuoteRequestForm product={product} user={session?.user} />
            </div>

            <div className="p-6 bg-slate-100/50 rounded-3xl border border-slate-200 border-dashed">
               <div className="flex items-center gap-3 text-slate-500 mb-2">
                  <CheckCircle size={16} className="text-emerald-500" />
                  <span className="text-xs font-bold uppercase tracking-widest">No Commitment Needed</span>
               </div>
               <p className="text-[10px] text-slate-400 font-medium leading-relaxed">By submitting a request, our team will review your requirements and provide a detailed estimate within 24 hours. No payment required at this stage.</p>
            </div>
         </div>
      </main>

      <footer className="mt-32 py-16 text-center border-t border-slate-100 text-slate-400 text-xs font-bold bg-white">
         &copy; 2026 SaaSManager Enterprise Catalog Center.
      </footer>
    </div>
  );
}
