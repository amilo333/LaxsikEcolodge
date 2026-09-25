const CONTENT_PAIRS = [
  // Rooms
  ['Deluxu View Garden', 'Phòng Deluxe Hướng Vườn'],
  ['HomeStay Ami', 'Homestay Ami'],
  ['HomeStay HP', 'Homestay HP'],
  ['Deluxe Double Room With Ami 5', 'Phòng Đôi Deluxe Ami 5'],
  ['Deluxe Double Room With Ami 4', 'Phòng Đôi Deluxe Ami 4'],
  ['Deluxe Double Room With Balcony', 'Phòng Đôi Deluxe Có Ban Công'],
  [
    'The spacious double room features air conditioning, a private balcony with mountain views, free Wi-Fi, a minibar, and a modern bathroom. Perfect for couples seeking comfort and relaxation.',
    'Phòng đôi rộng rãi có điều hòa, ban công riêng hướng núi, Wi-Fi miễn phí, minibar và phòng tắm hiện đại. Không gian phù hợp cho các cặp đôi tìm kiếm sự thoải mái và thư giãn.',
  ],
  ['1 King Bed', '1 giường King'],
  ['1 bathroom with mountain view', '1 phòng tắm hướng núi'],
  ['1 fireplace', '1 lò sưởi'],
  ['Window & balcony with mountain view', 'Cửa sổ và ban công hướng núi'],

  // Tours
  ['Hau Chu Ngai Highland Trail', 'Cung đường vùng cao Hầu Chư Ngài'],
  ['Remote paths & mountain villages', 'Lối mòn xa và bản làng vùng cao'],
  [
    'Take the old buffalo trails through bamboo forest and the highland villages of Hau Chu Ngai, Hau Thao and Giang Ta Chai, with lunch in Giang Ta Chai or Ta Van.',
    'Theo lối mòn chăn trâu xưa xuyên qua rừng tre và các bản vùng cao Hầu Chư Ngài, Hầu Thào, Giàng Tả Chải, dùng bữa trưa tại Giàng Tả Chải hoặc Tả Van.',
  ],
  ['5–8 hours', '5–8 giờ'],
  ['Challenging', 'Thử thách'],
  ['Buffalo trails & bamboo forest', 'Lối mòn chăn trâu và rừng tre'],
  ['Four highland communities', 'Bốn cộng đồng vùng cao'],
  ['Village lunch along the route', 'Bữa trưa tại bản trên hành trình'],
  ['Bamboo Forest & Cau May Waterfall', 'Rừng Tre và Thác Cầu Mây'],
  ['Forest paths & riverside views', 'Lối rừng và cảnh ven sông'],
  [
    'Walk through a lush bamboo forest to Cau May Waterfall, then continue to Giang Ta Chai, a Red Dao village perched above Muong Hoa River.',
    'Đi bộ xuyên qua rừng tre xanh mát đến Thác Cầu Mây, sau đó tiếp tục tới Giàng Tả Chải, bản người Dao Đỏ nằm bên trên dòng sông Mường Hoa.',
  ],
  ['3–5 hours', '3–5 giờ'],
  ['Moderate', 'Trung bình'],
  ['Lush bamboo forest', 'Rừng tre xanh mát'],
  ['Cau May Waterfall', 'Thác Cầu Mây'],
  ['Giang Ta Chai Red Dao village', 'Bản Dao Đỏ Giàng Tả Chải'],
  ['Lao Chai & Ta Van Valley Stroll', 'Dạo bước thung lũng Lao Chải và Tả Van'],
  ['Gentle paths & village life', 'Đường đi nhẹ nhàng và đời sống bản địa'],
  [
    'A gentle introduction to Muong Hoa Valley, following easy village paths around Lao Chai and Ta Van with time to enjoy the terraces and everyday local life.',
    'Hành trình nhẹ nhàng làm quen với thung lũng Mường Hoa, men theo các lối bản quanh Lao Chải và Tả Van để ngắm ruộng bậc thang và cảm nhận đời sống thường ngày.',
  ],
  ['2–3 hours', '2–3 giờ'],
  ['Easy', 'Dễ'],
  ['Lao Chai village', 'Bản Lao Chải'],
  ['Ta Van village', 'Bản Tả Van'],
  ['Easy rice terrace paths', 'Lối đi nhẹ nhàng qua ruộng bậc thang'],

  // Dining experiences
  ['RIVER BBQ', 'BBQ BÊN SÔNG'],
  ['MOUNTAIN BBQ', 'BBQ GIỮA NÚI RỪNG'],
  [
    'Enjoy a warm BBQ dinner featuring fresh local ingredients, grilled specialties and traditional flavors in the peaceful atmosphere of Sa Pa mountains.',
    'Thưởng thức bữa tối BBQ ấm cúng với nguyên liệu địa phương tươi ngon, các món nướng đặc sắc và hương vị truyền thống giữa không gian núi rừng Sa Pa yên bình.',
  ],
  ["H'MONG FLAVOR", "HƯƠNG VỊ H'MÔNG"],
  [
    "Discover the unique flavors of the H'Mong people through traditional recipes, fresh local ingredients and authentic mountain cuisine.",
    "Khám phá hương vị độc đáo của người H'Mông qua công thức truyền thống, nguyên liệu địa phương tươi ngon và ẩm thực vùng cao nguyên bản.",
  ],
  ['ROMANTIC DINING', 'BỮA TỐI LÃNG MẠN'],
  [
    'Enjoy delicious local and international cuisine in the heart of Muong Hoa Valley.',
    'Thưởng thức ẩm thực địa phương và quốc tế hấp dẫn ngay giữa thung lũng Mường Hoa.',
  ],
  ['FIREWOOD', 'BẾP CỦI'],
  ['Special grill food', 'Các món nướng đặc biệt'],
  ['ORGANIC INGREDIENTS', 'NGUYÊN LIỆU HỮU CƠ'],
  ['Local vegetables', 'Rau củ địa phương'],
  ['COUPLE DINNER', 'BỮA TỐI ĐÔI'],
  ['A romantic dinner for two.', 'Bữa tối lãng mạn dành cho hai người.'],
  ['COCKTAILS & DRINKS', 'COCKTAIL VÀ ĐỒ UỐNG'],
  ['Unique cocktail & fresh juice', 'Cocktail độc đáo và nước ép tươi'],
  ['BUFFETS', 'TIỆC TỰ CHỌN'],
  ['+50 dished', 'Hơn 50 món ăn'],
  ['SERVING TIME', 'GIỜ PHỤC VỤ'],

  // Spa experiences
  ['RED DAO BATH', 'TẮM LÁ THUỐC DAO ĐỎ'],
  [
    'Relax in a warm herbal bath prepared with natural mountain herbs, helping to soothe tired muscles, nourish the skin, and refresh your body.',
    'Thư giãn trong bồn tắm thảo dược ấm từ các loại lá thuốc tự nhiên vùng cao, giúp làm dịu cơ bắp mệt mỏi, nuôi dưỡng làn da và làm mới cơ thể.',
  ],
  ['RELAXING MASSAGE', 'MASSAGE THƯ GIÃN'],
  [
    'A soothing massage designed to release muscle tension, improve circulation, and bring deep relaxation to both body and mind.',
    'Liệu trình massage nhẹ nhàng giúp giải tỏa căng cơ, cải thiện tuần hoàn và mang lại sự thư giãn sâu cho cả cơ thể lẫn tinh thần.',
  ],
  ["H'MONG HERBAL", "THẢO DƯỢC H'MÔNG"],
  [
    "Experience the traditional healing power of H'Mong herbal therapy with natural mountain herbs, helping to relax the body, relieve tension, and restore your energy.",
    "Trải nghiệm liệu pháp thảo dược H'Mông truyền thống từ các loại lá thuốc tự nhiên vùng cao, giúp cơ thể thư giãn, giảm căng thẳng và phục hồi năng lượng.",
  ],
  ['HERBAL BATH', 'TẮM THẢO DƯỢC'],
  ['90 minutes, herbal bath', '90 phút, tắm thảo dược'],
  ['HOT STONE THERAPY', 'TRỊ LIỆU ĐÁ NÓNG'],
  ['90 - 120 minutes, hot stone therapy', '90–120 phút, trị liệu đá nóng'],
  ['FACE MASSAGE', 'MASSAGE MẶT'],
  ['45 minutes, face massage', '45 phút, massage mặt'],
  ['CUPPING THERAPY', 'TRỊ LIỆU GIÁC HƠI'],
  ['30 minutes, cupping therapy', '30 phút, trị liệu giác hơi'],
  ['FOOT MASSAGE', 'MASSAGE CHÂN'],
  ['45 - 75 minutes, foot massage', '45–75 phút, massage chân'],
  ['FULL BODY MASSAGE', 'MASSAGE TOÀN THÂN'],
  ['90 minutes, full body massage', '90 phút, massage toàn thân'],
] as const;

