export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
      {/* Изображение */}
      <div className="h-48 bg-gray-200"></div>
      
      {/* Контент */}
      <div className="p-4 space-y-3">
        {/* Название */}
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        
        {/* Адрес */}
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        
        {/* Рейтинг и цена */}
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        
        {/* Кнопка */}
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}
