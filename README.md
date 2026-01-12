# Unified Studio App

A comprehensive photo studio booking platform that combines features from 3 separate projects into one unified application.

## 🎯 Features

### Authentication System (from Amir & Yerkanat projects)
- User login and registration
- Studio owner registration
- Profile management
- Protected routes

### Studio Catalog (from Amir project)
- Browse photo studios
- Advanced filtering (city, price, type)
- Search functionality
- Studio details and reviews
- Pagination

### Booking System (from Kiryu project)
- Room booking forms
- Availability calendar
- My bookings management
- Review system (write and read reviews)

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Start development server
```bash
npm run dev
```

### 3. Build for production
```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/          # Shared UI components
├── features/           # Feature modules
│   ├── auth/          # Authentication features
│   ├── booking/       # Booking system
│   └── catalog/       # Studio catalog
├── api/               # API services
├── context/           # React contexts
├── types/             # TypeScript types
├── services/          # External services
├── data/              # Mock data
└── lib/               # Utility libraries
```

## 🛠 Technologies

- **React 19** - UI framework
- **TypeScript** - Type safety
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications
- **Vite** - Build tool

## 🌐 Available Routes

### Public Routes
- `/login` - User login
- `/register` - User registration
- `/studio-register` - Studio owner registration
- `/studios` - Browse studios
- `/studios/:id` - Studio details

### Protected Routes (require authentication)
- `/` - Dashboard
- `/profile` - User profile
- `/booking` - Book a studio
- `/availability` - Check availability
- `/my-bookings` - View bookings
- `/write-review` - Write a review
- `/reviews` - View reviews

## 🔧 Configuration

The project uses mock data by default. To connect to a real API:

1. Update API endpoints in `src/services/api.ts`
2. Configure environment variables
3. Replace mock data with real API calls

## 📱 Responsive Design

All components are fully responsive and work on:
- Desktop (1200px+)
- Tablet (768px-1199px)
- Mobile (320px-767px)

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with UI
npm run test:ui
```

## 📝 Development Notes

This unified application combines:
- **Kiryu Project**: Booking and review system
- **Amir Project**: Authentication and studio catalog
- **Yerkanat Project**: Enhanced authentication with context

All conflicts have been resolved and features are integrated seamlessly.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License
