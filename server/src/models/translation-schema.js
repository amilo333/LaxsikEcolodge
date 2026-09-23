import mongoose from "mongoose";

export const createTranslationsSchema = (fields) => {
  const createLocaleSchema = () =>
    new mongoose.Schema(fields, {
      _id: false,
      id: false,
    });

  return new mongoose.Schema(
    {
      vi: {
        type: createLocaleSchema(),
        required: true,
      },
      en: {
        type: createLocaleSchema(),
        required: true,
      },
    },
    {
      _id: false,
      id: false,
    },
  );
};
