import React, { useState, useEffect } from 'react';
import { 
  getAttachments, 
  attachUploads, 
  deleteAttachment, 
  reorderAttachments,
  type Attachment,
  type AttachRequest 
} from '../api/attachmentsApi';
import { uploadFile } from '../api/uploadApi';
import { X, GripVertical, Upload, Image as ImageIcon } from 'lucide-react';
import './AttachmentsManager.css';

interface AttachmentsManagerProps {
  targetType: 'studio_gallery' | 'room_gallery';
  targetId: number;
  token: string;
  maxImages?: number;
  onImagesChange?: (images: string[]) => void;
}

export const AttachmentsManager: React.FC<AttachmentsManagerProps> = ({
  targetType,
  targetId,
  token,
  maxImages = 10,
  onImagesChange
}) => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  useEffect(() => {
    loadAttachments();
  }, [targetType, targetId, token]);

  const loadAttachments = async () => {
    try {
      setLoading(true);
      const data = await getAttachments(targetType, targetId, token);
      setAttachments(data);
      const imageUrls = data.map(att => att.upload?.url || '').filter(Boolean);
      onImagesChange?.(imageUrls);
    } catch (error) {
      console.error('Failed to load attachments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    if (files.length === 0) return;

    try {
      setUploading(true);
      
      // Upload all files
      const uploadPromises = Array.from(files).map(file => uploadFile(file, token));
      const uploadResults = await Promise.all(uploadPromises);
      const uploadIds = uploadResults.map(result => result.id);

      // Attach uploads to entity
      const attachRequest: AttachRequest = {
        target_type: targetType,
        target_id: targetId,
        upload_ids: uploadIds
      };

      await attachUploads(attachRequest, token);
      
      // Reload attachments
      await loadAttachments();
    } catch (error) {
      console.error('Failed to upload files:', error);
      alert('Не удалось загрузить файлы');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDelete = async (attachmentId: number) => {
    if (!confirm('Вы уверены, что хотите удалить это изображение?')) return;

    try {
      await deleteAttachment(attachmentId, token);
      await loadAttachments();
    } catch (error) {
      console.error('Failed to delete attachment:', error);
      alert('Не удалось удалить изображение');
    }
  };

  const handleDragStart = (e: React.DragEvent, attachmentId: number) => {
    setDraggedItem(attachmentId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = async () => {
    if (draggedItem === null) return;

    const newOrder = [...attachments];
    const draggedIndex = newOrder.findIndex(att => att.id === draggedItem);
    
    if (draggedIndex !== -1) {
      const [draggedAttachment] = newOrder.splice(draggedIndex, 1);
      newOrder.push(draggedAttachment);
      
      try {
        await reorderAttachments(newOrder.map(att => att.id), token);
        setAttachments(newOrder);
      } catch (error) {
        console.error('Failed to reorder attachments:', error);
        // Revert order on error
        await loadAttachments();
      }
    }
    
    setDraggedItem(null);
  };

  const handleDragOverItem = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  if (loading) {
    return (
      <div className="attachments-manager loading">
        <div className="loading-spinner">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="attachments-manager">
      <div className="attachments-header">
        <h3>Галерея изображений</h3>
        <span className="image-count">
          {attachments.length}/{maxImages}
        </span>
      </div>

      {/* Upload Area */}
      {attachments.length < maxImages && (
        <div 
          className="upload-area"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            disabled={uploading}
            className="file-input"
          />
          <div className="upload-content">
            <Upload size={24} />
            <span>
              {uploading ? 'Загрузка...' : 'Перетащите файлы сюда или нажмите для выбора'}
            </span>
            <small>Поддерживаются JPG, PNG, GIF (макс. 5MB)</small>
          </div>
        </div>
      )}

      {/* Images Grid */}
      <div className="attachments-grid">
        {attachments.map((attachment, index) => (
          <div
            key={attachment.id}
            className={`attachment-item ${draggedItem === attachment.id ? 'dragging' : ''}`}
            draggable
            onDragStart={(e) => handleDragStart(e, attachment.id)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOverItem}
          >
            <div className="attachment-image">
              {attachment.upload?.url ? (
                <img 
                  src={attachment.upload.url} 
                  alt={`Attachment ${index + 1}`}
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-image.jpg';
                  }}
                />
              ) : (
                <div className="image-placeholder">
                  <ImageIcon size={24} />
                </div>
              )}
              <div className="attachment-overlay">
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(attachment.id)}
                  title="Удалить"
                >
                  <X size={16} />
                </button>
                <div className="drag-handle" title="Перетащить для изменения порядка">
                  <GripVertical size={16} />
                </div>
              </div>
            </div>
            {attachment.caption && (
              <div className="attachment-caption">
                {attachment.caption}
              </div>
            )}
          </div>
        ))}
      </div>

      {attachments.length === 0 && (
        <div className="empty-state">
          <ImageIcon size={48} />
          <p>Нет загруженных изображений</p>
          <small>Загрузите изображения, чтобы они появились здесь</small>
        </div>
      )}
    </div>
  );
};

export default AttachmentsManager;
