# ✅ Deployment Checklist

VPS serveringizda SubConverter dasturini deploy qilish uchun to'liq checklist.

## 📋 Pre-Deployment

### Server Talablari
- [ ] VPS/Server mavjud (Ubuntu 20.04+ tavsiya)
- [ ] Root yoki sudo access
- [ ] Minimal 1GB RAM
- [ ] 10GB+ disk space
- [ ] Internet ulanishi
- [ ] Static IP (optional, lekin tavsiya)

### Dasturiy ta'minot
- [ ] Docker o'rnatilgan (`docker --version`)
- [ ] Docker Compose o'rnatilgan (`docker-compose --version`)
- [ ] Git o'rnatilgan (`git --version`)
- [ ] Curl o'rnatilgan (`curl --version`)

### Network
- [ ] Port 3000 ochiq (yoki boshqa tanlanganingiz)
- [ ] Port 5432 internal (database uchun)
- [ ] Firewall sozlangan
- [ ] Domain/Subdomain (optional)

## 🔧 Installation Checklist

### 1. Docker Installation
```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify
docker --version
docker-compose --version
```

- [ ] Docker o'rnatildi
- [ ] Docker Compose o'rnatildi
- [ ] User docker group ga qo'shildi
- [ ] Logout/Login qilindi

### 2. Repository Setup
```bash
cd ~
git clone <YOUR_GITHUB_REPO_URL>
cd subconverter
```

- [ ] Repository clone qilindi
- [ ] `cd subconverter` directory ga kirildi
- [ ] Fayllar mavjudligi tekshirildi (`ls -la`)

### 3. Environment Configuration
```bash
cp .env.example .env
nano .env  # yoki vim .env
```

