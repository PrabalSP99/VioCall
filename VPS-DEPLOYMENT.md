# 🚀 VPS Deployment Guide

## Architecture Overview

```
Internet → Nginx (Reverse Proxy) → Express Backend → Socket.IO
         ↓
    React Frontend (Static Files)
```

## 📋 Prerequisites

- **VPS Provider**: DigitalOcean, AWS EC2, Linode, Vultr, etc.
- **Domain Name**: For SSL certificate
- **SSH Access**: To your VPS
- **GitHub Repository**: With your code

## 🎯 Step-by-Step Deployment

### 1. VPS Setup

#### A. Create VPS Instance
1. **Choose Provider**: DigitalOcean, AWS, Linode, etc.
2. **Select Plan**: Minimum 1GB RAM, 1 CPU
3. **Choose OS**: Ubuntu 20.04 LTS or newer
4. **Add SSH Key**: Your public SSH key
5. **Note IP**: Save your VPS IP address

#### B. Initial Server Setup
```bash
# SSH into your VPS
ssh ubuntu@your-vps-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git ufw
```

### 2. GitHub Actions Setup

#### A. Add Repository Secrets
Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:
```
VPS_HOST=your-vps-ip
VPS_USERNAME=ubuntu
VPS_SSH_KEY=your-private-ssh-key
VPS_PORT=22
```

#### B. Generate SSH Key (if needed)
```bash
# On your local machine
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"
cat ~/.ssh/id_rsa.pub  # Copy this to VPS
cat ~/.ssh/id_rsa      # Copy this to GitHub secrets
```

### 3. Domain Configuration

#### A. Point Domain to VPS
1. **DNS A Record**: Point your domain to VPS IP
2. **Wait for Propagation**: 5-30 minutes

#### B. Update Configuration Files
1. **nginx.conf**: Replace `your-domain.com` with your actual domain
2. **ecosystem.config.js**: Update host IP
3. **deploy.sh**: Update domain variable

### 4. Manual Deployment (Alternative)

If you prefer manual deployment over GitHub Actions:

```bash
# SSH into VPS
ssh ubuntu@your-vps-ip

# Clone repository
git clone https://github.com/yourusername/meet-video.git
cd meet-video

# Run setup
./deploy.sh setup

# Deploy application
./deploy.sh deploy

# Setup SSL certificate
sudo certbot --nginx -d your-domain.com
```

### 5. SSL Certificate Setup

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Test renewal
sudo certbot renew --dry-run
```

## 🔧 Configuration Files

### Environment Variables (.env)
```env
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-domain.com
```

### Nginx Configuration
- **Location**: `/etc/nginx/sites-available/meet-video`
- **Features**: SSL, WebSocket support, rate limiting, security headers

### PM2 Configuration
- **File**: `ecosystem.config.js`
- **Features**: Process management, auto-restart, logging

## 🚨 Security Considerations

### Firewall Setup
```bash
# Allow SSH
sudo ufw allow ssh

# Allow HTTP/HTTPS
sudo ufw allow 'Nginx Full'

# Enable firewall
sudo ufw --force enable
```

### Security Headers
Nginx configuration includes:
- X-Frame-Options
- X-XSS-Protection
- X-Content-Type-Options
- Content-Security-Policy

### Rate Limiting
- API: 10 requests/second
- WebSocket: 30 requests/second

## 🔍 Monitoring & Maintenance

### Application Status
```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs meet-video

# Monitor resources
pm2 monit
```

### Nginx Status
```bash
# Check Nginx status
sudo systemctl status nginx

# Test configuration
sudo nginx -t

# View logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### System Monitoring
```bash
# Check disk usage
df -h

# Check memory usage
free -h

# Check CPU usage
htop
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
- **Trigger**: Push to main branch
- **Tests**: Build and lint checks
- **Deployment**: Automatic deployment to VPS
- **Rollback**: Automatic backup before deployment

### Manual Commands
```bash
# Restart application
./deploy.sh restart

# View logs
./deploy.sh logs

# Check status
./deploy.sh status
```

## 🛠️ Troubleshooting

### Common Issues

#### Application Not Starting
```bash
# Check PM2 logs
pm2 logs meet-video

# Check if port is in use
sudo netstat -tlnp | grep :5000

# Restart application
pm2 restart meet-video
```

#### Nginx Issues
```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log

# Reload Nginx
sudo systemctl reload nginx
```

#### SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Check SSL configuration
sudo nginx -t
```

#### WebSocket Connection Issues
```bash
# Check Socket.IO logs
pm2 logs meet-video

# Test WebSocket connection
curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" \
  -H "Sec-WebSocket-Version: 13" -H "Sec-WebSocket-Key: test" \
  https://your-domain.com/socket.io/
```

### Performance Optimization

#### Nginx Optimization
```bash
# Enable gzip compression
# Already configured in nginx.conf

# Enable caching
# Already configured for static assets
```

#### Node.js Optimization
```bash
# Increase memory limit
# Already configured in ecosystem.config.js

# Enable clustering
# Socket.IO works better with single instance
```

## 📊 Backup Strategy

### Application Backup
```bash
# Backup application
tar -czf backup-$(date +%Y%m%d).tar.gz ~/meet-video

# Backup Nginx configuration
sudo cp /etc/nginx/sites-available/meet-video ~/nginx-backup
```

### Database Backup (if applicable)
```bash
# If you add a database later
pg_dump your_database > backup-$(date +%Y%m%d).sql
```

## 🔄 Updates & Maintenance

### Regular Maintenance
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Node.js (if needed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Update PM2
sudo npm install -g pm2@latest
```

### Application Updates
1. **Push to GitHub**: Triggers automatic deployment
2. **Manual Update**: SSH and run `./deploy.sh deploy`
3. **Rollback**: Restore from backup if needed

## 💰 Cost Estimation

### VPS Costs (Monthly)
- **DigitalOcean**: $5-10/month
- **AWS EC2**: $5-15/month
- **Linode**: $5-10/month
- **Vultr**: $5-10/month

### Domain Costs (Yearly)
- **Domain Registration**: $10-15/year
- **SSL Certificate**: Free (Let's Encrypt)

## 🎉 Success!

Once deployed, your application will be available at:
- **URL**: `https://your-domain.com`
- **Health Check**: `https://your-domain.com/health`
- **Admin**: SSH access for maintenance

## 📞 Support

For issues:
1. Check logs: `./deploy.sh logs`
2. Check status: `./deploy.sh status`
3. Restart: `./deploy.sh restart`
4. GitHub Issues: Open issue in repository

---

**Happy Video Calling! 🎉**
