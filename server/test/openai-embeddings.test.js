import assert from "node:assert/strict";
import test from "node:test";

import { createEmbeddings } from "../src/service/openai-embeddings.js";

const jsonResponse = (body, { ok = true, status = 200 } = {}) => ({
  ok,
  status,
  json: async () => body,
});

test("creates ordered embeddings with the configured dimensions", async () => {
  let requestBody;
  const fetchImpl = async (url, options) => {
    assert.equal(url, "https://api.openai.com/v1/embeddings");
    assert.equal(options.headers.Authorization, "Bearer test-key");
    requestBody = JSON.parse(options.body);

    return jsonResponse({
      data: [
        { index: 1, embedding: [0.4, 0.5, 0.6] },
        { index: 0, embedding: [0.1, 0.2, 0.3] },
      ],
    });
  };

  const result = await createEmbeddings(["First", "Second"], {
    fetchImpl,
    apiKey: "test-key",
    model: "text-embedding-3-small",
    dimensions: 3,
  });

  assert.deepEqual(requestBody.input, ["First", "Second"]);
  assert.equal(requestBody.dimensions, 3);
  assert.deepEqual(result.embeddings, [
    [0.1, 0.2, 0.3],
    [0.4, 0.5, 0.6],
  ]);
});

test("rejects malformed embedding responses", async () => {
  const fetchImpl = async () =>
    jsonResponse({ data: [{ index: 0, embedding: [0.1] }] });

  await assert.rejects(
    () =>
      createEmbeddings(["Question"], {
        fetchImpl,
        apiKey: "test-key",
        dimensions: 3,
      }),
    /invalid embedding data/i,
  );
});
