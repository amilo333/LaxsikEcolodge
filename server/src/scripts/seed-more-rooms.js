import dotenv from "dotenv";
import mongoose from "mongoose";

import Room from "../models/Room.js";
import User from "../models/User.js";

dotenv.config();

const officialImage = (fileName) =>
  encodeURI(`https://www.laxsik.com/storage/rooms/${fileName}`);

const rooms = [
  {
    vi: {
      title: "Phòng Master Suite Cao Cấp",
      description:
        "Không gian nghỉ dưỡng rộng rãi nhìn ra thung lũng Mường Hoa, phù hợp cho cặp đôi hoặc gia đình nhỏ yêu thích sự riêng tư và tiện nghi cao cấp.",
      bed: "1 giường King",
      bathroom: "Bồn tắm và vòi sen",
      fireplace: "",
      views: "Hướng thung lũng Mường Hoa",
    },
    en: {
      title: "Luxurious Master Suite",
      description:
        "A spacious retreat overlooking Muong Hoa Valley, ideal for couples or small families seeking privacy and refined comfort.",
      bed: "1 King bed",
      bathroom: "Bathtub and shower",
      fireplace: "",
      views: "Muong Hoa Valley view",
    },
    price: 6500000,
    area: 45,
    capacity: 3,
    quantity: 2,
    images: [
      "1724732866_Deluxe-Premium_04.jpg",
      "1724732865_Deluxe-Premium_06.jpg",
      "1724732868_Deluxe-Premium_07.jpg",
      "1724732868_Lao-Chai-03_01.jpg",
    ],
  },
  {
    vi: {
      title: "Deluxe Double Hướng Núi",
      description:
        "Phòng đôi ấm cúng với cửa sổ lớn mở ra núi và ruộng bậc thang, mang đến kỳ nghỉ yên tĩnh giữa thiên nhiên Sa Pa.",
      bed: "1 giường King",
      bathroom: "Vòi sen",
      fireplace: "",
      views: "Hướng núi và ruộng bậc thang",
    },
    en: {
      title: "Deluxe Double Mountain View",
      description:
        "A welcoming double room with wide mountain and rice terrace views for a peaceful stay in the Sapa landscape.",
      bed: "1 King bed",
      bathroom: "Shower",
      fireplace: "",
      views: "Mountain and rice terrace view",
    },
    price: 3300000,
    area: 35,
    capacity: 3,
    quantity: 3,
    images: [
      "1724731500_bacony (3).jpg",
      "1724731501_bacony (4).jpg",
      "1724731503_bacony (5).jpg",
      "1724731503_bacony (7).jpg",
    ],
  },
  {
    vi: {
      title: "Deluxe Twin Hướng Núi",
      description:
        "Lựa chọn linh hoạt cho nhóm bạn hoặc gia đình, có khu nghỉ thoáng đãng và tầm nhìn hướng núi đặc trưng của thung lũng Lao Chải.",
      bed: "1 giường King và 1 giường đơn",
      bathroom: "Vòi sen",
      fireplace: "",
      views: "Hướng núi Lao Chải",
    },
    en: {
      title: "Deluxe Twin Mountain View",
      description:
        "A flexible choice for friends or families, with an airy living space and signature views across the Lao Chai mountains.",
      bed: "1 King bed and 1 single bed",
      bathroom: "Shower",
      fireplace: "",
      views: "Lao Chai mountain view",
    },
    price: 3400000,
    area: 35,
    capacity: 4,
    quantity: 3,
    images: [
      "1724732944_Copy-of-Lao-Chai-04_03.jpg",
      "1724732944_Copy-of-Lao-Chai-04_04.jpg",
      "1724732946_Deluxe-Premium_01.jpg",
      "1724732947_Deluxe-Premium_02.jpg",
    ],
  },
  {
    vi: {
      title: "Premium Ban Công Hướng Núi",
      description:
        "Phòng Premium có ban công riêng để ngắm mây, núi và ruộng bậc thang, kết hợp nội thất gỗ ấm áp với tiện nghi hiện đại.",
      bed: "1 giường King hoặc 2 giường đơn",
      bathroom: "Bồn tắm và vòi sen",
      fireplace: "",
      views: "Ban công hướng núi",
    },
    en: {
      title: "Premium Balcony Mountain View",
      description:
        "A premium room with a private balcony for cloud, mountain and rice terrace views, combining warm wood interiors with modern comfort.",
      bed: "1 King bed or 2 single beds",
      bathroom: "Bathtub and shower",
      fireplace: "",
      views: "Mountain-view balcony",
    },
    price: 4800000,
    area: 45,
    capacity: 3,
    quantity: 2,
    images: [
      "1724732870_Lao-Chai-03_02.jpg",
      "1724732870_Lao-Chai-03_03.jpg",
      "1724731505_bacony (8).jpg",
      "1724731508_bacony (2).jpg",
    ],
  },
  {
    vi: {
      title: "Deluxe Bungalow Hướng Thung Lũng",
      description:
        "Bungalow riêng biệt lấy cảm hứng từ kiến trúc vùng cao, có không gian rộng, góc thư giãn riêng và tầm nhìn bao quát thung lũng.",
      bed: "1 giường King",
      bathroom: "Bồn tắm và vòi sen",
      fireplace: "Lò sưởi trong phòng",
      views: "Hướng thung lũng",
    },
    en: {
      title: "Deluxe Bungalow Valley View",
      description:
        "A private bungalow inspired by highland architecture, with generous space, a dedicated lounge and sweeping valley views.",
      bed: "1 King bed",
      bathroom: "Bathtub and shower",
      fireplace: "In-room fireplace",
      views: "Valley view",
    },
    price: 5600000,
    area: 60,
    capacity: 3,
    quantity: 2,
    images: [
      "1724732795_2M2A4650-2048.jpg",
      "1724732795_2M2A4658-2048.jpg",
      "1724732797_2M2A4662-2048.jpg",
      "1724732798_2M2A4674-1.jpg",
    ],
  },
];

const seedRooms = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is required");
  }

  await mongoose.connect(process.env.MONGO_URI);

  const owner =
    (await User.findOne({ role: "admin" }).sort({ createdAt: 1 })) ??
    (await User.findOne().sort({ createdAt: 1 }));

  if (!owner) {
    throw new Error("Create an admin user before seeding rooms");
  }

  const result = await Room.bulkWrite(
    rooms.map(({ vi, en, images, ...details }) => ({
      updateOne: {
        filter: { "translations.en.title": en.title },
        update: {
          $setOnInsert: {
            title: vi.title,
            description: vi.description,
            bed: vi.bed,
            bathroom: vi.bathroom,
            fireplace: vi.fireplace,
            views: vi.views,
            ...details,
            thumbnail: officialImage(images[0]),
            images: images.map(officialImage),
            translations: { vi, en },
            status: "available",
            createdBy: owner._id,
            updatedBy: owner._id,
          },
        },
        upsert: true,
      },
    })),
  );

  console.log(
    `Room seed completed: ${result.upsertedCount} inserted, ${rooms.length - result.upsertedCount} already present`,
  );
};

seedRooms()
  .catch((error) => {
    console.error(`Room seed failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
