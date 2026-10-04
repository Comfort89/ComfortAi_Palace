import Link from "next/link";

const rows = [
  { size: "XS", bust: "32″", waist: "25″", hips: "35″" },
  { size: "S", bust: "34″", waist: "27″", hips: "37″" },
  { size: "M", bust: "36″", waist: "29″", hips: "39″" },
  { size: "L", bust: "38″", waist: "31″", hips: "41″" },
  { size: "XL", bust: "40″", waist: "33″", hips: "43″" },
  { size: "XXL", bust: "42″", waist: "35″", hips: "45″" }
];

export default function SizeGuidePage() {
  return (
    <main className="min-h-screen bg-ivory text-espresso">
      <div className="mx-auto max-w-2xl px-5 py-8">
        <Link href="/" className="text-sm text-wine">← Back home</Link>
        <h1 className="mt-2 font-serif text-3xl">Size Guide</h1>
        <p className="mt-2 text-sm text-muted">Measure around bust, waist and hips. Between sizes? Take the larger for comfort.</p>
        <table className="mt-6 w-full overflow-hidden rounded-2xl border border-line bg-white text-sm">
          <thead><tr className="bg-cream"><th className="p-3 text-left">Size</th><th className="p-3">Bust</th><th className="p-3">Waist</th><th className="p-3">Hips</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.size} className="border-t border-line"><td className="p-3 font-bold">{r.size}</td><td className="p-3 text-center">{r.bust}</td><td className="p-3 text-center">{r.waist}</td><td className="p-3 text-center">{r.hips}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
