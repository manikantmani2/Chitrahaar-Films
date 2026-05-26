# Deployment Guide - Chitrahaar Films Website

## Pre-Deployment Checklist

- [ ] Update all content (company info, team, portfolio, etc.)
- [ ] Test all forms locally
- [ ] Configure email service
- [ ] Update `.env.local` with production values
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Verify all links work
- [ ] Add analytics tracking
- [ ] Generate sitemap
- [ ] Add robots.txt
- [ ] Create favicon
- [ ] Set up CDN for images
- [ ] Enable GZIP compression
- [ ] Set up SSL/HTTPS

## Option 1: Vercel (Recommended for Next.js)

### Easiest & Fastest

**Cost**: Free tier available, paid starting $20/month

**Setup Time**: 5 minutes

### Steps:

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/chitrahaar-website.git
git push -u origin main
```

2. **Connect to Vercel**
   - Visit https://vercel.com
   - Click "New Project"
   - Select your GitHub repository
   - Configure project settings

3. **Add Environment Variables**
   - Go to Project Settings > Environment Variables
   - Add from `.env.local`:
     ```
     NEXT_PUBLIC_API_URL=https://yourdomain.com/api
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASSWORD=your-app-password
     BUSINESS_EMAIL=contact@chitrahaarfilms.com
     ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your site is live!

5. **Custom Domain**
   - Go to Settings > Domains
   - Add your custom domain
   - Update DNS records at your registrar

### Vercel Benefits:
- Free SSL certificate
- Automatic deployments on push
- Built-in analytics
- Edge caching
- Serverless functions
- Zero configuration

---

## Option 2: Netlify

**Cost**: Free tier available, paid starting $19/month

**Setup Time**: 5 minutes

### Steps:

1. **Connect Repository**
   - Visit https://netlify.com
   - Click "New site from Git"
   - Connect GitHub account
   - Select repository

2. **Configure Build**
   ```
   Build command: npm run build
   Publish directory: out
   ```

3. **Environment Variables**
   - Go to Site Settings > Build & Deploy > Environment
   - Add your environment variables

4. **Add Domain**
   - Domain settings > Custom domain
   - Configure DNS

### Netlify Benefits:
- Form handling built-in
- Easy deployment
- Build status checks
- Preview deployments

---

## Option 3: AWS Amplify

**Cost**: Free tier available, pay-as-you-go

**Setup Time**: 10 minutes

### Steps:

1. **Setup AWS Account**
   - Visit aws.amazon.com
   - Create account

2. **Connect Repository**
   - Open AWS Amplify Console
   - Click "New app" > "Host web app"
   - Select GitHub
   - Authorize and select repository

3. **Configure Build**
   ```
   Frontend
   Build: npm run build
   Output: .next
   ```

4. **Deploy**
   - Click "Save and deploy"
   - Wait for build to complete

### AWS Amplify Benefits:
- Free tier generous
- Integrated with AWS services
- API Gateway integration
- CI/CD pipeline built-in
- Scalable infrastructure

---

## Option 4: Docker Deployment

**For:** VPS, dedicated servers, cloud platforms

### Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Create docker-compose.yml

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://yourdomain.com/api
    restart: always
```

### Deploy

```bash
docker build -t chitrahaar-website .
docker run -p 3000:3000 chitrahaar-website
```

---

## Option 5: Manual VPS Deployment

**For:** DigitalOcean, Linode, AWS EC2, etc.

### Prerequisites
- Node.js 16+ installed
- npm installed
- Domain pointing to server

### Steps:

1. **Connect to Server**
```bash
ssh root@your_server_ip
```

2. **Clone Repository**
```bash
cd /var/www
git clone https://github.com/username/chitrahaar-website.git
cd chitrahaar-website
```

3. **Install Dependencies**
```bash
npm install
```

4. **Create Environment File**
```bash
cp .env.example .env.local
nano .env.local  # Edit with your values
```

5. **Build Application**
```bash
npm run build
```

6. **Install PM2**
```bash
npm install -g pm2
```

7. **Start Application**
```bash
pm2 start "npm start" --name "chitrahaar"
pm2 startup
pm2 save
```

8. **Setup Nginx Reverse Proxy**
```bash
# Install Nginx
sudo apt update
sudo apt install nginx

# Configure
sudo nano /etc/nginx/sites-available/default
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

9. **Enable SSL with Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

10. **Test and Reload**
```bash
sudo nginx -t
sudo systemctl restart nginx
```

---

## Option 6: cPanel Hosting

**For:** Shared hosting with cPanel

### Steps:

1. **SSH into Server**
```bash
ssh username@yourdomain.com
```

2. **Navigate to public_html**
```bash
cd public_html
```

3. **Clone & Setup**
```bash
git clone repo-url .
npm install
npm run build
```

