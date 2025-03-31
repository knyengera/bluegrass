# Bluegrass

A modern mobile application with a robust backend API.

## Project Structure

The project is divided into two main parts:
- `marble/`: React Native mobile application
- `api/`: Backend API server

## Mobile Application (Marble)

The mobile application is built using React Native with Expo, featuring a modern tech stack and architecture.

### Tech Stack
- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **UI Components**: Gluestack UI
- **Type Safety**: TypeScript

### Key Features
- Modern UI components with Gluestack UI
- Dark mode support
- Type-safe development with TypeScript
- Efficient state management with Zustand
- Responsive design with NativeWind
- Cross-platform support (iOS, Android, Web)

### Project Structure
```
marble/
├── app/           # Main application screens and routing
├── components/    # Reusable UI components
├── hooks/         # Custom React hooks
├── store/         # Zustand state management
├── types/         # TypeScript type definitions
├── api/           # API integration layer
├── assets/        # Static assets (images, fonts)
└── lib/           # Utility functions and shared logic
```

## Backend API

The backend is built with Node.js and Express, featuring a robust database setup with Drizzle ORM.

### Tech Stack
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT with bcrypt
- **Validation**: Zod
- **Type Safety**: TypeScript

### Key Features
- RESTful API architecture
- Secure authentication system
- Database migrations with Drizzle
- Input validation with Zod
- Type-safe development with TypeScript

### Project Structure
```
api/
├── src/           # Source code
├── drizzle/       # Database migrations and schema
├── dist/          # Compiled JavaScript
└── node_modules/  # Dependencies
```

## Getting Started

### Mobile App Setup
1. Navigate to the marble directory:
   ```bash
   cd marble
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

### Backend Setup
1. Navigate to the api directory:
   ```bash
   cd api
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env`
4. Run database migrations:
   ```bash
   npm run db:migrate
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

### Mobile App (.env)
Required environment variables for the mobile app:
- API_URL: Backend API endpoint

### Backend (.env)
Required environment variables for the backend:
- DATABASE_URL: PostgreSQL connection string
- JWT_SECRET: Secret key for JWT token generation
