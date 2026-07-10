// Get featured-books
export default async function getFeaturedRooms () {
    // return serverFetch('/featured-books');
    return [
  {
    "_id": "space_001",
    "title": "Downtown Hub Co-working",
    "shortDescription": "Modern co-working space with high-speed internet, ergonomic desks, and a vibrant community atmosphere.",
    "images": [
      "https://picsum.photos/id/1015/800/600",
      "https://picsum.photos/id/1016/800/600"
    ],
    "category": "Co-working",
    "location": "123 Gulshan Avenue",
    "city": "Dhaka",
    "pricePerHour": 450,
    "capacity": 50,
    "rating": 4.7,
    "reviewCount": 128
  },
  {
    "_id": "space_002",
    "title": "Executive Meeting Room",
    "shortDescription": "Fully equipped meeting room with 65-inch display, video conferencing, and premium seating.",
    "images": [
      "https://picsum.photos/id/102/800/600"
    ],
    "category": "Meeting Room",
    "location": "45 Banani Road, Block D",
    "city": "Dhaka",
    "pricePerHour": 850,
    "capacity": 12,
    "rating": 4.9,
    "reviewCount": 67
  },
  {
    "_id": "space_003",
    "title": "Grand Ballroom Event Hall",
    "shortDescription": "Spacious hall perfect for weddings, conferences, and large corporate events with stage and lighting.",
    "images": [
      "https://picsum.photos/id/1033/800/600",
      "https://picsum.photos/id/1040/800/600",
      "https://picsum.photos/id/106/800/600"
    ],
    "category": "Event Hall",
    "location": "Sector 10, Uttara",
    "city": "Dhaka",
    "pricePerHour": 2500,
    "capacity": 300,
    "rating": 4.5,
    "reviewCount": 89
  },
  {
    "_id": "space_004",
    "title": "Creative Photo & Video Studio",
    "shortDescription": "Professional photography studio with natural light, backdrop options, and professional lighting setup.",
    "images": [
      "https://picsum.photos/id/1074/800/600",
      "https://picsum.photos/id/133/800/600"
    ],
    "category": "Studio",
    "location": "Mirpur-10, Road 5",
    "city": "Dhaka",
    "pricePerHour": 1200,
    "capacity": 8,
    "rating": 4.8,
    "reviewCount": 54
  },
  {
    "_id": "space_005",
    "title": "The Loft Co-working",
    "shortDescription": "Industrial-style co-working space with open layout, private pods, and rooftop terrace.",
    "images": [
      "https://picsum.photos/id/201/800/600"
    ],
    "category": "Co-working",
    "location": "Gulshan-2, House 45",
    "city": "Dhaka",
    "pricePerHour": 380,
    "capacity": 35,
    "rating": 4.6,
    "reviewCount": 112
  },
  {
    "_id": "space_006",
    "title": "Boardroom Premium",
    "shortDescription": "Luxury meeting room featuring leather chairs, smart TV, and white board with video call facility.",
    "images": [
      "https://picsum.photos/id/251/800/600",
      "https://picsum.photos/id/256/800/600"
    ],
    "category": "Meeting Room",
    "location": "Dhanmondi 27",
    "city": "Dhaka",
    "pricePerHour": 950,
    "capacity": 18,
    "rating": 4.4,
    "reviewCount": 41
  },
  {
    "_id": "space_007",
    "title": "Riverside Event Venue",
    "shortDescription": "Beautiful open hall with river view, ideal for product launches, parties, and seminars.",
    "images": [
      "https://picsum.photos/id/1018/800/600",
      "https://picsum.photos/id/133/800/600"
    ],
    "category": "Event Hall",
    "location": "Savar, Near Ashulia",
    "city": "Dhaka",
    "pricePerHour": 1800,
    "capacity": 150,
    "rating": 4.3,
    "reviewCount": 76
  },
  {
    "_id": "space_008",
    "title": "Music & Podcast Studio",
    "shortDescription": "Soundproof recording studio equipped with high-end microphones, mixing console, and acoustic treatment.",
    "images": [
      "https://picsum.photos/id/870/800/600"
    ],
    "category": "Studio",
    "location": "Mohammadpur, Block E",
    "city": "Dhaka",
    "pricePerHour": 1400,
    "capacity": 6,
    "rating": 4.9,
    "reviewCount": 33
  }
]
}