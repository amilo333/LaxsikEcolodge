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

const localizedValues = (document, locale) =>
  document?.translations?.[locale] || document || {};

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

const mapRoom = (room) => {
  const vi = localizedValues(room, "vi");
  const en = localizedValues(room, "en");

  return {
    key: `room:${room._id}`,
    title: vi.title || room.title,
    category: "room",
    language: "multilingual",
    sourceType: "room",
    sourceId: room._id.toString(),
    sourcePath: `/rooms/${room._id}`,
    content: compact([
      `Tên phòng: ${vi.title || room.title}`,
      vi.description,
      vi.bed ? `Giường: ${vi.bed}` : null,
      vi.views ? `Hướng nhìn: ${vi.views}` : null,
      vi.bathroom ? `Phòng tắm: ${vi.bathroom}` : null,
      vi.fireplace ? `Lò sưởi: ${vi.fireplace}` : null,
      `Room name: ${en.title || room.title}`,
      en.description,
      room.capacity ? `Capacity: up to ${room.capacity} guests` : null,
      room.area ? `Area: ${room.area} square metres` : null,
      en.bed ? `Bed: ${en.bed}` : null,
      en.views ? `View: ${en.views}` : null,
      en.bathroom ? `Bathroom: ${en.bathroom}` : null,
      en.fireplace ? `Fireplace: ${en.fireplace}` : null,
    ]),
    metadata: { roomId: room._id.toString() },
  };
};

const mapDining = (dining) => ({
  key: `dining:${dining._id}`,
  title: localizedValues(dining, "vi").title || dining.title,
  category: "dining",
  language: "multilingual",
  sourceType: "dining",
  sourceId: dining._id.toString(),
  sourcePath: "/dining",
  content: compact([
    `Khu ẩm thực: ${localizedValues(dining, "vi").title || dining.title}`,
    localizedValues(dining, "vi").description,
    `Dining venue: ${localizedValues(dining, "en").title || dining.title}`,
    localizedValues(dining, "en").description,
  ]),
  metadata: { diningId: dining._id.toString() },
});

const mapDiningService = (service) => ({
  key: `dining-service:${service._id}`,
  title: localizedValues(service, "vi").title || service.title,
  category: "dining",
  language: "multilingual",
  sourceType: "dining-service",
  sourceId: service._id.toString(),
  sourcePath: "/dining",
  content: compact([
    `Dịch vụ ẩm thực: ${localizedValues(service, "vi").title || service.title}`,
    localizedValues(service, "vi").description,
    service.diningId?.title
      ? `Có tại ${localizedValues(service.diningId, "vi").title || service.diningId.title}`
      : null,
    `Dining service: ${localizedValues(service, "en").title || service.title}`,
    service.diningId?.title
      ? `Available at ${localizedValues(service.diningId, "en").title || service.diningId.title}`
      : null,
    localizedValues(service, "en").description,
  ]),
  metadata: {
    diningId: service.diningId?._id?.toString() || null,
  },
});

const mapSpa = (spa) => ({
  key: `spa:${spa._id}`,
  title: localizedValues(spa, "vi").title || spa.title,
  category: "spa",
  language: "multilingual",
  sourceType: "spa",
  sourceId: spa._id.toString(),
  sourcePath: "/spa-massage",
  content: compact([
    `Khu spa: ${localizedValues(spa, "vi").title || spa.title}`,
    localizedValues(spa, "vi").description,
    `Spa or wellness area: ${localizedValues(spa, "en").title || spa.title}`,
    localizedValues(spa, "en").description,
  ]),
  metadata: { spaId: spa._id.toString() },
});

const mapSpaService = (service) => ({
  key: `spa-service:${service._id}`,
  title: localizedValues(service, "vi").title || service.title,
  category: "spa",
  language: "multilingual",
  sourceType: "spa-service",
  sourceId: service._id.toString(),
  sourcePath: "/spa-massage",
  content: compact([
    `Dịch vụ spa: ${localizedValues(service, "vi").title || service.title}`,
    localizedValues(service, "vi").description,
    service.spaId?.title
      ? `Có tại ${localizedValues(service.spaId, "vi").title || service.spaId.title}`
      : null,
    `Spa service: ${localizedValues(service, "en").title || service.title}`,
    service.spaId?.title
      ? `Available at ${localizedValues(service.spaId, "en").title || service.spaId.title}`
      : null,
    localizedValues(service, "en").description,
  ]),
  metadata: { spaId: service.spaId?._id?.toString() || null },
});

const collectLaxsikKnowledge = async () => {
  const [rooms, dinings, diningServices, spas, spaServices] =
    await Promise.all([
      Room.find({ status: "available" }).lean(),
      Dining.find({ status: "active" }).lean(),
      DiningService.find({ status: "active" })
        .populate({ path: "diningId", select: "title translations" })
        .lean(),
      Spa.find({ status: "active" }).lean(),
      SpaService.find({ status: "active" })
        .populate({ path: "spaId", select: "title translations" })
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
