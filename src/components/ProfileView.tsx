import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { User, Mail, Phone, Building, FileText, MapPin, Edit, Calendar, Clock, Upload, X, File, Image } from 'lucide-react';
import { getUserBookings, type Booking } from '../api/myBookingsApi';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import BookingDetailModal from './BookingDetailModal';

interface ProfileViewProps {
  profile: any;
  onEdit: () => void;
}

export default function ProfileView({ profile, onEdit }: ProfileViewProps) {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<'info' | 'visits' | 'files'>('info');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['profile-bookings'],
    queryFn: () => getUserBookings(undefined, token || ''),
    enabled: !!token,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>;
      case 'cancelled': return <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>;
      case 'confirmed': return <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>;
      default: return <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Завершено';
      case 'cancelled': return 'Отменено';
      case 'confirmed': return 'Подтверждено';
      case 'pending': return 'В ожидании';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files).filter(file => {
      const isValidType = file.type.startsWith('image/') || 
                        file.type === 'application/pdf' || 
                        file.type === 'application/msword' ||
                        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      return isValidType && isValidSize;
    });

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-8 h-8 text-blue-500" />;
    if (file.type === 'application/pdf') return <FileText className="w-8 h-8 text-red-500" />;
    return <File className="w-8 h-8 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes: string[] = [];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const unit = sizes[i] || 'Bytes';
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + unit;
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
        <div className="h-32 md:h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        <div className="px-6 sm:px-8 pb-8">
          <div className="relative flex justify-between items-start -mt-12 sm:-mt-16 mb-4">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white p-1 sm:p-2 shadow-md">
              <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100">
                {profile?.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt="Avatar" 
                    className="w-full h-full rounded-full object-cover" 
                  />
                ) : (
                  <span className="text-3xl sm:text-4xl font-bold text-gray-400">
                    {profile?.name?.[0]?.toUpperCase() || '?'}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-14 sm:mt-16">
              <button
                onClick={onEdit}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm"
              >
                <Edit className="w-4 h-4" />
                Редактировать
              </button>
            </div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{profile?.name}</h1>
            <p className="text-gray-500 flex items-center gap-2 mb-4">
              <Mail className="w-4 h-4" />
              {profile?.email}
            </p>
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                {profile?.role === 'studio_owner' ? 'Владелец студии' : 
                 profile?.role === 'admin' ? 'Администратор' : 'Клиент'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100 overflow-x-auto no-scrollbar">
          <div className="flex min-w-max px-2">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-6 py-4 text-sm font-medium transition-colors relative whitespace-nowrap ${
                activeTab === 'info'
                  ? 'text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50 rounded-t-lg'
              }`}
            >
              Информация
              {activeTab === 'info' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('visits')}
              className={`px-6 py-4 text-sm font-medium transition-colors relative whitespace-nowrap ${
                activeTab === 'visits'
                  ? 'text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50 rounded-t-lg'
              }`}
            >
              Мои посещения 
              <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                {bookings?.length || 0}
              </span>
              {activeTab === 'visits' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`px-6 py-4 text-sm font-medium transition-colors relative whitespace-nowrap ${
                activeTab === 'files'
                  ? 'text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50 rounded-t-lg'
              }`}
            >
              Документы
              <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                {uploadedFiles.length}
              </span>
              {activeTab === 'files' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full"></span>
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8">
          {activeTab === 'info' && (
            <div className="space-y-8">
              {/* Account Statistics */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  Статистика
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {bookings?.length || 0}
                    </div>
                    <div className="text-sm font-medium text-gray-500">Всего бронирований</div>
                  </div>
                  <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {bookings?.filter(b => b.status === 'completed').length || 0}
                    </div>
                    <div className="text-sm font-medium text-gray-500">Завершено посещений</div>
                  </div>
                  <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {bookings?.filter(b => b.status === 'pending' || b.status === 'confirmed').length || 0}
                    </div>
                    <div className="text-sm font-medium text-gray-500">Предстоящие</div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100"></div>

              {/* Contact Information */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  Контактная информация
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                    <div className="p-2.5 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-500">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-0.5">Телефон</p>
                      <p className="font-semibold text-gray-900">{profile?.phone || 'Не указан'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                    <div className="p-2.5 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-500">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-0.5">Email</p>
                      <p className="font-semibold text-gray-900">{profile?.email}</p>
                    </div>
                  </div>

                  {profile?.address && (
                    <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                      <div className="p-2.5 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-500">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-0.5">Адрес</p>
                        <p className="font-semibold text-gray-900">{profile.address}</p>
                      </div>
                    </div>
                  )}

                  {profile?.companyName && (
                    <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                      <div className="p-2.5 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-500">
                        <Building className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-0.5">Компания</p>
                        <p className="font-semibold text-gray-900">{profile.companyName}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Business Information (for studio owners) */}
              {(profile?.bin || profile?.contactPerson) && (
                <>
                  <div className="border-t border-gray-100"></div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                      Информация о бизнесе
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {profile?.bin && (
                        <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                          <div className="p-2.5 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-500">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-0.5">БИН</p>
                            <p className="font-semibold text-gray-900">{profile.bin}</p>
                          </div>
                        </div>
                      )}

                      {profile?.contactPerson && (
                        <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                          <div className="p-2.5 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-500">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-0.5">Контактное лицо</p>
                            <p className="font-semibold text-gray-900">{profile.contactPerson}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'files' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-200 ${
                  isDragging
                    ? 'border-indigo-500 bg-indigo-50/50'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="w-16 h-16 bg-white border border-gray-100 shadow-sm rounded-2xl flex items-center justify-center mx-auto mb-5 text-indigo-500">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Загрузить документы
                </h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                  Перетащите файлы сюда или нажмите кнопку для выбора с компьютера
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 shadow-sm hover:shadow-md cursor-pointer transition-all active:scale-[0.98]"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Выбрать файлы
                </label>
                <p className="text-xs font-medium text-gray-400 mt-4 uppercase tracking-wider">
                  Поддерживаются: Изображения, PDF, Word (До 10MB)
                </p>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-gray-900">
                      Загруженные файлы
                    </h3>
                    <span className="text-sm text-gray-500">{uploadedFiles.length} файла(ов)</span>
                  </div>
                  <div className="space-y-3">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="group flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:border-indigo-200 hover:shadow-sm transition-all"
                      >
                        <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center">
                          {getFileIcon(file)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {formatFileSize(file.size)} • {file.name.split('.').pop()?.toUpperCase()}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Удалить файл"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  {/* Upload Button */}
                  <div className="mt-6 flex justify-end pt-4 border-t border-gray-100">
                    <button
                      className="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-black shadow-sm transition-all flex items-center gap-2 active:scale-[0.98]"
                      onClick={() => {
                        // TODO: Implement actual upload logic
                        setUploadedFiles([]);
                      }}
                    >
                      <Upload className="w-4 h-4" />
                      Сохранить файлы
                    </button>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {uploadedFiles.length === 0 && (
                <div className="text-center py-12 px-4">
                  <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <File className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-medium text-gray-900 mb-1">
                    Нет загруженных файлов
                  </h3>
                  <p className="text-sm text-gray-500">
                    Загрузите документы или изображения для вашего профиля
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'visits' && (
            <div className="space-y-4">
              {bookingsLoading ? (
                <div className="py-12">
                  <LoadingSpinner />
                </div>
              ) : !bookings || bookings.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Calendar className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-medium text-gray-900 mb-1">Нет посещений</h3>
                  <p className="text-sm text-gray-500">У вас пока нет ни одного бронирования</p>
                </div>
              ) : (
                bookings.map((booking: Booking) => (
                  <div 
                    key={booking.id} 
                    className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer group"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {booking.room_name || 'Зал'}
                        </h4>
                        <p className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-wider">
                          Бронь #{booking.id}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(booking.status)}
                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                          booking.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                          booking.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                          'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {getStatusLabel(booking.status)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg mb-4">
                      <div className="flex items-center gap-2.5 text-sm text-gray-700 font-medium">
                        <div className="text-gray-400">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <span>{formatDate(booking.start_time)}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-sm text-gray-700 font-medium">
                        <div className="text-gray-400">
                          <Clock className="w-4 h-4" />
                        </div>
                        <span>
                          {new Date(booking.start_time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })} - 
                          {new Date(booking.end_time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs text-gray-400 font-medium">
                      <span>Создано: {formatDate(booking.created_at)}</span>
                      <span className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">Подробнее &rarr;</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
}
