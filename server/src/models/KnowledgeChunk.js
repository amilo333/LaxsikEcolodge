import mongoose from "mongoose";

const knowledgeChunkSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    language: {
      type: String,
      default: "multilingual",
      trim: true,
    },
    sourceType: {
      type: String,
      required: true,
      trim: true,
    },
    sourceId: {
      type: String,
      default: null,
      trim: true,
    },
    sourcePath: {
      type: String,
      default: null,
      trim: true,
    },
    embedding: {
      type: [Number],
      required: true,
      select: false,
    },
    embeddingModel: {
      type: String,
      required: true,
      trim: true,
    },
    checksum: {
      type: String,
      required: true,
      trim: true,
    },
    managedBy: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

const KnowledgeChunk = mongoose.model("KnowledgeChunk", knowledgeChunkSchema);

export default KnowledgeChunk;
