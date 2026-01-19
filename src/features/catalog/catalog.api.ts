const API_BASE = '/api/v1';

export interface StudiosResponse {
  studios: any[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
}

export const getStudios = async (filters: any) => {
  const searchParams = new URLSearchParams();
  
  if (filters.city) searchParams.append('city', filters.city);
  if (filters.room_type) searchParams.append('room_type', filters.room_type);
  if (filters.min_price) searchParams.append('min_price', String(filters.min_price));
  if (filters.max_price) searchParams.append('max_price', String(filters.max_price));
  if (filters.search) searchParams.append('search', filters.search);
  if (filters.page) searchParams.append('page', String(filters.page));
  if (filters.limit) searchParams.append('limit', String(filters.limit));
  
  try {
    const response = await fetch(`${API_BASE}/studios?${searchParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Возвращаем моковые данные если API не отвечает
    if (!data.success && !data.data) {
      return getMockStudios(filters);
    }
    
    return {
      studios: data.data?.studios || [],
      pagination: data.data?.pagination || {
        current_page: 1,
        total_pages: 1,
        total_count: 0,
        per_page: 12
      }
    };
  } catch (error) {
    console.warn('API unavailable, using mock data:', error);
    return getMockStudios(filters);
  }
};

export const getStudioById = async (id: number) => {
  try {
    const response = await fetch(`${API_BASE}/studios/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Возвращаем моковые данные если API не отвечает
    if (!data.success && !data.data) {
      return getMockStudio(id);
    }
    
    return data.data;
  } catch (error) {
    console.warn('API unavailable, using mock data:', error);
    return getMockStudio(id);
  }
};

// Моковые данные для демонстрации
function getMockStudios(filters: any) {
  const mockStudios = [
    {
      id: 1,
      name: 'Photo Pro Studio',
      description: 'Профессиональная фотостудия с современным оборудованием',
      address: 'ул. Абая 150, Алматы',
      city: 'Алматы',
      phone: '+7 777 123 45 67',
      rating: 4.8,
      reviews_count: 124,
      min_price: 5000,
      preview_image: 'https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=Studio+1',
      rooms: [
        {
          id: 1,
          name: 'Main Hall',
          description: 'Основной зал с профессиональным светом',
          room_type: 'Fashion',
          area_sqm: 50,
          capacity: 10,
          price_per_hour_min: 5000,
          price_per_hour_max: 8000,
          amenities: ['Wi-Fi', 'Кондиционер', 'Зеркало']
        }
      ]
    },
    {
      id: 2,
      name: 'Creative Space',
      description: 'Креативное пространство для фотосессий',
      address: 'ул. Достык 85, Астана',
      city: 'Астана',
      phone: '+7 777 234 56 78',
      rating: 4.6,
      reviews_count: 89,
      min_price: 4000,
      preview_image: 'https://via.placeholder.com/400x300/10B981/FFFFFF?text=Studio+2',
      rooms: [
        {
          id: 2,
          name: 'Creative Studio',
          description: 'Пространство для креативных идей',
          room_type: 'Creative',
          area_sqm: 40,
          capacity: 8,
          price_per_hour_min: 4000,
          price_per_hour_max: 6000,
          amenities: ['Wi-Fi', 'Проектор']
        }
      ]
    }
  ];

  // Применяем фильтры
  let filteredStudios = mockStudios.filter(studio => {
    if (filters.city && studio.city !== filters.city) return false;
    if (filters.search && !studio.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.min_price && studio.min_price < filters.min_price) return false;
    if (filters.max_price && studio.min_price > filters.max_price) return false;
    if (filters.room_type && studio.rooms?.[0]?.room_type !== filters.room_type) return false;
    return true;
  });

  // Пагинация
  const page = filters.page || 1;
  const limit = filters.limit || 12;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedStudios = filteredStudios.slice(startIndex, endIndex);

  return {
    studios: paginatedStudios,
    pagination: {
      current_page: page,
      total_pages: Math.ceil(filteredStudios.length / limit),
      total_count: filteredStudios.length,
      per_page: limit
    }
  };
}

function getMockStudio(id: number) {
  const mockStudios = [
    {
      id: 1,
      name: 'Photo Pro Studio',
      description: 'Профессиональная фотостудия с современным оборудованием. Идеально подходит для fashion съемок, портретов и коммерческих проектов.',
      address: 'ул. Абая 150, Алматы',
      city: 'Алматы',
      phone: '+7 777 123 45 67',
      email: 'info@photopro.kz',
      website: 'https://photopro.kz',
      working_hours: 'Пн-Вс: 09:00 - 22:00',
      rating: 4.8,
      reviews_count: 124,
      min_price: 5000,
      preview_image: 'https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=Photo+Pro',
      photos: [
        'https://via.placeholder.com/800x600/3B82F6/FFFFFF?text=Studio+1',
        'https://via.placeholder.com/800x600/10B981/FFFFFF?text=Studio+2',
        'https://via.placeholder.com/800x600/F59E0B/FFFFFF?text=Studio+3'
      ],
      rooms: [
        {
          id: 1,
          name: 'Main Hall',
          description: 'Основной зал с профессиональным светом',
          room_type: 'Fashion',
          area_sqm: 50,
          capacity: 10,
          price_per_hour_min: 5000,
          price_per_hour_max: 8000,
          amenities: ['Wi-Fi', 'Кондиционер', 'Зеркало', 'Вешалки']
        },
        {
          id: 2,
          name: 'Portrait Room',
          description: 'Уютная комната для портретных съемок',
          room_type: 'Portrait',
          area_sqm: 25,
          capacity: 5,
          price_per_hour_min: 3000,
          price_per_hour_max: 5000,
          amenities: ['Wi-Fi', 'Кондиционер', 'Фоны']
        }
      ]
    }
  ];

  return mockStudios.find(studio => studio.id === id) || mockStudios[0];
}
