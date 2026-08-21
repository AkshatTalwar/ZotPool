# ZotPool engineering walkthrough

This guide is the shortest path through the working system. It separates the public demo configuration from the full local architecture so each claim can be checked directly in code.

## Three-minute demo

1. Open the public demo and choose **Get Started**.
2. Choose **Start matching**, then **Run 30-second prepared demo**. The prepared request avoids relying on external place autocomplete during a presentation.
3. Explain that the returned scores are deterministic. Pickup proximity and destination proximity each contribute 35%, departure-time alignment contributes 20%, and luggage compatibility contributes 10%.
4. Point out whether the result was freshly computed or served from the configured cache.
5. Open the files below in order to show how the request travels through the system.

## Claim-to-code map

| Capability | Implementation | What to explain |
| --- | --- | --- |
| Geospatial matching | [`src/domain/matching.ts`](../src/domain/matching.ts) | Haversine distance, hard compatibility filters, weighted scoring, deterministic sorting |
| Request validation | [`src/domain/validation.ts`](../src/domain/validation.ts) | Coordinate, time, party-size, detour, and luggage bounds before matching |
| Google Maps | [`app/carpool/page.tsx`](../app/carpool/page.tsx) | Places autocomplete supplies labels and coordinates; the prepared request is a resilient demo fallback |
| PostgreSQL and B-tree indexes | [`src/server/repositories/ride-repository.ts`](../src/server/repositories/ride-repository.ts), [`db/init/001_schema.sql`](../db/init/001_schema.sql) | Indexed status/time lookup narrows candidates before in-process geospatial scoring |
| Redis caching | [`src/server/cache/match-cache.ts`](../src/server/cache/match-cache.ts) | SHA-256 request key, JSON result value, 60-second TTL, in-memory adapter for the public demo |
| OpenAI explanation | [`src/server/explanations/openai-match-explanation.ts`](../src/server/explanations/openai-match-explanation.ts) | The model explains deterministic metrics; it does not choose or reorder matches |
| WebSocket coordination | [`server/realtime.ts`](../server/realtime.ts) | Connection acknowledgement, validated trip-status events, broadcast to connected clients |
| Docker local stack | [`docker-compose.yml`](../docker-compose.yml) | App, PostgreSQL, Redis, and realtime service start as separate containers |
| AWS Lambda container | [`infra/lambda/match-handler.ts`](../infra/lambda/match-handler.ts), [`infra/lambda/Dockerfile`](../infra/lambda/Dockerfile) | Lambda reuses the API service layer, including repository, cache, and optional explanation adapters |
| CI/CD | [`.github/workflows/ci.yml`](../.github/workflows/ci.yml), [`.github/workflows/deploy-lambda.yml`](../.github/workflows/deploy-lambda.yml) | Pull requests run tests, type checking, and a production build; a protected manual workflow builds and deploys the Lambda image through OIDC |

## Request path

```text
Carpool form
  -> POST /api/matches
  -> request validation
  -> cache lookup
  -> PostgreSQL candidate lookup (or demo adapter)
  -> deterministic filtering and ranking
  -> cache write
  -> optional OpenAI explanation
  -> ranked result cards
```

The Lambda handler calls the same service layer as the Next.js route. This keeps matching behavior consistent across the web demo and the AWS deployment path.

## Deliberate scope boundaries

- The public Vercel deployment uses the configured environment; without database or Redis URLs, it uses the documented in-memory adapters.
- OpenAI is optional and cannot change the deterministic ranking.
- The WebSocket service is included in the Docker stack and is not hosted by the Vercel frontend.
- The repository provides a deployable Lambda container and GitHub Actions workflow, but it does not publish or claim a currently live AWS endpoint or production traffic.
- PostGIS would be the next database-level optimization for a larger geospatial search radius; the current B-tree indexes accelerate the status/time candidate lookup used by this prototype.
