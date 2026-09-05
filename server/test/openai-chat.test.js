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
    [
      "list_rooms",
      "search_available_rooms",
      "get_room_details",
      "search_laxsik_knowledge",
    ],
  );
  assert.equal(reply.message, "Xin chào! Tôi có thể giúp bạn tìm phòng.");
  assert.deepEqual(reply.toolsUsed, []);
  assert.deepEqual(reply.rooms, []);
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
          id: "aaaaaaaaaaaaaaaaaaaaaaaa",
          title: "Homestay Ami",
          status: "available",
          thumbnail: "https://example.com/ami.jpg",
          pricePerNight: 150000,
          capacity: 2,
          bed: "1 King Bed",
          views: "Mountain",
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
        content: "Tìm phòng từ 2026-09-10 đến 2026-09-12 cho 2 khách, 1 phòng",
      },
    ],
    { fetchImpl, toolExecutor, apiKey: "test-key" },
  );

  assert.match(reply.message, /150\.000 VND\/đêm/);
  assert.match(reply.message, /view Mountain/);
  assert.match(reply.message, /còn 2 phòng/);
  assert.deepEqual(reply.toolsUsed, ["search_available_rooms"]);
  assert.deepEqual(reply.rooms, [
    {
      id: "aaaaaaaaaaaaaaaaaaaaaaaa",
      title: "Homestay Ami",
      thumbnail: "https://example.com/ami.jpg",
      pricePerNight: 150000,
      capacity: 2,
      views: "Mountain",
      stay: {
        checkInDate: "2026-09-10",
        checkOutDate: "2026-09-12",
        guests: 2,
        roomCount: 1,
        availableQuantity: 2,
      },
    },
  ]);
});

test("uses retrieved Laxsik knowledge as function output before answering", async () => {
  const requestBodies = [];
  const fetchImpl = async (_url, options) => {
    const body = JSON.parse(options.body);
    requestBodies.push(body);

    if (requestBodies.length === 1) {
      return jsonResponse({
        output: [
          {
            type: "function_call",
            call_id: "call_knowledge_1",
            name: "search_laxsik_knowledge",
            arguments: '{"query":"phòng có view núi","category":"room"}',
          },
        ],
      });
    }

    return jsonResponse({
      output_text:
        "Phòng Mountain Retreat có view núi và phù hợp tối đa 2 khách.",
      output: [],
    });
  };
  const toolExecutor = async (name, args) => {
    assert.equal(name, "search_laxsik_knowledge");
    assert.equal(args.category, "room");

    return {
      ok: true,
      matches: [
        {
          title: "Mountain Retreat",
          content: "Room name: Mountain Retreat. Capacity: 2. View: Mountain.",
          category: "room",
        },
      ],
    };
  };

  const reply = await createOpenAIChatReply(
    [{ role: "user", content: "Phòng nào có virew núi?" }],
    { fetchImpl, toolExecutor, apiKey: "test-key" },
  );

  assert.equal(requestBodies.length, 2);
  assert.equal(requestBodies[1].input.at(-1).type, "function_call_output");
  assert.match(requestBodies[1].input.at(-1).output, /Mountain Retreat/);
  assert.match(reply.message, /Mountain Retreat/);
  assert.deepEqual(reply.toolsUsed, ["search_laxsik_knowledge"]);
  assert.deepEqual(reply.rooms, []);
});

const mountainRoom = {
  id: "aaaaaaaaaaaaaaaaaaaaaaaa",
  title: "Mountain Retreat",
  pricePerNight: 150000,
  thumbnail: "https://example.com/mountain.jpg",
  capacity: 2,
  views: "Mountain",
  status: "available",
};
const gardenRoom = {
  ...mountainRoom,
  id: "bbbbbbbbbbbbbbbbbbbbbbbb",
  title: "Garden Retreat",
  views: "Garden",
};

const knowledgeCall = {
  type: "function_call",
  call_id: "knowledge_1",
  name: "search_laxsik_knowledge",
  arguments: '{"query":"phòng view núi","category":"room"}',
};
const roomKnowledge = {
  ok: true,
  matches: [
    { title: mountainRoom.title, category: "room", content: "Mountain view" },
  ],
  rooms: [mountainRoom, gardenRoom],
};

