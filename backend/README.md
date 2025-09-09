# SplitEase Backend API

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Update `.env` file with your MongoDB URI and JWT secret:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/splitease
   JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
   JWT_EXPIRE=30d
   NODE_ENV=production
   FRONTEND_URL=http://localhost:5173
   ```

3. **Run the Server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create expense
- `GET /api/expenses/:id` - Get single expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/category/:category` - Get by category

### Groups
- `GET /api/groups` - Get user groups
- `POST /api/groups` - Create group
- `GET /api/groups/:id` - Get group details
- `PUT /api/groups/:id` - Update group
- `DELETE /api/groups/:id` - Delete group

### Analytics
- `GET /api/analytics/summary` - Dashboard summary
- `GET /api/analytics/monthly` - Monthly data
- `GET /api/analytics/category` - Category breakdown
- `GET /api/analytics/trends` - Spending trends

## Features

✅ JWT Authentication
✅ Password Hashing
✅ Input Validation
✅ Error Handling
✅ MongoDB Integration
✅ Group Expense Splitting
✅ Analytics & Reports
✅ Production Ready