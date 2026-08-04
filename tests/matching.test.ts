import assert from "node:assert/strict";
import test from "node:test";

import { findRideMatches, haversineMiles } from "../src/domain/matching";
import type { RideCandidate, RideRequest } from "../src/domain/types";

const request: RideRequest = {
  startLabel: "UC Irvine",
  endLabel: "LAX",
  start: { lat: 33.6405, lng: -117.8443 },
  end: { lat: 33.9416, lng: -118.4085 },
  departureTime: "2026-08-04T18:00:00.000Z",
  preferences: { maxDetourMiles: 5, partySize: 1, luggageCount: 1 },
};

function candidate(overrides: Partial<RideCandidate> = {}): RideCandidate {
  return {
    ...request,
    id: "ride-1",
    riderName: "Maya",
    departureTime: "2026-08-04T19:00:00.000Z",
    availableSeats: 2,
    ...overrides,
  };
}

test("haversine returns zero for the same coordinates", () => {
  assert.equal(haversineMiles(request.start, request.start), 0);
});

test("matching ranks the closest compatible ride first", () => {
  const matches = findRideMatches(request, [
    candidate({ id: "farther", start: { lat: 33.67, lng: -117.85 } }),
    candidate({ id: "closest" }),
  ]);

  assert.equal(matches.length, 2);
  assert.equal(matches[0].rideId, "closest");
  assert.ok(matches[0].matchScore > matches[1].matchScore);
});

test("matching rejects routes outside the detour radius", () => {
  const matches = findRideMatches(request, [
    candidate({ start: { lat: 34.0522, lng: -118.2437 } }),
  ]);
  assert.deepEqual(matches, []);
});

test("matching rejects rides without enough seats", () => {
  const matches = findRideMatches(
    { ...request, preferences: { ...request.preferences, partySize: 3 } },
    [candidate({ availableSeats: 2 })],
  );
  assert.deepEqual(matches, []);
});
