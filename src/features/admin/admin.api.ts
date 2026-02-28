const API_BASE = '/api/v1';

export interface AdminLoginRequest {
    email: string;
    password: string;
}

export interface AdminLoginResponse {
    data: string; // JWT token
    success: boolean;
    error?: {
        code: string;
        details: string;
        message: string;
    };
}

export interface AdminUser {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar_url?: string;
    is_active: boolean;
    last_login_at?: string;
    created_at: string;
    updated_at: string;
}

export interface AdminMeResponse {
    data: AdminUser;
    success: boolean;
    error?: {
        code: string;
        details: string;
        message: string;
    };
}

// Admin authentication functions
export const adminLogin = async (data: AdminLoginRequest): Promise<{ token: string; user: AdminUser }> => {
    const response = await fetch(`${API_BASE}/admin/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || errorData.message || 'Admin login failed';
        throw new Error(errorMessage);
    }

    const json = await response.json();
    
    // According to the API response, the structure is:
    // {
    //   "data": {
    //     "access_token": "...",
    //     "admin": { ... }
    //   },
    //   "success": true
    // }
    const token = json.data.access_token;
    const user = json.data.admin;
    
    return { token, user };
};

export const getCurrentAdmin = async (token: string): Promise<AdminUser> => {
    const response = await fetch(`${API_BASE}/admin/auth/me`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || errorData.message || 'Failed to get admin info';
        throw new Error(errorMessage);
    }

    const json = await response.json();
    return json.data;
};

export interface Statistics {
    total_users: number;
    total_studios: number;
    total_bookings: number;
    pending_studios: number;
    today_bookings: number;
}

export interface PendingStudio {
    id: number;
    name: string;
    address: string;
    city: string;
    owner_name: string;
    owner_email: string;
    created_at: string;
}

export interface PendingBooking {
    id: number;
    studio_name: string;
    room_name: string;
    user_name: string;
    client_name: string;
    client_email: string;
    user_email: string;
    start_time: string;
    end_time: string;
    date: string;
    status: string;
    total_price: number;
    created_at: string;
}

export const getStatistics = async (token: string): Promise<Statistics> => {
    const response = await fetch(`${API_BASE}/admin/statistics`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch statistics');
    const json = await response.json();
    return json.data;
};

export const getPendingStudios = async (token: string): Promise<PendingStudio[]> => {
    const response = await fetch(`${API_BASE}/admin/studios/pending`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch pending studios');
    const json = await response.json();
    return json.data?.studios || [];
};

export const verifyStudio = async (token: string, studioId: number, notes?: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/admin/studios/${studioId}/verify`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ admin_notes: notes || '' })
    });
    if (!response.ok) throw new Error('Failed to verify studio');
};

export const rejectStudio = async (token: string, studioId: number, reason: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/admin/studios/${studioId}/reject`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
    });
    if (!response.ok) throw new Error('Failed to reject studio');
};

export const getPendingBookings = async (token: string): Promise<PendingBooking[]> => {
    const response = await fetch(`${API_BASE}/admin/bookings/pending`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch pending bookings');
    const json = await response.json();
    return json.data?.bookings || [];
};

export const approveBooking = async (token: string, bookingId: number): Promise<void> => {
    const response = await fetch(`${API_BASE}/admin/bookings/${bookingId}/approve`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) throw new Error('Failed to approve booking');
};

export const rejectBooking = async (token: string, bookingId: number, reason: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/admin/bookings/${bookingId}/reject`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
    });
    if (!response.ok) throw new Error('Failed to reject booking');
};

// Lead Management APIs
export interface OwnerLead {
    id: number;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
    contact_position?: string;
    company_name: string;
    bin?: string;
    legal_address?: string;
    website?: string;
    use_case?: string;
    how_found_us?: string;
    status: 'new' | 'contacted' | 'qualified' | 'converted' | 'rejected' | 'lost';
    priority: number;
    assigned_to?: string;
    notes?: string;
    last_contacted_at?: string;
    next_follow_up_at?: string;
    follow_up_count: number;
    converted_at?: string;
    converted_user_id?: number;
    rejection_reason?: string;
    source?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    referrer_url?: string;
    ip_address?: string;
    user_agent?: string;
    created_at: string;
    updated_at: string;
}

export interface LeadStats {
    new: number;
    contacted: number;
    qualified: number;
    converted: number;
    rejected: number;
    lost: number;
}

export interface LeadListResponse {
    leads: OwnerLead[];
    total: number;
}

export const getLeads = async (token: string, status?: string, limit = 50, offset = 0): Promise<LeadListResponse> => {
    const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
    });
    
    if (status) {
        params.append('status', status);
    }

    const response = await fetch(`${API_BASE}/admin/leads?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch leads');
    const json = await response.json();
    return json.data;
};

export const getLeadById = async (token: string, leadId: number): Promise<OwnerLead> => {
    const response = await fetch(`${API_BASE}/admin/leads/${leadId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch lead');
    const json = await response.json();
    return json.data;
};

export const getLeadStats = async (token: string): Promise<LeadStats> => {
    const response = await fetch(`${API_BASE}/admin/leads/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch lead stats');
    const json = await response.json();
    return json.data;
};

export const updateLeadStatus = async (token: string, leadId: number, status: string, notes?: string, reason?: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/admin/leads/${leadId}/status`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, notes, reason })
    });
    if (!response.ok) throw new Error('Failed to update lead status');
};

