import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const userId = searchParams.get("userId");

		if (!userId) {
			return new Response("No userId", { status: 400 });
		}

		const { data, error } = await supabase
			.from("profiles")
			.select("plan, subscription_end")
			.eq("id", userId)
			.single();

		if (error || !data) {
			console.error("DB error:", error);
			return new Response("DB error", { status: 500 });
		}

		return Response.json({
			plan: data.plan ?? "free",
			subscription_end: data.subscription_end,
		});
	} catch (err) {
		console.error("API crash:", err);
		return new Response("Server error", { status: 500 });
	}
}
