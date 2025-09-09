# SplitEase - Expense Sharing App

SplitEase is a full-stack, production-ready expense sharing application. It allows users to create groups, add members, split expenses, track debts, and view analytics in real time. Built with a modern tech stack, it is suitable for roommates, friends, trips, offices, and families.

## Features
- User registration and login (MongoDB, JWT)
- Create and join groups by invite code
- Add members by email
- Add, split, and track expenses
- Mark debts as paid (settlements)
- Real-time balance and debt tracking
- Analytics: charts, category breakdown, trends
- Smart caching and real-time updates
- Responsive UI and production-ready backend

## Quick Start
See [SETUP.md](./SETUP.md) for detailed setup instructions.

## API Endpoints
- Authentication: `/api/auth/*`
- Groups: `/api/groups/*`
- Expenses: `/api/expenses/*`
- Settlements: `/api/settlements/*`
- Analytics: `/api/analytics/*`

## Usage Flow
1. Register and log in
2. Create or join a group
3. Add members by email
4. Add and split expenses
5. Track and settle debts
6. View analytics and reports

## Tech Stack
- Backend: Node.js, Express, MongoDB
- Frontend: React, Vite
- Auth: JWT, bcrypt

## License
MIT

For setup, troubleshooting, and full feature list, see [SETUP.md](./SETUP.md).

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account or local MongoDB instance

### Clone the Repository
```bash
git clone https://github.com/pranavisback/Expense_Tracker.git
cd Expense_Tracker/fullstack-app
```

### Backend Setup
```bash
cd backend
npm install
```

#### Configure Environment Variables
Create a `.env` file in the `backend` folder with the following content:
```env
PORT=5000
MONGDB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
NODE_ENV=production
FRONTEND_URL=http://localhost:5173
```

#### Start Backend Server
```bash
npm run dev
```
Backend will run on: http://localhost:5000

### Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
Frontend will run on: http://localhost:5173
