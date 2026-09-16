# 🚀 Quick Start Guide

SubConverter dasturini tez ishga tushirish yo'riqnomasi.

## ⚡ 3 daqiqada ishga tushiring!

### 1. Repository klonlash

```bash
git clone https://github.com/YOUR_USERNAME/subconverter.git
cd subconverter
```

### 2. Environment sozlash

```bash
cp .env.example .env
nano .env  # Parollarni o'zgartiring!
```

### 3. Deploy

```bash
./deploy.sh
```

Tayyor! 🎉 Oching: http://localhost:3000

## 📝 Birinchi qadamlar

### 1. Sublink qo'shish

1. Dashboard ga kiring
2. **📡 Sublinklar** tab ga o'ting
3. **+ Yangi Sublink** tugmasini bosing
4. Ma'lumotlarni kiriting:
   - **Nomi:** Masalan, "Free Servers"
   - **URL:** Subscription link URL
5. **Qo'shish** tugmasini bosing

Dastur avtomatik ravishda:
- Sublinkni fetch qiladi
- Format aniqlanadi (Base64/Raw)
- Serverlar parse qilinadi
- Turlar bo'yicha sanalib chiqiladi

### 2. Foydalanuvchi yaratish

1. **👥 Foydalanuvchilar** tab ga o'ting
2. **+ Yangi Foydalanuvchi** tugmasini bosing
3. Ma'lumotlarni kiriting:
   - **Ismi:** Masalan, "Ali"
   - **Izoh:** Ixtiyoriy
   - **Muddati:** Qachongacha amal qilsin
   - **Sublinklar:** Qaysi sublinkdan nechta server berish
4. **Qo'shish** tugmasini bosing

### 3. Subscription URL olish

Foydalanuvchi kartochkasida **Subscription URL** ko'rinadi:

```
http://localhost:3000/api/users/1/subscription?format=base64
```

Bu URLni VPN klientga (V2Ray, Clash, etc.) qo'shing!

### 4. Statistikani ko'rish

**📊 Statistika** tab da:
- Umumiy statistika
- Server turlari
- Access loglar
- Har bir sublink statistikasi

## 🔄 Avtomatik yangilanish

### Docker Compose usuli

`docker-compose.yml` da cron service ni yoqing:

```yaml
# Uncomment qiling:
cron:
  image: curlimages/curl:latest
  ...
```

Qayta ishga tushiring:

```bash
docker-compose up -d
```

### Server cron usuli

```bash
./setup-cron.sh
```

## 🔧 Asosiy buyruqlar

```bash
# Loglarni ko'rish
docker logs -f subconverter-app

# Qayta ishga tushirish
docker-compose restart

# To'xtatish
docker-compose down

# Yangilash
git pull && docker-compose up -d --build
```

## 📱 VPN Klient sozlash

### V2RayNG (Android)

1. V2RayNG ni oching
2. **+** > **Import config from URL**
3. Subscription URL ni kiriting
4. **OK**
5. **Update subscription**

### V2RayN (Windows)

1. V2RayN ni oching
2. **Subscription** > **Subscription setting**
3. **Add** tugmasini bosing
4. URL kiriting
5. **Update subscription**

### Clash

1. Clash ni oching
2. **Profiles**
3. **Import** > **From URL**
4. Subscription URL ni kiriting (format=raw ishlatish mumkin)

## ⚙️ Sozlamalar

### Port o'zgartirish

`.env` faylda:

```env
APP_PORT=8080
```

Qayta ishga tushiring:

```bash
docker-compose down && docker-compose up -d
```

### Database backup

```bash
docker exec subconverter-db pg_dump -U postgres subconverter_db > backup.sql
```

### Restore

```bash
cat backup.sql | docker exec -i subconverter-db psql -U postgres subconverter_db
```

## 🌐 Domain sozlash (ixtiyoriy)

Nginx reverse proxy sozlang:

```nginx
server {
    listen 80;
    server_name sub.example.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

SSL (Let's Encrypt):

```bash
sudo certbot --nginx -d sub.example.com
```

## ❓ Tez-tez so'raladigan savollar

**Q: Sublink qo'shilmayapti?**
A: URL to'g'riligini tekshiring. Ba'zi sublinklar CORS yoki auth talab qilishi mumkin.

**Q: Database ulanmayapti?**
A: `docker logs subconverter-db` orqali xatoni ko'ring. Port band bo'lishi mumkin.

**Q: Cron ishlamayapti?**
A: CRON_SECRET to'g'riligini va cron service yoniqligini tekshiring.

**Q: User subscription URL ishlamayapti?**
A: User aktiv va muddati tugamaganligini tekshiring.

## 📚 Qo'shimcha ma'lumot

- To'liq yo'riqnoma: [INSTALLATION.md](INSTALLATION.md)
- README: [README.md](README.md)
- GitHub Issues: https://github.com/YOUR_USERNAME/subconverter/issues

## 🎯 Keyingi qadamlar

1. ✅ Sublink qo'shing
2. ✅ User yarating
3. ✅ VPN klientga ulang
4. ✅ Statistikani monitoring qiling
5. ✅ Cron job sozlang
6. ✅ Domain va SSL qo'shing (production uchun)

**Omad! 🚀**
