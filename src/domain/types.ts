export type Coordinates = {
  lat: number;
  lng: number;
};

export type RidePreferences = {
  maxDetourMiles: number;
  partySize: number;
  luggageCount: number;
};

export type RideRequest = {
  id?: string;
  riderName?: string;
  startLabel: string;
  endLabel: string;
  start: Coordinates;
  end: Coordinates;
  departureTime: string;
  preferences: RidePreferences;
};

export type RideCandidate = RideRequest & {
  id: string;
  riderName: string;
  availableSeats: number;
  contact?: string;
};

export type RideMatch = {
  rideId: string;
  riderName: string;
  destination: string;
  departureTime: string;
  matchScore: number;
  startDistanceMiles: number;
  endDistanceMiles: number;
  reasons: string[];
  contact?: string;
};
