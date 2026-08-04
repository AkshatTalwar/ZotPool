import { findRideMatches } from "@/src/domain/matching";
import type { RideMatch, RideRequest } from "@/src/domain/types";
import { getMatchCache } from "@/src/server/cache/match-cache";
import { generateAiMatchExplanation } from "@/src/server/explanations/openai-match-explanation";
import { getRideRepository } from "@/src/server/repositories/ride-repository";

export async function matchRideRequest(request: RideRequest): Promise<{
  matches: RideMatch[];
  source: "cache" | "computed";
  aiExplanation: string | null;
}> {
  const cache = getMatchCache();
  const cached = await cache.get(request);
  if (cached) {
    return {
      matches: cached,
      source: "cache",
      aiExplanation: await generateAiMatchExplanation(request, cached),
    };
  }

  const candidates = await getRideRepository().findCandidates(request);
  const matches = findRideMatches(request, candidates);
  await cache.set(request, matches);
  return {
    matches,
    source: "computed",
    aiExplanation: await generateAiMatchExplanation(request, matches),
  };
}
