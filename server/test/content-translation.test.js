import assert from "node:assert/strict";
import test from "node:test";

import {
  createBilingualContent,
  translateVietnameseContent,
} from "../src/service/content-translation.js";

const jsonResponse = (body, { ok = true, status = 200 } = {}) => ({
  ok,
  status,
  json: async () => body,
});

test("translates every supplied field in one structured OpenAI response", async () => {
  const source = {
    title: "Phòng hướng núi",
    description: "Không gian yên tĩnh.",
    highlights: ["Ban công riêng", "Bữa sáng"],
  };
  let calls = 0;
  let requestBody;

  const translations = await createBilingualContent(source, {
    apiKey: "test-key",
    fetchImpl: async (url, options) => {
      calls += 1;
      assert.equal(url, "https://api.openai.com/v1/responses");
      requestBody = JSON.parse(options.body);

      return jsonResponse({
        output_text: JSON.stringify({
          title: "Mountain View Room",
          description: "A peaceful space.",
          highlights: ["Private balcony", "Breakfast"],
        }),
      });
    },
  });

  assert.equal(calls, 1);
  assert.deepEqual(JSON.parse(requestBody.input), source);
  assert.equal(requestBody.text.format.type, "json_schema");
  assert.deepEqual(requestBody.text.format.schema.required, [
    "title",
    "description",
    "highlights",
  ]);
  assert.deepEqual(translations.vi, source);
  assert.deepEqual(translations.en, {
    title: "Mountain View Room",
    description: "A peaceful space.",
    highlights: ["Private balcony", "Breakfast"],
  });
});

test("rejects translations that change JSON shape or empty values", async () => {
  await assert.rejects(
    translateVietnameseContent(
      { title: "", highlights: ["Một", "Hai"] },
      {
        apiKey: "test-key",
        fetchImpl: async () =>
          jsonResponse({
            output_text: JSON.stringify({
              title: "Untitled",
              highlights: ["One"],
            }),
          }),
      },
    ),
    /JSON structure|empty value/,
  );
});
