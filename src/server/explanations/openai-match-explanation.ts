import OpenAI from "openai";

import type { RideMatch, RideRequest } from "@/src/domain/types";

let client: OpenAI | undefined;

export async function generateAiMatchExplanation(
  request: RideRequest,
  matches: RideMatch[],
): Promise<string | null> {
  if (!process.env.OPENAI_API_KEY || matches.length === 0) return null;

  client ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL ?? "gpt-5",
      store: false,
      instructions:
        "Explain these deterministic carpool rankings in two concise sentences. " +
        "Use only the supplied metrics, do not invent facts, and do not reveal contact details.",
      input: JSON.stringify({
        route: {
          pickup: request.startLabel,
          destination: request.endLabel,
          departureTime: request.departureTime,
        },
        matches: matches.map((match) => ({
          score: match.matchScore,
          pickupDistanceMiles: match.startDistanceMiles,
          destinationDistanceMiles: match.endDistanceMiles,
          reasons: match.reasons,
        })),
      }),
    });

    return response.output_text.trim() || null;
  } catch (error) {
    console.warn("OpenAI match explanation was unavailable", error);
    return null;
  }
}
