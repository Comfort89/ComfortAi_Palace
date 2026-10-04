"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");

  async function onSubmit(formData: FormData) {
    setError("");
    const res = await signIn("credentials", {
      email: String(formData.get("email")),
      password: String(formData.get("password")),
      redirect: false
    });
    if (res?.error) setError("Invalid email or password.");
    else router.push("/account");
  }

  return (
    <main className="min-h-screen bg-ivory text-espresso">
      <div className="mx-auto max-w-md px-5 py-10">
        <Link href="/" className="text-sm text-wine">← Back home</Link>
        <h1 className="mt-2 font-serif text-3xl">Log in</h1>
        {params.get("created") && <p className="mt-2 text-sm text-emerald">Account created — log in below.</p>}
        <form action={onSubmit} className="mt-6 space-y-4 rounded-2xl border border-line bg-white p-6">
          <label className="block text-sm">Email<input name="email" type="email" required className="mt-1 w-full rounded-xl border border-line px-3 py-2" /></label>
          <label className="block text-sm">Password<input name="password" type="password" required className="mt-1 w-full rounded-xl border border-line px-3 py-2" /></label>
          {error && <p className="text-sm text-wine">{error}</p>}
          <button type="submit" className="w-full rounded-full bg-espresso px-8 py-3 font-bold text-[#FFF8EC]">Log in</button>
        </form>
        <p className="mt-4 text-sm text-muted">New here? <Link href="/signup" className="text-wine underline">Create account</Link></p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
