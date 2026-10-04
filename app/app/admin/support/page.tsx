import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { setSupportHandled } from "@/lib/admin-ops";

export const dynamic = 'force-dynamic';

export default async function AdminSupport() {
  await requireAdmin();
  const messages = await prisma.supportMessage.findMany({ orderBy: { createdAt: "desc" }, take: 50 });

  return (
    <main className="min-h-screen bg-ivory text-espresso">
      <div className="mx-auto max-w-3xl px-5 py-8">
        <Link href="/admin" className="text-sm text-wine">← Admin</Link>
        <h1 className="mt-2 font-serif text-3xl">Support inbox</h1>
        <div className="mt-6 space-y-3">
          {messages.map((m) => (
            <div key={m.id} className="rounded-2xl border border-line bg-white p-4">
              <p className="text-sm"><strong>{m.topic}</strong> • {m.name} ({m.email}) • {m.handled ? "Handled" : "Open"}</p>
              <p className="mt-1 text-sm">{m.message}</p>
              <form action={setSupportHandled.bind(null, m.id, !m.handled)} className="mt-2">
                <button className="text-sm text-wine">{m.handled ? "Reopen" : "Mark handled"}</button>
              </form>
            </div>
          ))}
          {messages.length === 0 && <p className="text-sm text-muted">No messages yet.</p>}
        </div>
      </div>
    </main>
  );
}
