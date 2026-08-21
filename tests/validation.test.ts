import assert from "node:assert/strict";
import test from "node:test";

import { isRideRequest } from "../src/domain/validation";

const validRequest = {
  startLabel: "UC Irvine",
  endLabel: "LAX",
  start: { lat: 33.6405, lng: -117.8443 },
  end: { lat: 33.9416, lng: -118.4085 },
  departureTime: "2026-08-22T18:00:00.000Z",
  preferences: { maxDetourMiles: 5, partySize: 1, luggageCount: 1 },
};

test("accepts a complete ride request", () => {
  assert.equal(isRideRequest(validRequest), true);
});

test("rejects invalid coordinates", () => {
  assert.equal(
    isRideRequest({ ...validRequest, start: { lat: 120, lng: -117.8443 } }),
    false,
  );
});

test("rejects impossible capacity preferences", () => {
  assert.equal(
    isRideRequest({
      ...validRequest,
      preferences: { ...validRequest.preferences, partySize: 0 },
    }),
    false,
  );
});
