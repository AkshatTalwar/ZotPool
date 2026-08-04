import { NextResponse } from "next/server";

import type { RideRequest } from "@/src/domain/types";
import { matchRideRequest } from "@/src/server/match-service";

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isRideRequest(value: unknown): value is RideRequest {
  if (!value || typeof value !== "object") return false;
  const request = value as Partial<RideRequest>;
  return Boolean(
    request.startLabel &&
      request.endLabel &&
      request.departureTime &&
      request.start &&
      request.end &&
      request.preferences &&
      isFiniteNumber(request.start.lat) &&
      isFiniteNumber(request.start.lng) &&
      isFiniteNumber(request.end.lat) &&
      isFiniteNumber(request.end.lng) &&
      isFiniteNumber(request.preferences.maxDetourMiles) &&
      isFiniteNumber(request.preferences.partySize) &&
      isFiniteNumber(request.preferences.luggageCount),
  );
}

export async function POST(httpRequest: Request) {
  const body: unknown = await httpRequest.json().catch(() => null);
  if (!isRideRequest(body)) {
    return NextResponse.json(
      { error: "A valid ride request with coordinates and preferences is required." },
      { status: 400 },
    );
  }

  const result = await matchRideRequest(body);
  return NextResponse.json(result);
}

export function GET() {
  return NextResponse.json({
    service: "zotpool-matching",
    status: "ok",
    persistence: process.env.DATABASE_URL ? "postgresql" : "demo-memory",
    cache: process.env.REDIS_URL ? "redis" : "memory",
  });
}
