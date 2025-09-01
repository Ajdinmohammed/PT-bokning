import { NextResponse } from "next/server";
import Stripe from "stripe";
import { pts } from "../../lib/ptData";

// Snabbkoll: öppna /api/checkout i webbläsaren, du ska se ok: true
export async function GET() {
  return NextResponse.json({
    ok: true,
    hasKey: !!process.env.STRIPE_SECRET_KEY,
    appUrl: process.env.APP_URL || null,
  });
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let data: any = {};
    if (contentType.includes("application/json")) {
      data = await req.json();
    } else {
      const form = await req.formData();
      form.forEach((v, k) => (data[k] = v));
    }

    const { customerEmail, ptId, serviceId, startsAt } = data;

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Saknar STRIPE_SECRET_KEY (kolla .env.local)" },
        { status: 500 }
      );
    }
    if (!process.env.APP_URL) {
      return NextResponse.json(
        { error: "Saknar APP_URL (kolla .env.local)" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: "2024-06-20" as any,
    });

    const pt = pts.find((p) => p.id === ptId);
    if (!pt) return NextResponse.json({ error: "PT saknas" }, { status: 404 });
    const service = pt.services.find((s) => s.id === serviceId);
    if (!service) return NextResponse.json({ error: "Tjänst saknas" }, { status: 404 });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "sek",
      customer_email: String(customerEmail || ""),
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "sek",
            unit_amount: service.priceSek * 100,
            product_data: {
              name: `${service.title} hos ${pt.name}`,
              description: `Start: ${new Date(startsAt).toLocaleString("sv-SE")}`,
            },
          },
        },
      ],
      success_url: `${process.env.APP_URL}/booking/success`,
      cancel_url: `${process.env.APP_URL}/booking/cancel`,
      metadata: { ptId: pt.id, serviceId: service.id, startsAt: String(startsAt) },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Okänt fel i checkout" },
      { status: 500 }
    );
  }
}
