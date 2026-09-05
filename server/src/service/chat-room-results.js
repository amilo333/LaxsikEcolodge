import Room from "../models/Room.js";

const ROOM_ID_PATTERN = /^[a-f\d]{24}$/i;
const PUBLIC_ROOM_FIELDS =
  "title description price thumbnail bed capacity area bathroom fireplace views quantity status";

export const isChatRoomId = (value) =>
  typeof value === "string" && ROOM_ID_PATTERN.test(value);

export const serializeChatRoom = (room, extra = {}) => ({
  id: room._id.toString(),
  title: room.title,
  description: room.description,
  thumbnail: room.thumbnail || null,
  pricePerNight: room.price,
  bed: room.bed,
  capacity: room.capacity,
  area: room.area,
  bathroom: room.bathroom || null,
  fireplace: room.fireplace || null,
  views: room.views || null,
  quantity: room.quantity,
  status: room.status,
  ...extra,
});

// Resolve retrieved IDs against live, public room data before recommending them.
export const hydrateRoomKnowledge = async (
  result,
  {
    findRooms = (ids) =>
      Room.find({ _id: { $in: ids }, status: "available" })
        .select(PUBLIC_ROOM_FIELDS)
        .lean(),
  } = {},
) => {
  if (!result?.ok) return result;

  const matches = result.matches || [];
  const ids = [
    ...new Set(
      matches
        .filter((match) => match.category === "room")
        .map((match) => match.metadata?.roomId)
        .filter(isChatRoomId),
    ),
  ];
  const liveRooms = ids.length ? await findRooms(ids) : [];
  const roomsById = new Map(
    liveRooms
      .filter((room) => room.status === "available")
      .map((room) => [room._id.toString(), serializeChatRoom(room)]),
  );
  const rooms = ids.map((id) => roomsById.get(id)).filter(Boolean);

  return {
    ...result,
    matches: matches.flatMap((match) => {
      if (match.category !== "room") return [match];
      const room = roomsById.get(match.metadata?.roomId);
      if (!room) return [];

      // The vector index may be older than the room record. Do not repeat stale facts.
      const { thumbnail, ...facts } = room;
      return [{ ...match, title: room.title, content: JSON.stringify(facts) }];
    }),
    rooms,
    availabilityChecked: false,
  };
};

const safeThumbnail = (value) => {
  if (typeof value !== "string") return null;
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    return new URL(value).protocol === "https:" ? value : null;
  } catch {
    return null;
  }
};

// Only server-owned fields reach the UI; model-generated URLs are never used.
export const buildChatRoomCards = (rooms = [], criteria = null) => {
  const seen = new Set();
  return rooms
    .filter((room) => {
      if (
        !isChatRoomId(room?.id) ||
        !room.title ||
        room.status !== "available" ||
        seen.has(room.id)
      ) {
        return false;
      }
      seen.add(room.id);
      return true;
    })
    .slice(0, 6)
    .map((room) => ({
      id: room.id,
      title: room.title,
      thumbnail: safeThumbnail(room.thumbnail),
      pricePerNight: Number.isFinite(room.pricePerNight)
        ? room.pricePerNight
        : null,
      capacity: Number.isFinite(room.capacity) ? room.capacity : null,
      views: room.views || null,
      stay: criteria
        ? {
            checkInDate: criteria.checkInDate,
            checkOutDate: criteria.checkOutDate,
            guests: criteria.guests ?? null,
            roomCount: criteria.roomCount ?? null,
            availableQuantity: room.availableQuantity,
          }
        : null,
    }));
};

export const getToolRoomCards = (toolName, result) => {
  if (!result?.ok) return [];
  if (toolName === "get_room_details") {
    return buildChatRoomCards(result.found ? [result.room] : []);
  }
  if (toolName === "list_rooms" || toolName === "search_available_rooms") {
    return buildChatRoomCards(
      result.rooms,
      toolName === "search_available_rooms" && result.availabilityChecked
        ? result.criteria
        : null,
    );
  }
  return [];
};
