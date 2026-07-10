export interface Space {
  _id: string;
  title: string;
  shortDescription: string;
  images: string[];
  category: "Co-working" | "Meeting Room" | "Event Hall" | "Studio";
  location: string;
  city: string;
  pricePerHour: number;
  capacity: number;
  rating: number;
  reviewCount: number;
}