import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { deleteProduct } from "@/actions/products";

export default async function ProductsAdminPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-900 tracking-tight">Products</h1>
          <p className="text-slate-500 mt-1">Manage your catalog, prices, and categories.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 group transition-all transform hover:scale-105"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform"/>
          New Product
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input
            className="w-full pl-12 pr-4 py-2 bg-slate-50 border-none outline-none focus:ring-0 rounded-xl text-sm"
            placeholder="Search products..."
          />
        </div>
        <button className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors text-slate-500">
          <Filter size={18} />
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="group bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="h-48 bg-slate-100 relative overflow-hidden">
              <img
                src={product.images || "https://images.unsplash.com/photo-1512314889357-e157c22f938d?auto=format&fit=crop&q=80&w=800"}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                alt={product.name}
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm border border-slate-200 text-slate-900">
                  {product.category}
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-slate-900">
                      {product.price ? formatCurrency(product.price) : "Custom Quote"}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      &bull; {product.type === "fixed" ? "Subscription" : "Service"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={`/admin/products/edit/${product.id}`}
                    className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                    aria-label="Edit product"
                  >
                    <Edit size={16} />
                  </Link>
                  <form action={deleteProduct.bind(null, product.id)} method="POST">
                    <button
                      type="submit"
                      className="p-2 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      aria-label="Delete product"
                    >
                      <Trash2 size={16} />
                    </button>
                  </form>
                </div>
              </div>
              <p className="text-slate-500 text-xs mt-4 line-clamp-2 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="col-span-full py-20 bg-white border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400">
            <Box size={40} className="mb-4 opacity-50" />
            <p className="font-medium">No products found. Create your first one!</p>
          </div>
        )}
      </div>
    </div>
  );
}

const Box = ({ size, className }: { size: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
);