function normalizeContent(value: string) {
  return value
    .normalize('NFC')
    .replace(/\s+/gu, ' ')
    .trim()
    .toLocaleLowerCase();
}

const ENGLISH_TO_VIETNAMESE = new Map(
  CONTENT_PAIRS.map(([english, vietnamese]) => [
    normalizeContent(english),
    vietnamese,
  ])
);

const VIETNAMESE_TO_ENGLISH = new Map(
  CONTENT_PAIRS.map(([english, vietnamese]) => [
    normalizeContent(vietnamese),
    english,
  ])
);

export function localizeContentText(value: string, locale: string) {
  if (!value) return value;

  const translations =
    locale === 'vi' ? ENGLISH_TO_VIETNAMESE : VIETNAMESE_TO_ENGLISH;
  return translations.get(normalizeContent(value)) ?? value;
}

type RoomContent = {
  title: string;
  description: string;
  bed: string;
  bathroom?: string;
  fireplace?: string;
  views?: string;
  translations?: LocalizedTranslations;
};

type LocalizedTranslations = Partial<Record<'vi' | 'en', unknown>>;

function storedValues(
  item: { translations?: LocalizedTranslations },
  locale: string
) {
  const values = item.translations?.[locale === 'vi' ? 'vi' : 'en'];
  return values && typeof values === 'object' && !Array.isArray(values)
    ? (values as Record<string, unknown>)
    : undefined;
}