4. **Create Node.js App in cPanel**
   - Go to cPanel > Node.js
   - Click "Create Application"
   - Set application path to `/public_html`
   - Set app.js file
   - Set port

5. **Create Proxy**
   - Create `.htaccess` file:
```apache
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ http://127.0.0.1:PORT%{REQUEST_URI} [QSA,L,P]
</IfModule>
```

---

## SSL/HTTPS Setup

### Free SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot

# For Nginx
sudo certbot certonly --nginx -d yourdomain.com

# For Apache
sudo certbot certonly --apache -d yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Using CloudFlare (Free)

1. Add domain to CloudFlare
2. Update nameservers
3. Enable SSL in CloudFlare Dashboard
4. Set SSL to "Full"

---

## Performance Optimization

### 1. Enable Gzip Compression

**Nginx**:
```nginx
gzip on;
gzip_types text/plain text/css text/xml text/javascript;
gzip_min_length 1000;
```

**Apache**:
```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml
</IfModule>
```

### 2. Setup CDN

**Recommended**: CloudFlare, AWS CloudFront, Bunny CDN

For Next.js with Vercel, CDN is automatic.

### 3. Database Optimization

If using database, add indexes:
```javascript
// MongoDB
db.contacts.createIndex({ email: 1 });
```

### 4. Image Optimization

- Use WebP format
- Implement lazy loading
- Use responsive images
- Consider Image CDN (Cloudinary, imgix)

---

## Monitoring & Maintenance

### Setup Monitoring

1. **Uptime Monitoring**
   - Pingdom
   - StatusCake
   - UptimeRobot

2. **Error Tracking**
   - Sentry
   - Bugsnag
   - LogRocket

3. **Performance Monitoring**
   - New Relic
   - DataDog
   - Lightspeed

### Regular Maintenance

```bash
# Weekly
npm update

# Monthly
npm audit
npm audit fix

# Quarterly
npm outdated
# Upgrade major versions carefully
```

---

## Backup Strategy

### Automated Backups

**GitHub**:
- All code automatically backed up
- Easy rollback via git

**Database Backups**:
```bash
# MongoDB
mongodump --db chitrahaar --out backup/

# PostgreSQL
pg_dump dbname > backup.sql
```

**File Backups**:
- Use AWS S3
- Or cPanel backups
- Or rsync to external storage

---

## Domain Setup

### Point Domain to Server

1. **Get Nameservers** from your hosting
2. **Update DNS** at domain registrar
3. **Wait** for propagation (can take 24-48 hours)

### Email Setup

If using Vercel or Netlify, email comes from your domain:
- Postmark
- SendGrid
- AWS SES

Configure SPF, DKIM, DMARC for email authentication.

---

## Troubleshooting Deployment

### Issue: Build fails on deploy
**Solution**:
- Check Node.js version matches
- Clear build cache
- Check dependencies in package.json

### Issue: Slow performance
**Solution**:
- Enable caching
- Compress images
- Use CDN
- Check database queries

### Issue: Emails not sending
**Solution**:
- Verify credentials in .env
- Check spam folder
- Verify domain SPF/DKIM

### Issue: CORS errors
**Solution**:
- Configure CORS headers
- Add domain to whitelist
- Check API endpoints

---

## Post-Deployment

1. **Test Everything**
   - Contact form
   - All links
   - Responsive design
   - Cross-browser compatibility

2. **Setup Analytics**
   - Google Analytics
   - Mixpanel
   - Amplitude

3. **SEO**
   - Submit sitemap to Google Search Console
   - Verify domain ownership
   - Monitor rankings

4. **Social Media**
   - Share launch
   - Update profiles
   - Get backlinks

5. **Monitor**
   - Set up uptime monitoring
   - Check daily for issues
   - Review analytics

---

## Recommended Hosting Providers

| Provider | Cost | Best For | Setup Time |
|----------|------|----------|-----------|
| Vercel | Free-$50 | Next.js | 5 min |
| Netlify | Free-$19 | Static/JAM | 5 min |
| AWS Amplify | Free-Pay as you go | AWS users | 10 min |
| DigitalOcean | $5-$50 | VPS control | 20 min |
| Heroku | $50-$500 | Apps | 15 min |
| Bluehost | $2.95-$13 | WordPress/shared | 15 min |

---

## Cost Comparison

For typical usage:
- **Vercel**: $0-50/month (recommended)
- **Netlify**: $0-50/month
- **AWS Amplify**: $0-20/month
- **VPS**: $5-50/month
- **cPanel Hosting**: $5-20/month

---

## Next Steps

1. ✅ Choose hosting provider
2. ✅ Deploy application
3. ✅ Test thoroughly
4. ✅ Set up monitoring
5. ✅ Configure analytics
6. ✅ Optimize performance
7. ✅ Monitor regularly

Good luck! 🚀
