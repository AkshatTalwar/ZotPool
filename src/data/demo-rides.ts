import type { RideCandidate } from "@/src/domain/types";

const departure = (baseTime: number, hoursFromRequest: number): string =>
  new Date(baseTime + hoursFromRequest * 3_600_000).toISOString();

export function getDemoRides(
  requestedDeparture = new Date().toISOString(),
): RideCandidate[] {
  const requestedTime = new Date(requestedDeparture).getTime();
  const baseTime = Number.isNaN(requestedTime) ? Date.now() : requestedTime;

  return [
    {
      id: "demo-ride-1",
      riderName: "Maya",
      startLabel: "UC Irvine",
      endLabel: "Los Angeles International Airport",
      start: { lat: 33.6405, lng: -117.8443 },
      end: { lat: 33.9416, lng: -118.4085 },
      departureTime: departure(baseTime, 1),
      preferences: { maxDetourMiles: 3, partySize: 1, luggageCount: 2 },
      availableSeats: 3,
      contact: "Shared after both riders confirm",
    },
    {
      id: "demo-ride-2",
      riderName: "Noah",
      startLabel: "University Town Center",
      endLabel: "Los Angeles International Airport",
      start: { lat: 33.6494, lng: -117.8397 },
      end: { lat: 33.9425, lng: -118.4068 },
      departureTime: departure(baseTime, 2),
      preferences: { maxDetourMiles: 5, partySize: 1, luggageCount: 1 },
      availableSeats: 2,
      contact: "Shared after both riders confirm",
    },
    {
      id: "demo-ride-3",
      riderName: "Avery",
      startLabel: "Irvine Spectrum Center",
      endLabel: "John Wayne Airport",
      start: { lat: 33.6508, lng: -117.7438 },
      end: { lat: 33.6757, lng: -117.8682 },
      departureTime: departure(baseTime, 1.5),
      preferences: { maxDetourMiles: 4, partySize: 1, luggageCount: 1 },
      availableSeats: 1,
      contact: "Shared after both riders confirm",
    },
  ];
}
