# FreelanceHub - Freelance Marketplace Platform

A comprehensive full-stack freelance marketplace application similar to Fiverr/Upwork, built with React.js and Node.js.

## 🚀 Features

- **Authentication System**: JWT-based auth with role-based access control
- **Gig Management**: Full CRUD operations for freelancer services
- **Gig Discovery**: Search, filter, and browse available services
- **Payment Integration**: Secure payments via Stripe
- **Order Management**: Complete order lifecycle tracking
- **Real-time Messaging**: Socket.io-powered live chat
- **Review System**: Star ratings and written reviews
- **Role-based Dashboards**: Separate interfaces for freelancers and clients

## 🛠️ Tech Stack

### Frontend
- React.js with functional components and hooks
- Tailwind CSS for styling
- React Router for navigation
- React Hook Form + Zod for validation
- Axios for API calls
- Socket.io-client for real-time features

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing
- Cloudinary for image storage
- Stripe for payments
- Socket.io for real-time messaging

## 📁 Project Structure

```
/freelance-marketplace
├── /client                 # React frontend
│   ├── /public
│   ├── /src
│   │   ├── /components     # Reusable UI components
│   │   ├── /pages          # Route components
│   │   ├── /hooks          # Custom React hooks
│   │   ├── /utils          # Helper functions
│   │   ├── /context        # State management
│   │   └── /services       # API calls
├── /server                 # Node.js backend
│   ├── /controllers        # Route handlers
│   ├── /models            # Database schemas
│   ├── /routes            # API endpoints
│   ├── /middleware        # Custom middleware
│   ├── /config            # Database and service configs
│   └── /utils             # Backend utilities
├── .env.example           # Environment variables template
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Stripe account for payments
- Cloudinary account for image storage

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd freelance-marketplace
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env with your configuration
   ```

4. **Start the application**
   ```bash
   # Start server (from server directory)
   npm run dev

   # Start client (from client directory)
   npm start
   ```

## 📝 Environment Variables

See `.env.example` for required environment variables.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
