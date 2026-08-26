import assert from "node:assert/strict";
import test from "node:test";

import {
  createOpenAIChatReply,
  DEFAULT_MODEL,
} from "../src/service/openai-chat.js";

const jsonResponse = (body, { ok = true, status = 200 } = {}) => ({
  ok,
  status,
  json: async () => body,
});

test("uses the low-cost OpenAI model and Responses API function schemas", async () => {
  let requestBody;
  const fetchImpl = async (url, options) => {
    assert.equal(url, "https://api.openai.com/v1/responses");
    assert.equal(options.headers.Authorization, "Bearer test-key");
    requestBody = JSON.parse(options.body);

    return jsonResponse({
      output_text: "Xin chào! Tôi có thể giúp bạn tìm phòng.",
      output: [],
    });
  };

  const reply = await createOpenAIChatReply(
    [{ role: "user", content: "Xin chào" }],
    { fetchImpl, apiKey: "test-key" },
  );

  assert.equal(requestBody.model, DEFAULT_MODEL);
  assert.equal(requestBody.store, false);
  assert.equal(requestBody.parallel_tool_calls, false);
  assert.deepEqual(
    requestBody.tools.map((tool) => tool.name),
    ["list_rooms", "search_available_rooms", "get_room_details"],
  );
  assert.equal(reply.message, "Xin chào! Tôi có thể giúp bạn tìm phòng.");
  assert.deepEqual(reply.toolsUsed, []);
});

test("renders live MongoDB tool output without letting the model rewrite prices", async () => {
  const fetchImpl = async () =>
    jsonResponse({
      output: [
        {
          type: "function_call",
          call_id: "call_1",
          name: "search_available_rooms",
          arguments:
            '{"checkInDate":"2026-09-10","checkOutDate":"2026-09-12","guests":2,"roomCount":1}',
        },
      ],
    });
  const toolExecutor = async (name, args) => {
    assert.equal(name, "search_available_rooms");
    assert.equal(args.guests, 2);

    return {
      ok: true,
      criteria: args,
      roomTypeCount: 1,
      returnedRoomCount: 1,
      totalAvailableUnits: 2,
      rooms: [
        {
          id: "room-1",
          title: "Homestay Ami",
          pricePerNight: 150000,
          capacity: 2,
          bed: "1 King Bed",
          availableQuantity: 2,
        },
      ],
      availabilityChecked: true,
    };
  };

  const reply = await createOpenAIChatReply(
    [
      {
        role: "user",
        content:
          "Tìm phòng từ 2026-09-10 đến 2026-09-12 cho 2 khách, 1 phòng",
      },
    ],
    { fetchImpl, toolExecutor, apiKey: "test-key" },
  );

  assert.match(reply.message, /150\.000 VND\/đêm/);
  assert.match(reply.message, /còn 2 phòng/);
  assert.deepEqual(reply.toolsUsed, ["search_available_rooms"]);
});

test("removes links and Markdown from general model answers", async () => {
  const fetchImpl = async () =>
    jsonResponse({
      output_text: "**Xem thêm** tại https://example.com/phong",
      output: [],
    });

  const reply = await createOpenAIChatReply(
    [{ role: "user", content: "Tell me more" }],
    { fetchImpl, apiKey: "test-key" },
  );

  assert.equal(reply.message, "Xem thêm tại");
});

test("preserves OpenAI quota errors for the controller", async () => {
  const fetchImpl = async () =>
    jsonResponse(
      { error: { code: "insufficient_quota", message: "Quota exceeded" } },
      { ok: false, status: 429 },
    );

  await assert.rejects(
    () =>
      createOpenAIChatReply([{ role: "user", content: "Hello" }], {
        fetchImpl,
        apiKey: "test-key",
      }),
    (error) => error.status === 429 && error.code === "insufficient_quota",
  );
});
