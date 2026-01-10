import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Home } from 'lucide-react';

export const AuthLanding: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-blue-600 mb-4">StudioBooking</h1>
          <p className="text-xl text-gray-600">Платформа для аренды фотостудий и творческих пространств</p>
        </div>

        {/* Cards Container */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Client Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow flex flex-col h-full">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <Camera className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Я клиент</h2>
            </div>
            
            <div className="space-y-3 mb-8 flex-grow">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-600">Находите идеальные студии для ваших проектов</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-600">Бронируйте удобное время онлайн</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-600">Оставляйте отзывы и читайте о других</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-600">Управляйте всеми вашими бронированиями</p>
              </div>
            </div>
            
            <div className="space-y-3 mt-auto">
              <Link 
                to="/register?type=client"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors"
              >
                Регистрация
              </Link>
              <Link 
                to="/login?type=client"
                className="block w-full text-blue-600 hover:text-blue-700 font-medium text-center transition-colors"
              >
                Вход
              </Link>
            </div>
          </div>

          {/* Studio Owner Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow flex flex-col h-full">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                <Home className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Я владелец студии</h2>
            </div>
            
            <div className="space-y-3 mb-8 flex-grow">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-600">Размещайте вашу студию на нашей платформе</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-600">Управляйте бронированиями и расписанием</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-600">Получайте отзывы от клиентов</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-600">Увеличивайте вашу прибыль</p>
              </div>
            </div>
            
            <div className="space-y-3 mt-auto">
              <Link 
                to="/register?type=studio_owner"
                className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors"
              >
                Регистрация
              </Link>
              <Link 
                to="/login?type=studio_owner"
                className="block w-full text-indigo-600 hover:text-indigo-700 font-medium text-center transition-colors"
              >
                Вход
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-500">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Войдите
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLanding;
