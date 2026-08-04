import { Pool } from "pg";

import { getDemoRides } from "@/src/data/demo-rides";
import type { RideCandidate, RideRequest } from "@/src/domain/types";

export interface RideRepository {
  findCandidates(request: RideRequest): Promise<RideCandidate[]>;
}

export class InMemoryRideRepository implements RideRepository {
  async findCandidates(request: RideRequest): Promise<RideCandidate[]> {
    return getDemoRides(request.departureTime);
  }
}

export class PostgresRideRepository implements RideRepository {
  constructor(private readonly pool: Pool) {}

  async findCandidates(request: RideRequest): Promise<RideCandidate[]> {
    const departure = new Date(request.departureTime);
    const minimumDeparture = new Date(departure.getTime() - 3 * 3_600_000);
    const maximumDeparture = new Date(departure.getTime() + 3 * 3_600_000);

    const result = await this.pool.query(
      `SELECT
         id,
         rider_name,
         start_label,
         end_label,
         start_lat,
         start_lng,
         end_lat,
         end_lng,
         departure_time,
         available_seats,
         luggage_capacity
       FROM ride_requests
       WHERE status = 'open'
         AND departure_time BETWEEN $1 AND $2
         AND available_seats >= $3
       ORDER BY departure_time ASC
       LIMIT 100`,
      [minimumDeparture.toISOString(), maximumDeparture.toISOString(), request.preferences.partySize],
    );

    return result.rows.map((row) => ({
      id: row.id,
      riderName: row.rider_name,
      startLabel: row.start_label,
      endLabel: row.end_label,
      start: { lat: Number(row.start_lat), lng: Number(row.start_lng) },
      end: { lat: Number(row.end_lat), lng: Number(row.end_lng) },
      departureTime: new Date(row.departure_time).toISOString(),
      preferences: {
        maxDetourMiles: request.preferences.maxDetourMiles,
        partySize: 1,
        luggageCount: Number(row.luggage_capacity),
      },
      availableSeats: Number(row.available_seats),
      contact: "Shared after both riders confirm",
    }));
  }
}

let repository: RideRepository | undefined;

export function getRideRepository(): RideRepository {
  if (repository) return repository;

  if (!process.env.DATABASE_URL) {
    repository = new InMemoryRideRepository();
    return repository;
  }

  repository = new PostgresRideRepository(
    new Pool({ connectionString: process.env.DATABASE_URL }),
  );
  return repository;
}
