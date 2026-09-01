# Laxsik RAG setup

The chatbot uses MongoDB Atlas Vector Search for Laxsik-specific knowledge and
keeps live room price and availability queries separate.

## Environment

Add these values to `server/.env`:

```env
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
OPENAI_EMBEDDING_DIMENSIONS=1536
ATLAS_VECTOR_INDEX=laxsik_knowledge_vector
```

`OPENAI_API_KEY` and an Atlas `MONGO_URI` must also be configured. The
embedding dimensions must match the `numDimensions` value in the Atlas Vector
Search index.

## Create the index and ingest knowledge

Run these commands from the `server` directory:

```bash
npm run knowledge:index
npm run knowledge:sync
npm run knowledge:check -- room "phòng có view núi"
npm run chat:check -- "Phòng nào có virew núi?"
```

Index creation is asynchronous in Atlas. If the first chatbot query reports
that knowledge search is unavailable, wait until the index status is ready and
try again.

The sync command imports:

- active room descriptions and facilities, excluding price and availability;
- active dining, dining-service, spa, and spa-service records;
- curated Laxsik overview, contact, policy, tour, and experience content.

The command hashes every knowledge document and only requests new embeddings
for changed content. Run it again after an admin changes rooms, dining, spa, or
other source content. Records no longer present in the public source data are
marked inactive and excluded by the vector query.

## Production notes

- Keep room prices and date-specific availability in the existing live tools.
- Run `npm run knowledge:sync` as part of content publishing or deployment.
- Do not expose the embedding field through public API responses.
- Recreate or update the Atlas index whenever the embedding model or dimensions
  change, then run the sync command again.
