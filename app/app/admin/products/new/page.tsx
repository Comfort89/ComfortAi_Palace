import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createProduct } from "@/lib/admin-actions";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  await requireAdmin();
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <main className="min-h-screen bg-ivory text-espresso">
      <div className="mx-auto max-w-2xl px-5 py-8">
        <Link href="/admin" className="text-sm text-wine">← Admin</Link>
        <h1 className="mt-2 font-serif text-3xl">Add product</h1>
        <form action={createProduct} className="mt-6 space-y-4 rounded-2xl border border-line bg-white p-6">
          <label className="block text-sm">Name<input name="name" required className="mt-1 w-full rounded-xl border border-line px-3 py-2" /></label>
          <label className="block text-sm">Slug (optional)<input name="slug" placeholder="auto from name" className="mt-1 w-full rounded-xl border border-line px-3 py-2" /></label>
          <label className="block text-sm">Description<textarea name="description" required rows={4} className="mt-1 w-full rounded-xl border border-line px-3 py-2" /></label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block text-sm">Price (₦)<input name="priceNaira" type="number" min={0} required className="mt-1 w-full rounded-xl border border-line px-3 py-2" /></label>
            <label className="block text-sm">Category
              <select name="categoryId" required className="mt-1 w-full rounded-xl border border-line px-3 py-2">
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <label className="block text-sm">Size<input name="size" defaultValue="M" className="mt-1 w-full rounded-xl border border-line px-3 py-2" /></label>
            <label className="block text-sm">Colour<input name="colour" defaultValue="Black" className="mt-1 w-full rounded-xl border border-line px-3 py-2" /></label>
            <label className="block text-sm">Stock<input name="stock" type="number" min={0} defaultValue={5} className="mt-1 w-full rounded-xl border border-line px-3 py-2" /></label>
          </div>
          <div className="flex gap-4 text-sm">
            <label><input type="checkbox" name="isNew" className="mr-1" />New arrival</label>
            <label><input type="checkbox" name="isBestSeller" className="mr-1" />Best seller</label>
          </div>
          <button type="submit" className="rounded-full bg-espresso px-8 py-3 font-bold text-[#FFF8EC]">Create product</button>
        </form>
      </div>
    </main>
  );
}
