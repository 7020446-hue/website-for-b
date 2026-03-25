import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Search, Filter, ArrowRight, Star, ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default async function PublicProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Header */}
      <nav className="p-6 border-b border-slate-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
           <Link href="/" className="text-2xl font-black font-display text-blue-600 tracking-tighter">SaaS<span className="text-slate-900">Manager</span></Link>
           <div className="flex items-center gap-6">
              <Link href="/products" className="text-sm font-bold text-slate-900">Browse Catalog</Link>
              <Link href="/login" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Sign In</Link>
              <Link href="/signup" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95">Start Project</Link>
           </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-16 space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-6">
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/50 rounded-full text-blue-600 text-xs font-bold uppercase tracking-widest border border-blue-200 animate-in fade-in slide-in-from-top-2 duration-700">
              <Star size={14} fill="currentColor" />
              World Class Enterprise Solutions
           </div>
           <h1 className="text-6xl font-black font-display text-slate-900 tracking-tight leading-[1.1] max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-700">
             Powerful Tools to Grow <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Your Business.</span>
           </h1>
           <p className="text-slate-500 text-xl max-w-2xl mx-auto animate-in fade-in delay-150 duration-700">
              Browse our enterprise-grade catalog. From fixed software licenses to bespoke custom developments, find the perfect solution today.
           </p>
        </section>

        {/* Catalog Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, idx) => (
            <div
              key={product.id}
              className={`group bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-10 delay-${idx * 100} duration-1000`}
            >
              <div className="h-64 bg-slate-200 relative overflow-hidden">
                <img
                  src={product.images || "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=800"}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  alt={product.name}
                />
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-1.5 bg-white/90 backdrop-blur-xl text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg border border-white text-slate-900">
                    {product.category}
                  </span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                   <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">{product.name}</h3>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                   <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Starting at</div>
                      <div className="text-xl font-black text-slate-900">{product.price ? formatCurrency(product.price) : "Custom Quote"}</div>
                   </div>
                   <Link
                      href={`/products/${product.id}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl font-bold text-sm transition-all transform active:scale-95 group/btn"
                   >
                     View Details
                     <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                   </Link>
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="col-span-full py-32 text-center text-slate-400 flex flex-col items-center">
               <ShoppingBag size={64} className="mb-6 opacity-30" />
               <p className="text-xl font-bold">No products available in the catalog center.</p>
               <p className="mt-2 text-sm font-medium">Check back later or contact us for custom inquiries.</p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-32 p-16 bg-slate-900 text-white rounded-t-[48px]">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-16">
            <div className="space-y-6">
               <div className="text-3xl font-black font-display text-blue-400 tracking-tighter">SaaS<span className="text-white">Manager</span></div>
               <p className="text-slate-400 text-sm max-w-[280px] leading-relaxed">The premium platform for managing modern business requests and complex commercial invoicing at scale.</p>
            </div>
            <div className="grid grid-cols-2 gap-16">
               <div className="space-y-4">
                  <h4 className="font-bold text-white text-sm uppercase tracking-widest">Product</h4>
                  <ul className="space-y-2 text-slate-400 text-sm font-medium">
                     <li><Link href="/products" className="hover:text-white transition-colors">Catalog</Link></li>
                     <li><Link href="/" className="hover:text-white transition-colors">Pricing</Link></li>
                     <li><Link href="/" className="hover:text-white transition-colors">Enterprise</Link></li>
                  </ul>
               </div>
               <div className="space-y-4">
                  <h4 className="font-bold text-white text-sm uppercase tracking-widest">Support</h4>
                  <ul className="space-y-2 text-slate-400 text-sm font-medium">
                     <li><Link href="/" className="hover:text-white transition-colors">Help Center</Link></li>
                     <li><Link href="/" className="hover:text-white transition-colors">Status</Link></li>
                     <li><Link href="/" className="hover:text-white transition-colors">Contact</Link></li>
                  </ul>
               </div>
            </div>
         </div>
         <div className="max-w-7xl mx-auto pt-16 mt-16 border-t border-slate-800 text-slate-500 text-xs font-bold text-center">
            &copy; 2026 SaaSManager Enterprise Systems. All rights reserved.
         </div>
      </footer>
    </div>
  );
}
