#!/bin/bash

# FreelanceHub Vercel Deployment Script
# This script handles deployment to Vercel for both frontend and backend

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Vercel CLI is installed
check_vercel_cli() {
    if ! command -v vercel &> /dev/null; then
        print_error "Vercel CLI is not installed"
        print_status "Installing Vercel CLI..."
        npm install -g vercel
    else
        print_success "Vercel CLI is available"
    fi
}

# Deploy frontend
deploy_frontend() {
    print_status "Deploying frontend to Vercel..."
    
    # Copy frontend configuration
    cp vercel-frontend.json vercel.json
    
    # Set environment variables for frontend
    print_status "Setting frontend environment variables..."
    vercel env add VITE_API_URL production
    vercel env add VITE_SOCKET_URL production
    vercel env add VITE_STRIPE_PUBLISHABLE_KEY production
    
    # Deploy frontend
    print_status "Building and deploying frontend..."
    vercel --prod --yes
    
    print_success "Frontend deployed successfully!"
}

# Deploy backend
deploy_backend() {
    print_status "Deploying backend to Vercel..."
    
    # Navigate to server directory
    cd server
    
    # Set environment variables for backend
    print_status "Setting backend environment variables..."
    vercel env add MONGODB_URI production
    vercel env add JWT_SECRET production
    vercel env add CLOUDINARY_CLOUD_NAME production
    vercel env add CLOUDINARY_API_KEY production
    vercel env add CLOUDINARY_API_SECRET production
    vercel env add STRIPE_SECRET_KEY production
    vercel env add CLIENT_URL production
    
    # Deploy backend
    print_status "Deploying backend..."
    vercel --prod --yes
    
    cd ..
    print_success "Backend deployed successfully!"
}

# Deploy both
deploy_both() {
    print_status "Deploying both frontend and backend..."
    
    # Deploy backend first
    deploy_backend
    
    # Wait a moment for backend to be ready
    sleep 5
    
    # Deploy frontend
    deploy_frontend
    
    print_success "Both frontend and backend deployed successfully!"
}

# Main function
main() {
    print_status "FreelanceHub Vercel Deployment Script"
    print_status "====================================="
    
    # Check requirements
    check_vercel_cli
    
    # Parse command line arguments
    case "${1:-both}" in
        "frontend")
            deploy_frontend
            ;;
        "backend")
            deploy_backend
            ;;
        "both")
            deploy_both
            ;;
        *)
            print_error "Invalid option. Use: frontend, backend, or both"
            exit 1
            ;;
    esac
    
    print_success "Deployment completed!"
    print_status "Frontend URL: Check Vercel dashboard"
    print_status "Backend URL: Check Vercel dashboard"
}

# Run main function
main "$@"
