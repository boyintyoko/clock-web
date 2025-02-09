export async function GET(req) {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : "IP取得不可";
  return new Response(JSON.stringify({ ip }), {
    headers: { "Content-Type": "application/json" },
  });
}
