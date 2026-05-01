import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
	const { userId } = await req.json();

	const { data: user } = await supabase
		.from("profiles")
		.select("stripe_subscription_id")
		.eq("id", userId)
		.single();

	if (!user?.stripe_subscription_id) {
		return NextResponse.json({ error: "No subscription" }, { status: 400 });
	}

	await stripe.subscriptions.cancel(user.stripe_subscription_id);

	return NextResponse.json({ ok: true });
}
