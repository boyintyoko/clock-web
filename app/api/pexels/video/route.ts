import axios from "axios";

export async function GET() {
	try {
		const query = "particles loop";

		const res = await axios.get("https://api.pexels.com/videos/search", {
			headers: {
				Authorization: process.env.PEXELS_API_KEY!,
			},

			params: {
				query: query,
				per_page: 15,
			},
		});

		const videos = res.data.videos;

		const randomVideo = videos[Math.floor(Math.random() * videos.length)];

		const videoFile = randomVideo.video_files.find(
			(file: any) => file.width <= 1280,
		);

		return Response.json({
			videoUrl: videoFile.link,
		});
	} catch (error) {
		console.error("pexels error:", error);

		return Response.json(
			{
				error: "Failed to fetch video",
			},
			{ status: 500 },
		);
	}
}
