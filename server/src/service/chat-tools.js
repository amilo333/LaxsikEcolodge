import mongoose from "mongoose";

import Room from "../models/Room.js";
import {
  findAvailableRooms,
  RoomAvailabilityError,
} from "./room-availability.js";
import { searchLaxsikKnowledge } from "./knowledge-search.js";
import {
  hydrateRoomKnowledge,
  isChatRoomId,
  serializeChatRoom as serializeRoom,
} from "./chat-room-results.js";

const ROOM_LIMIT = 6;

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const CHAT_TOOLS = [
  {
    type: "function",
    name: "list_rooms",
    description:
      "List room types currently marked available in MongoDB. Returns up to 6 rooms, the total room-type count, prices, capacities and facilities.",
    strict: true,
    parameters: {
      type: "object",
      properties: {},
      required: [],
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "search_available_rooms",
    description:
      "Check live room availability from MongoDB for a stay. Dates must use YYYY-MM-DD. Returns matching rooms and their available quantities.",
    strict: true,
    parameters: {
      type: "object",
      properties: {
        checkInDate: {
          type: "string",
          description: "Check-in date in YYYY-MM-DD format.",
        },
        checkOutDate: {
          type: "string",
          description: "Check-out date in YYYY-MM-DD format.",
        },
        guests: {
          type: ["integer", "null"],
          description: "Total number of guests, or null when not supplied.",
        },
        roomCount: {
          type: ["integer", "null"],
          description: "Number of rooms requested, or null when not supplied.",
        },
        minPrice: {
          type: ["number", "null"],
          description: "Minimum nightly room price in VND, or null.",
        },
        maxPrice: {
          type: ["number", "null"],
          description: "Maximum nightly room price in VND, or null.",
        },
        roomIds: {
          type: ["array", "null"],
          items: { type: "string" },
          description:
            "Only check these room IDs selected from knowledge results when the guest has room preferences. Null means no room restriction; an empty array means no matching rooms.",
        },
      },
      required: [
        "checkInDate",
        "checkOutDate",
        "guests",
        "roomCount",
        "minPrice",
        "maxPrice",
        "roomIds",
      ],
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "get_room_details",
    description:
      "Get one room from MongoDB by its exact room id or exact title. Returns only stored room details.",
    strict: true,
    parameters: {
      type: "object",
      properties: {
        roomIdOrTitle: {
          type: "string",
          description: "The MongoDB room id or exact room title.",
        },
      },
      required: ["roomIdOrTitle"],
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "search_laxsik_knowledge",
    description:
      "Search the official Laxsik Ecolodge knowledge base with semantic search. Use for Laxsik-specific questions about room preferences or views, location, contact details, policies, dining, spa, tours, experiences, facilities, and other property information. Do not use it to claim date-specific room availability.",
    strict: true,
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "A self-contained semantic search query based on the guest's question, preserving important names and preferences.",
        },
        category: {
          type: ["string", "null"],
          enum: [
            "overview",
            "contact",
            "policy",
            "room",
            "dining",
            "spa",
            "tour",
            "experience",
            null,
          ],
          description:
            "Optional Laxsik knowledge category, or null to search every category.",
        },
      },
      required: ["query", "category"],
      additionalProperties: false,
    },
  },
];

const listRooms = async () => {
  const query = { status: "available" };
  const [rooms, roomTypeCount] = await Promise.all([
    Room.find(query).sort({ price: 1 }).limit(ROOM_LIMIT),
    Room.countDocuments(query),
  ]);

  return {
    ok: true,
    roomTypeCount,
    returnedRoomCount: rooms.length,
    rooms: rooms.map((room) => serializeRoom(room)),
    availabilityChecked: false,
  };
};

export const searchAvailableRooms = async (
  args,
  { findRooms = findAvailableRooms } = {},
) => {
  try {
    if (
      args.roomIds != null &&
      (!Array.isArray(args.roomIds) || !args.roomIds.every(isChatRoomId))
    ) {
      throw new RoomAvailabilityError("Invalid room IDs");
    }
    const availableRooms = await findRooms(args);
    const rooms =
      args.roomIds == null
        ? availableRooms
        : availableRooms.filter((room) =>
            args.roomIds.includes(room._id.toString()),
          );
    const returnedRooms = rooms.slice(0, ROOM_LIMIT);

    return {
      ok: true,
      criteria: {
        checkInDate: args.checkInDate,
        checkOutDate: args.checkOutDate,
        guests: args.guests,
        roomCount: args.roomCount,
      },
      roomTypeCount: rooms.length,
      returnedRoomCount: returnedRooms.length,
      totalAvailableUnits: rooms.reduce(
        (total, room) => total + room.availableQuantity,
        0,
      ),
      rooms: returnedRooms.map((room) =>
        serializeRoom(room, { availableQuantity: room.availableQuantity }),
      ),
      availabilityChecked: true,
    };
  } catch (error) {
    if (error instanceof RoomAvailabilityError) {
      return { ok: false, error: error.message };
    }

    throw error;
  }
};

const getRoomDetails = async ({ roomIdOrTitle }) => {
  const value = roomIdOrTitle.trim();
  const query = mongoose.Types.ObjectId.isValid(value)
    ? { _id: value }
    : { title: { $regex: `^${escapeRegExp(value)}$`, $options: "i" } };
  const room = await Room.findOne({ ...query, status: "available" });

  return room
    ? { ok: true, found: true, room: serializeRoom(room) }
    : { ok: true, found: false, room: null };
};

export const executeChatTool = async (name, args = {}) => {
  switch (name) {
    case "list_rooms":
      return listRooms();
    case "search_available_rooms":
      return searchAvailableRooms(args);
    case "get_room_details":
      return getRoomDetails(args);
    case "search_laxsik_knowledge":
      return hydrateRoomKnowledge(await searchLaxsikKnowledge(args));
    default:
      return { ok: false, error: `Unknown tool: ${name}` };
  }
};
