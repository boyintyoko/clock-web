import connectToDatabase from "../../../lib/mongoose";
import Ip from "../../../models/Ip";

// POST メソッドで IP を保存
export async function POST(req) {
  await connectToDatabase();

  try {
    const forwarded = req.headers["x-forwarded-for"];
    const ip = forwarded
      ? forwarded.split(",")[0]
      : req.socket.remoteAddress || "IP取得不可";

    const newIp = new Ip({ ip });
    await newIp.save();

    return new Response(JSON.stringify({ message: "IP saved", ip }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
