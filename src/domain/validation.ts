import type { RideRequest } from "./types";

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function isRideRequest(value: unknown): value is RideRequest {
  if (!value || typeof value !== "object") return false;

  const request = value as Partial<RideRequest>;
  const departureTime = request.departureTime
    ? new Date(request.departureTime).getTime()
    : Number.NaN;

  return Boolean(
    request.startLabel?.trim() &&
      request.endLabel?.trim() &&
      Number.isFinite(departureTime) &&
      request.start &&
      request.end &&
      request.preferences &&
      isFiniteNumber(request.start.lat) &&
      request.start.lat >= -90 &&
      request.start.lat <= 90 &&
      isFiniteNumber(request.start.lng) &&
      request.start.lng >= -180 &&
      request.start.lng <= 180 &&
      isFiniteNumber(request.end.lat) &&
      request.end.lat >= -90 &&
      request.end.lat <= 90 &&
      isFiniteNumber(request.end.lng) &&
      request.end.lng >= -180 &&
      request.end.lng <= 180 &&
      isFiniteNumber(request.preferences.maxDetourMiles) &&
      request.preferences.maxDetourMiles > 0 &&
      request.preferences.maxDetourMiles <= 50 &&
      Number.isInteger(request.preferences.partySize) &&
      request.preferences.partySize > 0 &&
      request.preferences.partySize <= 8 &&
      Number.isInteger(request.preferences.luggageCount) &&
      request.preferences.luggageCount >= 0 &&
      request.preferences.luggageCount <= 20,
  );
}
