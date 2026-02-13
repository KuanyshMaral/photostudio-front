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

  const getStatusIcon = (status: string) => null;
  const getStatusColor = (status: string) => '';
  const getStatusLabel = (status: string) => status;

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
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden border-3 border-white/30">
            {profile?.avatar ? (
              <img 
                src={profile.avatar} 
                alt="Avatar" 
                className="w-full h-full rounded-full object-cover" 
              />
            ) : (
              <span className="text-3xl font-bold">
                {profile?.name?.[0]?.toUpperCase() || '?'}
              </span>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{profile?.name}</h1>
            <p className="text-white/80 flex items-center gap-2 mb-3">
              <Mail className="w-4 h-4" />
              {profile?.email}
            </p>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                {profile?.role === 'studio_owner' ? 'Владелец студии' : 
                 profile?.role === 'admin' ? 'Администратор' : 'Клиент'}
              </span>
              <button
                onClick={onEdit}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-white/90 transition-colors flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Редактировать
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'info'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Информация об аккаунте
            </button>
            <button
              onClick={() => setActiveTab('visits')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'visits'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Мои посещения ({bookings?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'files'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Upload Files ({uploadedFiles.length})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Контактная информация</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Телефон</p>
                      <p className="font-medium">{profile?.phone || 'Не указан'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{profile?.email}</p>
                    </div>
                  </div>

                  {profile?.address && (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-500">Адрес</p>
                        <p className="font-medium">{profile.address}</p>
                      </div>
                    </div>
                  )}

                  {profile?.companyName && (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <Building className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-500">Компания</p>
                        <p className="font-medium">{profile.companyName}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Business Information (for studio owners) */}
              {(profile?.bin || profile?.contactPerson) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Информация о бизнесе</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile?.bin && (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-sm text-gray-500">БИН</p>
                          <p className="font-medium">{profile.bin}</p>
                        </div>
                      </div>
                    )}

                    {profile?.contactPerson && (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <User className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-sm text-gray-500">Контактное лицо</p>
                          <p className="font-medium">{profile.contactPerson}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Account Statistics */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Статистика аккаунта</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {bookings?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Всего бронирований</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {bookings?.filter(b => b.status === 'completed').length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Завершено посещений</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-600 mb-1">
                      {bookings?.filter(b => b.status === 'pending' || b.status === 'confirmed').length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Предстоящие</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="space-y-6">
              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Upload Files
                </h3>
                <p className="text-gray-600 mb-4">
                  Drag and drop files here, or click to select files
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Supported formats: Images, PDF, Word documents (Max 10MB)
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
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Select Files
                </label>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Uploaded Files ({uploadedFiles.length})
                  </h3>
                  <div className="space-y-3">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-shrink-0">
                          {getFileIcon(file)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(file.size)} • {file.type}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove file"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  {/* Upload Button */}
                  <div className="mt-6 flex justify-end">
                    <button
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                      onClick={() => {
                        // TODO: Implement actual upload logic
                        setUploadedFiles([]);
                      }}
                    >
                      <Upload className="w-4 h-4" />
                      Upload All Files
                    </button>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {uploadedFiles.length === 0 && (
                <div className="text-center py-12">
                  <File className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No files uploaded
                  </h3>
                  <p className="text-gray-500">
                    Upload files to manage your documents and images
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'visits' && (
            <div className="space-y-4">
              {bookingsLoading ? (
                <LoadingSpinner />
              ) : !bookings || bookings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Нет посещений</h3>
                  <p className="text-gray-500">У вас пока нет ни одного бронирования</p>
                </div>
              ) : (
                bookings.map((booking: Booking) => (
                  <div 
                    key={booking.id} 
                    className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {booking.room_name || 'Зал'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          ID бронирования: #{booking.id}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(booking.status)}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                          {getStatusLabel(booking.status)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(booking.start_time)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>
                          {new Date(booking.start_time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })} - 
                          {new Date(booking.end_time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
                      Создано: {formatDate(booking.created_at)}
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
