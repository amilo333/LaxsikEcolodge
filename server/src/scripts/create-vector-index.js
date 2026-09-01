import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import KnowledgeChunk from "../models/KnowledgeChunk.js";
import { getEmbeddingConfig } from "../service/openai-embeddings.js";

dotenv.config();

const indexName = process.env.ATLAS_VECTOR_INDEX || "laxsik_knowledge_vector";
const { dimensions } = getEmbeddingConfig();
const definition = {
  fields: [
    {
      type: "vector",
      path: "embedding",
      numDimensions: dimensions,
      similarity: "cosine",
    },
    { type: "filter", path: "active" },
    { type: "filter", path: "category" },
    { type: "filter", path: "language" },
  ],
};

try {
  await connectDB();
  const collectionName = KnowledgeChunk.collection.collectionName;
  const collectionExists = await mongoose.connection.db
    .listCollections({ name: collectionName })
    .hasNext();

  if (!collectionExists) {
    await mongoose.connection.db.createCollection(collectionName);
  }

  const collection = mongoose.connection.db.collection(collectionName);
  const existing = await collection.listSearchIndexes(indexName).toArray();

  if (existing.length) {
    await collection.updateSearchIndex(indexName, definition);
    console.log(`Atlas Vector Search index updated: ${indexName}`);
  } else {
    await collection.createSearchIndex({
      name: indexName,
      type: "vectorSearch",
      definition,
    });
    console.log(`Atlas Vector Search index created: ${indexName}`);
  }
} catch (error) {
  console.error("Atlas Vector Search index setup failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
