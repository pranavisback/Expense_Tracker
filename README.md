# 💰 SplitEase - Smart Expense Sharing Application

<div align="center">

![SplitEase Logo](https://img.shields.io/badge/SplitEase-Expense%20Tracker-4CAF50?style=for-the-badge&logo=cash-app&logoColor=white)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)

**A modern, full-stack expense sharing application for seamless group expense management**

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [API Documentation](#-api-documentation)
- [Usage Guide](#-usage-guide)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Overview

SplitEase is a production-ready expense sharing application designed to simplify group expense management. Whether you're splitting bills with roommates, organizing trip expenses with friends, managing office expenses, or tracking family budgets, SplitEase provides an intuitive platform for transparent and hassle-free expense tracking.

### 🚀 Key Highlights

- **Real-time Updates**: Instant synchronization across all group members
- **Smart Splitting**: Multiple split options (equal, percentage, custom amounts)
- **Debt Simplification**: Automatic calculation of optimal settlement paths
- **Comprehensive Analytics**: Visual insights into spending patterns
- **Secure & Scalable**: JWT authentication with MongoDB backend
- **Mobile Responsive**: Seamless experience across all devices

## ✨ Features

### 👤 User Management
- ✅ Secure user registration and authentication
- ✅ Profile management with avatar support
- ✅ Password recovery and reset functionality
- ✅ Session management with JWT tokens

### 👥 Group Management
- ✅ Create unlimited expense groups
- ✅ Invite members via unique invite codes
- ✅ Add members by email address
- ✅ Role-based permissions (Admin, Member)
- ✅ Group settings and customization

### 💸 Expense Tracking
- ✅ Add expenses with multiple payers
- ✅ Split expenses equally or by custom amounts
- ✅ Categorize expenses (Food, Transport, Accommodation, etc.)
- ✅ Attach receipts and notes
- ✅ Edit and delete expense records
- ✅ Recurring expense support

### 💳 Settlement & Balances
- ✅ Real-time balance calculation
- ✅ Smart debt simplification algorithm
- ✅ Mark settlements as paid
- ✅ Settlement history tracking
- ✅ Payment reminders

### 📊 Analytics & Reports
- ✅ Interactive charts and graphs
- ✅ Category-wise expense breakdown
- ✅ Monthly/Weekly spending trends
- ✅ Individual contribution analysis
- ✅ Export reports (PDF/CSV)

### 🔔 Notifications
- ✅ Email notifications for new expenses
- ✅ Payment reminders
- ✅ Group activity updates
- ✅ Customizable notification preferences

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web application framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | ODM for MongoDB |
| **JWT** | Authentication |
| **Bcrypt** | Password hashing |
| **Nodemailer** | Email services |
| **Express Validator** | Input validation |

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI library |
| **Vite** | Build tool |
| **React Router** | Client-side routing |
| **Axios** | HTTP client |
| **Chart.js** | Data visualization |
| **Tailwind CSS** | Styling |
| **React Query** | Server state management |
| **React Hook Form** | Form handling |

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend (React)                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │ Components  │  │   Services  │  │    Store    │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────────┬───────────────────────────────┘
                          │ HTTP/WebSocket
┌─────────────────────────┴───────────────────────────────┐
│                    Backend (Express)                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │ Controllers │  │   Services  │  │ Middleware  │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────┴───────────────────────────────┐
│                   Database (MongoDB)                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │    Users    │  │   Groups    │  │  Expenses   │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────────────────────────────────────────┘
```

## 📦 Installation

### Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16.0.0 or higher)
- [npm](https://www.npmjs.com/) (v7.0.0 or higher)
- [MongoDB](https://www.mongodb.com/) (v4.4 or higher) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- [Git](https://git-scm.com/)

### 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/pranavisback/Expense_Tracker.git
   cd Expense_Tracker/fullstack-app
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # In backend directory
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the application**
   ```bash
   # Start backend (from backend directory)
   npm run dev

   # Start frontend (from frontend directory)
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/splitease
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/splitease

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
COOKIE_EXPIRE=30

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@splitease.com
FROM_NAME=SplitEase

# File Upload (Optional)
MAX_FILE_UPLOAD=10000000
FILE_UPLOAD_PATH=./public/uploads

# Rate Limiting (Optional)
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000

# Application Settings
VITE_APP_NAME=SplitEase
VITE_APP_VERSION=1.0.0

# Feature Flags (Optional)
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | User login | No |
| GET | `/auth/logout` | User logout | Yes |
| GET | `/auth/me` | Get current user | Yes |
| PUT | `/auth/updateprofile` | Update user profile | Yes |
| PUT | `/auth/updatepassword` | Update password | Yes |
| POST | `/auth/forgotpassword` | Request password reset | No |
| PUT | `/auth/resetpassword/:token` | Reset password | No |

### Group Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/groups` | Get user's groups | Yes |
| POST | `/groups` | Create new group | Yes |
| GET | `/groups/:id` | Get group details | Yes |
| PUT | `/groups/:id` | Update group | Yes |
| DELETE | `/groups/:id` | Delete group | Yes |
| POST | `/groups/:id/members` | Add member to group | Yes |
| DELETE | `/groups/:id/members/:userId` | Remove member | Yes |
| POST | `/groups/join` | Join group by code | Yes |

### Expense Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/expenses/group/:groupId` | Get group expenses | Yes |
| POST | `/expenses` | Create expense | Yes |
| GET | `/expenses/:id` | Get expense details | Yes |
| PUT | `/expenses/:id` | Update expense | Yes |
| DELETE | `/expenses/:id` | Delete expense | Yes |

### Settlement Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/settlements/group/:groupId` | Get group settlements | Yes |
| POST | `/settlements` | Create settlement | Yes |
| PUT | `/settlements/:id` | Update settlement | Yes |
| DELETE | `/settlements/:id` | Delete settlement | Yes |

### Analytics Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/analytics/group/:groupId` | Get group analytics | Yes |
| GET | `/analytics/user/:userId` | Get user analytics | Yes |
| GET | `/analytics/trends/:groupId` | Get spending trends | Yes |

### Example API Calls

**Register User**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

**Create Group**
```bash
curl -X POST http://localhost:5000/api/groups \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Weekend Trip",
    "description": "Trip to mountains",
    "currency": "USD"
  }'
```

## 📱 Usage Guide

### Getting Started

1. **Create an Account**
   - Navigate to the registration page
   - Enter your name, email, and password
   - Verify your email (if enabled)

2. **Create or Join a Group**
   - Click "Create Group" to start a new expense group
   - Or enter an invite code to join an existing group

3. **Add Members**
   - Go to group settings
   - Add members by email or share the invite code

4. **Add Expenses**
   - Click "Add Expense"
   - Enter amount, description, and category
   - Select who paid and how to split

5. **Track Balances**
   - View real-time balances on the dashboard
   - See who owes whom and how much

6. **Settle Debts**
   - Click on a debt to mark it as settled
   - Add settlement notes if needed

7. **View Analytics**
   - Navigate to the Analytics section
   - View spending trends and category breakdowns

## 🔧 Development

### Project Structure

```
Expense_Tracker/
├── fullstack-app/
│   ├── backend/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   ├── validators/     # Input validators
│   │   ├── .env.example    # Environment variables example
│   │   ├── server.js       # Entry point
│   │   └── package.json
│   │
│   └── frontend/
│       ├── public/         # Static files
│       ├── src/
│       │   ├── components/ # React components
│       │   ├── pages/      # Page components
│       │   ├── services/   # API services
│       │   ├── hooks/      # Custom hooks
│       │   ├── utils/      # Utility functions
│       │   ├── styles/     # CSS/SCSS files
│       │   ├── App.jsx     # Main App component
│       │   └── main.jsx    # Entry point
│       ├── .env.example    # Environment variables example
│       └── package.json
├── docs/                   # Documentation
├── scripts/               # Utility scripts
└── README.md
```

### Development Commands

**Backend**
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

**Frontend**
```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Lint code
npm run lint
```

### Code Style Guide

- Use ES6+ features
- Follow Airbnb JavaScript Style Guide
- Use async/await for asynchronous operations
- Implement proper error handling
- Write meaningful commit messages
- Add JSDoc comments for functions

## 🧪 Testing

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e
```

### Test Coverage

```bash
# Generate coverage report
npm run test:coverage
```

## 🚀 Deployment

### Deploy to Production

#### Using Docker

1. **Build Docker images**
   ```bash
   docker-compose build
   ```

2. **Run containers**
   ```bash
   docker-compose up -d
   ```

#### Using Traditional Hosting

**Backend Deployment (Heroku)**
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create Heroku app
heroku create splitease-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_production_mongodb_uri
heroku config:set JWT_SECRET=your_production_secret

# Deploy
git push heroku main
```

**Frontend Deployment (Vercel/Netlify)**
```bash
# Build the frontend
cd frontend
npm run build

# Deploy to Vercel
vercel --prod

# Or deploy to Netlify
netlify deploy --prod
```

### Production Checklist

- [ ] Set strong JWT secret
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable request logging
- [ ] Configure error monitoring (Sentry)
- [ ] Set up backup strategy
- [ ] Configure CDN for static assets
- [ ] Enable caching
- [ ] Set up CI/CD pipeline

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Write clean, maintainable code
- Add tests for new features
- Update documentation as needed
- Follow the existing code style
- Create detailed pull request descriptions

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape SplitEase
- Special thanks to the open-source community
- Icons by [Lucide Icons](https://lucide.dev/)
- UI components inspired by [Tailwind UI](https://tailwindui.com/)

## 📞 Support

- 📧 Email: support@splitease.com
- 💬 Discord: [Join our community](https://discord.gg/splitease)
- 📖 Documentation: [Read the docs](https://docs.splitease.com)
- 🐛 Issues: [Report bugs](https://github.com/pranavisback/Expense_Tracker/issues)

## 🗺 Roadmap

### Version 2.0 (Q1 2025)
- [ ] Mobile app (React Native)
- [ ] Multi-currency support
- [ ] Bill scanning with OCR
- [ ] Integration with payment apps
- [ ] Budget planning features

### Version 3.0 (Q2 2025)
- [ ] AI-powered expense categorization
- [ ] Voice commands
- [ ] Blockchain settlements
- [ ] Advanced analytics dashboard
- [ ] Team collaboration features

---

<div align="center">

**Built with ❤️ by [Pranavi S](https://github.com/pranavisback)**

⭐ Star us on GitHub — it helps!

[Report Bug](https://github.com/pranavisback/Expense_Tracker/issues) • [Request Feature](https://github.com/pranavisback/Expense_Tracker/issues)

</div>
