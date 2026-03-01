import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { uploadFile, validateImageFile, normalizeImageUrl } from '../api/uploadApi';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({ images, onImagesChange, maxImages = 5 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Check max images limit
    if (images.length >= maxImages) {
      setError(`Максимум ${maxImages} изображений`);
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Требуется авторизация');
      }

      console.log('Starting upload for file:', file.name);
      const uploadResult = await uploadFile(file, token);
      console.log('Upload completed:', uploadResult);

      // Add new image to the list
      const newImages = [...images, uploadResult.url];
      onImagesChange(newImages);
      
      console.log('Images updated:', newImages);
    } catch (error) {
      console.error('Upload failed:', error);
      setError('Не удалось загрузить изображение');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
    console.log('Image removed at index:', index, 'New images:', newImages);
  };

  return (
    <div className="image-upload">
      <div className="image-upload__grid">
        {/* Existing images */}
        {images.map((image, index) => {
          const normalizedUrl = normalizeImageUrl(image);
          console.log(`Rendering image ${index}:`, image, 'normalized:', normalizedUrl);
          
          return (
            <div key={index} className="image-upload__item">
              <img
                src={normalizedUrl}
                alt={`Upload ${index + 1}`}
                className="image-upload__image"
                onLoad={() => console.log(`Image ${index} loaded successfully`)}
                onError={(e) => {
                  console.error(`Failed to load image ${index}:`, normalizedUrl);
                  console.error('Error event:', e);
                }}
              />
              <button
                type="button"
                className="image-upload__remove"
                onClick={() => removeImage(index)}
                disabled={uploading}
              >
                <X size={16} />
              </button>
            </div>
          );
        })}

        {/* Upload button */}
        {images.length < maxImages && (
          <div className="image-upload__item image-upload__upload">
            <input
              type="file"
              id="file-upload"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading}
              style={{ display: 'none' }}
            />
            <label
              htmlFor="file-upload"
              className={`image-upload__label ${uploading ? 'uploading' : ''}`}
            >
              {uploading ? (
                <div className="uploading-spinner">Загрузка...</div>
              ) : (
                <>
                  <Upload size={24} />
                  <span>Загрузить</span>
                </>
              )}
            </label>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="image-upload__error">
          {error}
        </div>
      )}

      {/* Info */}
      <div className="image-upload__info">
        {images.length} из {maxImages} изображений
      </div>

      <style>{`
        .image-upload {
          width: 100%;
        }

        .image-upload__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 12px;
          margin-bottom: 8px;
        }

        .image-upload__item {
          position: relative;
          width: 100%;
          height: 120px;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e5e7eb;
        }

        .image-upload__image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-upload__remove {
          position: absolute;
          top: 4px;
          right: 4px;
          background: rgba(239, 68, 68, 0.9);
          color: white;
          border: none;
          border-radius: 4px;
          padding: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s;
        }

        .image-upload__remove:hover {
          background: rgba(220, 38, 38, 0.9);
        }

        .image-upload__upload {
          background: #f9fafb;
          border: 2px dashed #d1d5db;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .image-upload__label {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #6b7280;
          transition: all 0.2s;
          gap: 4px;
        }

        .image-upload__label:hover {
          color: #374151;
          background: #f3f4f6;
        }

        .image-upload__label.uploading {
          cursor: not-allowed;
          color: #9ca3af;
        }

        .uploading-spinner {
          font-size: 12px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .image-upload__error {
          color: #dc2626;
          font-size: 14px;
          margin-bottom: 4px;
        }

        .image-upload__info {
          color: #6b7280;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
}
