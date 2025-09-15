export const runtime = 'edge'

export async function GET() {
  return Response.json({
    ok: true,
    hasGeminiKey: !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY),
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    now: new Date().toISOString(),
  })
}