function storedString(
  item: { translations?: LocalizedTranslations },
  field: string,
  fallback: string,
  locale: string
) {
  const value = storedValues(item, locale)?.[field];
  return typeof value === 'string'
    ? value
    : localizeContentText(fallback, locale);
}

export function localizeTranslatedText(
  item: { translations?: LocalizedTranslations },
  field: string,
  fallback: string,
  locale: string
) {
  return storedString(item, field, fallback, locale);
}

function storedStringArray(
  item: { translations?: LocalizedTranslations },
  field: string,
  fallback: string[],
  locale: string
) {
  const value = storedValues(item, locale)?.[field];
  return Array.isArray(value) &&
    value.every((entry) => typeof entry === 'string')
    ? value
    : fallback.map((entry) => localizeContentText(entry, locale));
}

export function localizeRoomContent<T extends RoomContent>(
  room: T,
  locale: string
): T {
  return {
    ...room,
    title: storedString(room, 'title', room.title, locale),
    description: storedString(room, 'description', room.description, locale),
    bed: storedString(room, 'bed', room.bed, locale),
    bathroom: room.bathroom
      ? storedString(room, 'bathroom', room.bathroom, locale)
      : room.bathroom,
    fireplace: room.fireplace
      ? storedString(room, 'fireplace', room.fireplace, locale)
      : room.fireplace,
    views: room.views
      ? storedString(room, 'views', room.views, locale)
      : room.views,
  };
}

type ExperienceContent = {
  title: string;
  description: string;
  translations?: LocalizedTranslations;
};

export function localizeExperienceContent<T extends ExperienceContent>(
  item: T,
  locale: string
): T {
  return {
    ...item,
    title: storedString(item, 'title', item.title, locale),
    description: storedString(item, 'description', item.description, locale),
  };
}

type TourContent = ExperienceContent & {
  eyebrow: string;
  duration: string;
  rhythm: string;
  highlights: string[];
};

export function localizeTourContent<T extends TourContent>(
  tour: T,
  locale: string
): T {
  return {
    ...localizeExperienceContent(tour, locale),
    eyebrow: storedString(tour, 'eyebrow', tour.eyebrow, locale),
    duration: storedString(tour, 'duration', tour.duration, locale),
    rhythm: storedString(tour, 'rhythm', tour.rhythm, locale),
    highlights: storedStringArray(tour, 'highlights', tour.highlights, locale),
  };
}
