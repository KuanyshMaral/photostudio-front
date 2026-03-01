const API_BASE = import.meta.env.VITE_API_URL || 'http://89.35.125.136:8090';

export interface Attachment {
  id: number;
  upload_id: string;
  target_type: 'studio_gallery' | 'room_gallery' | 'review_photos' | 'chat_message';
  target_id: number;
  caption?: string;
  created_at: string;
  updated_at: string;
  upload?: {
    id: string;
    url: string;
    filename: string;
    size: number;
    mime_type: string;
    created_at: string;
  };
}

export interface AttachRequest {
  caption?: string;
  target_id: number;
  target_type: 'studio_gallery' | 'room_gallery' | 'review_photos' | 'chat_message';
  upload_ids: string[];
}

export interface ReorderRequest {
  ids: number[];
}

export interface AttachmentsResponse {
  data: Record<string, any>;
  success: boolean;
  error?: {
    code: string;
    message: string;
    details: string;
  };
}

// Get attachments for an entity
export const getAttachments = async (
  targetType: 'studio_gallery' | 'room_gallery' | 'review_photos' | 'chat_message',
  targetId: number,
  token: string
): Promise<Attachment[]> => {
  const response = await fetch(`${API_BASE}/attachments?target_type=${targetType}&target_id=${targetId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to fetch attachments');
  }

  const result: AttachmentsResponse = await response.json();
  // Convert response data to array format
  return Object.values(result.data).map((item: any) => ({
    id: item.id,
    upload_id: item.upload_id,
    target_type: item.target_type,
    target_id: item.target_id,
    caption: item.caption,
    created_at: item.created_at,
    updated_at: item.updated_at,
    upload: item.upload
  }));
};

// Attach uploads to an entity
export const attachUploads = async (
  request: AttachRequest,
  token: string
): Promise<Attachment[]> => {
  const response = await fetch(`${API_BASE}/attachments`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to attach uploads');
  }

  const result: AttachmentsResponse = await response.json();
  return Object.values(result.data).map((item: any) => ({
    id: item.id,
    upload_id: item.upload_id,
    target_type: item.target_type,
    target_id: item.target_id,
    caption: item.caption,
    created_at: item.created_at,
    updated_at: item.updated_at,
    upload: item.upload
  }));
};

// Reorder attachments
export const reorderAttachments = async (
  ids: number[],
  token: string
): Promise<void> => {
  const response = await fetch(`${API_BASE}/attachments/reorder`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ids }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to reorder attachments');
  }
};

// Delete an attachment (unlink upload from entity)
export const deleteAttachment = async (
  id: number,
  token: string
): Promise<void> => {
  const response = await fetch(`${API_BASE}/attachments/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to delete attachment');
  }
};
