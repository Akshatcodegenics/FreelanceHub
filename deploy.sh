#!/bin/bash

# FreelanceHub Deployment Script
echo "🚀 Starting FreelanceHub deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 16 or higher."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    # Check Node.js version
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 16 ]; then
        print_error "Node.js version 16 or higher is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_status "✅ All requirements met"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install server dependencies
    print_status "Installing server dependencies..."
    cd server
    npm ci --only=production
    if [ $? -ne 0 ]; then
        print_error "Failed to install server dependencies"
        exit 1
    fi
    cd ..
    
    # Install client dependencies
    print_status "Installing client dependencies..."
    cd client
    npm ci
    if [ $? -ne 0 ]; then
        print_error "Failed to install client dependencies"
        exit 1
    fi
    cd ..
    
    print_status "✅ Dependencies installed successfully"
}

# Build client
build_client() {
    print_status "Building client application..."
    cd client
    npm run build
    if [ $? -ne 0 ]; then
        print_error "Failed to build client application"
        exit 1
    fi
    cd ..
    print_status "✅ Client built successfully"
}

# Setup environment
setup_environment() {
    print_status "Setting up environment..."
    
    if [ ! -f .env ]; then
        if [ -f .env.example ]; then
            cp .env.example .env
            print_warning "Created .env file from .env.example. Please update with your configuration."
        else
            print_error ".env.example file not found"
            exit 1
        fi
    else
        print_status "✅ Environment file exists"
    fi
}

# Start application
start_application() {
    print_status "Starting FreelanceHub application..."
    
    # Set production environment
    export NODE_ENV=production
    
    # Start the server
    cd server
    npm start &
    SERVER_PID=$!
    cd ..
    
    print_status "✅ Application started with PID: $SERVER_PID"
    print_status "🌐 Server running on: http://localhost:8000"
    print_status "📱 Health check: http://localhost:8000/api/health"
    
    # Save PID for later use
    echo $SERVER_PID > freelancehub.pid
}

# Docker deployment
deploy_docker() {
    print_status "Deploying with Docker..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose."
        exit 1
    fi
    
    # Build and start containers
    docker-compose down
    docker-compose build
    docker-compose up -d
    
    if [ $? -eq 0 ]; then
        print_status "✅ Docker deployment successful"
        print_status "🌐 Application running on: http://localhost:8000"
    else
        print_error "Docker deployment failed"
        exit 1
    fi
}

# Main deployment function
main() {
    print_status "FreelanceHub Deployment Script v1.0"
    print_status "======================================"
    
    # Parse command line arguments
    DEPLOY_TYPE="standard"
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --docker)
                DEPLOY_TYPE="docker"
                shift
                ;;
            --help)
                echo "Usage: $0 [--docker] [--help]"
                echo "  --docker    Deploy using Docker containers"
                echo "  --help      Show this help message"
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    check_requirements
    setup_environment
    
    if [ "$DEPLOY_TYPE" = "docker" ]; then
        deploy_docker
    else
        install_dependencies
        build_client
        start_application
    fi
    
    print_status "🎉 Deployment completed successfully!"
    print_status "📖 Check the logs for any issues"
    print_status "🔧 To stop the application, run: kill \$(cat freelancehub.pid)"
}

# Run main function
main "$@"
