import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SignOutButton from "@/components/SignOutButton";

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  const id = (session?.user as { id?: string } | undefined)?.id;
  if (!id) redirect("/login");
  const user = await prisma.user.findUnique({ where: { id }, include: { addresses: true } });
  if (!user) redirect("/login");

  return (
    <main className="min-h-screen bg-ivory text-espresso">
      <div className="mx-auto max-w-2xl px-5 py-8">
        <Link href="/" className="text-sm text-wine">← Back home</Link>
        <div className="mt-2 flex items-center justify-between">
          <h1 className="font-serif text-3xl">My Account</h1>
          <SignOutButton />
        </div>
        <p className="mt-1 text-sm text-muted">{user.name} • {user.email}</p>
        <div className="mt-6 grid gap-3">
          <Link href="/account/addresses" className="rounded-2xl border border-line bg-white p-4">
            <p className="font-serif text-lg">My Addresses ({user.addresses.length})</p>
            <p className="text-sm text-muted">Delivery details for checkout (Phase 4).</p>
          </Link>
          <Link href="/wishlist" className="rounded-2xl border border-line bg-white p-4">
            <p className="font-serif text-lg">Saved Items</p>
            <p className="text-sm text-muted">Your wishlist (moves to account in a later pass).</p>
          </Link>
          <Link href="/size-guide" className="rounded-2xl border border-line bg-white p-4">
            <p className="font-serif text-lg">Size Guide</p>
            <p className="text-sm text-muted">Find your fit.</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
