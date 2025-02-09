import connectToDatabase from "../../lib/mongoose";
import Ip from "../../models/Ip";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  await connectToDatabase();

  try {
    const forwarded = req.headers["x-forwarded-for"];
    const ip = forwarded
      ? forwarded.split(",")[0]
      : req.socket.remoteAddress || "IP取得不可";

    const newIp = new Ip({ ip });
    await newIp.save();

    return res.status(201).json({ message: "IP saved", ip });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
