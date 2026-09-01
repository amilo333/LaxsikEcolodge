import { createHash } from "node:crypto";

import { LAXSIK_STATIC_KNOWLEDGE } from "../knowledge/laxsik-static-content.js";
import Dining from "../models/Dining.js";
import DiningService from "../models/DiningService.js";
import KnowledgeChunk from "../models/KnowledgeChunk.js";
import Room from "../models/Room.js";
import Spa from "../models/Spa.js";
import SpaService from "../models/SpaService.js";
import {
  createEmbeddings,
  getEmbeddingConfig,
} from "./openai-embeddings.js";

const MANAGED_BY = "laxsik-knowledge-sync-v1";
const EMBEDDING_BATCH_SIZE = 50;

const compact = (values) => values.filter(Boolean).join(". ");

const checksumDocument = (document) =>
  createHash("sha256")
    .update(
      JSON.stringify({
        title: document.title,
        content: document.content,
        category: document.category,
        language: document.language,
        sourcePath: document.sourcePath,
      }),
    )
    .digest("hex");

const mapStaticDocuments = () =>
  LAXSIK_STATIC_KNOWLEDGE.map((document) => ({
    ...document,
    language: "multilingual",
    sourceType: "static",
    sourceId: null,
    metadata: {},
  }));

const mapRoom = (room) => ({
  key: `room:${room._id}`,
  title: room.title,
  category: "room",
  language: "multilingual",
  sourceType: "room",
  sourceId: room._id.toString(),
  sourcePath: `/rooms/${room._id}`,
  content: compact([
    `Room name: ${room.title}`,
    room.description,
    room.capacity ? `Capacity: up to ${room.capacity} guests` : null,
    room.area ? `Area: ${room.area} square metres` : null,
    room.bed ? `Bed: ${room.bed}` : null,
    room.views ? `View: ${room.views}` : null,
    room.bathroom ? `Bathroom: ${room.bathroom}` : null,
    room.fireplace ? `Fireplace: ${room.fireplace}` : null,
  ]),
  metadata: { roomId: room._id.toString() },
});

const mapDining = (dining) => ({
  key: `dining:${dining._id}`,
  title: dining.title,
  category: "dining",
  language: "multilingual",
  sourceType: "dining",
  sourceId: dining._id.toString(),
  sourcePath: "/dining",
  content: compact([`Dining venue: ${dining.title}`, dining.description]),
  metadata: { diningId: dining._id.toString() },
});

const mapDiningService = (service) => ({
  key: `dining-service:${service._id}`,
  title: service.title,
  category: "dining",
  language: "multilingual",
  sourceType: "dining-service",
  sourceId: service._id.toString(),
  sourcePath: "/dining",
  content: compact([
    `Dining service: ${service.title}`,
    service.diningId?.title
      ? `Available at ${service.diningId.title}`
      : null,
    service.description,
  ]),
  metadata: {
    diningId: service.diningId?._id?.toString() || null,
  },
});

const mapSpa = (spa) => ({
  key: `spa:${spa._id}`,
  title: spa.title,
  category: "spa",
  language: "multilingual",
  sourceType: "spa",
  sourceId: spa._id.toString(),
  sourcePath: "/spa-massage",
  content: compact([`Spa or wellness area: ${spa.title}`, spa.description]),
  metadata: { spaId: spa._id.toString() },
});

const mapSpaService = (service) => ({
  key: `spa-service:${service._id}`,
  title: service.title,
  category: "spa",
  language: "multilingual",
  sourceType: "spa-service",
  sourceId: service._id.toString(),
  sourcePath: "/spa-massage",
  content: compact([
    `Spa service: ${service.title}`,
    service.spaId?.title ? `Available at ${service.spaId.title}` : null,
    service.description,
  ]),
  metadata: { spaId: service.spaId?._id?.toString() || null },
});

const collectLaxsikKnowledge = async () => {
  const [rooms, dinings, diningServices, spas, spaServices] =
    await Promise.all([
      Room.find({ status: "available" }).lean(),
      Dining.find({ status: "active" }).lean(),
      DiningService.find({ status: "active" })
        .populate({ path: "diningId", select: "title" })
        .lean(),
      Spa.find({ status: "active" }).lean(),
      SpaService.find({ status: "active" })
        .populate({ path: "spaId", select: "title" })
        .lean(),
    ]);

  return [
    ...mapStaticDocuments(),
    ...rooms.map(mapRoom),
    ...dinings.map(mapDining),
    ...diningServices.map(mapDiningService),
    ...spas.map(mapSpa),
    ...spaServices.map(mapSpaService),
  ].map((document) => ({
    ...document,
    managedBy: MANAGED_BY,
    active: true,
    checksum: checksumDocument(document),
  }));
};

export const syncLaxsikKnowledge = async ({
  embeddingCreator = createEmbeddings,
} = {}) => {
  const documents = await collectLaxsikKnowledge();
  const keys = documents.map((document) => document.key);
  const existingDocuments = await KnowledgeChunk.find({
    managedBy: MANAGED_BY,
    key: { $in: keys },
  })
    .select("key checksum embeddingModel +embedding")
    .lean();
  const existingByKey = new Map(
    existingDocuments.map((document) => [document.key, document]),
  );
  const expectedEmbedding = getEmbeddingConfig();
  const changedDocuments = documents.filter((document) => {
    const existing = existingByKey.get(document.key);
    return (
      !existing ||
      existing.checksum !== document.checksum ||
      existing.embeddingModel !== expectedEmbedding.model ||
      existing.embedding?.length !== expectedEmbedding.dimensions
    );
  });
  let embeddingModel = null;
  let embeddingDimensions = null;

  for (
    let offset = 0;
    offset < changedDocuments.length;
    offset += EMBEDDING_BATCH_SIZE
  ) {
    const batch = changedDocuments.slice(
      offset,
      offset + EMBEDDING_BATCH_SIZE,
    );
    const embedded = await embeddingCreator(
      batch.map((document) => `${document.title}\n${document.content}`),
    );

    embeddingModel = embedded.model;
    embeddingDimensions = embedded.dimensions;

    await KnowledgeChunk.bulkWrite(
      batch.map((document, index) => ({
        updateOne: {
          filter: { key: document.key },
          update: {
            $set: {
              ...document,
              embedding: embedded.embeddings[index],
              embeddingModel: embedded.model,
            },
          },
          upsert: true,
        },
      })),
    );
  }

  await KnowledgeChunk.updateMany(
    { managedBy: MANAGED_BY, key: { $nin: keys } },
    { $set: { active: false } },
  );

  if (!changedDocuments.length) {
    embeddingModel = expectedEmbedding.model;
    embeddingDimensions = expectedEmbedding.dimensions;
  }

  return {
    total: documents.length,
    embedded: changedDocuments.length,
    unchanged: documents.length - changedDocuments.length,
    embeddingModel,
    embeddingDimensions,
  };
};
