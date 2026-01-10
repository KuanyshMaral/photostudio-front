import React from 'react';
import { Link } from 'react-router-dom';
import { User, Briefcase } from 'lucide-react';

export const AuthLanding: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-purple-600 mb-4">MWork</h1>
          <p className="text-xl text-gray-600">Платформа для моделей и работодателей в мире моды, рекламы, блогинга и искусства</p>
        </div>

        {/* Cards Container */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Model Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow flex flex-col h-full">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <User className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Я модель</h2>
            </div>
            
            <div className="space-y-3 mb-8 flex-grow">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-600">Создайте профессиональный профиль и портфолио</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-600">Находите кастинги и работу от лучших работодателей</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-600">Общайтесь напрямую с работодателями</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-600">Управляйте своим расписанием и портфолио</p>
              </div>
            </div>
            
            <div className="space-y-3 mt-auto">
              <Link 
                to="/register?type=model"
                className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors"
              >
                Регистрация
              </Link>
              <Link 
                to="/login?type=model"
                className="block w-full text-purple-600 hover:text-purple-700 font-medium text-center transition-colors"
              >
                Вход
              </Link>
            </div>
          </div>

          {/* Employer Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow flex flex-col h-full">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <Briefcase className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Я работодатель</h2>
            </div>
            
            <div className="space-y-3 mb-8 flex-grow">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-600">Находите идеальных моделей для ваших проектов</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-600">Создавайте кастинги и управляйте откликами</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-600">Управляйте командами и проектами</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-600">Поиск моделей по параметрам и аналитика</p>
              </div>
            </div>
            
            <div className="space-y-3 mt-auto">
              <Link 
                to="/register?type=employer"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors"
              >
                Регистрация
              </Link>
              <Link 
                to="/login?type=employer"
                className="block w-full text-blue-600 hover:text-blue-700 font-medium text-center transition-colors"
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
            <Link to="/login" className="text-purple-600 hover:text-purple-700 font-medium">
              Войдите
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLanding;
