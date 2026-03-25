import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ArrowLeft, Edit3, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface EditProductPageProps {
  params: { id: string };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const session = await getServerSession(authOptions);

  if ((session?.user as any)?.role !== "ADMIN") {
    redirect("/login");
  }

  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });

  if (!product) {
    redirect("/admin/products");
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <Link
        href="/admin/products"
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-all font-bold text-sm group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Return to Catalog Management
      </Link>

      <div className="flex items-center gap-6">
         <div className="w-16 h-16 rounded-3xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-2xl shadow-blue-500/20">
            <Edit3 size={32} />
         </div>
         <div>
            <h1 className="text-4xl font-black font-display text-slate-900 tracking-tight leading-none mb-1">Modify <br />Catalogue.</h1>
            <div className="flex items-center gap-2 mt-2">
               <ShieldCheck size={14} className="text-blue-500" />
               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Administrator Access Verified</span>
            </div>
         </div>
      </div>

      <div className="max-w-4xl">
         <ProductForm initialData={product} productId={product.id} isUpdate />
      </div>

      <div className="max-w-4xl p-8 bg-amber-50 border border-amber-100/50 rounded-[40px] flex items-start gap-6">
         <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white shrink-0 shadow-xl shadow-amber-500/20">
            <ShieldCheck size={24} />
         </div>
         <div>
            <h4 className="font-bold text-slate-900 mb-1 leading-tight">Modification Notice</h4>
            <p className="text-slate-500 text-xs leading-relaxed font-medium">Changes made to this catalogue mapping will be reflected immediately in all public listings and active customer requests. Please verify all technical and commercial attributes before committing updates.</p>
         </div>
      </div>
    </div>
  );
}
