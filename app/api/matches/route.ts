import { NextResponse } from "next/server";

import { isRideRequest } from "@/src/domain/validation";
import { matchRideRequest } from "@/src/server/match-service";

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
