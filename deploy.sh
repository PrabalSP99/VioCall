#!/bin/bash

# Meet Video VPS Deployment Script
# Usage: ./deploy.sh [setup|deploy|restart|logs|status]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="meet-video"
APP_DIR="/home/ubuntu/meet-video"
NGINX_SITE="meet-video"
DOMAIN="your-domain.com"

# Logging
LOG_DIR="$APP_DIR/logs"
mkdir -p $LOG_DIR

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

warn() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        error "This script should not be run as root"
    fi
}

# Setup function - initial VPS configuration
setup() {
    log "Setting up VPS for Meet Video deployment..."
    
    # Update system
    log "Updating system packages..."
    sudo apt update && sudo apt upgrade -y
    
    # Install Node.js
    log "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    
    # Install PM2
    log "Installing PM2..."
    sudo npm install -g pm2
    
    # Install Nginx
    log "Installing Nginx..."
    sudo apt install -y nginx
    
    # Install Certbot for SSL
    log "Installing Certbot..."
    sudo apt install -y certbot python3-certbot-nginx
    
    # Create application directory
    log "Creating application directory..."
    mkdir -p $APP_DIR
    mkdir -p $LOG_DIR
    
    # Setup firewall
    log "Configuring firewall..."
    sudo ufw allow ssh
    sudo ufw allow 'Nginx Full'
    sudo ufw --force enable
    
    log "VPS setup completed successfully!"
    info "Next steps:"
    info "1. Update nginx.conf with your domain"
    info "2. Run: ./deploy.sh deploy"
    info "3. Setup SSL certificate with: sudo certbot --nginx -d $DOMAIN"
}

# Deploy function
deploy() {
    log "Deploying Meet Video application..."
    
    # Check if app directory exists
    if [ ! -d "$APP_DIR" ]; then
        error "Application directory not found. Run setup first."
    fi
    
    # Stop existing application
    if pm2 list | grep -q "$APP_NAME"; then
        log "Stopping existing application..."
        pm2 stop $APP_NAME
        pm2 delete $APP_NAME
    fi
    
    # Install dependencies
    log "Installing dependencies..."
    cd $APP_DIR
    npm install --production
    
    # Setup environment
    if [ ! -f .env ]; then
        log "Creating environment file..."
        cp .env.example .env
        warn "Please update .env file with your configuration"
    fi
    
    # Setup Nginx
    log "Configuring Nginx..."
    sudo cp nginx.conf /etc/nginx/sites-available/$NGINX_SITE
    sudo ln -sf /etc/nginx/sites-available/$NGINX_SITE /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl reload nginx
    
    # Start application
    log "Starting application with PM2..."
    pm2 start ecosystem.config.js --env production
    pm2 save
    pm2 startup
    
    log "Deployment completed successfully!"
    info "Application URL: https://$DOMAIN"
    info "Health check: https://$DOMAIN/health"
}

# Restart function
restart() {
    log "Restarting application..."
    pm2 restart $APP_NAME
    sudo systemctl reload nginx
    log "Application restarted successfully!"
}

# Logs function
logs() {
    log "Showing application logs..."
    pm2 logs $APP_NAME --lines 50
}

# Status function
status() {
    log "Application status:"
    pm2 status
    echo ""
    log "Nginx status:"
    sudo systemctl status nginx --no-pager
    echo ""
    log "Application health check:"
    curl -s https://$DOMAIN/health || echo "Health check failed"
}

# Main script logic
case "${1:-}" in
    "setup")
        check_root
        setup
        ;;
    "deploy")
        deploy
        ;;
    "restart")
        restart
        ;;
    "logs")
        logs
        ;;
    "status")
        status
        ;;
    *)
        echo "Usage: $0 {setup|deploy|restart|logs|status}"
        echo ""
        echo "Commands:"
        echo "  setup   - Initial VPS setup (run once)"
        echo "  deploy  - Deploy the application"
        echo "  restart - Restart the application"
        echo "  logs    - Show application logs"
        echo "  status  - Show application status"
        exit 1
        ;;
esac
