const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_TRANSLATION_MODEL = "gpt-5.6-luna";

const TRANSLATION_INSTRUCTIONS = `Translate Vietnamese content into concise, natural English suitable for a resort website.

STRICT RULES:
- Translate only the values provided.
- Keep the same JSON keys and structure.
- Return JSON only.
- Do not explain anything.
- Do not repeat the Vietnamese source text.
- Do not add notes, comments, markdown, or extra fields.
- Keep translations concise while preserving the original meaning.
- Do not expand or rewrite content unnecessarily.
- Keep proper names, URLs, IDs, codes, numbers, status values, and technical values unchanged.
- If a value is already English, keep it unchanged.
- If a value is empty or null, keep it unchanged.
- Translate all fields in ONE response.
- Use the fewest words necessary while keeping the translation natural and professional.`;

const cloneJson = (value) => JSON.parse(JSON.stringify(value));

const buildJsonSchema = (value) => {
  if (value === null) return { type: "null" };

  if (Array.isArray(value)) {
    return {
      type: "array",
      items: value.length ? buildJsonSchema(value[0]) : { type: "string" },
    };
  }

  if (typeof value === "object") {
    const keys = Object.keys(value);
    return {
      type: "object",
      properties: Object.fromEntries(
        keys.map((key) => [key, buildJsonSchema(value[key])]),
      ),
      required: keys,
      additionalProperties: false,
    };
  }

  return { type: typeof value };
};

const getOutputText = (response) => {
  if (typeof response.output_text === "string") {
    return response.output_text.trim();
  }

  return (response.output || [])
    .filter((item) => item.type === "message")
    .flatMap((item) => item.content || [])
    .filter((content) => content.type === "output_text")
    .map((content) => content.text)
    .join("\n")
    .trim();
};

const assertSameShape = (source, translated, path = "content") => {
  if (source === null) {
    if (translated !== null) {
      throw new Error(`OpenAI changed the JSON structure at ${path}.`);
    }
    return;
  }

  if (Array.isArray(source)) {
    if (!Array.isArray(translated) || translated.length !== source.length) {
      throw new Error(`OpenAI changed the JSON structure at ${path}.`);
    }
    source.forEach((item, index) =>
      assertSameShape(item, translated[index], `${path}[${index}]`),
    );
    return;
  }

  if (typeof source === "object") {
    if (!translated || typeof translated !== "object" || Array.isArray(translated)) {
      throw new Error(`OpenAI changed the JSON structure at ${path}.`);
    }

    const sourceKeys = Object.keys(source).sort();
    const translatedKeys = Object.keys(translated).sort();
    if (JSON.stringify(sourceKeys) !== JSON.stringify(translatedKeys)) {
      throw new Error(`OpenAI changed the JSON structure at ${path}.`);
    }

    sourceKeys.forEach((key) =>
      assertSameShape(source[key], translated[key], `${path}.${key}`),
    );
    return;
  }

  if (typeof translated !== typeof source) {
    throw new Error(`OpenAI changed the value type at ${path}.`);
  }

  if (
    typeof source === "string" &&
    source.trim() === "" &&
    translated !== source
  ) {
    throw new Error(`OpenAI changed an empty value at ${path}.`);
  }

  if (typeof source !== "string" && translated !== source) {
    throw new Error(`OpenAI changed a technical value at ${path}.`);
  }
};

export const translateVietnameseContent = async (
  values,
  {
    fetchImpl = fetch,
    apiKey = process.env.OPENAI_API_KEY,
    model = process.env.OPENAI_TRANSLATION_MODEL ||
      process.env.OPENAI_MODEL ||
      DEFAULT_TRANSLATION_MODEL,
  } = {},
) => {
  if (!apiKey) {
    const error = new Error("OPENAI_API_KEY is not configured.");
    error.status = 503;
    error.code = "OPENAI_NOT_CONFIGURED";
    throw error;
  }

  const response = await fetchImpl(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    signal: AbortSignal.timeout(30_000),
    body: JSON.stringify({
      model,
      instructions: TRANSLATION_INSTRUCTIONS,
      input: JSON.stringify(values),
      reasoning: { effort: "low" },
      text: {
        verbosity: "low",
        format: {
          type: "json_schema",
          name: "translated_content",
          strict: true,
          schema: buildJsonSchema(values),
        },
      },
      max_output_tokens: 2000,
      store: false,
    }),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      data.error?.message || "OpenAI could not translate the content.",
    );
    error.status = response.status;
    error.code = data.error?.code || null;
    throw error;
  }

  const outputText = getOutputText(data);
  if (!outputText) {
    throw new Error("OpenAI returned an empty translation.");
  }

  let translated;
  try {
    translated = JSON.parse(outputText);
  } catch {
    throw new Error("OpenAI returned invalid translation JSON.");
  }

  assertSameShape(values, translated);
  return translated;
};

export const createBilingualContent = async (vietnameseValues, options) => ({
  vi: cloneJson(vietnameseValues),
  en: await translateVietnameseContent(vietnameseValues, options),
});

export { DEFAULT_TRANSLATION_MODEL, TRANSLATION_INSTRUCTIONS };
