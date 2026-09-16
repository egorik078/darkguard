# 🔐 Credentials & Passwords

**⚠️ MUHIM: Bu faylni git ga commit qilmang! Faqat shaxsiy serveringizda saqlang!**

## Database Credentials

```
Database Host: localhost (yoki postgres container nomi)
Database Port: 5432
Database Name: subconverter_db
Database User: postgres
Database Password: postgres_secure_pass_2026
```

**Full Connection String:**
```
postgresql://postgres:postgres_secure_pass_2026@localhost:5432/subconverter_db
```

## Admin Panel (Kelajakda qo'shiladi)

```
Username: admin
Password: SubConv3rt3r2026!SecurePass
```

## Cron Job Secret

```
CRON_SECRET: cron_s3cr3t_k3y_2026_subconv3rt3r
```

**Cron ishlatish:**
```bash
curl -H "Authorization: Bearer cron_s3cr3t_k3y_2026_subconv3rt3r" \
  http://localhost:3000/api/cron/refresh-sublinks
```

## Environment File (.env)

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:postgres_secure_pass_2026@localhost:5432/subconverter_db
DB_PASSWORD=postgres_secure_pass_2026
DB_PORT=5432

# Application Configuration
APP_PORT=3000

# Admin panel access credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=SubConv3rt3r2026!SecurePass

# Application settings
CRON_SECRET=cron_s3cr3t_k3y_2026_subconv3rt3r
NEXT_PUBLIC_APP_NAME=SubConverter Dashboard
```

## Xavfsizlik Maslahatlari

### 🔒 Parollarni o'zgartirish (JUDA MUHIM!)

Production serverda deploy qilishdan oldin **BARCHA** parollarni o'zgartiring:

1. **Database Password** - Murakkab parol qo'ying
2. **Admin Password** - Kuchli parol (kamida 12 belgi, harflar, raqamlar, belgilar)
3. **Cron Secret** - Random string (32+ belgi)

**Parol generatsiya:**

```bash
# Random password generatsiya (Linux/Mac)
openssl rand -base64 32

# yoki
head /dev/urandom | tr -dc A-Za-z0-9 | head -c 32

# yoki online: https://passwordsgenerator.net/
```

### 🛡️ Production Checklist

- [ ] Barcha parollar o'zgartirildi
- [ ] `.env` fayli `.gitignore` da
- [ ] Firewall sozlandi (faqat kerakli portlar ochiq)
- [ ] HTTPS (SSL) sozlandi
- [ ] Database tashqaridan ulanish o'chirilgan
- [ ] Regular backup sozlandi
- [ ] Monitoring sozlandi

### 📁 Fayllar xavfsizligi

```bash
# .env fayl faqat owner o'qishi uchun
chmod 600 .env

# Credentials fayl xavfsizligi
chmod 600 CREDENTIALS.md

# .gitignore tekshirish
cat .gitignore | grep .env
```

### 🔄 Parol o'zgartirish

Agar parolni o'zgartirsangiz:

1. `.env` faylni yangilang
2. Docker containerlarni qayta ishga tushiring:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

### 🗄️ Database Backup

Regular backup oling:

```bash
# Backup
docker exec subconverter-db pg_dump -U postgres subconverter_db > backup_$(date +%Y%m%d).sql

# Backup with password
docker exec -e PGPASSWORD=postgres_secure_pass_2026 subconverter-db \
  pg_dump -U postgres subconverter_db > backup.sql

# Restore
cat backup.sql | docker exec -i subconverter-db psql -U postgres subconverter_db
```

### 📊 Monitoring

Quyidagi narsalarni monitor qiling:

- Database ulanishlari
- Cron job execution
- API error rate
- Disk space
- Memory usage

### 🚨 Xavfsizlik Hodisasi

Agar parol oshkor bo'lsa:

1. **Darhol** parolni o'zgartiring
2. Barcha ulanishlarni tekshiring
3. Database loglarini ko'ring
4. Keraksiz userlarni o'chiring
5. Backup yarating

## Test Credentials (Development Only)

Faqat local development uchun:

```
Test Sublink: https://example.com/subscription
Test User: Test User 1
Test Note: Bu test foydalanuvchi
```

**⚠️ Production da test credentials ishlatmang!**

## Contact

Xavfsizlik masalalari bo'yicha:
- Email: security@example.com
- GitHub Issues: https://github.com/YOUR_USERNAME/subconverter/issues

---

**Last Updated:** 2026-01-15

**⚠️ Eslatma: Bu faylni git repository ga commit qilmang! Faqat xavfsiz joyda saqlang!**
