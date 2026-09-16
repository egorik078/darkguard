# 📦 SubConverter - O'rnatish Yo'riqnomasi

Bu qo'llanma sizga SubConverter dasturini VPS serveringizda Docker va Portainer orqali o'rnatishda yordam beradi.

## 🎯 Talablar

- VPS server (Ubuntu 20.04/22.04 tavsiya etiladi)
- Docker va Docker Compose o'rnatilgan
- Portainer (ixtiyoriy, lekin tavsiya etiladi)
- Git
- 1GB+ RAM
- 10GB+ disk space

## 📋 Bosqichma-bosqich o'rnatish

### 1️⃣ Server tayyorlash

```bash
# Sistema yangilanishi
sudo apt update && sudo apt upgrade -y

# Git o'rnatish
sudo apt install git curl -y

# Docker o'rnatish (agar yo'q bo'lsa)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Docker Compose o'rnatish
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Docker user ga qo'shish
sudo usermod -aG docker $USER
```

**Logout va login qiling** - Docker permissionlar amal qilishi uchun.

### 2️⃣ Repository klonlash

```bash
# Home directory ga o'tish
cd ~

# Repository klonlash
git clone https://github.com/YOUR_USERNAME/subconverter.git

# Loyihaga o'tish
cd subconverter
```

**Eslatma:** `YOUR_USERNAME` ni o'zingizning GitHub username bilan almashtiring.

### 3️⃣ Environment sozlash

```bash
# .env fayl yaratish
cp .env.example .env

# .env faylni tahrirlash
nano .env
```

**O'zgartirish kerak bo'lgan qiymatlar:**

```env
# ⚠️ MUHIM: Parollarni o'zgartiring!
DB_PASSWORD=sizning_database_parolingiz_2026
ADMIN_PASSWORD=sizning_admin_parolingiz_2026
CRON_SECRET=sizning_cron_secret_kalitingiz_2026

# Port sozlamalari (kerak bo'lsa)
APP_PORT=3000
DB_PORT=5432
```

**Ctrl+X**, keyin **Y**, keyin **Enter** - saqlash uchun.

### 4️⃣ Deploy qilish

**Avtomatik usul (tavsiya etiladi):**

```bash
./deploy.sh
```

**Manual usul:**

```bash
# Build va run
docker-compose up -d

# Database tayyor bo'lishini kutish
sleep 15

# Database migration
docker exec -it subconverter-app npx drizzle-kit push
```

### 5️⃣ Tekshirish

```bash
# Container holati
docker ps

# App logs
docker logs -f subconverter-app

# Database logs
docker logs subconverter-db
```

Brauzerda oching:
- Local: `http://localhost:3000`
- Server: `http://YOUR_SERVER_IP:3000`

### 6️⃣ Cron Job (avtomatik yangilanish)

**Docker Compose ichida (tavsiya etiladi):**

`docker-compose.yml` da cron service ni uncomment qiling:

```bash
nano docker-compose.yml
```

Cron service qismidagi `#` ni olib tashlang, keyin:

```bash
docker-compose up -d
```

**Server crontab orqali:**

```bash
./setup-cron.sh
```

Yoki manual:

```bash
crontab -e

# Quyidagi qatorni qo'shing (har 30 daqiqada):
*/30 * * * * curl -s -H "Authorization: Bearer SIZNING_CRON_SECRET" http://localhost:3000/api/cron/refresh-sublinks >> /var/log/subconverter-cron.log 2>&1
```

## 🎨 Portainer orqali o'rnatish

### 1️⃣ Portainer Stack yaratish

1. Portainer UI ga kiring: `http://YOUR_SERVER_IP:9000`
2. **Stacks** > **Add stack**
3. Stack nomi: `subconverter`
4. Build method: **Git Repository**
5. Repository URL: `https://github.com/YOUR_USERNAME/subconverter.git`
6. Compose path: `docker-compose.yml`

### 2️⃣ Environment o'zgaruvchilar

**Environment variables** qismida qo'shing:

```
DB_PASSWORD=sizning_database_parolingiz_2026
ADMIN_PASSWORD=sizning_admin_parolingiz_2026
CRON_SECRET=sizning_cron_secret_kalitingiz_2026
APP_PORT=3000
DB_PORT=5432
```

### 3️⃣ Deploy

**Deploy the stack** tugmasini bosing.

### 4️⃣ Migration

Stack deploy qilingandan keyin:

1. **Containers** > **subconverter-app** > **Console**
2. **Connect** tugmasini bosing
3. Buyruq kiriting:

```bash
npx drizzle-kit push
```

## 🔄 Yangilanishlar

### Git orqali yangilash

```bash
cd ~/subconverter
git pull origin main
docker-compose down
docker-compose up -d --build
```

### Portainer orqali

1. Stack ni tanglang
2. **Pull and redeploy** tugmasini bosing

## 🛠️ Foydali buyruqlar

```bash
# Loglarni ko'rish
docker logs -f subconverter-app

# Container ichiga kirish
docker exec -it subconverter-app sh

# Database console
docker exec -it subconverter-db psql -U postgres -d subconverter_db

# Container qayta ishga tushirish
docker-compose restart

# To'xtatish
docker-compose down

# Hammasi bilan o'chirish (data ham)
docker-compose down -v

# Disk usage
docker system df
```

## 🔐 Firewall sozlash (ixtiyoriy)

```bash
# UFW o'rnatish va yoqish
sudo apt install ufw
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 3000/tcp  # SubConverter
sudo ufw enable
```

## 🌐 Nginx Reverse Proxy (ixtiyoriy)

Domain bilan ishlatish uchun:

```bash
# Nginx o'rnatish
sudo apt install nginx

# Config yaratish
sudo nano /etc/nginx/sites-available/subconverter
```

Config:

```nginx
server {
    listen 80;
    server_name subconverter.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Yoqish:

```bash
sudo ln -s /etc/nginx/sites-available/subconverter /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**SSL (Let's Encrypt):**

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d subconverter.example.com
```

## ❓ Muammolar va yechimlar

### Port band

Agar 3000 port band bo'lsa:

```bash
# .env da portni o'zgartiring
APP_PORT=3001
```

### Database ulanmayapti

```bash
# Database containerini qayta ishga tushiring
docker-compose restart postgres

# Loglarni tekshiring
docker logs subconverter-db
```

### Migration xatosi

```bash
# Container ichida manual migration
docker exec -it subconverter-app sh
npx drizzle-kit push
exit
```

## 📞 Yordam

Muammolar bo'lsa:
- GitHub Issues: https://github.com/YOUR_USERNAME/subconverter/issues
- Documentation: README.md
- Logs: `docker logs -f subconverter-app`

## ✅ Tayyor!

Endi sizning SubConverter dasturingiz ishlayapti! 🎉

Dashboard: `http://YOUR_SERVER_IP:3000`

**Keyingi qadamlar:**
1. Sublink qo'shing
2. Foydalanuvchi yarating
3. Subscription URL ni ko'chiring
4. Statistikani kuzating

Good luck! 🚀
