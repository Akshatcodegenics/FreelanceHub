# FreelanceHub - Advanced Freelance Marketplace Platform

A comprehensive full-stack freelance marketplace application similar to Fiverr/Upwork, built with React.js and Node.js. Features an advanced messaging system with WhatsApp-like capabilities, file sharing, voice messages, and integrated payment requests.

## 🚀 Features

### Core Platform Features
- **Authentication System**: JWT-based auth with role-based access control
- **Gig Management**: Full CRUD operations for freelancer services
- **Gig Discovery**: Advanced search, filter, and browse capabilities
- **Payment Integration**: Secure payments via Stripe with in-chat payment requests
- **Order Management**: Complete order lifecycle tracking
- **Review System**: Star ratings and written reviews
- **Role-based Dashboards**: Separate interfaces for freelancers and clients

### 💬 Enhanced Messaging System
- **WhatsApp-like Interface**: Modern chat UI with emoji picker and typing indicators
- **Multiple Message Types**: Text, voice messages, file sharing, email threads
- **File Sharing**: Support for images, videos, documents, PDFs, and ZIP files
- **Voice Messages**: Record and playback with waveform visualization
- **Payment Integration**: Send payment requests directly in chat
- **Real-time Features**: Live messaging, typing indicators, read receipts
- **Smart File Handling**: AI-powered file categorization and previews
- **Drag & Drop**: Intuitive file upload with visual feedback

## 🛠️ Tech Stack

### Frontend
- **React.js** with functional components and hooks
- **Tailwind CSS** for responsive styling
- **React Router** for navigation
- **React Hook Form + Zod** for validation
- **Axios** for API calls with interceptors
- **Socket.io-client** for real-time features
- **React Dropzone** for file uploads
- **React Player** for video playback
- **Emoji Picker React** for emoji support
- **React Speech Kit** for voice features

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Cloudinary** for media storage and processing
- **Stripe** for payment processing
- **Socket.io** for real-time messaging
- **Sharp** for image processing
- **Multer** for file upload handling
- **Express Rate Limit** for API protection

## 📁 Project Structure

```
/FreelanceHub
├── /client                 # React frontend
│   ├── /public
│   ├── /src
│   │   ├── /components     # Reusable UI components
│   │   │   ├── /auth       # Authentication components
│   │   │   ├── /layout     # Layout components
│   │   │   ├── /messages   # Enhanced messaging components
│   │   │   └── /ui         # UI components
│   │   ├── /pages          # Route components
│   │   │   ├── /auth       # Authentication pages
│   │   │   ├── /dashboard  # User dashboards
│   │   │   ├── /gigs       # Gig management pages
│   │   │   ├── /messages   # Messaging interface
│   │   │   ├── /orders     # Order management
│   │   │   └── /profile    # User profiles
│   │   ├── /context        # State management (Zustand)
│   │   ├── /services       # API calls and utilities
│   │   └── /utils          # Helper functions
├── /server                 # Node.js backend
│   ├── /controllers        # Route handlers
│   ├── /models            # Database schemas (User, Gig, Order, Message, etc.)
│   ├── /routes            # API endpoints
│   ├── /middleware        # Custom middleware (auth, validation, etc.)
│   ├── /config            # Database and service configs
│   ├── /utils             # Backend utilities (socket handler, helpers)
│   └── /uploads           # File upload directory
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **Stripe account** for payment processing
- **Cloudinary account** for media storage
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Akshatcodegenics/FreelanceHub.git
   cd FreelanceHub
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

   # Edit .env with your configuration:
   # - MongoDB connection string
   # - JWT secret key
   # - Cloudinary credentials
   # - Stripe API keys
   ```

4. **Start the application**
   ```bash
   # Terminal 1: Start server (from server directory)
   cd server
   npm run dev
   # Server runs on http://localhost:8000

   # Terminal 2: Start client (from client directory)
   cd client
   npm run dev
   # Client runs on http://localhost:3001
   ```

### 🧪 Demo Mode

For quick testing without database setup:
- **Demo Login**: `demo@freelancehub.com` / `demo123`
- **Demo Registration**: Use any email containing "demo" or "test"

## 📝 Environment Variables

See `.env.example` for required environment variables:

```bash
# Server Configuration
PORT=8000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/freelancehub

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key

# Client URL
CLIENT_URL=http://localhost:3001
```

## 🎯 Key Features Implemented

### Enhanced Messaging System
- **WhatsApp-like UI**: Modern chat interface with emoji picker
- **File Sharing**: Drag & drop support for multiple file types
- **Voice Messages**: Record and playback with waveform visualization
- **Payment Requests**: Send payment requests directly in chat
- **Real-time Updates**: Live messaging with typing indicators
- **Smart Previews**: Image lightbox, video player, document previews

### Authentication & Security
- **JWT-based Authentication**: Secure token-based auth system
- **Role-based Access Control**: Client and freelancer roles
- **Password Security**: bcrypt hashing with validation
- **Demo Mode**: Testing without database setup

### File Management
- **Cloudinary Integration**: Optimized media storage and delivery
- **Multiple File Types**: Images, videos, documents, archives
- **Smart Processing**: Automatic image optimization and thumbnails
- **Secure Uploads**: File type validation and size limits

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Messaging
- `GET /api/messages/conversations` - Get user conversations
- `GET /api/messages/conversations/:id/messages` - Get messages
- `POST /api/messages/conversations/:id/messages` - Send text message
- `POST /api/messages/conversations/:id/files` - Send file message
- `POST /api/messages/conversations/:id/voice` - Send voice message
- `POST /api/messages/conversations/:id/payment-request` - Send payment request

## 🧪 Testing

Run the authentication test:
```bash
node test-auth.js
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern React.js and Node.js
- Enhanced messaging inspired by WhatsApp
- Secure payment processing with Stripe
- Real-time features powered by Socket.io
