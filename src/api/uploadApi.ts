const API_BASE = import.meta.env.VITE_API_URL || 'http://89.35.125.136:8090/api/v1';

export interface UploadResponse {
  id: string;
  url: string;
  filename: string;
  size: number;
  content_type: string;
  created_at: string;
}

export interface UploadMetadata {
  id: string;
  filename: string;
  size: number;
  mime_type: string;
  created_at: string;
  url?: string;
}

// Helper function to normalize image URLs
export const normalizeImageUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined;
  
  // If URL is base64, return as is
  if (url.startsWith('data:image/')) {
    return url;
  }
  
  // If URL is already absolute, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If URL starts with /static/uploads/, add base URL
  if (url.startsWith('/static/uploads/')) {
    // Use server URL for static files
    const serverUrl = import.meta.env.VITE_SERVER_URL || import.meta.env.VITE_API_URL || 'http://localhost:3000';
    return `${serverUrl}${url}`;
  }
  
  // If URL starts with /api/v1/uploads/, add base URL
  if (url.startsWith('/api/v1/uploads/')) {
    return `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${url}`;
  }
  
  // If URL is just an ID or relative path, construct full URL
  if (url.startsWith('/uploads/') || !url.includes('/')) {
    return `${API_BASE}/uploads/${url.replace('/uploads/', '')}`;
  }
  
  return url;
};

// Upload file - POST /api/v1/uploads
export const uploadFile = async (file: File, token: string): Promise<UploadResponse> => {
  console.log('Uploading file:', file.name, 'size:', file.size, 'type:', file.type);
  
  // Convert to base64 for demonstration
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      const base64 = reader.result as string;
      console.log('File converted to base64');
      
      // Try API upload first
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(`${API_BASE}/uploads`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });
        
        console.log('Upload response status:', response.status);
        
        if (response.ok) {
          const json = await response.json();
          console.log('Upload response:', json);
          
          // Handle different response formats
          const uploadData = json.data?.upload || json.upload || json.data || json;
          
          // Extract URL from response
          let url = uploadData.url;
          if (!url && uploadData.id) {
            url = `/static/uploads/${uploadData.id}`;
          }
          
          console.log('Extracted URL:', url);
          
          resolve({
            id: uploadData.id,
            url: url,
            filename: uploadData.name || uploadData.filename,
            size: uploadData.size,
            content_type: uploadData.mime_type || uploadData.content_type,
            created_at: uploadData.created_at
          });
        } else {
          throw new Error('API upload failed');
        }
      } catch (error) {
        console.warn('API upload failed, using base64 fallback:', error);
        
        // Fallback to base64
        resolve({
          id: `base64-${Date.now()}`,
          url: base64,
          filename: file.name,
          size: file.size,
          content_type: file.type,
          created_at: new Date().toISOString()
        });
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

// Get upload metadata - GET /api/v1/uploads/{id}
export const getUploadMetadata = async (uploadId: string, token: string): Promise<UploadMetadata> => {
  console.log('Getting upload metadata:', uploadId);
  
  const response = await fetch(`${API_BASE}/uploads/${uploadId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to get upload metadata');
  }

  const json = await response.json();
  console.log('Upload metadata response:', json);
  
  return json.data?.upload || json.upload || json.data || json;
};

// List my uploads - GET /api/v1/uploads/my
export const listMyUploads = async (token: string): Promise<UploadMetadata[]> => {
  console.log('Listing my uploads');
  
  const response = await fetch(`${API_BASE}/uploads/my`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to list uploads');
  }

  const json = await response.json();
  console.log('List uploads response:', json);
  
  const uploads = json.data?.uploads || json.uploads || json.data || json;
  return Array.isArray(uploads) ? uploads : [];
};

// Delete upload - DELETE /api/v1/uploads/{id}
export const deleteUpload = async (uploadId: string, token: string): Promise<void> => {
  console.log('Deleting upload:', uploadId);
  
  const response = await fetch(`${API_BASE}/uploads/${uploadId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to delete upload');
  }

  console.log('Upload deleted successfully');
};

// Validate image file
export const validateImageFile = (file: File): string | null => {
  console.log('Validating image file:', file.name, 'type:', file.type, 'size:', file.size);
  
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return 'Только изображения форматов JPG, PNG, GIF, WebP';
  }
  
  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return 'Размер файла не должен превышать 5MB';
  }
  
  console.log('Image file validation passed');
  return null;
};
