import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-ivory text-espresso">
      <div className="mx-auto flex max-w-md flex-col items-center px-5 py-20 text-center">
        <p className="font-serif text-2xl tracking-wide">
          ComfortZone <span className="italic text-golddark">Palace</span>
        </p>
        <h1 className="mt-6 font-serif text-4xl">You are offline</h1>
        <p className="mt-3 text-muted">
          Please check your connection. Your bag and wishlist are saved on this
          device and will be here when you return.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-espresso px-8 py-3 font-bold text-[#FFF8EC]"
        >
          Try again
        </Link>
      </div>
    </main>
  );
}
