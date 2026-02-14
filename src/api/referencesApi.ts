/**
 * References API - единая точка для получения справочников
 * Все данные приходят с бэкенда, без хардкодов
 */

const API_BASE = '/api/v1';

// ============ TYPES ============

export interface City {
  id: number;
  name: string;
  code: string;
  country: string;
}

export interface District {
  id: number;
  city_id: number;
  name: string;
  code: string;
}

export interface Amenity {
  id: number;
  name: string;
  icon?: string;
  category?: string;
}

export interface RoomTypeRef {
  id: number;
  name: string;
  description?: string;
}

export interface BookingStatus {
  id: number;
  code: string;
  name: string;
  color: string;
}

export interface StudioStatus {
  id: number;
  code: string;
  name: string;
  description?: string;
}

// ============ CITY API ============

export const getCities = async (): Promise<City[]> => {
  try {
    const response = await fetch(`${API_BASE}/references/cities`);
    if (!response.ok) {
      console.warn('Failed to fetch cities, returning empty array');
      return [];
    }
    const data = await response.json();
    return data.data?.cities || [];
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
};

// ============ DISTRICT API ============

export const getDistricts = async (cityId?: number): Promise<District[]> => {
  try {
    const url = cityId 
      ? `${API_BASE}/references/districts?city_id=${cityId}`
      : `${API_BASE}/references/districts`;
    
    const response = await fetch(url);
    if (!response.ok) {
      console.warn('Failed to fetch districts, returning empty array');
      return [];
    }
    const data = await response.json();
    return data.data?.districts || [];
  } catch (error) {
    console.error('Error fetching districts:', error);
    return [];
  }
};

export const getDistrictsByCity = async (cityName: string): Promise<District[]> => {
  try {
    const response = await fetch(`${API_BASE}/references/districts?city_name=${encodeURIComponent(cityName)}`);
    if (!response.ok) {
      console.warn(`Failed to fetch districts for ${cityName}, returning empty array`);
      return [];
    }
    const data = await response.json();
    return data.data?.districts || [];
  } catch (error) {
    console.error(`Error fetching districts for ${cityName}:`, error);
    return [];
  }
};

// ============ AMENITY API ============

export const getAmenities = async (): Promise<Amenity[]> => {
  try {
    const response = await fetch(`${API_BASE}/references/amenities`);
    if (!response.ok) {
      console.warn('Failed to fetch amenities, returning empty array');
      return [];
    }
    const data = await response.json();
    return data.data?.amenities || [];
  } catch (error) {
    console.error('Error fetching amenities:', error);
    return [];
  }
};

// ============ ROOM TYPE API ============

export const getRoomTypes = async (): Promise<RoomTypeRef[]> => {
  try {
    const response = await fetch(`${API_BASE}/references/room-types`);
    if (!response.ok) {
      console.warn('Failed to fetch room types, returning empty array');
      return [];
    }
    const data = await response.json();
    return data.data?.room_types || [];
  } catch (error) {
    console.error('Error fetching room types:', error);
    return [];
  }
};

// ============ BOOKING STATUS API ============

export const getBookingStatuses = async (): Promise<BookingStatus[]> => {
  try {
    const response = await fetch(`${API_BASE}/references/booking-statuses`);
    if (!response.ok) {
      console.warn('Failed to fetch booking statuses, returning empty array');
      return [];
    }
    const data = await response.json();
    return data.data?.statuses || [];
  } catch (error) {
    console.error('Error fetching booking statuses:', error);
    return [];
  }
};

// ============ STUDIO STATUS API ============

export const getStudioStatuses = async (): Promise<StudioStatus[]> => {
  try {
    const response = await fetch(`${API_BASE}/references/studio-statuses`);
    if (!response.ok) {
      console.warn('Failed to fetch studio statuses, returning empty array');
      return [];
    }
    const data = await response.json();
    return data.data?.statuses || [];
  } catch (error) {
    console.error('Error fetching studio statuses:', error);
    return [];
  }
};

// ============ HELPER: GET ALL REFERENCES ============

export interface AllReferences {
  cities: City[];
  amenities: Amenity[];
  roomTypes: RoomTypeRef[];
  bookingStatuses: BookingStatus[];
  studioStatuses: StudioStatus[];
}

/**
 * Загружает все справочники параллельно
 */
export const getAllReferences = async (): Promise<AllReferences> => {
  const [cities, amenities, roomTypes, bookingStatuses, studioStatuses] = await Promise.all([
    getCities(),
    getAmenities(),
    getRoomTypes(),
    getBookingStatuses(),
    getStudioStatuses()
  ]);

  return {
    cities,
    amenities,
    roomTypes,
    bookingStatuses,
    studioStatuses
  };
};
