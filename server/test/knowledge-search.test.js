import assert from "node:assert/strict";
import test from "node:test";

import { searchLaxsikKnowledge } from "../src/service/knowledge-search.js";

test("builds an Atlas Vector Search query with category filtering", async () => {
  let receivedPipeline;
  const result = await searchLaxsikKnowledge(
    { query: "phòng view núi", category: "room", limit: 4 },
    {
      indexName: "test_vector_index",
      embeddingCreator: async () => ({ embedding: [0.1, 0.2, 0.3] }),
      aggregate: async (pipeline) => {
        receivedPipeline = pipeline;
        return [
          {
            title: "Mountain Retreat",
            content: "View: Mountain",
            score: 0.9,
          },
        ];
      },
    },
  );

  const vectorSearch = receivedPipeline[0].$vectorSearch;
  assert.equal(vectorSearch.index, "test_vector_index");
  assert.deepEqual(vectorSearch.queryVector, [0.1, 0.2, 0.3]);
  assert.deepEqual(vectorSearch.filter, { active: true, category: "room" });
  assert.equal(vectorSearch.limit, 4);
  assert.equal(result.ok, true);
  assert.equal(result.matches[0].title, "Mountain Retreat");
});

test("returns a safe error when Atlas Vector Search is unavailable", async () => {
  const result = await searchLaxsikKnowledge(
    { query: "spa" },
    {
      embeddingCreator: async () => ({ embedding: [0.1] }),
      aggregate: async () => {
        throw new Error("index not found: internal details");
      },
    },
  );

  assert.equal(result.ok, false);
  assert.equal(result.code, "KNOWLEDGE_SEARCH_UNAVAILABLE");
  assert.doesNotMatch(result.error, /internal details/);
});
