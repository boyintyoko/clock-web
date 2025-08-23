import { NextResponse } from "next/server";
import axios from "axios";
import type ImageType from "@/app/types/ImagesType";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const response = await axios.get<ImageType[]>(
      `https://api.unsplash.com/photos/random?client_id=${process.env.NEXT_PUBLIC_UNSPLASH_API_END_KEY}&count=${id}`,
    );

    const data = response.data;

    return NextResponse.json(data);
  } catch (_err: unknown) {
    console.error("Error fetching API:", _err);

    const message =
      _err instanceof Error ? _err.message : "Failed to fetch data";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
