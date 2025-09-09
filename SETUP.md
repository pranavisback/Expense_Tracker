# SplitEase Setup Guide

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
```

### 2. Update Environment Variables
Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/splitease
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
JWT_EXPIRE=30d
NODE_ENV=production
FRONTEND_URL=http://localhost:5173
```

### 3. Start Backend Server
```bash
npm run dev
```
Backend will run on: http://localhost:5000

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on: http://localhost:5173

## ✅ What's Working Now

### Authentication
- ✅ Real user registration with MongoDB
- ✅ Real user login with JWT tokens
- ✅ Password hashing with bcrypt
- ✅ Protected routes with JWT validation
- ✅ Proper logout functionality

### Expense Management
- ✅ Create expenses with real API
- ✅ View expenses from database
- ✅ User-specific expense filtering
- ✅ Real-time expense totals
- ✅ Category-based organization

### Dashboard
- ✅ Real expense data display
- ✅ Monthly analytics from API
- ✅ Loading states and error handling
- ✅ Responsive design

### API Endpoints Available
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/expenses` - Get user expenses
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/analytics/summary` - Dashboard analytics

## 🔧 Testing

1. Start both backend and frontend
2. Register a new user account
3. Login with your credentials
4. Add some expenses
5. View them on the dashboard

## 📝 Notes

- No more demo/mock data
- All authentication is real MongoDB-based
- JWT tokens are properly managed
- Expenses are saved to database
- Ready for production deployment