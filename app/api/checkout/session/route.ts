import { stripe } from "@/lib/stripe";

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);

		const sessionId = searchParams.get("session_id");

		if (!sessionId) {
			return Response.json(
				{ error: "session_id is required" },
				{ status: 400 },
			);
		}

		const session = await stripe.checkout.sessions.retrieve(sessionId);

		let subscriptionEnd: number | null = null;

		if (session.mode === "subscription" && session.subscription) {
			const subscription = await stripe.subscriptions.retrieve(
				session.subscription as string,
			);

			if (subscription.items.data[0].current_period_end) {
				subscriptionEnd = subscription.items.data[0].current_period_end;
			}
		}

		return Response.json({
			mode: session.mode,
			payment_status: session.payment_status,

			userId: session.metadata?.userId ?? null,

			subscription_end: subscriptionEnd,
		});
	} catch (err) {
		console.error(err);

		return Response.json({ error: "server error" }, { status: 500 });
	}
}
