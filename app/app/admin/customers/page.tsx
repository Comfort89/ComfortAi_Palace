import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { setUserRole } from "@/lib/admin-ops";

export const dynamic = 'force-dynamic';

export default async function AdminCustomers() {
  await requireAdmin();
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 50, include: { _count: { select: { orders: true } } } });

  return (
    <main className="min-h-screen bg-ivory text-espresso">
      <div className="mx-auto max-w-3xl px-5 py-8">
        <Link href="/admin" className="text-sm text-wine">← Admin</Link>
        <h1 className="mt-2 font-serif text-3xl">Customers</h1>
        <div className="mt-6 space-y-3">
          {users.map((u) => (
            <div key={u.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-line bg-white px-4 py-3">
              <div>
                <p className="font-serif">{u.name ?? "—"} <span className="text-sm text-muted">{u.email}</span></p>
                <p className="text-sm text-muted">{u.role} • {u._count.orders} orders</p>
              </div>
              <div className="flex gap-2">
                <form action={setUserRole.bind(null, u.id, "ADMIN")}><button className="rounded-full border border-line px-3 py-1 text-sm">Make admin</button></form>
                <form action={setUserRole.bind(null, u.id, "CUSTOMER")}><button className="rounded-full border border-line px-3 py-1 text-sm">Make customer</button></form>
              </div>
            </div>
          ))}
          {users.length === 0 && <p className="text-sm text-muted">No users yet.</p>}
        </div>
      </div>
    </main>
  );
}
