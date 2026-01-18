import { Star, MapPin } from 'lucide-react';

interface StudioCardProps {
  studio: any;
  onClick?: () => void;
}

export default function StudioCard({ studio, onClick }: StudioCardProps) {
  return (
    <div 
      className="group relative overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md cursor-pointer"
      onClick={onClick}
    >
      {/* Image Placeholder */}
      <div className="h-48 w-full bg-gray-200 object-cover">
        {studio.preview_image ? (
          <img 
            src={studio.preview_image} 
            alt={studio.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-2xl font-bold">{studio.name?.[0] || 'S'}</div>
          </div>
        )}
      </div>
      
      {/* Контент */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg text-gray-900">{studio.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{studio.city}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{studio.rating || '0.0'}</span>
            <span className="text-gray-500">({studio.reviews_count || 0})</span>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">от {studio.min_price} ₸/час</p>
          </div>
        </div>
      </div>
    </div>
  );
}
