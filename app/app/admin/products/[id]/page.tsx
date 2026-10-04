import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateProduct } from "@/lib/admin-actions";

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product) notFound();
  const update = updateProduct.bind(null, product.id);

  return (
    <main className="min-h-screen bg-ivory text-espresso">
      <div className="mx-auto max-w-2xl px-5 py-8">
        <Link href="/admin" className="text-sm text-wine">← Admin</Link>
        <h1 className="mt-2 font-serif text-3xl">Edit — {product.name}</h1>
        <form action={update} className="mt-6 space-y-4 rounded-2xl border border-line bg-white p-6">
          <label className="block text-sm">Name<input name="name" defaultValue={product.name} required className="mt-1 w-full rounded-xl border border-line px-3 py-2" /></label>
          <label className="block text-sm">Description<textarea name="description" defaultValue={product.description} required rows={4} className="mt-1 w-full rounded-xl border border-line px-3 py-2" /></label>
          <label className="block text-sm">Price (₦)<input name="priceNaira" type="number" min={0} defaultValue={product.priceNaira} required className="mt-1 w-full rounded-xl border border-line px-3 py-2" /></label>
          <div className="flex flex-wrap gap-4 text-sm">
            <label><input type="checkbox" name="available" defaultChecked={product.available} className="mr-1" />Available</label>
            <label><input type="checkbox" name="isNew" defaultChecked={product.isNew} className="mr-1" />New arrival</label>
            <label><input type="checkbox" name="isBestSeller" defaultChecked={product.isBestSeller} className="mr-1" />Best seller</label>
          </div>
          <button type="submit" className="rounded-full bg-espresso px-8 py-3 font-bold text-[#FFF8EC]">Save changes</button>
        </form>
      </div>
    </main>
  );
}
