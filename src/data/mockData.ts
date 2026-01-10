// src/data/mockData.ts

import type { Studio, Room } from '../types';

export const mockStudios: Studio[] = [
  {
    id: 1,
    name: "Studio Light Pro",
    address: "ул. Абая, 150",
    district: "Алмалинский",
    city: "Алматы",
    rating: 4.9,
    total_reviews: 127,
    min_price: 8000,
    max_price: 15000,
    photos: ["https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800"],
    description: "Профессиональная студия для fashion и коммерческой съемки с современным оборудованием и опытной командой.",
    phone: "+7 701 123 4567",
    email: "info@studiolightpro.kz",
    working_hours: {
      monday: { open: "09:00", close: "22:00" },
      tuesday: { open: "09:00", close: "22:00" },
      wednesday: { open: "09:00", close: "22:00" },
      thursday: { open: "09:00", close: "22:00" },
      friday: { open: "09:00", close: "23:00" },
      saturday: { open: "10:00", close: "23:00" },
      sunday: { open: "10:00", close: "20:00" }
    }
  },
  {
    id: 2,
    name: "Creative Space",
    address: "пр. Достык, 234",
    district: "Медеуский",
    city: "Алматы",
    rating: 4.7,
    total_reviews: 89,
    min_price: 6000,
    max_price: 12000,
    photos: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"],
    description: "Креативное пространство для портретной съемки и творческих проектов.",
    phone: "+7 702 234 5678",
    working_hours: {
      monday: { open: "10:00", close: "21:00" },
      tuesday: { open: "10:00", close: "21:00" },
      wednesday: { open: "10:00", close: "21:00" },
      thursday: { open: "10:00", close: "21:00" },
      friday: { open: "10:00", close: "22:00" },
      saturday: { open: "11:00", close: "22:00" },
      sunday: { open: "11:00", close: "19:00" }
    }
  },
  {
    id: 3,
    name: "Fashion Hub",
    address: "ул. Розыбакиева, 87",
    district: "Бостандыкский",
    city: "Алматы",
    rating: 4.8,
    total_reviews: 156,
    min_price: 10000,
    max_price: 20000,
    photos: ["https://images.unsplash.com/photo-1554080353-a576cf803bda?w=800"],
    description: "Премиум студия для модной съемки с профессиональным световым оборудованием.",
    phone: "+7 703 345 6789",
    working_hours: {
      monday: { open: "09:00", close: "23:00" },
      tuesday: { open: "09:00", close: "23:00" },
      wednesday: { open: "09:00", close: "23:00" },
      thursday: { open: "09:00", close: "23:00" },
      friday: { open: "09:00", close: "00:00" },
      saturday: { open: "10:00", close: "00:00" },
      sunday: { open: "10:00", close: "22:00" }
    }
  },
  {
    id: 4,
    name: "Portrait Studio",
    address: "мкр. Самал-2, 45",
    district: "Медеуский",
    city: "Алматы",
    rating: 4.6,
    total_reviews: 73,
    min_price: 5000,
    max_price: 9000,
    photos: ["https://images.unsplash.com/photo-1571689936869-abcba3190498?w=800"],
    description: "Уютная студия для портретов и семейной съемки в домашней атмосфере.",
    phone: "+7 704 456 7890",
    working_hours: {
      monday: { open: "10:00", close: "20:00" },
      tuesday: { open: "10:00", close: "20:00" },
      wednesday: { open: "10:00", close: "20:00" },
      thursday: { open: "10:00", close: "20:00" },
      friday: { open: "10:00", close: "21:00" },
      saturday: { open: "11:00", close: "21:00" },
      sunday: { open: "11:00", close: "18:00" }
    }
  },
  {
    id: 5,
    name: "Urban Photo Lab",
    address: "ул. Жандосова, 98",
    district: "Ауэзовский",
    city: "Алматы",
    rating: 4.5,
    total_reviews: 64,
    min_price: 7000,
    max_price: 13000,
    photos: ["https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800"],
    description: "Современная студия с индустриальным дизайном для коммерческой съемки.",
    phone: "+7 705 567 8901"
  },
  {
    id: 6,
    name: "Bright Studio",
    address: "пр. Абылай хана, 112",
    district: "Алмалинский",
    city: "Алматы",
    rating: 4.9,
    total_reviews: 201,
    min_price: 9000,
    max_price: 18000,
    photos: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800"],
    description: "Просторная студия с естественным освещением и панорамными окнами."
  }
];

export const mockRooms: Record<number, Room[]> = {
  1: [
    {
      id: 1,
      studio_id: 1,
      name: "Fashion Hall",
      description: "Большой зал для fashion съемки с профессиональным светом",
      area_sqm: 120,
      capacity: 15,
      room_type: "Fashion",
      price_per_hour_min: 15000,
      price_per_hour_max: 20000,
      is_active: true,
      amenities: ["Wi-Fi", "Кондиционер", "Гримерная", "Паркинг", "Кухня"],
      photos: ["https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800"],
      equipment: [
        {
          id: 1,
          room_id: 1,
          name: "Profoto B10",
          category: "Lighting",
          brand: "Profoto",
          quantity: 4,
          rental_price: 2000
        },
        {
          id: 2,
          room_id: 1,
          name: "Sony A7R IV",
          category: "Camera",
          brand: "Sony",
          model: "A7R IV",
          quantity: 2,
          rental_price: 5000
        },
        {
          id: 3,
          room_id: 1,
          name: "Softbox 120x120",
          category: "Lighting",
          quantity: 6
        }
      ]
    },
    {
      id: 2,
      studio_id: 1,
      name: "Portrait Room",
      description: "Компактный зал для портретной съемки",
      area_sqm: 60,
      capacity: 8,
      room_type: "Portrait",
      price_per_hour_min: 8000,
      price_per_hour_max: 12000,
      is_active: true,
      amenities: ["Wi-Fi", "Кондиционер", "Гримерная"],
      photos: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"],
      equipment: [
        {
          id: 4,
          room_id: 2,
          name: "Godox AD600",
          category: "Lighting",
          brand: "Godox",
          quantity: 2
        }
      ]
    }
  ],
  2: [
    {
      id: 3,
      studio_id: 2,
      name: "Creative Hall",
      area_sqm: 80,
      capacity: 10,
      room_type: "Creative",
      price_per_hour_min: 10000,
      is_active: true,
      amenities: ["Wi-Fi", "Кондиционер", "Backdrop система"],
      photos: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"]
    }
  ]
};