**O'zgartirish KERAK:**
- [ ] `DB_PASSWORD` o'zgartirildi
- [ ] `ADMIN_PASSWORD` o'zgartirildi
- [ ] `CRON_SECRET` o'zgartirildi
- [ ] `APP_PORT` sozlandi (kerak bo'lsa)
- [ ] `.env` fayl saqlandi

**Parol generatsiya:**
```bash
openssl rand -base64 32
```

### 4. Deployment
```bash
./deploy.sh
```

- [ ] Deploy script ishga tushdi
- [ ] Containers build bo'ldi
- [ ] Containers ishga tushdi (`docker ps`)
- [ ] Database migration bajarildi
- [ ] Xatolar yo'q

### 5. Verification
```bash
# Container status
docker ps

# App logs
docker logs -f subconverter-app

# Database logs
docker logs subconverter-db

# Health check
curl http://localhost:3000/api/health
```

- [ ] Ikkala container ham running
- [ ] Health check `{"ok":true}` qaytardi
- [ ] Logda xatolar yo'q
- [ ] Dashboard ochiladi (`http://YOUR_IP:3000`)

## 🔄 Cron Job Setup

### Option 1: Docker Compose Cron

`docker-compose.yml` faylni tahrirlang:
```bash
nano docker-compose.yml
```

Cron service ni uncomment qiling, keyin:
```bash
docker-compose up -d
```

- [ ] Cron service uncomment qilindi
- [ ] Containers qayta ishga tushirildi
- [ ] Cron container running

### Option 2: Server Cron

```bash
./setup-cron.sh
```

Yoki manual:
```bash
crontab -e

# Qo'shing (har 30 daqiqada):
*/30 * * * * curl -s -H "Authorization: Bearer YOUR_CRON_SECRET" http://localhost:3000/api/cron/refresh-sublinks >> /var/log/subconverter-cron.log 2>&1
```

- [ ] Cron job qo'shildi
- [ ] Crontab saqlandi
- [ ] Test qilindi (`curl` buyrug'i bilan)
- [ ] Log file yaratildi

## 🔐 Security Checklist

### Firewall
```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 3000/tcp  # SubConverter (yoki sizning portingiz)
sudo ufw enable
sudo ufw status
```

- [ ] Firewall yoqildi
- [ ] SSH port ochiq
- [ ] App port ochiq
- [ ] Boshqa portlar yopiq

### Passwords
- [ ] Barcha default parollar o'zgartirildi
- [ ] Kuchli parollar ishlatildi (12+ belgi)
- [ ] `.env` fayl `.gitignore` da
- [ ] `CREDENTIALS.md` xavfsiz saqlandi

### Docker Security
- [ ] Containers restart policy: `unless-stopped`
- [ ] Database faqat internal network
- [ ] Environment variables secure
- [ ] Volume permissions to'g'ri

## 🌐 Domain & SSL (Optional)

### Nginx Setup
```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/subconverter
```

Config:
```nginx
server {
    listen 80;
    server_name sub.example.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/subconverter /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

- [ ] Nginx o'rnatildi
- [ ] Config fayl yaratildi
- [ ] Symlink yaratildi
- [ ] Nginx test o'tdi
- [ ] Nginx reload qilindi

### SSL Certificate
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d sub.example.com
```

- [ ] Certbot o'rnatildi
- [ ] SSL certificate olindi
- [ ] Auto-renewal sozlandi
- [ ] HTTPS ishlayapti

## 📊 Monitoring Setup

### Basic Monitoring
```bash
# Docker stats
docker stats

# Disk usage
df -h
docker system df

# Logs
docker logs -f subconverter-app
tail -f /var/log/subconverter-cron.log
```

- [ ] Container stats ko'riladi
- [ ] Disk space yetarli
- [ ] Logs accessible

### Advanced Monitoring (Optional)
- [ ] Portainer o'rnatildi
- [ ] Grafana setup (optional)
- [ ] Prometheus setup (optional)
- [ ] Alert system (optional)

## 🔄 Backup Strategy

### Database Backup
```bash
# Manual backup
docker exec subconverter-db pg_dump -U postgres subconverter_db > backup_$(date +%Y%m%d).sql

# Automated backup (cron)
0 2 * * * docker exec subconverter-db pg_dump -U postgres subconverter_db > /backups/subconverter_$(date +\%Y\%m\%d).sql
```

- [ ] Backup script yaratildi
- [ ] Test backup olinadi
- [ ] Restore test qilindi
- [ ] Automated backup sozlandi
- [ ] Backup storage aniqlandi

### Backup Files
Backup qilish kerak:
- [ ] `.env` file (secure location!)
- [ ] Database dumps
- [ ] Docker volumes (optional)
- [ ] Custom configurations

## 🧪 Testing

### Functional Tests
- [ ] Sublink qo'shish ishlayapti
- [ ] User yaratish ishlayapti
- [ ] Subscription URL generatsiya
- [ ] Statistics ko'rinmoqda
- [ ] Refresh button ishlayapti
- [ ] Cron job ishlayapti

### Load Testing
```bash
# Basic load test
ab -n 100 -c 10 http://localhost:3000/api/health

# User subscription test
ab -n 50 -c 5 http://localhost:3000/api/users/1/subscription
```

- [ ] Health endpoint responsive
- [ ] API endpoints fast
- [ ] Database performant
- [ ] No memory leaks

## 📱 Client Testing

### V2RayNG (Android)
- [ ] Subscription URL qo'shildi
- [ ] Update successful
- [ ] Servers imported
- [ ] Connection test

### V2RayN (Windows)
- [ ] Subscription URL qo'shildi
- [ ] Update successful
- [ ] Servers imported
- [ ] Connection test

## 📝 Documentation

- [ ] Server access credentials yozildi
- [ ] Database credentials saqlandi
- [ ] API endpoints hujjatlashtirildi
- [ ] Troubleshooting guide tayyorlandi
- [ ] Team bilan shared (agar kerak bo'lsa)

## 🎯 Post-Deployment

### Immediate
- [ ] Health check test
- [ ] Dashboard access test
- [ ] API endpoints test
- [ ] Cron job test (wait 30-40 min)
- [ ] Logs monitoring

### Within 24 hours
- [ ] Statistika to'planmoqda
- [ ] Access logs yozilmoqda
- [ ] Cron job ishlayapti
- [ ] No errors in logs
- [ ] Performance acceptable

### Within 1 week
- [ ] Users feedback yig'ildi
- [ ] Performance monitoring
- [ ] Disk usage tekshirildi
- [ ] Backup test qilindi
- [ ] Updates rejalashtirildi

## 🔄 Maintenance Plan

### Daily
- [ ] Logs tekshirish
- [ ] Error monitoring
- [ ] Disk space check

### Weekly
- [ ] Performance review
- [ ] Backup verification
- [ ] Security updates check
- [ ] User feedback review

### Monthly
- [ ] Full backup test
- [ ] Security audit
- [ ] Performance optimization
- [ ] Documentation update

## 🆘 Troubleshooting

Agar muammo bo'lsa:

1. **Loglarni tekshiring:**
   ```bash
   docker logs subconverter-app
   docker logs subconverter-db
   ```

2. **Container statusni tekshiring:**
   ```bash
   docker ps -a
   ```

3. **Database connection:**
   ```bash
   docker exec -it subconverter-db psql -U postgres -d subconverter_db
   ```

4. **Restart containers:**
   ```bash
   docker-compose restart
   ```

5. **Full rebuild:**
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

## ✅ Final Checklist

Hammasini bajarilganidan keyin:

- [x] Server tayyorlandi
- [x] Docker o'rnatildi
- [x] Repository clone qilindi
- [x] Environment sozlandi
- [x] Deploy muvaffaqiyatli
- [x] Cron job sozlandi
- [x] Security qo'llanildi
- [x] Domain/SSL sozlandi (optional)
- [x] Monitoring setup
- [x] Backup strategiya
- [x] Testing bajarildi
- [x] Documentation yozildi
- [x] Post-deployment tekshiruv

## 🎉 Tayyor!

SubConverter production serveringizda ishlayapti!

**Next Steps:**
1. ✅ First sublink qo'shing
2. ✅ First user yarating
3. ✅ Subscription URL test qiling
4. ✅ Statistikani monitoring qiling
5. ✅ Regular maintenance

**Omad tilaklar! 🚀**

---

*Last Updated: 2026-01-15*
*Version: 1.0.0*
