# Task Management API - Backend Developement

A scalable REST API with Authentication & Role-Based Access Control, featuring a React frontend for testing the APIs.

## Project Overview

This project implements a complete full-stack solution with:
- **Backend**: Node.js/Express REST API with MongoDB
- **Frontend**: React + Vite for API testing
- **Authentication**: JWT-based with password hashing
- **Role-Based Access**: User and Admin roles

## Project Structure

```
inbackendapi/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Auth & error handling
│   │   ├── models/         # Mongoose schemas
│   │   └── routes/         # API routes
│   ├── .env               # Environment variables
│   └── package.json
│
└── frontend/               # React + Vite
    ├── src/
    │   ├── components/    # React components
    │   ├── pages/         # Page components
    │   ├── App.jsx        # Main app
    │   └── index.css      # Styles
    ├── package.json
    └── vite.config.js
```

## Features Implemented

### Backend Features
-  User registration & login with bcrypt password hashing
-  JWT authentication with token generation
-  Role-based access (user vs admin)
-  CRUD APIs for Tasks entity
-  API versioning (/api/v1)
-  Input validation & error handling
-  Swagger API documentation
-  MongoDB database with Mongoose

### Frontend Features
-  User registration & login forms
-  Protected dashboard (JWT required)
- Task CRUD operations (Create, Read, Update, Delete)
-  Success/Error messages from API responses
-  Responsive UI design

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=you-got-it
JWT_EXPIRE=7d
```

Start the backend server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`
Swagger docs at `http://localhost:5000/api-docs`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`

##  API Endpoints

### Authentication Routes
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/v1/auth/register` | Register new user | Public |
| POST | `/api/v1/auth/login` | Login user | Public |
| GET | `/api/v1/auth/me` | Get current user | Private |
| GET | `/api/v1/auth/logout` | Logout user | Private |

### Task Routes
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/v1/tasks` | Get all tasks | Private |
| GET | `/api/v1/tasks/:id` | Get single task | Private |
| POST | `/api/v1/tasks` | Create task | Private |
| PUT | `/api/v1/tasks/:id` | Update task | Private |
| DELETE | `/api/v1/tasks/:id` | Delete task | Private |

##  Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Tokens**: Secure token generation with expiration
- **Input Validation**: express-validator for request validation
- **Security Headers**: helmet.js middleware
- **CORS**: Configured for frontend access
- **Error Handling**: Centralized error handler

##  Scalability Notes

### Current Architecture
- Monolithic Node.js/Express application
- MongoDB for data storage
- JWT stateless authentication


##  Testing

### Manual Testing with Swagger
1. Start the backend server
2. Open `http://localhost:5000/api-docs`
3. Use the interactive Swagger UI to test endpoints

### Testing with Frontend
1. Start both backend and frontend
2. Open `http://localhost:3000`
3. Register a new user
4. Login and test CRUD operations

##  License

MIT License

## 👤 Author

Anurag Pratap Singh
