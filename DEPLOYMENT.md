# Deployment Guide for Hostinger VPS

Complete step-by-step guide to deploy the Knowledge Base Platform on a Hostinger VPS.

## Prerequisites

- Hostinger VPS with Ubuntu 20.04+ or similar Linux distribution
- Root or sudo access to the VPS
- Domain name pointed to your VPS IP (optional but recommended)
- SSH access configured

## Step 1: Initial VPS Setup

### 1.1 Connect to VPS

```bash
ssh root@your-vps-ip
```

### 1.2 Update System

```bash
apt update && apt upgrade -y
```

### 1.3 Install Required Software

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose -y

# Install Git
apt install git -y

# Verify installations
docker --version
docker-compose --version
git --version
```

### 1.4 Configure Firewall

```bash
# Allow SSH, HTTP, and HTTPS
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# Check status
ufw status
```

## Step 2: Clone and Configure Application

### 2.1 Clone Repository

```bash
cd /opt
git clone <your-repository-url> knowledgebase
cd knowledgebase
```

### 2.2 Configure Environment Variables

```bash
# Copy example environment file
cp .env.example .env

# Edit with your production values
nano .env
```

**Important: Update the following in `.env`:**

```env
# Generate a secure random key for API_KEY (minimum 32 characters)
API_KEY=$(openssl rand -base64 32)

# Set a strong PostgreSQL password
POSTGRES_PASSWORD=$(openssl rand -base64 24)

# Set your domain
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
CORS_ORIGIN=https://yourdomain.com
```

**Quick command to generate secure keys:**

```bash
echo "API_KEY=$(openssl rand -base64 32)"
echo "POSTGRES_PASSWORD=$(openssl rand -base64 24)"
```

### 2.3 Configure API Environment

```bash
cd api
cp .env.example .env

# Update with production values
nano .env
```

Update:
```env
DATABASE_URL="postgresql://knowledgebase:YOUR_POSTGRES_PASSWORD@postgres:5432/knowledgebase?schema=public"
API_KEY="your-secure-api-key-from-root-env"
PORT=4000
NODE_ENV=production
CORS_ORIGIN="https://yourdomain.com"
```

### 2.4 Configure Web Environment

```bash
cd ../web
cp .env.example .env.local

# Update with production values
nano .env.local
```

Update:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_ADMIN_API_KEY="your-secure-api-key-from-root-env"
```

## Step 3: SSL Certificate Setup (Recommended)

### Option A: Let's Encrypt (Free SSL)

```bash
# Install Certbot
apt install certbot -y

# Generate certificate (replace with your domain)
certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Certificates will be at:
# /etc/letsencrypt/live/yourdomain.com/fullchain.pem
# /etc/letsencrypt/live/yourdomain.com/privkey.pem
```

### Option B: Use Existing SSL Certificate

Place your SSL certificate files in:
```bash
mkdir -p /opt/knowledgebase/nginx/ssl
cp your-cert.pem /opt/knowledgebase/nginx/ssl/cert.pem
cp your-key.pem /opt/knowledgebase/nginx/ssl/key.pem
chmod 600 /opt/knowledgebase/nginx/ssl/*
```

### 3.2 Update Nginx Configuration

Edit `nginx/nginx.conf` and uncomment SSL section:

```bash
cd /opt/knowledgebase
nano nginx/nginx.conf
```

Update the SSL server block:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # ... rest of configuration
}
```

Update `docker-compose.yml` to mount SSL certificates:

```yaml
nginx:
  volumes:
    - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    - /etc/letsencrypt:/etc/letsencrypt:ro  # Add this line
```

## Step 4: Build and Deploy

### 4.1 Build Docker Images

```bash
cd /opt/knowledgebase

# Build all services
docker-compose build

# This will take several minutes on first build
```

### 4.2 Start Services

```bash
# Start all services in detached mode
docker-compose up -d

# Check logs
docker-compose logs -f

# Check status
docker-compose ps
```

Expected output:
```
NAME                      STATUS          PORTS
knowledgebase-postgres    Up (healthy)    5432/tcp
knowledgebase-api         Up (healthy)    4000/tcp
knowledgebase-web         Up              3000/tcp
knowledgebase-nginx       Up              80/tcp, 443/tcp
```

### 4.3 Initialize Database

```bash
# Database migrations are run automatically on API startup
# Check if they completed successfully:
docker-compose logs api | grep "migration"

# If needed, run migrations manually:
docker-compose exec api npx prisma migrate deploy

# Seed initial data:
docker-compose exec api npm run prisma:seed
```

## Step 5: Verify Deployment

### 5.1 Health Checks

```bash
# Check Nginx health
curl http://localhost/health

# Check API directly
curl http://localhost:4000/docs/nav

# Check frontend
curl http://localhost:3000
```

### 5.2 Access Application

Open your browser and navigate to:
- **Frontend**: https://yourdomain.com
- **Admin Panel**: https://yourdomain.com/admin
- **API**: https://api.yourdomain.com (if using subdomain)

## Step 6: Post-Deployment Configuration

### 6.1 Set Up Auto-Renewal for SSL (Let's Encrypt)

```bash
# Test renewal
certbot renew --dry-run

