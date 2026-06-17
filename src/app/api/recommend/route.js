// src/app/api/recommend/route.js
// Runs on the SERVER — your API key is never exposed to the browser.

export async function POST(request) {
  try {
    const { services, genres, mood } = await request.json();

    if (!services?.length || !genres?.length) {
      return Response.json({ error: "Please select at least one service and genre." }, { status: 400 });
    }

    const prompt = `You are a TV show recommendation expert. Based on the user's preferences, recommend exactly 4 shows.

User's streaming services: ${services.join(", ")}
Favorite genres: ${genres.join(", ")}
Current mood: ${mood || "flexible"}

IMPORTANT: Only recommend shows actually available on the listed streaming services.

Respond ONLY with valid JSON, no markdown, no extra text:
{
  "shows": [
    {
      "title": "Show Title",
      "platform": "Netflix",
      "genre": "Drama",
      "seasons": "3 seasons",
      "year": "2019",
      "matchScore": 95,
      "why": "One sentence explaining exactly why this matches their taste and mood.",
      "hook": "One irresistible sentence that makes them want to watch it tonight."
    }
  ]
}`;

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!anthropicRes.ok) {
      console.error("Anthropic API error:", await anthropicRes.text());
      return Response.json({ error: "Recommendation service unavailable. Try again." }, { status: 502 });
    }

    const data = await anthropicRes.json();
    const raw = data.content.map((b) => b.text || "").join("");
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const result = JSON.parse(cleaned);

    return Response.json(result);
  } catch (err) {
    console.error("Route error:", err);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
