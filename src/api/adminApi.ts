const API_BASE = '/api/v1/admin';

export const getPendingStudios = async (token: string) => {
    const response = await fetch(`${API_BASE}/studios/pending`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch');
    return (await response.json()).data;
};

export const verifyStudio = async (token: string, studioId: number, notes?: string) => {
    const response = await fetch(`${API_BASE}/studios/${studioId}/verify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ admin_notes: notes }),
    });
    if (!response.ok) throw new Error('Failed to verify');
    return (await response.json()).data;
};

export const rejectStudio = async (token: string, studioId: number, reason: string) => {
    const response = await fetch(`${API_BASE}/studios/${studioId}/reject`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
    });
    if (!response.ok) throw new Error('Failed to reject');
    return (await response.json()).data;
};

export const getStatistics = async (token: string) => {
    const response = await fetch(`${API_BASE}/statistics`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch');
    return (await response.json()).data;
};

export const getPlatformAnalytics = async (token: string, days = 30) => {
  const response = await fetch(`${API_BASE}/analytics?days=${days}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch analytics');
  const data = await response.json();
  return data.data?.analytics;
};

export const getAds = async (token: string, placement?: string) => {
  let url = `${API_BASE}/ads`;
  if (placement) url += `?placement=${placement}`;
  
  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch ads');
  const data = await response.json();
  return data.data?.ads || [];
};

export const createAd = async (token: string, adData: any) => {
  const response = await fetch(`${API_BASE}/ads`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(adData)
  });
  if (!response.ok) throw new Error('Failed to create ad');
  return response.json();
};

export const updateAd = async (token: string, adId: number, updates: any) => {
  const response = await fetch(`${API_BASE}/ads/${adId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });
  if (!response.ok) throw new Error('Failed to update ad');
  return response.json();
};

export const deleteAd = async (token: string, adId: number) => {
  const response = await fetch(`${API_BASE}/ads/${adId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to delete ad');
};

export const setStudioVIP = async (token: string, studioId: number, isVIP: boolean) => {
  const response = await fetch(`${API_BASE}/studios/${studioId}/vip`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ is_vip: isVIP })
  });
  if (!response.ok) throw new Error('Failed to update VIP');
};

export const setStudioGold = async (token: string, studioId: number, isGold: boolean) => {
  const response = await fetch(`${API_BASE}/studios/${studioId}/gold`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ is_gold: isGold })
  });
  if (!response.ok) throw new Error('Failed to update Gold');
};

export const getReviewsForModeration = async (token: string, page = 1, perPage = 20) => {
  const response = await fetch(`${API_BASE}/reviews?page=${page}&per_page=${perPage}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch reviews');
  const data = await response.json();
  return {
    reviews: data.data?.reviews || [],
    total: data.data?.total || 0
  };
};

export const hideReview = async (token: string, reviewId: number) => {
  const response = await fetch(`${API_BASE}/reviews/${reviewId}/hide`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to hide review');
};

export const deleteReview = async (token: string, reviewId: number) => {
  const response = await fetch(`${API_BASE}/reviews/${reviewId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to delete review');
};
