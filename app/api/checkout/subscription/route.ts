import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
	try {
		const body = await req.json();

		if (!body.priceId || !body.userId) {
			return Response.json(
				{ error: "priceId and userId required" },
				{ status: 400 },
			);
		}

		const session = await stripe.checkout.sessions.create({
			mode: "subscription",

			line_items: [
				{
					price: body.priceId,
					quantity: 1,
				},
			],

			metadata: {
				userId: body.userId,
			},

			success_url:
				"http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}",

			cancel_url: "http://localhost:3000/cancel",
		});

		return Response.json({ url: session.url });
	} catch (err) {
		console.error(err);

		return Response.json({ error: "server error" }, { status: 500 });
	}
}
