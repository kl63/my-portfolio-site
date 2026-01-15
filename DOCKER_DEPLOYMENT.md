# Docker Deployment Guide

This guide explains how to deploy your Next.js portfolio using Docker to avoid OOM issues on DigitalOcean.

## Architecture

```
[ Your Laptop ]
     |
     | git push
     v
[ GitHub Actions ]
  (builds image)
     |
     | docker push
     v
[ GHCR (Container Registry) ]
     |
     | docker pull
     v
[ DigitalOcean Droplet ]
  (runs container only)
```

**Key principle:** The droplet NEVER builds - it only pulls and runs pre-built images.

---

## Part 1: Initial Setup (One-Time)

### 1. Push Docker files to GitHub

```bash
git add .
git commit -m "Add Docker configuration for deployment"
git push
```

### 2. Enable GitHub Container Registry

The GitHub Actions workflow will automatically:
- Build the Docker image
- Push it to `ghcr.io/kl63/my-portfolio-site:latest`
- Use GitHub's free container registry

**No additional setup needed** - the `GITHUB_TOKEN` is automatically available in Actions.

---

## Part 2: DigitalOcean Droplet Setup (One-Time)

### 1. SSH into your droplet

```bash
ssh root@your-droplet-ip
```

### 2. Install Docker (if not already installed)

```bash
# Update packages
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose-plugin -y

# Verify installation
docker --version
docker compose version
```

### 3. Create deployment directory

```bash
mkdir -p /var/www/portfolio
cd /var/www/portfolio
```

### 4. Create environment file

```bash
nano .env
```

Add your environment variables:

```env
OPENAI_API_KEY=your_openai_key_here
GA4_PROPERTY_ID=your_ga4_property_id
GOOGLE_APPLICATION_CREDENTIALS_JSON=your_json_credentials_here
```

Save and exit (Ctrl+X, Y, Enter).

### 5. Create docker-compose.yml on the droplet

```bash
nano docker-compose.yml
```

Paste this content:

```yaml
version: '3.8'

services:
  portfolio:
    image: ghcr.io/kl63/my-portfolio-site:latest
    container_name: portfolio-nextjs
    restart: unless-stopped
    ports:
      - "3002:3000"
    environment:
      - NODE_ENV=production
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - GA4_PROPERTY_ID=${GA4_PROPERTY_ID}
      - GOOGLE_APPLICATION_CREDENTIALS_JSON=${GOOGLE_APPLICATION_CREDENTIALS_JSON}
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

Save and exit.

### 6. Log in to GitHub Container Registry

```bash
# Create a Personal Access Token (PAT) on GitHub with read:packages permission
# Go to: Settings > Developer settings > Personal access tokens > Tokens (classic)
# Create token with 'read:packages' scope

# Login to GHCR
echo "YOUR_GITHUB_PAT" | docker login ghcr.io -u kl63 --password-stdin
```

### 7. Update Nginx configuration

```bash
nano /etc/nginx/sites-available/kevinlinportfolio.com
```

Update the proxy configuration:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name kevinlinportfolio.com www.kevinlinportfolio.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name kevinlinportfolio.com www.kevinlinportfolio.com;

    # SSL configuration (adjust paths as needed)
    ssl_certificate /etc/letsencrypt/live/kevinlinportfolio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/kevinlinportfolio.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Proxy to Docker container
    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Increase timeouts for AI operations
        proxy_read_timeout 90s;
        proxy_connect_timeout 90s;
        proxy_send_timeout 90s;
    }

    # Handle Next.js static files
    location /_next/static {
        proxy_pass http://localhost:3002;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }
}
```

Test and reload Nginx:

```bash
nginx -t
systemctl reload nginx
```

### 8. Stop PM2 (if running)

```bash
# Stop the old PM2 process
pm2 stop portfolio
pm2 delete portfolio
pm2 save
```

---

## Part 3: Deploy (Every Time You Push Code)

### On GitHub (automatic):
1. Push code to GitHub
2. GitHub Actions builds the image
3. Image is pushed to GHCR

### On DigitalOcean Droplet:

```bash
# 1. Navigate to deployment directory
cd /var/www/portfolio

# 2. Pull the latest image
docker compose pull

# 3. Restart the container
docker compose up -d

# 4. Check status
docker compose ps
docker compose logs -f portfolio
```

That's it! No building, no OOM errors.

---

## Useful Commands

### Check container status
```bash
docker compose ps
```

### View logs
```bash
docker compose logs -f portfolio
```

### Restart container
```bash
docker compose restart portfolio
```

### Stop container
```bash
docker compose down
```

### Check resource usage
```bash
docker stats portfolio-nextjs
```

### Clean up old images
```bash
docker image prune -a
```

### Force pull and rebuild
```bash
docker compose down
docker compose pull
docker compose up -d --force-recreate
```

---

## Troubleshooting

### Container won't start
```bash
# Check logs
docker compose logs portfolio

# Check if port is in use
netstat -tlnp | grep 3002
```

### Out of memory
```bash
# Check container memory
docker stats portfolio-nextjs

# Adjust memory limits in docker-compose.yml if needed
```

### Can't pull image
```bash
# Re-login to GHCR
echo "YOUR_GITHUB_PAT" | docker login ghcr.io -u kl63 --password-stdin

# Try pulling manually
docker pull ghcr.io/kl63/my-portfolio-site:latest
```

### Environment variables not working
```bash
# Check .env file exists
cat /var/www/portfolio/.env

# Restart container to pick up changes
docker compose down
docker compose up -d
```

---

## What You NEVER Do Anymore

- ❌ `npm run build` on the droplet
- ❌ `next build` on the droplet  
- ❌ PM2 managing Next.js builds
- ❌ Deploying via SCP with compiled files
- ❌ Building anything on the droplet

The droplet is now ONLY for running containers. All builds happen in GitHub Actions.
