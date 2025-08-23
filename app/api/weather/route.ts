// app/api/weather/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({ error: "Missing lat/lon" }, { status: 400 });
  }

  try {
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_OPEN_WEATHER_API_KEY}&units=metric&lang=ja`,
    );

    const temp = res.data.main.temp;
    const hum = res.data.main.humidity;
    const weatherIcon = res.data.weather[0].icon;

    return NextResponse.json({ temp, hum, weatherIcon });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
