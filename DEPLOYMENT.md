# FreelanceHub Deployment Guide

This guide covers various deployment options for the FreelanceHub application.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm 8+
- MongoDB (local or Atlas)
- Git

### Local Development
```bash
# Clone the repository
git clone https://github.com/Akshatcodegenics/FreelanceHub.git
cd FreelanceHub

# Install dependencies
npm run install:all

# Setup environment
cp .env.example .env
cp client/.env.example client/.env

# Start development servers
npm run dev
```

## 🌐 Production Deployment

### Option 1: Traditional Server Deployment

1. **Prepare the server**
   ```bash
   # Install Node.js, npm, and PM2
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```

2. **Deploy the application**
   ```bash
   # Clone and setup
   git clone https://github.com/Akshatcodegenics/FreelanceHub.git
   cd FreelanceHub
   
   # Install dependencies and build
   npm run install:all
   npm run build
   
   # Setup environment
   cp .env.example .env
   # Edit .env with production values
   
   # Start with PM2
   pm2 start server/server.js --name "freelancehub"
   pm2 startup
   pm2 save
   ```

### Option 2: Docker Deployment

1. **Using Docker Compose (Recommended)**
   ```bash
   # Clone repository
   git clone https://github.com/Akshatcodegenics/FreelanceHub.git
   cd FreelanceHub
   
   # Setup environment
   cp .env.example .env
   # Edit .env with your configuration
   
   # Deploy with Docker
   npm run deploy:docker
   ```

2. **Manual Docker Build**
   ```bash
   # Build the image
   docker build -t freelancehub .
   
   # Run the container
   docker run -d \
     --name freelancehub \
     -p 8000:8000 \
     -e NODE_ENV=production \
     -e MONGODB_URI=your_mongodb_uri \
     -e JWT_SECRET=your_jwt_secret \
     freelancehub
   ```

### Option 3: Cloud Platform Deployment

#### Heroku
1. **Prepare for Heroku**
   ```bash
   # Install Heroku CLI
   npm install -g heroku
   
   # Login and create app
   heroku login
   heroku create your-app-name
   
   # Set environment variables
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your_mongodb_atlas_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   
   # Deploy
   git push heroku main
   ```

#### Vercel (Frontend + Serverless Functions)
1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

#### Railway
1. **Connect GitHub repository to Railway**
2. **Set environment variables in Railway dashboard**
3. **Deploy automatically on push**

## 🔧 Environment Configuration

### Server Environment Variables (.env)
```bash
# Server Configuration
PORT=8000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/freelancehub

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRE=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key

# Client URL
CLIENT_URL=https://your-domain.com
```

### Client Environment Variables (client/.env)
```bash
# API Configuration
VITE_API_URL=https://your-api-domain.com/api

# Socket.io Configuration
VITE_SOCKET_URL=https://your-api-domain.com

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
```

## 🔒 Security Checklist

- [ ] Use strong JWT secret (min 32 characters)
- [ ] Enable HTTPS in production
- [ ] Set secure environment variables
- [ ] Configure CORS properly
- [ ] Use MongoDB Atlas with authentication
- [ ] Enable rate limiting
- [ ] Set up proper firewall rules
- [ ] Use environment-specific API keys

## 📊 Monitoring & Health Checks

### Health Check Endpoint
```bash
curl https://your-domain.com/api/health
```

### PM2 Monitoring
```bash
pm2 status
pm2 logs freelancehub
pm2 monit
```

### Docker Health Check
```bash
docker ps
docker logs freelancehub
```

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill process on port 8000
   lsof -ti:8000 | xargs kill -9
   ```

2. **MongoDB connection failed**
   - Check MongoDB URI format
   - Verify network access in MongoDB Atlas
   - Check firewall settings

3. **Build failures**
   ```bash
   # Clear npm cache
   npm cache clean --force
   
   # Remove node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Memory issues**
   ```bash
   # Increase Node.js memory limit
   export NODE_OPTIONS="--max-old-space-size=4096"
   ```

### Logs and Debugging

1. **Server logs**
   ```bash
   # PM2 logs
   pm2 logs freelancehub
   
   # Docker logs
   docker logs freelancehub
   ```

2. **Client build logs**
   ```bash
   cd client
   npm run build -- --verbose
   ```

## 📈 Performance Optimization

1. **Enable gzip compression**
2. **Use CDN for static assets**
3. **Implement caching strategies**
4. **Optimize database queries**
5. **Use connection pooling**
6. **Enable HTTP/2**

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy FreelanceHub

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm run install:all
      - run: npm run build
      - run: npm run test
      # Add deployment steps here
```

## 📞 Support

For deployment issues:
1. Check the troubleshooting section
2. Review application logs
3. Verify environment configuration
4. Test health check endpoint
5. Create an issue on GitHub if needed
