# StudioBooking Frontend

Фронтенд для платформы бронирования фотостудий.

## 📁 Структура проекта

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/          # React компоненты
│   │   ├── StudioCard.tsx
│   │   ├── FilterPanel.tsx
│   │   ├── StudioDetailModal.tsx
│   │   └── Pagination.tsx
│   ├── types/              # TypeScript типы
│   │   └── index.ts
│   ├── services/           # API сервисы
│   │   └── api.ts
│   ├── data/               # Mock данные
│   │   └── mockData.ts
│   ├── App.tsx             # Главный компонент
│   ├── index.tsx           # Entry point
│   └── index.css           # Стили
├── .env.example            # Пример переменных окружения
├── package.json
├── tsconfig.json
└── tailwind.config.js
```

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка переменных окружения

Скопируйте `.env.example` в `.env`:

```bash
cp .env.example .env
```

Отредактируйте `.env` и укажите URL вашего backend API:

```
REACT_APP_API_URL=http://localhost:8080/api/v1
```

### 3. Запуск в режиме разработки

```bash
npm start
```

Приложение откроется по адресу [http://localhost:3000](http://localhost:3000)

### 4. Сборка для production

```bash
npm run build
```

Готовые файлы будут в папке `build/`

## 🔌 Интеграция с Backend

По умолчанию используются **mock данные** из `src/data/mockData.ts`.

Для подключения реального API:

1. Откройте `src/App.tsx`
2. Раскомментируйте строки с `catalogAPI`
3. Закомментируйте строки с mock данными

```typescript
// Было:
setStudios(mockStudios);

// Станет:
const response = await catalogAPI.getStudios(filters, currentPage, studiosPerPage);
if (response.success) {
  setStudios(response.data.studios);
}
```

## 📋 Реализованные функции

### ✅ Day 1-2
- [x] Структура проекта с TypeScript
- [x] Компонент карточки студии
- [x] Список студий с grid layout
- [x] Фильтры (город, цена, тип зала)
- [x] Поиск по названию
- [x] Пагинация

### ✅ Day 3
- [x] Модальное окно деталей студии
- [x] Вкладки: Обзор, Галерея, Оборудование, Отзывы
- [x] Отображение списка залов
- [x] Информация об оборудовании

### 🔜 Day 4-5 (TODO)
- [ ] Форма создания студии (для владельцев)
- [ ] Страница "Мои студии"
- [ ] Форма добавления залов
- [ ] Unit тесты
- [ ] Loading states и skeleton screens
- [ ] Error boundaries

## 🛠 Технологии

- **React 18** - UI библиотека
- **TypeScript** - Типизация
- **Tailwind CSS** - Стили
- **Lucide React** - Иконки
- **Axios** - HTTP клиент

## 📝 Основные компоненты

### StudioCard
Карточка студии в списке

```tsx
<StudioCard studio={studio} onClick={handleClick} />
```

### FilterPanel
Панель фильтров

```tsx
<FilterPanel 
  filters={filters} 
  onChange={setFilters} 
  onClose={handleClose} 
/>
```

### StudioDetailModal
Детальная информация о студии

```tsx
<StudioDetailModal 
  studio={studio}
  rooms={rooms}
  onClose={handleClose} 
/>
```

### Pagination
Пагинация списка

```tsx
<Pagination 
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
/>
```

## 🎨 Tailwind CSS

Проект использует Tailwind CSS для стилизации. Основные утилиты:

- `bg-blue-600` - фон
- `text-white` - текст
- `rounded-lg` - скругление
- `shadow-md` - тень
- `hover:scale-[1.02]` - анимация при наведении

## 📱 Адаптивность

Все компоненты адаптированы для мобильных устройств:

```tsx
// Grid адаптируется
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3

// Модальные окна
max-w-4xl w-full max-h-[90vh] overflow-y-auto
```

## 🔧 Настройка

### API сервис (`src/services/api.ts`)

Добавлен JWT токен в headers:

```typescript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Типы данных (`src/types/index.ts`)

Все типы соответствуют backend API:

```typescript
interface Studio {
  id: number;
  name: string;
  address: string;
  rating: number;
  // ...
}
```

## 🐛 Отладка

### Включить React DevTools

1. Установите расширение React DevTools для браузера
2. Откройте DevTools (F12)
3. Перейдите на вкладку "Components"

### Логирование

Добавьте `console.log` для отладки:

```typescript
console.log('Loaded studios:', studios);
console.log('Current filters:', filters);
```

## 📦 Deployment

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Загрузите папку build/ на Netlify
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npx", "serve", "-s", "build", "-l", "3000"]
```

## 🤝 Вклад

1. Fork проекта
2. Создайте feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit изменения (`git commit -m 'Add some AmazingFeature'`)
4. Push в branch (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

## 📄 Лицензия

MIT License - смотрите файл LICENSE

## 👥 Авторы

Team 3 - Catalog Module
- Backend Developer 3
- Frontend Developer 3

## 📞 Контакты

Вопросы? Пишите в Telegram: @your_username

---

**Версия:** 1.0.0  
**Дата:** 25.12.2025