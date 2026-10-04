import Link from "next/link";
import { signup } from "@/lib/account-actions";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-ivory text-espresso">
      <div className="mx-auto max-w-md px-5 py-10">
        <Link href="/" className="text-sm text-wine">← Back home</Link>
        <h1 className="mt-2 font-serif text-3xl">Create account</h1>
        <form action={signup} className="mt-6 space-y-4 rounded-2xl border border-line bg-white p-6">
          <label className="block text-sm">Full name<input name="name" required className="mt-1 w-full rounded-xl border border-line px-3 py-2" /></label>
          <label className="block text-sm">Email<input name="email" type="email" required className="mt-1 w-full rounded-xl border border-line px-3 py-2" /></label>
          <label className="block text-sm">Password (6+ characters)<input name="password" type="password" minLength={6} required className="mt-1 w-full rounded-xl border border-line px-3 py-2" /></label>
          <button type="submit" className="w-full rounded-full bg-espresso px-8 py-3 font-bold text-[#FFF8EC]">Sign up</button>
        </form>
        <p className="mt-4 text-sm text-muted">Have an account? <Link href="/login" className="text-wine underline">Log in</Link></p>
      </div>
    </main>
  );
}
