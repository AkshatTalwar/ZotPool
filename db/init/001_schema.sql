CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS ride_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rider_name TEXT NOT NULL,
  start_label TEXT NOT NULL,
  end_label TEXT NOT NULL,
  start_lat DOUBLE PRECISION NOT NULL,
  start_lng DOUBLE PRECISION NOT NULL,
  end_lat DOUBLE PRECISION NOT NULL,
  end_lng DOUBLE PRECISION NOT NULL,
  departure_time TIMESTAMPTZ NOT NULL,
  available_seats SMALLINT NOT NULL CHECK (available_seats > 0),
  luggage_capacity SMALLINT NOT NULL DEFAULT 0 CHECK (luggage_capacity >= 0),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'matched', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- B-tree indexes support the API's time-window/status lookup and deterministic
-- endpoint filtering. A production geospatial version can add PostGIS/GiST.
CREATE INDEX IF NOT EXISTS ride_requests_status_departure_idx
  ON ride_requests USING BTREE (status, departure_time);

CREATE INDEX IF NOT EXISTS ride_requests_route_lookup_idx
  ON ride_requests USING BTREE (start_lat, start_lng, end_lat, end_lng);

INSERT INTO ride_requests (
  rider_name, start_label, end_label, start_lat, start_lng,
  end_lat, end_lng, departure_time, available_seats, luggage_capacity
)
SELECT * FROM (
  VALUES
    ('Maya', 'UC Irvine', 'Los Angeles International Airport', 33.6405, -117.8443, 33.9416, -118.4085, NOW() + INTERVAL '1 hour', 3, 2),
    ('Noah', 'University Town Center', 'Los Angeles International Airport', 33.6494, -117.8397, 33.9425, -118.4068, NOW() + INTERVAL '2 hours', 2, 1),
    ('Avery', 'Irvine Spectrum Center', 'John Wayne Airport', 33.6508, -117.7438, 33.6757, -117.8682, NOW() + INTERVAL '90 minutes', 1, 1)
) AS seed(rider_name, start_label, end_label, start_lat, start_lng, end_lat, end_lng, departure_time, available_seats, luggage_capacity)
WHERE NOT EXISTS (SELECT 1 FROM ride_requests);
