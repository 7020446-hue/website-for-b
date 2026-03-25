"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createProduct, updateProduct } from "@/actions/products";

const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.preprocess((val) => Number(val), z.number().optional().nullable()),
  category: z.string().min(1, "Category is required"),
  minQuantity: z.preprocess((val) => Number(val), z.number().min(1)),
  type: z.enum(["fixed", "custom"]),
  imageUrl: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: any;
  productId?: string;
  isUpdate?: boolean;
}

export default function ProductForm({ initialData, productId, isUpdate = false }: ProductFormProps) {
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      price: null,
      category: "",
      minQuantity: 1,
      type: "fixed",
      imageUrl: "",
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    try {
      if (isUpdate && productId) {
        await updateProduct(productId, formData);
      } else {
        await createProduct(formData);
      }
    } catch (error) {
      console.error(error);
      alert("Error saving product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <Link
        href="/admin/products"
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6 text-sm font-medium"
      >
        <ArrowLeft size={16} />
        Back to Products
      </Link>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">
          {isUpdate ? "Edit Product" : "Create New Product"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Product Name</label>
              <input
                {...register("name")}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="e.g. Enterprise Hosting"
              />
              {errors.name && <p className="text-xs text-rose-500 font-medium">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Category</label>
              <input
                {...register("category")}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="e.g. SaaS"
              />
              {errors.category && <p className="text-xs text-rose-500 font-medium">{errors.category.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Type</label>
              <select
                {...register("type")}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                <option value="fixed">Fixed Price</option>
                <option value="custom">Custom Quote</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Price ($)</label>
              <input
                type="number"
                step="0.01"
                {...register("price")}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="29.99"
              />
              {errors.price && <p className="text-xs text-rose-500 font-medium">{errors.price.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Min Quantity</label>
              <input
                type="number"
                {...register("minQuantity")}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="1"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Image URL</label>
              <input
                {...register("imageUrl")}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Description</label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Tell customers about this product..."
            />
            {errors.description && <p className="text-xs text-rose-500 font-medium">{errors.description.message}</p>}
          </div>

          <div className="pt-4">
            <button
              disabled={loading}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 group transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} className="group-hover:rotate-90 transition-transform"/>}
              {isUpdate ? "Update Product" : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
