import React from 'react';
import './GalleryPreview.css';

interface Room {
  id: number;
  name: string;
  photos?: string[];
}

interface GalleryPreviewProps {
  rooms: Room[];
  onViewAll: (roomId: number) => void;
}

/**
 * GalleryPreview — групировка фото по комнатам.
 * Показывает max 3 фото с "+N" overlay.
 */
export const GalleryPreview: React.FC<GalleryPreviewProps> = ({
  rooms,
  onViewAll,
}) => {
  return (
    <div className="gallery-preview">
      {rooms.map(room => {
        const photos = room.photos || [];
        const displayPhotos = photos.slice(0, 3);
        const remainingCount = photos.length - 3;

        return (
          <div key={room.id} className="gallery-preview__room">
            <h4 className="gallery-preview__room-name">{room.name}</h4>
            
            <div className="gallery-preview__grid">
              {displayPhotos.map((photo, index) => (
                <div 
                  key={index} 
                  className="gallery-preview__item"
                  onClick={() => onViewAll(room.id)}
                >
                  <img src={photo} alt={`${room.name} ${index + 1}`} />
                  
                  {/* "+N" overlay на последнем фото */}
                  {index === 2 && remainingCount > 0 && (
                    <div className="gallery-preview__overlay">
                      <span>+{remainingCount}</span>
                      <span className="gallery-preview__overlay-text">
                        смотреть все
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GalleryPreview;
