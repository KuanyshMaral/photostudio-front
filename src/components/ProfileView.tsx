import { User, Mail, Phone, Building, FileText, MapPin, Edit } from 'lucide-react';

interface ProfileViewProps {
  profile: any;
  onEdit: () => void;
}

export default function ProfileView({ profile, onEdit }: ProfileViewProps) {
  return (
    <div className="space-y-6">
      {/* Avatar and basic info */}
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          {profile?.avatar ? (
            <img 
              src={profile.avatar} 
              alt="Avatar" 
              className="w-full h-full rounded-full object-cover" 
            />
          ) : (
            <span className="text-3xl font-bold text-gray-500">
              {profile?.name?.[0]?.toUpperCase() || '?'}
            </span>
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">{profile?.name}</h2>
          <p className="text-gray-600 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            {profile?.email}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {profile?.role === 'studio_owner' ? 'Владелец студии' : 
               profile?.role === 'admin' ? 'Администратор' : 'Клиент'}
            </span>
          </div>
        </div>
      </div>

      {/* Profile information */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Информация о профиле</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Телефон</p>
              <p className="font-medium">{profile?.phone || 'Не указан'}</p>
            </div>
          </div>

          {profile?.companyName && (
            <div className="flex items-center gap-3">
              <Building className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Компания</p>
                <p className="font-medium">{profile.companyName}</p>
              </div>
            </div>
          )}

          {profile?.bin && (
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">БИН</p>
                <p className="font-medium">{profile.bin}</p>
              </div>
            </div>
          )}

          {profile?.address && (
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Адрес</p>
                <p className="font-medium">{profile.address}</p>
              </div>
            </div>
          )}

          {profile?.contactPerson && (
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Контактное лицо</p>
                <p className="font-medium">{profile.contactPerson}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Edit className="w-4 h-4" />
          Редактировать профиль
        </button>
        
        {/* Password change disabled until backend implements endpoint */}
        <button
          disabled
          className="px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed opacity-50"
          title="Смена пароля временно недоступна"
        >
          Сменить пароль
        </button>
      </div>
    </div>
  );
}
