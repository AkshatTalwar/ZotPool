import type { Coordinates, RideCandidate, RideMatch, RideRequest } from "./types";

const EARTH_RADIUS_MILES = 3_958.8;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function haversineMiles(a: Coordinates, b: Coordinates): number {
  const latitudeDelta = toRadians(b.lat - a.lat);
  const longitudeDelta = toRadians(b.lng - a.lng);
  const aLatitude = toRadians(a.lat);
  const bLatitude = toRadians(b.lat);

  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(aLatitude) *
      Math.cos(bLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;

  return 2 * EARTH_RADIUS_MILES * Math.asin(Math.sqrt(haversine));
}

function hoursApart(a: string, b: string): number {
  return Math.abs(new Date(a).getTime() - new Date(b).getTime()) / 3_600_000;
}

function proximityScore(distanceMiles: number, maximumMiles: number): number {
  if (distanceMiles > maximumMiles) return 0;
  return Math.max(0, 1 - distanceMiles / maximumMiles);
}

export function scoreCandidate(
  request: RideRequest,
  candidate: RideCandidate,
): RideMatch | null {
  const startDistanceMiles = haversineMiles(request.start, candidate.start);
  const endDistanceMiles = haversineMiles(request.end, candidate.end);
  const departureDeltaHours = hoursApart(
    request.departureTime,
    candidate.departureTime,
  );

  if (
    startDistanceMiles > request.preferences.maxDetourMiles ||
    endDistanceMiles > request.preferences.maxDetourMiles ||
    departureDeltaHours > 3 ||
    candidate.availableSeats < request.preferences.partySize
  ) {
    return null;
  }

  const startScore = proximityScore(
    startDistanceMiles,
    request.preferences.maxDetourMiles,
  );
  const endScore = proximityScore(
    endDistanceMiles,
    request.preferences.maxDetourMiles,
  );
  const timeScore = Math.max(0, 1 - departureDeltaHours / 3);
  const luggageScore =
    candidate.preferences.luggageCount >= request.preferences.luggageCount
      ? 1
      : 0.5;

  const matchScore = Math.round(
    (startScore * 0.35 + endScore * 0.35 + timeScore * 0.2 + luggageScore * 0.1) *
      100,
  );

  return {
    rideId: candidate.id,
    riderName: candidate.riderName,
    destination: candidate.endLabel,
    departureTime: candidate.departureTime,
    matchScore,
    startDistanceMiles: Number(startDistanceMiles.toFixed(2)),
    endDistanceMiles: Number(endDistanceMiles.toFixed(2)),
    reasons: [
      `${startDistanceMiles.toFixed(1)} mi from your pickup`,
      `${endDistanceMiles.toFixed(1)} mi from your destination`,
      `${departureDeltaHours.toFixed(1)} hr departure difference`,
    ],
    contact: candidate.contact,
  };
}

export function findRideMatches(
  request: RideRequest,
  candidates: RideCandidate[],
  limit = 5,
): RideMatch[] {
  return candidates
    .map((candidate) => scoreCandidate(request, candidate))
    .filter((match): match is RideMatch => match !== null)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}
