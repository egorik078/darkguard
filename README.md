# SubConverter Dashboard

**Professional Subscription Link Converter & Manager** - VPN subscription linklar bilan ishlash uchun to'liq boshqaruv tizimi.

## ✨ Xususiyatlar

### 📡 Sublinklar Boshqaruvi
- Subscription linklar qo'shish va boshqarish
- Base64 va Raw formatlarni avtomatik aniqlash
- Server turlarini avtomatik tahlil qilish (VLESS, VMess, Shadowsocks, Trojan, Hysteria2)
- Har bir sublinkdagi serverlar sonini ko'rish
- Avtomatik yangilanish (har 30-40 daqiqada)

### 👥 Foydalanuvchilar
- Foydalanuvchilar yaratish va boshqarish
- Har bir foydalanuvchiga sublinklar tayinlash
- Server limitlarini belgilash (har bir sublink uchun)
- Vaqt cheklovlarini sozlash
- Shaxsiy subscription URL generatsiya qilish

### 📊 Statistika
- Umumiy statistika (sublinklar, serverlar, so'rovlar)
- Server turlariga ko'ra taqsimlash
- Har bir sublink uchun detallangan statistika
- So'nggi 24 soatdagi access loglar
- Fetch success/error statistikasi

### 🔄 Avtomatik Yangilanish
- Cron job yordamida avtomatik yangilanish
- Manual refresh imkoniyati
- Xatolarni kuzatish va log qilish

## 🚀 O'rnatish

### Docker bilan (Tavsiya etiladi)

#### 1. Repository ni klonlash

```bash
git clone <YOUR_GITHUB_REPO_URL>
cd subconverter
```

#### 2. Environment o'zgaruvchilarini sozlash

```bash
cp .env.example .env
```

`.env` faylini ochib, quyidagi qiymatlarni o'zgartiring:

```env
# Database password
DB_PASSWORD=your_secure_database_password

# Admin credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_admin_password

# Cron secret for auto-refresh
CRON_SECRET=your_secure_cron_secret
```

#### 3. Docker Compose bilan ishga tushirish

```bash
docker-compose up -d
```

Bu quyidagilarni avtomatik ishga tushiradi:
- PostgreSQL database
- Next.js application
- Health check monitoring

#### 4. Database migratsiyasini qo'llash

```bash
# Container ichiga kirish
docker exec -it subconverter-app sh

# Drizzle migration
npx drizzle-kit push
```

#### 5. Dastur tayyor! 🎉

Brauzerda oching: `http://localhost:3000`

### VPS/Server Deployment

#### Portainer bilan

1. **Portainer Stack yaratish:**
   - Portainer UI ga kiring
   - Stacks > Add stack
   - `docker-compose.yml` ni ko'chiring
   - Environment o'zgaruvchilarini kiriting
   - Deploy stack

2. **Database setup:**
   - Container terminaliga kiring
   - `npx drizzle-kit push` buyrug'ini bajaring

#### Manual deployment

```bash
# Git orqali klonlash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd subconverter

# Environment sozlash
cp .env.example .env
nano .env  # o'zgartirish

# Docker build va run
docker-compose up -d

# Database migration
docker exec -it subconverter-app npx drizzle-kit push
```

### Cron Job sozlash (avtomatik yangilanish)

#### Docker Compose ichida

`docker-compose.yml` faylidagi cron service ni uncomment qiling va qayta ishga tushiring:

```bash
docker-compose up -d
```

#### Tashqi cron (VPS server cron)

Server crontab ga qo'shing:

```bash
crontab -e
```

Quyidagi qatorni qo'shing (har 30 daqiqada):

```cron
*/30 * * * * curl -H "Authorization: Bearer YOUR_CRON_SECRET" http://localhost:3000/api/cron/refresh-sublinks
```

yoki har 40 daqiqada:

```cron
*/40 * * * * curl -H "Authorization: Bearer YOUR_CRON_SECRET" http://localhost:3000/api/cron/refresh-sublinks
```

## 🛠️ Texnologiyalar

- **Framework:** Next.js 16 (App Router)
- **Database:** PostgreSQL 16
- **ORM:** Drizzle ORM
- **UI:** React 19 + TailwindCSS
- **Container:** Docker & Docker Compose
- **Runtime:** Node.js 20

## 📁 Loyiha Strukturasi

```
subconverter/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API endpoints
│   │   │   ├── sublinks/      # Sublink CRUD
│   │   │   ├── users/         # User management
│   │   │   ├── statistics/    # Statistics API
│   │   │   └── cron/          # Auto-refresh cron
│   │   ├── page.tsx           # Main dashboard
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── SublinksPanel.tsx
│   │   ├── UsersPanel.tsx
│   │   └── StatisticsPanel.tsx
│   ├── lib/
│   │   └── sublink-parser.ts  # Sublink parser utility
│   └── db/
│       ├── index.ts           # Database connection
│       └── schema.ts          # Database schema
├── docker-compose.yml         # Docker compose config
├── Dockerfile                 # Docker build
├── .env.example              # Environment template
└── README.md                 # Documentation
```

## 🔧 API Endpoints

### Sublinks
- `GET /api/sublinks` - Barcha sublinklar
- `POST /api/sublinks` - Yangi sublink
- `GET /api/sublinks/[id]` - Bitta sublink
- `PUT /api/sublinks/[id]` - Yangilash
- `DELETE /api/sublinks?id=[id]` - O'chirish
- `POST /api/sublinks/[id]/refresh` - Manual refresh

### Users
- `GET /api/users` - Barcha userlar
- `POST /api/users` - Yangi user
- `GET /api/users/[id]` - Bitta user
- `PUT /api/users/[id]` - Yangilash
- `DELETE /api/users?id=[id]` - O'chirish
- `GET /api/users/[id]/subscription?format=base64|raw` - Subscription URL

### Statistics
- `GET /api/statistics?type=overview` - Umumiy statistika
- `GET /api/statistics?type=sublinks` - Sublinklar statistikasi
- `GET /api/statistics?type=access` - Access logs

### Cron
- `GET /api/cron/refresh-sublinks` - Barcha sublinklar refresh (Authorization header kerak)

## 🔐 Xavfsizlik

- Environment o'zgaruvchilar `.env` faylda saqlanadi
- `.env` faylni **hech qachon** Git ga commit qilmang!
- Admin parolni kuchli qiling
- Cron secret ni maxfiy saqlang
- Production da HTTPS ishlatilishi tavsiya etiladi

## 🐛 Debug

Container loglarini ko'rish:

```bash
# App logs
docker logs -f subconverter-app

# Database logs
docker logs -f subconverter-db
```

Database ga ulanish:

```bash
docker exec -it subconverter-db psql -U postgres -d subconverter_db
```

## 📝 License

MIT License - O'zingiz xohlagan maqsadda foydalanishingiz mumkin.

## 🤝 Hissa qo'shish

Pull request va issue larni qabul qilamiz!

## 📧 Aloqa

Savollar bo'lsa, issue oching yoki email yuboring.

---

**SubConverter Dashboard** - Professional VPN subscription manager 🚀
