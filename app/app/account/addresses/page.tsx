import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addAddress, deleteAddress } from "@/lib/address-actions";

export const dynamic = 'force-dynamic';

export default async function AddressesPage() {
  const session = await getServerSession(authOptions);
  const id = (session?.user as { id?: string } | undefined)?.id;
  if (!id) redirect("/login");
  const addresses = await prisma.address.findMany({ where: { userId: id }, orderBy: { createdAt: "desc" } });

  return (
    <main className="min-h-screen bg-ivory text-espresso">
      <div className="mx-auto max-w-2xl px-5 py-8">
        <Link href="/account" className="text-sm text-wine">← Account</Link>
        <h1 className="mt-2 font-serif text-3xl">My Addresses</h1>

        <form action={addAddress} className="mt-6 space-y-3 rounded-2xl border border-line bg-white p-5">
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm">Label<input name="label" defaultValue="Home" className="mt-1 w-full rounded-xl border border-line px-3 py-2" /></label>
            <label className="text-sm">Full name<input name="fullName" required className="mt-1 w-full rounded-xl border border-line px-3 py-2" /></label>
          </div>
          <label className="block text-sm">Phone<input name="phone" required className="mt-1 w-full rounded-xl border border-line px-3 py-2" /></label>
          <label className="block text-sm">Delivery address<input name="address" required className="mt-1 w-full rounded-xl border border-line px-3 py-2" /></label>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm">City<input name="city" required className="mt-1 w-full rounded-xl border border-line px-3 py-2" /></label>
            <label className="text-sm">State<input name="state" required className="mt-1 w-full rounded-xl border border-line px-3 py-2" /></label>
          </div>
          <label className="block text-sm">Delivery instructions (optional)<input name="instructions" className="mt-1 w-full rounded-xl border border-line px-3 py-2" /></label>
          <button type="submit" className="rounded-full bg-espresso px-6 py-2 text-sm font-bold text-[#FFF8EC]">Save address</button>
        </form>

        <div className="mt-6 space-y-3">
          {addresses.map((a) => (
            <div key={a.id} className="rounded-2xl border border-line bg-white p-4">
              <p className="font-serif">{a.label} — {a.fullName}</p>
              <p className="text-sm text-muted">{a.address}, {a.city}, {a.state} • {a.phone}</p>
              {a.instructions && <p className="text-sm text-muted">Note: {a.instructions}</p>}
              <form action={deleteAddress.bind(null, a.id)} className="mt-2">
                <button className="text-sm text-wine">Delete</button>
              </form>
            </div>
          ))}
          {addresses.length === 0 && <p className="text-sm text-muted">No addresses yet.</p>}
        </div>
      </div>
    </main>
  );
}