export const assignLead = async (token: string, leadId: number, adminId: string, priority = 0): Promise<void> => {
    const response = await fetch(`${API_BASE}/admin/leads/${leadId}/assign`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ admin_id: adminId, priority })
    });
    if (!response.ok) throw new Error('Failed to assign lead');
};

export const markLeadContacted = async (token: string, leadId: number): Promise<void> => {
    const response = await fetch(`${API_BASE}/admin/leads/${leadId}/contacted`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) throw new Error('Failed to mark lead as contacted');
};

export const rejectLead = async (token: string, leadId: number, reason: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/admin/leads/${leadId}/reject`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
    });
    if (!response.ok) throw new Error('Failed to reject lead');
};

export const convertLead = async (token: string, leadId: number, legalName: string, legalAddress: string, password: string, bin?: string): Promise<{ message: string; user_id: number; email: string }> => {
    // Ensure all values are strings and handle object types
    const cleanLegalName = typeof legalName === 'string' ? legalName : String(legalName);
    const cleanLegalAddress = typeof legalAddress === 'string' ? legalAddress : String(legalAddress);
    const cleanPassword = typeof password === 'string' ? password : String(password);
    const cleanBin = typeof bin === 'string' ? bin : '000000000000';
    
    const requestBody = {
        legal_name: cleanLegalName,
        legal_address: cleanLegalAddress,
        password: cleanPassword,
        org_type: 'ip', // Default to individual entrepreneur
        bin: cleanBin.trim() || '000000000000' // Ensure BIN is always provided
    };
    
    console.log('Convert lead request body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(`${API_BASE}/admin/leads/${leadId}/convert`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('Error response:', errorData);
        let errorMessage = 'Failed to convert lead';
        
        // Handle validation errors which might be objects
        if (errorData.error?.message) {
            errorMessage = errorData.error.message;
        } else if (errorData.message) {
            errorMessage = errorData.message;
        } else if (typeof errorData.error === 'string') {
            errorMessage = errorData.error;
        } else if (errorData.error && typeof errorData.error === 'object') {
            // Handle validation object with String/Valid structure
            const validationErrors = Object.entries(errorData.error)
                .filter(([_, value]) => typeof value === 'string')
                .map(([_, value]) => value)
                .join(', ');
            if (validationErrors) {
                errorMessage = validationErrors;
            }
        } else if (errorData.data && typeof errorData.data === 'object') {
            // Handle errors in data field
            const validationErrors = Object.entries(errorData.data)
                .filter(([_, value]) => typeof value === 'string')
                .map(([_, value]) => value)
                .join(', ');
            if (validationErrors) {
                errorMessage = validationErrors;
            }
        }
        
        throw new Error(errorMessage);
    }
    const json = await response.json();
    return json.data;
};

// Owner verification types
export interface OwnerProfile {
  user_id: number;
  studio_id: number; // Original studio ID for API calls
  company_name?: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  studio_status?: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

export interface OwnerProfilesResponse {
  data: OwnerProfile[];
  success: boolean;
}

// Owner verification API functions
export const getOwnerProfiles = async (token: string): Promise<OwnerProfilesResponse> => {
  const response = await fetch(`${API_BASE}/admin/studios/pending`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to fetch owner profiles');
  }

  const json = await response.json();
  // Convert pending studios to owner profiles format
  const studios = json.data?.pending_studios || [];
  const ownerProfiles: OwnerProfile[] = studios.map((studio: any) => ({
    user_id: studio.id, // Use studio.id as user_id for API calls
    studio_id: studio.id, // Keep original studio_id for reference
    company_name: studio.company_name,
    contact_person: '', // Not available in API response
    phone: '', // Not available in API response
    email: '', // Not available in API response
    verification_status: 'pending', // All pending studios are pending verification
    studio_status: 'inactive',
    created_at: studio.created_at,
    updated_at: studio.created_at
  }));

  return {
    data: ownerProfiles,
    success: true
  };
};

export const updateOwnerVerification = async (token: string, studioId: number, verificationStatus: 'pending' | 'verified' | 'rejected'): Promise<OwnerProfile> => {
  if (verificationStatus === 'verified') {
    // Use existing verifyStudio function
    await verifyStudio(token, studioId, 'Verified through admin panel');
    
    // Return mock updated profile
    return {
      user_id: studioId,
      studio_id: studioId,
      verification_status: 'verified',
      studio_status: 'active'
    } as OwnerProfile;
  } else if (verificationStatus === 'rejected') {
    // Use existing rejectStudio function
    await rejectStudio(token, studioId, 'Rejected through admin panel');
    
    // Return mock updated profile
    return {
      user_id: studioId,
      studio_id: studioId,
      verification_status: 'rejected',
      studio_status: 'inactive'
    } as OwnerProfile;
  } else {
    // For 'pending', just return mock profile
    return {
      user_id: studioId,
      studio_id: studioId,
      verification_status: 'pending',
      studio_status: 'inactive'
    } as OwnerProfile;
  }
};

export const updateOwnerStudioStatus = async (token: string, userId: number, studioStatus: 'active' | 'inactive'): Promise<OwnerProfile> => {
  // Studio status is managed through verification status
  // For now, just return mock profile
  return {
    user_id: userId,
    studio_status: studioStatus
  } as OwnerProfile;
};
