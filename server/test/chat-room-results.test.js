import assert from "node:assert/strict";
import test from "node:test";

import {
  buildChatRoomCards,
  getToolRoomCards,
  hydrateRoomKnowledge,
  serializeChatRoom,
} from "../src/service/chat-room-results.js";
import { searchAvailableRooms } from "../src/service/chat-tools.js";

const liveRoom = {
  _id: "aaaaaaaaaaaaaaaaaaaaaaaa",
  title: "Mountain Retreat",
  description: "A mountain-view room",
  price: 2500000,
  thumbnail: "https://example.com/room.jpg",
  capacity: 2,
  views: "Mountain",
  status: "available",
  quantity: 3,
};

test("hydrates knowledge from live public rooms and drops deleted, inactive and invalid rooms", async () => {
  const roomMatch = (id) => ({
    category: "room",
    title: "Old name",
    content: "Old facts",
    metadata: { roomId: id },
    sourcePath: "/rooms/untrusted-path",
  });
  const ids = [
    liveRoom._id,
    "bbbbbbbbbbbbbbbbbbbbbbbb",
    "cccccccccccccccccccccccc",
  ];
  const result = await hydrateRoomKnowledge(
    {
      ok: true,
      matches: [
        ...ids.map(roomMatch),
        roomMatch("invalid"),
        roomMatch(liveRoom._id),
        { category: "policy", title: "Check-in", content: "Check-in at 14:00" },
      ],
    },
    {
      findRooms: async (requestedIds) => {
        assert.deepEqual(requestedIds, ids);
        return [liveRoom, { ...liveRoom, _id: ids[1], status: "inactive" }];
      },
    },
  );

  assert.equal(result.rooms.length, 1);
  assert.equal(result.rooms[0].pricePerNight, liveRoom.price);
  assert.equal(result.rooms[0].thumbnail, liveRoom.thumbnail);
  assert.equal(result.matches.length, 3);
  assert.equal(result.matches[0].title, liveRoom.title);
  assert.doesNotMatch(result.matches[0].content, /Old facts/);
  assert.match(result.matches[0].content, /Mountain/);
  assert.equal(result.matches.at(-1).category, "policy");
  assert.equal(result.availabilityChecked, false);
});

test("general knowledge does not need a room database lookup", async () => {
  const result = await hydrateRoomKnowledge(
    { ok: true, matches: [{ category: "spa", content: "Spa" }] },
    {
      findRooms: async () => assert.fail("Unexpected room query"),
    },
  );
  assert.deepEqual(result.rooms, []);
  assert.equal(result.matches.length, 1);
});

test("cards whitelist public fields, deduplicate and exclude invalid or inactive rooms", () => {
  const room = serializeChatRoom(liveRoom);
  const cards = buildChatRoomCards([
    { ...room, createdBy: "private", href: "https://evil.example" },
    room,
    { ...room, id: "../wrong" },
    { ...room, id: "bbbbbbbbbbbbbbbbbbbbbbbb", status: "maintenance" },
  ]);
  assert.equal(cards.length, 1);
  assert.equal(cards[0].id, liveRoom._id);
  assert.equal(cards[0].createdBy, undefined);
  assert.equal(cards[0].href, undefined);
  assert.equal(cards[0].stay, null);
  assert.equal(
    buildChatRoomCards([{ ...room, thumbnail: "javascript:alert(1)" }])[0]
      .thumbnail,
    null,
  );
});

test("list and detail tools produce cards; errors, missing rooms and unrelated tools do not", () => {
  const room = serializeChatRoom(liveRoom);
  assert.equal(
    getToolRoomCards("list_rooms", { ok: true, rooms: [room] }).length,
    1,
  );
  assert.equal(
    getToolRoomCards("get_room_details", { ok: true, found: true, room })[0].id,
    room.id,
  );
  for (const [name, result] of [
    ["list_rooms", { ok: false, rooms: [room] }],
    ["list_rooms", { ok: true, rooms: [] }],
    ["get_room_details", { ok: true, found: false, room: null }],
    ["search_laxsik_knowledge", { ok: true, rooms: [room] }],
  ]) {
    assert.deepEqual(getToolRoomCards(name, result), []);
  }
});

test("availability keeps the selected room restriction before counting or limiting", async () => {
  const args = {
    checkInDate: "2026-09-10",
    checkOutDate: "2026-09-12",
    guests: 2,
    roomCount: 1,
    minPrice: null,
    maxPrice: 3000000,
    roomIds: [liveRoom._id],
  };
  const findRooms = async (criteria) => {
    assert.equal(criteria.maxPrice, 3000000);
    return [
      { ...liveRoom, _id: "bbbbbbbbbbbbbbbbbbbbbbbb", availableQuantity: 2 },
      { ...liveRoom, availableQuantity: 1 },
    ];
  };
  const result = await searchAvailableRooms(args, { findRooms });
  assert.equal(result.roomTypeCount, 1);
  assert.equal(result.totalAvailableUnits, 1);
  assert.equal(result.rooms[0].id, liveRoom._id);
  assert.equal(result.availabilityChecked, true);

  const empty = await searchAvailableRooms(
    { ...args, roomIds: [] },
    { findRooms },
  );
  assert.deepEqual(empty.rooms, []);
  assert.equal(empty.roomTypeCount, 0);
  const invalid = await searchAvailableRooms(
    { ...args, roomIds: ["invalid"] },
    { findRooms },
  );
  assert.equal(invalid.ok, false);
});
