const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export class RoomFilterError extends Error {
  constructor(message) {
    super(message);
    this.name = "RoomFilterError";
  }
}

const optionalNumber = (value, label, { integer = false, min = 0 } = {}) => {
  if (value == null || value === "") return undefined;

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < min || (integer && !Number.isInteger(parsed))) {
    throw new RoomFilterError(`Invalid ${label}`);
  }

  return parsed;
};

const optionalText = (value, label) => {
  if (value == null || value === "") return undefined;

  const parsed = String(value).trim();
  if (!parsed || parsed.length > 80) {
    throw new RoomFilterError(`Invalid ${label}`);
  }

  return parsed;
};

const localizedTextFilter = (field, value) => {
  const expression = { $regex: escapeRegExp(value), $options: "i" };

  return {
    $or: [
      { [field]: expression },
      { [`translations.vi.${field}`]: expression },
      { [`translations.en.${field}`]: expression },
    ],
  };
};

export const buildRoomAttributeFilter = (params = {}) => {
  const minPrice = optionalNumber(params.minPrice, "room price range");
  const maxPrice = optionalNumber(params.maxPrice, "room price range");
  const minArea = optionalNumber(params.minArea, "room area", { min: 1 });
  const maxArea = optionalNumber(params.maxArea, "room area", { min: 1 });
  const minCapacity = optionalNumber(params.minCapacity, "room capacity", {
    integer: true,
    min: 1,
  });
  const bed = optionalText(params.bed, "bed filter");
  const view = optionalText(params.view, "view filter");

  if (
    (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) ||
    (minArea !== undefined && maxArea !== undefined && minArea > maxArea)
  ) {
    throw new RoomFilterError("Invalid room filter range");
  }

  if (
    params.hasFireplace != null &&
    params.hasFireplace !== "" &&
    !["true", "false", true, false].includes(params.hasFireplace)
  ) {
    throw new RoomFilterError("Invalid fireplace filter");
  }

  const filter = {};
  const andFilters = [];

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {
      ...(minPrice !== undefined ? { $gte: minPrice } : {}),
      ...(maxPrice !== undefined ? { $lte: maxPrice } : {}),
    };
  }

  if (minArea !== undefined || maxArea !== undefined) {
    filter.area = {
      ...(minArea !== undefined ? { $gte: minArea } : {}),
      ...(maxArea !== undefined ? { $lte: maxArea } : {}),
    };
  }

  if (minCapacity !== undefined) filter.capacity = { $gte: minCapacity };
  if (bed) andFilters.push(localizedTextFilter("bed", bed));
  if (view) andFilters.push(localizedTextFilter("views", view));

  if (params.hasFireplace === "true" || params.hasFireplace === true) {
    const hasValue = { $regex: "\\S" };
    andFilters.push({
      $or: [
        { fireplace: hasValue },
        { "translations.vi.fireplace": hasValue },
        { "translations.en.fireplace": hasValue },
      ],
    });
  }

  if (andFilters.length) filter.$and = andFilters;

  return filter;
};
