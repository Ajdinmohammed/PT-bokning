"use client";

import { useParams } from "next/navigation";
import { pts } from "../../lib/ptData";

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("sv-SE", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PTPage() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const pt = pts.find((p) => p.id === id);
  if (!pt) {
    return (
      <main className="min-h-screen p-6 md:p-12">
        <h1 className="text-2xl font-bold">PT hittades inte</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 md:p-12">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pt.photoUrl}
            alt={pt.name}
            className="w-full h-72 object-cover rounded-2xl mb-4"
          />
          <h1 className="text-3xl font-bold">{pt.name}</h1>
          <p className="text-gray-600">
            {pt.city} • ⭐ {pt.rating}
          </p>
          <p className="mt-4">{pt.bio}</p>

          <h2 className="text-2xl font-semibold mt-6">Tjänster</h2>
          <div className="grid md:grid-cols-2 gap-4 mt-3">
            {pt.services.map((s) => (
              <div key={s.id} className="border rounded-xl p-4">
                <div className="font-medium">{s.title}</div>
                <div className="text-sm text-gray-600">{s.durationMin} min</div>
                <div className="mt-1 font-semibold">{s.priceSek} kr</div>
              </div>
            ))}
          </div>
        </div>

        <aside>
          <div className="border rounded-2xl p-4 sticky top-6">
            <h3 className="text-xl font-semibold mb-3">Lediga tider</h3>
            <div className="space-y-2">
              {pt.slots.map((slot) => (
                <form
                  key={slot}
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget as HTMLFormElement;
                    const email = (form.elements.namedItem(
                      "customerEmail"
                    ) as HTMLInputElement).value;

                    try {
                      const res = await fetch("/api/checkout", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          customerEmail: email,
                          ptId: pt.id,
                          serviceId: pt.services[0].id,
                          startsAt: slot,
                        }),
                      });

                      const text = await res.text();
                      let data: any = {};
                      try {
                        data = JSON.parse(text);
                      } catch {
                        throw new Error(text);
                      }

                      if (res.ok && data.url) {
                        window.location.href = data.url;
                      } else {
                        alert(data.error || "Kunde inte starta betalning.");
                      }
                    } catch (err: any) {
                      alert("Fel: " + (err?.message || String(err)));
                    }
                  }}
                  className="flex gap-2"
                >
                  <input
                    required
                    name="customerEmail"
                    type="email"
                    placeholder="din@mail.se"
                    className="border rounded-lg px-3 py-2 w-full"
                  />
                  <button className="rounded-lg border px-3 py-2">
                    Boka {formatTime(slot)}
                  </button>
                </form>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Betalning sker i nästa steg (Stripe).
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
