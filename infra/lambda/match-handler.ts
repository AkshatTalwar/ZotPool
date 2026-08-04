import { findRideMatches } from "../../src/domain/matching";
import type { RideCandidate, RideRequest } from "../../src/domain/types";

type ApiGatewayEvent = { body?: string | null };

// Lambda-compatible pure handler. The deployed version supplies candidates
// from PostgreSQL before invoking the shared matching domain.
export async function handler(event: ApiGatewayEvent) {
  try {
    const payload = JSON.parse(event.body ?? "{}") as {
      request: RideRequest;
      candidates: RideCandidate[];
    };
    const matches = findRideMatches(payload.request, payload.candidates ?? []);

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ matches }),
    };
  } catch {
    return {
      statusCode: 400,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Invalid matching request" }),
    };
  }
}
