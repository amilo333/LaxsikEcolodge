import dotenv from "dotenv";
import mongoose from "mongoose";

import Tour from "../models/Tour.js";
import User from "../models/User.js";

dotenv.config();

const tours = [
  {
    title: "Hau Chu Ngai Highland Trail",
    eyebrow: "Remote paths & mountain villages",
    description:
      "Take the old buffalo trails through bamboo forest and the highland villages of Hau Chu Ngai, Hau Thao and Giang Ta Chai, with lunch in Giang Ta Chai or Ta Van.",
    thumbnail: "/images/slider3.png",
    duration: "5–8 hours",
    rhythm: "Challenging",
    highlights: [
      "Buffalo trails & bamboo forest",
      "Four highland communities",
      "Village lunch along the route",
    ],
    sortOrder: 10,
    status: "active",
  },
  {
    title: "Bamboo Forest & Cau May Waterfall",
    eyebrow: "Forest paths & riverside views",
    description:
      "Walk through a lush bamboo forest to Cau May Waterfall, then continue to Giang Ta Chai, a Red Dao village perched above Muong Hoa River.",
    thumbnail: "/images/img2.png",
    duration: "3–5 hours",
    rhythm: "Moderate",
    highlights: [
      "Lush bamboo forest",
      "Cau May Waterfall",
      "Giang Ta Chai Red Dao village",
    ],
    sortOrder: 20,
    status: "active",
  },
  {
    title: "Lao Chai & Ta Van Valley Stroll",
    eyebrow: "Gentle paths & village life",
    description:
      "A gentle introduction to Muong Hoa Valley, following easy village paths around Lao Chai and Ta Van with time to enjoy the terraces and everyday local life.",
    thumbnail: "/images/slider1.png",
    duration: "2–3 hours",
    rhythm: "Easy",
    highlights: [
      "Lao Chai village",
      "Ta Van village",
      "Easy rice terrace paths",
    ],
    sortOrder: 30,
    status: "active",
  },
];

const seedTours = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is required");
  }

  await mongoose.connect(process.env.MONGO_URI);

  const owner =
    (await User.findOne({ role: "admin" }).sort({ createdAt: 1 })) ??
    (await User.findOne().sort({ createdAt: 1 }));

  if (!owner) {
    throw new Error("Create an admin user before seeding tours");
  }

  const result = await Tour.bulkWrite(
    tours.map((tour) => ({
      updateOne: {
        filter: { title: tour.title },
        update: {
          $setOnInsert: {
            ...tour,
            createdBy: owner._id,
            updatedBy: owner._id,
          },
        },
        upsert: true,
      },
    })),
  );

  console.log(
    `Tour seed completed: ${result.upsertedCount} inserted, ${tours.length - result.upsertedCount} already present`,
  );
};

seedTours()
  .catch((error) => {
    console.error(`Tour seed failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
