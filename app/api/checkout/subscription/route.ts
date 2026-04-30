import Stripe from "stripe";

function getStripe() {
	const key = process.env.STRIPE_SECRET_KEY;

	if (!key) {
		throw new Error("Missing STRIPE_SECRET_KEY");
	}

	return new Stripe(key);
}

export async function POST(req: Request) {
	try {
		const { userId, priceId } = await req.json();

		if (!userId || !priceId) {
			return new Response("Missing params", { status: 400 });
		}

		const stripe = getStripe();

		const session = await stripe.checkout.sessions.create({
			mode: "subscription",

			payment_method_types: ["card"],

			line_items: [
				{
					price: priceId,
					quantity: 1,
				},
			],

			success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,

			metadata: {
				userId,
			},
		});

		return Response.json({ url: session.url });
	} catch (err: any) {
		console.error("🔥 Stripe subscription error:", err);
		return new Response(err.message || "Internal Server Error", {
			status: 500,
		});
	}
}
