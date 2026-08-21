import { isRideRequest } from "../../src/domain/validation";
import { matchRideRequest } from "../../src/server/match-service";

type ApiGatewayEvent = { body?: string | null };

export async function handler(event: ApiGatewayEvent) {
  try {
    const payload: unknown = JSON.parse(event.body ?? "{}");
    if (!isRideRequest(payload)) {
      return response(400, {
        error: "A valid ride request with coordinates and preferences is required.",
      });
    }

    return response(200, await matchRideRequest(payload));
  } catch {
    return response(400, { error: "Invalid matching request" });
  }
}

function response(statusCode: number, body: unknown) {
  return {
    statusCode,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  };
}
