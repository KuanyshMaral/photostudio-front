const API_BASE = '/api/v1';

export interface Lead {
  id: number;
  assigned_to: string;
  bin: string;
  company_name: string;
  contact_email: string;
  contact_name: string;
  contact_phone: string;
  contact_position: string;
  converted_at?: string;
  converted_user_id?: number;
  created_at: string;
  follow_up_count: number;
  how_found_us: string;
  last_contacted_at?: string;
  legal_address: string;
  next_follow_up_at?: string;
  notes: string;
  priority: number;
  referrer_url: string;
  rejection_reason?: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'rejected' | 'lost';
  updated_at: string;
  use_case: string;
  utm_campaign?: string;
  utm_medium?: string;
  utm_source?: string;
  website: string;
}

export interface LeadListResponse {
  leads: Lead[];
  total: number;
  limit: number;
  offset: number;
}

export interface LeadStats {
  new: number;
  contacted: number;
  qualified: number;
  converted: number;
  rejected: number;
  lost: number;
}

// Get all leads with optional filtering
export const getAllLeads = async (token: string, status?: string, limit: number = 50, offset: number = 0): Promise<LeadListResponse> => {
  try {
    console.log('getAllLeads: Fetching leads with params:', { status, limit, offset });
    
    const params = new URLSearchParams();
    if (status) {
      params.append('status', status);
    }
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());
    
    const response = await fetch(`${API_BASE}/admin/leads?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json',
      },
    });

    console.log('getAllLeads: Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('getAllLeads: Error response:', errorText);
      
      // If backend is unavailable, return mock data for development
      if (response.status === 0 || errorText.includes('ECONNREFUSED')) {
        console.warn('Backend unavailable - returning mock data');
        return {
          leads: [],
          total: 0,
          limit: limit,
          offset: offset
        };
      }
      
      throw new Error('Failed to fetch leads');
    }

    const json = await response.json();
    console.log('getAllLeads: Response JSON:', json);
    
    // According to Swagger API, response structure is: { data: { leads: [], total: 0 }, success: true }
    return json.data || { leads: [], total: 0, limit, offset };
  } catch (error) {
    console.error('Failed to fetch leads:', error);
    
    // Return mock data on network errors
    if (error instanceof Error && error.message.includes('Failed to fetch')) {
      console.warn('Network error - returning mock data');
      return {
        leads: [],
        total: 0,
        limit: limit,
        offset: offset
      };
    }
    
    throw error;
  }
};

// Get lead statistics
export const getLeadStats = async (token: string): Promise<LeadStats> => {
  try {
    const response = await fetch(`${API_BASE}/admin/leads/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('getLeadStats: Error response:', errorText);
      
      // If backend is unavailable, return mock data for development
      if (response.status === 0 || errorText.includes('ECONNREFUSED')) {
        console.warn('Backend unavailable - returning mock stats');
        return {
          new: 0,
          contacted: 0,
          qualified: 0,
          converted: 0,
          rejected: 0,
          lost: 0
        };
      }
      
      throw new Error('Failed to fetch lead stats');
    }

    const json = await response.json();
    console.log('getLeadStats: Response JSON:', json);
    
    // According to Swagger API, response structure is: { data: {...}, success: true }
    return json.data || {
      new: 0,
      contacted: 0,
      qualified: 0,
      converted: 0,
      rejected: 0,
      lost: 0
    };
  } catch (error) {
    console.error('Failed to fetch lead stats:', error);
    
    // Return mock data on network errors
    if (error instanceof Error && error.message.includes('Failed to fetch')) {
      console.warn('Network error - returning mock stats');
      return {
        new: 0,
        contacted: 0,
        qualified: 0,
        converted: 0,
        rejected: 0,
        lost: 0
      };
    }
    
    throw error;
  }
};

// Get lead by ID
export const getLeadById = async (token: string, id: number): Promise<Lead> => {
  try {
    const response = await fetch(`${API_BASE}/admin/leads/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('getLeadById: Error response:', errorText);
      throw new Error('Failed to fetch lead');
    }

    const json = await response.json();
    console.log('getLeadById: Response JSON:', json);
    
    // According to Swagger API, response structure is: { data: {...}, success: true }
    return json.data || json;
  } catch (error) {
    console.error('Failed to fetch lead:', error);
    throw error;
  }
};

// Assign lead to admin
export const assignLead = async (token: string, id: number, adminId: string, priority: number = 0): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE}/admin/leads/${id}/assign`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        admin_id: adminId,
        priority: priority,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || errorData.message || 'Failed to assign lead';
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('Failed to assign lead:', error);
    throw error;
  }
};

// Mark lead as contacted
export const markLeadAsContacted = async (token: string, id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE}/admin/leads/${id}/contacted`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || errorData.message || 'Failed to mark lead as contacted';
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('Failed to mark lead as contacted:', error);
    throw error;
  }
};

// Convert lead to studio owner
export const convertLead = async (token: string, id: number, conversionData: {
  bin: string;
  legal_address: string;
  legal_name: string;
  org_type: string;
  password: string;
}): Promise<void> => {
  try {
    console.log('convertLead: Sending conversion data:', conversionData);
    
    // Ensure all fields are strings and not empty
    const requestData = {
      bin: String(conversionData.bin || ''),
      legal_address: String(conversionData.legal_address || ''),
      legal_name: String(conversionData.legal_name || ''),
      org_type: String(conversionData.org_type || 'ip'),
      password: String(conversionData.password || '')
    };
    
    console.log('convertLead: Processed request data:', requestData);
    
    const jsonString = JSON.stringify(requestData);
    console.log('convertLead: JSON string to send:', jsonString);
    
    const response = await fetch(`${API_BASE}/admin/leads/${id}/convert`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: jsonString,
    });

    console.log('convertLead: Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('convertLead: Error response:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: { message: errorText } };
      }
      
      const errorMessage = errorData.error?.message || errorData.message || 'Failed to convert lead';
      throw new Error(errorMessage);
    }

    const responseText = await response.text();
    console.log('convertLead: Success response:', responseText);
    
    try {
      const responseData = JSON.parse(responseText);
      console.log('convertLead: Parsed response:', responseData);
    } catch {
      console.log('convertLead: Response is not JSON');
    }
    
  } catch (error) {
    console.error('Failed to convert lead:', error);
    throw error;
  }
};

// Reject lead
export const rejectLead = async (token: string, id: number, reason: string, notes?: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE}/admin/leads/${id}/reject`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        reason,
        notes: notes || '',
        status: 'rejected',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || errorData.message || 'Failed to reject lead';
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('Failed to reject lead:', error);
    throw error;
  }
};

// Update lead status
export const updateLeadStatus = async (token: string, id: number, status: string, notes?: string, reason?: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE}/admin/leads/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        status,
        notes: notes || '',
        reason: reason || '',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || errorData.message || 'Failed to update lead status';
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('Failed to update lead status:', error);
    throw error;
  }
};
