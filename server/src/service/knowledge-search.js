import KnowledgeChunk from "../models/KnowledgeChunk.js";
import { createEmbedding } from "./openai-embeddings.js";

const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 8;

const normalizeLimit = (value) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed < 1) return DEFAULT_LIMIT;
  return Math.min(parsed, MAX_LIMIT);
};

export const searchLaxsikKnowledge = async (
  { query, category = null, limit = DEFAULT_LIMIT },
  {
    embeddingCreator = createEmbedding,
    aggregate = (pipeline) => KnowledgeChunk.aggregate(pipeline),
    indexName = process.env.ATLAS_VECTOR_INDEX || "laxsik_knowledge_vector",
  } = {},
) => {
  const normalizedQuery = typeof query === "string" ? query.trim() : "";

  if (!normalizedQuery) {
    return { ok: false, error: "A knowledge search query is required." };
  }

  try {
    const resultLimit = normalizeLimit(limit);
    const { embedding } = await embeddingCreator(normalizedQuery);
    const filter = {
      active: true,
      ...(category ? { category } : {}),
    };
    const matches = await aggregate([
      {
        $vectorSearch: {
          index: indexName,
          path: "embedding",
          queryVector: embedding,
          numCandidates: Math.max(resultLimit * 20, 100),
          limit: resultLimit,
          filter,
        },
      },
      {
        $project: {
          _id: 0,
          key: 1,
          title: 1,
          content: 1,
          category: 1,
          sourcePath: 1,
          metadata: 1,
          score: { $meta: "vectorSearchScore" },
        },
      },
    ]);

    return {
      ok: true,
      query: normalizedQuery,
      matches,
    };
  } catch (error) {
    if ([401, 429].includes(error.status)) {
      throw error;
    }

    console.error("Knowledge search error:", error.message);

    return {
      ok: false,
      code: "KNOWLEDGE_SEARCH_UNAVAILABLE",
      error:
        "The Laxsik knowledge base is not available. Check the Atlas Vector Search index and knowledge sync.",
    };
  }
};