# Add cron job for auto-renewal
echo "0 0 * * 0 certbot renew --quiet && docker-compose -f /opt/knowledgebase/docker-compose.yml restart nginx" | crontab -
```

### 6.2 Set Up Log Rotation

```bash
cat > /etc/logrotate.d/knowledgebase <<EOF
/opt/knowledgebase/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 root root
    sharedscripts
}
EOF
```

### 6.3 Configure Automatic Backups

```bash
# Create backup script
cat > /opt/knowledgebase/backup.sh <<'EOF'
#!/bin/bash
BACKUP_DIR="/opt/backups/knowledgebase"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database
docker-compose exec -T postgres pg_dump -U knowledgebase knowledgebase | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

chmod +x /opt/knowledgebase/backup.sh

# Add to crontab (daily at 2 AM)
echo "0 2 * * * /opt/knowledgebase/backup.sh >> /var/log/knowledgebase-backup.log 2>&1" | crontab -
```

## Step 7: Monitoring and Maintenance

### 7.1 View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f web
docker-compose logs -f nginx

# Last 100 lines
docker-compose logs --tail=100
```

### 7.2 Restart Services

```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart api
docker-compose restart web
docker-compose restart nginx
```

### 7.3 Update Application

```bash
cd /opt/knowledgebase

# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose build
docker-compose up -d

# Run migrations if needed
docker-compose exec api npx prisma migrate deploy
```

### 7.4 Monitor Resources

```bash
# Container stats
docker stats

# Disk usage
docker system df

# Clean up unused resources
docker system prune -a
```

## Step 8: Security Best Practices

### 8.1 Secure Docker Daemon

```bash
# Create Docker group if not exists
groupadd docker
usermod -aG docker $USER

# Restrict Docker socket permissions
chmod 660 /var/run/docker.sock
```

### 8.2 Regular Updates

```bash
# Create update script
cat > /opt/knowledgebase/update.sh <<'EOF'
#!/bin/bash
apt update && apt upgrade -y
docker-compose pull
EOF

chmod +x /opt/knowledgebase/update.sh

# Run weekly updates
echo "0 3 * * 0 /opt/knowledgebase/update.sh" | crontab -
```

### 8.3 Fail2Ban Configuration (Optional)

```bash
apt install fail2ban -y

# Configure Nginx jail
cat > /etc/fail2ban/jail.local <<EOF
[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log

[nginx-noscript]
enabled = true
port = http,https
filter = nginx-noscript
logpath = /var/log/nginx/access.log
maxretry = 6
EOF

systemctl restart fail2ban
```

## Troubleshooting

### Issue: Services won't start

```bash
# Check logs
docker-compose logs

# Check disk space
df -h

# Check Docker status
systemctl status docker

# Restart Docker
systemctl restart docker
docker-compose up -d
```

### Issue: Database connection errors

```bash
# Check if PostgreSQL is healthy
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Reset database (WARNING: Deletes all data)
docker-compose down -v
docker-compose up -d
```

### Issue: Nginx errors

```bash
# Test Nginx configuration
docker-compose exec nginx nginx -t

# Check Nginx logs
docker-compose logs nginx

# Reload Nginx configuration
docker-compose exec nginx nginx -s reload
```

### Issue: Out of memory

```bash
# Check memory usage
free -h
docker stats

# Add swap space if needed
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

## Performance Optimization

### Enable HTTP/2 and Gzip

Already configured in `nginx.conf`, but verify:

```bash
docker-compose exec nginx nginx -V 2>&1 | grep http_v2
```

### PostgreSQL Tuning

Edit `docker-compose.yml` and add to postgres service:

```yaml
postgres:
  command: postgres -c shared_buffers=256MB -c max_connections=200
```

### Monitor Performance

```bash
# Install monitoring tools
apt install htop iotop -y

# Monitor in real-time
htop
docker stats
```

## Support and Maintenance

### Regular Maintenance Checklist

- [ ] Check logs daily for errors
- [ ] Monitor disk space weekly
- [ ] Update system packages monthly
- [ ] Review backup integrity monthly
- [ ] Update application code as needed
- [ ] Renew SSL certificates (auto-renewed with Let's Encrypt)
- [ ] Review security advisories

### Getting Help

- Check logs: `docker-compose logs`
- Review documentation: `/opt/knowledgebase/README.md`
- Check Docker status: `docker-compose ps`
- Verify environment variables are set correctly

## Conclusion

Your Knowledge Base Platform is now deployed and running on Hostinger VPS!

**Important URLs:**
- Frontend: https://yourdomain.com
- Admin Panel: https://yourdomain.com/admin
- API Health: https://yourdomain.com/health

**Next Steps:**
1. Create your first documentation in the admin panel
2. Configure backups according to your needs
3. Set up monitoring alerts
4. Customize the platform to your requirements

For any issues, check the logs and refer to the troubleshooting section above.
