import Link from "next/link";
import { pts } from "./lib/ptData";

export default function HomePage() {
  return (
    <main className="min-h-screen p-6 md:p-12">
      <h1 className="text-3xl font-bold mb-4">Hitta en PT nära dig</h1>
      <p className="mb-6">Klicka på en PT för att se tider och boka.</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pts.map((pt) => (
          <Link
            href={`/pt/${pt.id}`}
            key={pt.id}
            className="rounded-2xl border p-4 hover:shadow"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={pt.photoUrl}
              alt={pt.name}
              className="w-full h-48 object-cover rounded-xl mb-3"
            />
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{pt.name}</h2>
              <span className="text-sm">⭐ {pt.rating}</span>
            </div>
            <p className="text-sm text-gray-600">{pt.city}</p>
            <p className="mt-2 text-sm">{pt.bio}</p>
            <button className="mt-3 w-full rounded-xl border py-2">
              Visa & boka
            </button>
          </Link>
        ))}
      </div>
    </main>
  );
}
