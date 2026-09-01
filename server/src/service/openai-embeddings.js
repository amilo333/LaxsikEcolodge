const OPENAI_EMBEDDINGS_URL = "https://api.openai.com/v1/embeddings";

const DEFAULT_EMBEDDING_MODEL = "text-embedding-3-small";
const DEFAULT_EMBEDDING_DIMENSIONS = 1536;

const readPositiveInteger = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

export const getEmbeddingConfig = () => ({
  model: process.env.OPENAI_EMBEDDING_MODEL || DEFAULT_EMBEDDING_MODEL,
  dimensions: readPositiveInteger(
    process.env.OPENAI_EMBEDDING_DIMENSIONS,
    DEFAULT_EMBEDDING_DIMENSIONS,
  ),
});

export const createEmbeddings = async (
  inputs,
  {
    fetchImpl = fetch,
    apiKey = process.env.OPENAI_API_KEY,
    model = getEmbeddingConfig().model,
    dimensions = getEmbeddingConfig().dimensions,
  } = {},
) => {
  const normalizedInputs = (Array.isArray(inputs) ? inputs : [inputs])
    .map((input) => (typeof input === "string" ? input.trim() : ""))
    .filter(Boolean);

  if (!normalizedInputs.length) {
    throw new Error("At least one non-empty text is required for embedding.");
  }

  if (!apiKey) {
    const error = new Error("OPENAI_API_KEY is not configured.");
    error.status = 503;
    error.code = "OPENAI_NOT_CONFIGURED";
    throw error;
  }

  const response = await fetchImpl(OPENAI_EMBEDDINGS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    signal: AbortSignal.timeout(25_000),
    body: JSON.stringify({
      input: normalizedInputs,
      model,
      dimensions,
      encoding_format: "float",
    }),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      data.error?.message || "OpenAI could not create embeddings.",
    );
    error.status = response.status;
    error.code = data.error?.code || null;
    throw error;
  }

  const embeddings = [...(data.data || [])]
    .sort((left, right) => left.index - right.index)
    .map((item) => item.embedding);

  if (
    embeddings.length !== normalizedInputs.length ||
    embeddings.some(
      (embedding) =>
        !Array.isArray(embedding) || embedding.length !== dimensions,
    )
  ) {
    throw new Error("OpenAI returned invalid embedding data.");
  }

  return { embeddings, model, dimensions };
};

export const createEmbedding = async (input, options = {}) => {
  const result = await createEmbeddings([input], options);

  return {
    embedding: result.embeddings[0],
    model: result.model,
    dimensions: result.dimensions,
  };
};
