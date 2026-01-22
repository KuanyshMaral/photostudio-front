import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyStudios, getStudioBookings, updateBookingStatus, type OwnerBooking, type OwnerStudio } from '../../api/ownerApi';
import { getConversations, type Conversation } from '../chat/chat.api';
import ChatModal from '../../components/ChatModal';
import { MessageCircle, Calendar, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function OwnerDashboard() {
  const { token } = useAuth();
  const [studios, setStudios] = useState<OwnerStudio[]>([]);
  const [bookings, setBookings] = useState<OwnerBooking[]>([]);
  const [selectedStudio, setSelectedStudio] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  
  // Chat state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [chatConversation, setChatConversation] = useState<Conversation | null>(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'bookings' | 'chats'>('bookings');

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      
      try {
        // Get owner's studios
        const studiosData = await getMyStudios(token);
        setStudios(studiosData);
        
        // Get owner's conversations
        const conversationsData = await getConversations(token);
        setConversations(conversationsData.conversations);
        
        // If there are studios, get bookings for the first one
        if (studiosData.length > 0) {
          const firstStudio = studiosData[0];
          setSelectedStudio(firstStudio.id);
          const bookingsData = await getStudioBookings(token, firstStudio.id);
          setBookings(bookingsData);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error('Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleStudioChange = async (studioId: number) => {
    if (!token) return;
    
    try {
      setSelectedStudio(studioId);
      const bookingsData = await getStudioBookings(token, studioId);
      setBookings(bookingsData);
    } catch (error) {
      toast.error('Не удалось загрузить бронирования');
    }
  };

  const handleConfirmBooking = async (bookingId: number) => {
    if (!token) return;
    
    setActionLoading(bookingId);
    
    try {
      await updateBookingStatus(token, bookingId, 'confirmed');
      toast.success('Бронирование подтверждено');
      
      // Refresh bookings
      if (selectedStudio) {
        const bookingsData = await getStudioBookings(token, selectedStudio);
        setBookings(bookingsData);
      }
    } catch (error) {
      toast.error('Ошибка при подтверждении бронирования');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectBooking = async (bookingId: number) => {
    if (!token) return;
    
    setActionLoading(bookingId);
    
    try {
      await updateBookingStatus(token, bookingId, 'cancelled');
      toast.success('Бронирование отклонено');
      
      // Refresh bookings
      if (selectedStudio) {
        const bookingsData = await getStudioBookings(token, selectedStudio);
        setBookings(bookingsData);
      }
    } catch (error) {
      toast.error('Ошибка при отклонении бронирования');
    } finally {
      setActionLoading(null);
    }
  };

  const handleOpenChat = (conversation: Conversation) => {
    setChatConversation(conversation);
    setShowChatModal(true);
  };

  const handleCloseChat = () => {
    setShowChatModal(false);
    setChatConversation(null);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'confirmed': return 'Подтверждено';
      case 'pending': return 'Ожидает';
      case 'cancelled': return 'Отменено';
      case 'completed': return 'Завершено';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <span className="ml-3 text-gray-600">Загрузка...</span>
        </div>
      </div>
    );
  }

  if (studios.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">У вас нет студий</h2>
          <p className="text-gray-600">Сначала зарегистрируйте студию, чтобы управлять бронированиями.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Панель владельца студии</h1>
        
        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link 
            to="/manager/bookings"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
          >
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Календарь</h3>
                <p className="text-sm text-gray-600">Управление бронированиями</p>
              </div>
            </div>
          </Link>

          <Link 
            to="/manager/clients"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
          >
            <div className="flex items-center">
              <Users className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Клиенты</h3>
                <p className="text-sm text-gray-600">База клиентов</p>
              </div>
            </div>
          </Link>
        </div>
        
        {/* Studio Selector */}
        {studios.length > 1 && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Выберите студию:
            </label>
            <select
              value={selectedStudio || ''}
              onChange={(e) => handleStudioChange(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {studios.map(studio => (
                <option key={studio.id} value={studio.id}>
                  {studio.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'bookings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Бронирования ({bookings.length})
              </button>
              <button
                onClick={() => setActiveTab('chats')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'chats'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Чаты ({conversations.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'bookings' ? (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Бронирования ({bookings.length})
              </h2>
            </div>
            
            {bookings.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 text-lg">Нет бронирований</div>
                <p className="text-gray-500 mt-2">Когда клиенты забронируют вашу студию, они появятся здесь.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <div key={booking.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {booking.room_name || `Комната ${booking.room_id}`}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Клиент: ID #{booking.user_id}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatDate(booking.start_time)} - {formatDate(booking.end_time)}
                        </p>
                        {booking.total_price && (
                          <p className="text-sm text-gray-600 mt-1">
                            Цена: {booking.total_price} ₸
                          </p>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                    </div>
                    
                    {booking.status === 'pending' && (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleConfirmBooking(booking.id)}
                          disabled={actionLoading === booking.id}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {actionLoading === booking.id ? '...' : 'Подтвердить'}
                        </button>
                        <button
                          onClick={() => handleRejectBooking(booking.id)}
                          disabled={actionLoading === booking.id}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {actionLoading === booking.id ? '...' : 'Отклонить'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Чаты с клиентами ({conversations.length})
              </h2>
            </div>
            
            {conversations.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 text-lg">Нет чатов</div>
                <p className="text-gray-500 mt-2">Когда клиенты начнут чат с вами, он появится здесь.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {conversations.map((conversation) => (
                  <div 
                    key={conversation.id} 
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleOpenChat(conversation)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-5 h-5 text-blue-600" />
                          <h3 className="text-lg font-semibold text-gray-900">
                            {conversation.other_user.name}
                          </h3>
                        </div>
                        {conversation.studio && (
                          <p className="text-sm text-gray-600 mt-1">
                            Студия: {conversation.studio.name}
                          </p>
                        )}
                        {conversation.last_message && (
                          <p className="text-sm text-gray-500 mt-1 truncate">
                            {conversation.last_message.content}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">
                          {new Date(conversation.last_message_at).toLocaleDateString('ru-RU')}
                        </p>
                        {conversation.unread_count > 0 && (
                          <span className="inline-block mt-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                            {conversation.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chat Modal */}
      <ChatModal
        conversation={chatConversation}
        isOpen={showChatModal}
        onClose={handleCloseChat}
      />
    </div>
  );
}
