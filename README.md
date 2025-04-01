# Bluegrass Digital - Moble App Developer Assessment

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

## API Endpoints

### Authentication Endpoints
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password
- `POST /auth/verify-email` - Verify email address

### Products Endpoints
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `GET /products/categories` - Get all product categories
- `GET /products/categories/:categoryId` - Get category by ID
- `GET /products/categories/:categoryId/products` - Get products by category
- `GET /products/search/name/:name` - Search products by name
- `POST /products` - Create new product (Admin only)
- `PUT /products/:id` - Update product (Admin only)
- `DELETE /products/:id` - Delete product (Admin only)
- `POST /products/categories` - Create new product category (Admin only)

### Orders Endpoints
- `GET /orders` - Get all orders (Admin only)
- `GET /orders/:id` - Get order by ID
- `GET /orders/user/:userId` - Get orders by user ID
- `POST /orders` - Create new order
- `PUT /orders/:id` - Update order (Admin only)
- `DELETE /orders/:id` - Delete order (Admin only)

### Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: <your_jwt_token>
```

### Response Format
All API responses follow this format:
```json
{
  "data": {}, // The response data
  "message": "", // Optional message
  "error": "" // Optional error message
}
```

### Error Codes
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error
