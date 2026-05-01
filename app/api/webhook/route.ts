import Stripe from "stripe";
import { supabase } from "@/lib/supabase";

function getStripe() {
	const key = process.env.STRIPE_SECRET_KEY;
	if (!key) throw new Error("Missing STRIPE_SECRET_KEY");
	return new Stripe(key);
}

export async function POST(req: Request) {
	const stripe = getStripe();

	const body = await req.text();
	const sig = req.headers.get("stripe-signature");

	if (!sig) {
		return new Response("No signature", { status: 400 });
	}

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(
			body,
			sig,
			process.env.STRIPE_WEBHOOK_SECRET!,
		);
	} catch (err) {
		return new Response("Webhook Error", { status: 400 });
	}

	try {
		if (event.type === "checkout.session.completed") {
			const session = event.data.object as Stripe.Checkout.Session;

			const userId = session.metadata?.userId;
			if (!userId) {
				return new Response("No userId", { status: 400 });
			}

			if (session.mode === "subscription") {
				const subscriptionId = session.subscription as string;

				const subscription =
					await stripe.subscriptions.retrieve(subscriptionId);

				const periodEnd = subscription.items?.data?.[0]?.current_period_end;

				await supabase
					.from("profiles")
					.update({
						plan: "premium",
						subscription_status: subscription.status,
						subscription_end: new Date(periodEnd * 1000),

						stripe_customer_id: session.customer as string,
						stripe_subscription_id: subscription.id,
					})
					.eq("id", userId);
			}

			if (session.mode === "payment") {
				await supabase
					.from("profiles")
					.update({
						plan: "premium_plus",
						subscription_status: null,
						subscription_end: null,

						stripe_customer_id: session.customer as string,
						stripe_subscription_id: null,
					})
					.eq("id", userId);
			}
		}

		if (event.type === "invoice.payment_succeeded") {
			const invoice = event.data.object as any;

			const subscriptionId =
				typeof invoice.subscription === "string"
					? invoice.subscription
					: invoice.subscription?.id;

			const customerId = invoice.customer as string | null;

			if (!subscriptionId || !customerId) {
				return new Response("Missing data", { status: 400 });
			}

			const subscription = await stripe.subscriptions.retrieve(subscriptionId);

			const periodEnd = subscription.items?.data?.[0]?.current_period_end;

			await supabase
				.from("profiles")
				.update({
					subscription_status: subscription.status,
					subscription_end: new Date(periodEnd * 1000),
				})
				.eq("stripe_customer_id", customerId);
		}

		if (event.type === "customer.subscription.deleted") {
			const sub = event.data.object as Stripe.Subscription;

			await supabase
				.from("profiles")
				.update({
					plan: "free",
					subscription_status: "canceled",
					subscription_end: null,
					stripe_subscription_id: null,
				})
				.eq("stripe_customer_id", sub.customer);
		}
	} catch (err) {
		return new Response("Webhook failed", { status: 500 });
	}

	return new Response("ok");
}
