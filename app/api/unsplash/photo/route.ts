import axios from "axios";

export async function GET() {
	try {
		const res = await axios.get(
			`https://api.unsplash.com/photos/random?client_id=${process.env.NEXT_PUBLIC_UNSPLASH_API_END_KEY}`,
		);

		const data = res.data;

		return Response.json({
			imageUrl: data.urls.regular,
		});
	} catch (error) {
		console.error("Unsplash API error:", error);

		return new Response("Internal Server Error", {
			status: 500,
		});
	}
}