test("RAG cards use only selected, known IDs and authoritative database fields", async () => {
  const requests = [];
  const reply = await createOpenAIChatReply(
    [{ role: "user", content: "Phòng nào có view núi?" }],
    {
      apiKey: "test-key",
      toolExecutor: async () => roomKnowledge,
      fetchImpl: async (_url, options) => {
        requests.push(JSON.parse(options.body));
        return jsonResponse(
          requests.length === 1
            ? { output: [knowledgeCall] }
            : {
                output_text: JSON.stringify({
                  message: "Mountain Retreat có view núi.",
                  roomIds: [
                    mountainRoom.id,
                    "cccccccccccccccccccccccc",
                    mountainRoom.id,
                  ],
                  rooms: [
                    {
                      id: mountainRoom.id,
                      pricePerNight: 1,
                      href: "https://evil.example",
                    },
                  ],
                }),
              },
        );
      },
    },
  );

  assert.equal(requests[1].text.format.type, "json_schema");
  assert.equal(requests[1].text.format.strict, true);
  assert.deepEqual(
    requests[1].text.format.schema.properties.roomIds.items.enum,
    [mountainRoom.id, gardenRoom.id],
  );
  assert.equal(reply.rooms.length, 1);
  assert.equal(reply.rooms[0].id, mountainRoom.id);
  assert.equal(reply.rooms[0].pricePerNight, 150000);
  assert.equal(reply.rooms[0].thumbnail, mountainRoom.thumbnail);
  assert.equal(reply.rooms[0].stay, null);
  assert.equal(reply.rooms[0].href, undefined);
});

test("RAG does not attach retrieved rooms to a no-match or negative answer", async () => {
  let calls = 0;
  const reply = await createOpenAIChatReply(
    [{ role: "user", content: "Có phòng view biển không?" }],
    {
      apiKey: "test-key",
      toolExecutor: async () => roomKnowledge,
      fetchImpl: async () =>
        jsonResponse(
          ++calls === 1
            ? { output: [knowledgeCall] }
            : {
                output_text: JSON.stringify({
                  message:
                    "Mountain Retreat không có view biển. Mình chưa tìm được phòng đáp ứng yêu cầu.",
                  roomIds: [],
                }),
              },
        ),
    },
  );
  assert.deepEqual(reply.rooms, []);
});

test("availability after RAG replaces suggestions with the checked rooms and stay", async () => {
  let calls = 0;
  const reply = await createOpenAIChatReply(
    [{ role: "user", content: "Phòng view núi từ 2026-09-10 đến 2026-09-12" }],
    {
      apiKey: "test-key",
      fetchImpl: async () =>
        jsonResponse({
          output: [
            ++calls === 1
              ? knowledgeCall
              : {
                  type: "function_call",
                  call_id: "availability_1",
                  name: "search_available_rooms",
                  arguments: JSON.stringify({
                    checkInDate: "2026-09-10",
                    checkOutDate: "2026-09-12",
                    roomIds: [mountainRoom.id],
                  }),
                },
          ],
        }),
      toolExecutor: async (name, args) => {
        if (name === "search_laxsik_knowledge") return roomKnowledge;
        assert.deepEqual(args.roomIds, [mountainRoom.id]);
        return {
          ok: true,
          criteria: args,
          rooms: [{ ...mountainRoom, availableQuantity: 1 }],
          roomTypeCount: 1,
          availabilityChecked: true,
        };
      },
    },
  );
  assert.deepEqual(reply.toolsUsed, [
    "search_laxsik_knowledge",
    "search_available_rooms",
  ]);
  assert.equal(reply.rooms.length, 1);
  assert.equal(reply.rooms[0].stay.checkInDate, "2026-09-10");
  assert.equal(reply.rooms[0].stay.availableQuantity, 1);
});

test("invalid structured room output fails closed instead of showing invented cards", async () => {
  let calls = 0;
  await assert.rejects(() =>
    createOpenAIChatReply([{ role: "user", content: "Tư vấn phòng" }], {
      apiKey: "test-key",
      toolExecutor: async () => roomKnowledge,
      fetchImpl: async () =>
        jsonResponse(
          ++calls === 1
            ? { output: [knowledgeCall] }
            : { output_text: '{"message":"truncated' },
        ),
    }),
  );
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
