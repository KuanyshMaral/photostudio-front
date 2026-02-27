import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Home, Users, MapPin, Star, CheckCircle } from 'lucide-react';

export const AuthLanding: React.FC = () => {
  const stats = [
    { number: "500+", label: "Профессиональных студий", icon: Camera },
    { number: "25K+", label: "Довольных клиентов", icon: Users },
    { number: "4.9", label: "Средний рейтинг", icon: Star },
    { number: "99%", label: "Успешных бронирований", icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Navigation */}
      <nav className="flex justify-between items-center px-8 py-6 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900">StudioBooking</span>
        </div>
        <div className="flex items-center space-x-6">
          <Link to="/login" className="text-gray-600 hover:text-gray-900 transition-colors">Войти</Link>
          <Link to="/register" className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-indigo-600 transition-all">
            Начать
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl">
              <Camera className="w-16 h-16 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Идеальные пространства
            <br />
            <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">для творчества</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-16">
            Найдите и забронируйте лучшие фотостудии в вашем городе. Профессиональное оборудование, удобное расположение и доступные цены.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
          
          {/* Client Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mr-4">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Я клиент</h2>
                <p className="text-gray-600 text-sm">Находите и бронируйте студии</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-gray-600" />
                </div>
                <span className="text-sm text-gray-700">Удобная локация</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-gray-600" />
                </div>
                <span className="text-sm text-gray-700">Высокий рейтинг</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-gray-600" />
                </div>
                <span className="text-sm text-gray-700">Настоящие отзывы</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-gray-600" />
                </div>
                <span className="text-sm text-gray-700">Качество</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <Link 
                to="/register?type=client"
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium px-6 py-3 rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all text-center block"
              >
                Начать поиск
              </Link>
              <Link 
                to="/login?type=client"
                className="w-full bg-gray-100 text-gray-700 font-medium px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors text-center block"
              >
                Войти в аккаунт
              </Link>
            </div>
          </div>

          {/* Studio Owner Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mr-4">
                <Home className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Владелец студии</h2>
                <p className="text-gray-600 text-sm">Зарабатывайте на пространстве</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Camera className="w-5 h-5 text-gray-600" />
                </div>
                <span className="text-sm text-gray-700">Публикация</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-gray-600" />
                </div>
                <span className="text-sm text-gray-700">Клиенты</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-gray-600" />
                </div>
                <span className="text-sm text-gray-700">Отзывы</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-gray-600" />
                </div>
                <span className="text-sm text-gray-700">Доход</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <Link 
                to="/register?type=studio_owner"
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium px-6 py-3 rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all text-center block"
              >
                Добавить студию
              </Link>
              <Link 
                to="/login?type=studio_owner"
                className="w-full bg-gray-100 text-gray-700 font-medium px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors text-center block"
              >
                Войти в аккаунт
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Уже есть аккаунт?{' '}
              <Link to="/login" className="text-purple-600 hover:text-purple-700 font-medium transition-colors">
                Войдите
              </Link>
            </p>
            <p className="text-gray-500 mb-4">
              <Link to="/admin/login" className="text-gray-600 hover:text-gray-700 font-medium transition-colors">
                Вход для администраторов
              </Link>
            </p>
            <p className="text-gray-500 text-sm">
              © 2024 StudioBooking. Все права защищены.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLanding;
