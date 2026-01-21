import { useState, useRef } from 'react';
import './ImageUpload.css';

interface ImageUploadProps {
    onUpload: (file: File) => Promise<void>;
    disabled?: boolean;
}

export default function ImageUpload({ onUpload, disabled }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        // Валидация
        if (!file.type.startsWith('image/')) {
            alert('Можно загружать только изображения');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            alert('Максимальный размер файла 5MB');
            return;
        }
        
        // Preview
        const reader = new FileReader();
        reader.onload = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };
    
    const handleUpload = async () => {
        const file = fileInputRef.current?.files?.[0];
        if (!file) return;
        
        setIsUploading(true);
        try {
            await onUpload(file);
            setPreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Не удалось загрузить изображение');
        } finally {
            setIsUploading(false);
        }
    };
    
    const handleCancel = () => {
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    
    return (
        <div className="image-upload">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={disabled || isUploading}
                style={{ display: 'none' }}
            />
            
            {preview ? (
                <div className="image-preview-container">
                    <img src={preview} alt="Preview" className="image-preview" />
                    <div className="preview-actions">
                        <button 
                            onClick={handleUpload} 
                            disabled={isUploading}
                            className="btn-send"
                        >
                            {isUploading ? 'Загрузка...' : 'Отправить'}
                        </button>
                        <button 
                            onClick={handleCancel}
                            disabled={isUploading}
                            className="btn-cancel"
                        >
                            Отмена
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    className="attach-button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={disabled}
                    title="Прикрепить изображение"
                >
                    📎
                </button>
            )}
        </div>
    );
}
