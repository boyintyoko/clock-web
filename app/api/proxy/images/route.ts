import path from "path";
import fs from "fs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const colorsDirectory = path.join(process.cwd(), "public", "color");

    const files = fs.readdirSync(colorsDirectory);

    return NextResponse.json({ images: files });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to load images" },
      { status: 500 }
    );
  }
}
