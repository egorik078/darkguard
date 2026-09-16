# Changelog

Barcha muhim o'zgarishlar bu faylda qayd qilinadi.

Format [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) asosida.

## [1.0.0] - 2026-01-15

### ✨ Qo'shildi (Added)

#### Core Features
- 📡 Sublinklar boshqaruvi (CRUD)
- 👥 Foydalanuvchilar boshqaruvi (CRUD)
- 📊 Statistika paneli
- 🔄 Avtomatik refresh (cron job)
- 🌐 Subscription URL generatsiya

#### Sublink Features
- Base64 va Raw format qo'llab-quvvatlash
- Avtomatik format aniqlash
- Server turlari parse qilish:
  - VLESS
  - VMess
  - Shadowsocks
  - Trojan
  - Hysteria2
  - Other protocols
- Server soni counting
- Manual refresh imkoniyati
- Active/Inactive toggle

#### User Features
- User yaratish va boshqarish
- Sublink configs (qaysi sublinkdan nechta server)
- Vaqt cheklovi (expires at)
- Active/Inactive status
- Subscription URL (Base64/Raw format)
- Access logging

#### Statistics
- Umumiy statistika:
  - Sublinklar soni
  - Serverlar soni
  - Server turlari bo'yicha
- Sublink-specific statistika:
  - Fetch count
  - Success/Error rate
  - Server details
- Access logs:
  - Last 24h access
  - Per-user access count
  - IP va User-Agent tracking

#### API
- RESTful API endpoints
- `/api/sublinks` - CRUD
- `/api/users` - CRUD
- `/api/statistics` - Ma'lumotlar
- `/api/cron/refresh-sublinks` - Auto-refresh
- `/api/health` - Health check

#### UI/UX
- Modern dashboard design
- Tab navigation (Sublinklar, Users, Statistika)
- Real-time updates
- Responsive design (Mobile-friendly)
- TailwindCSS styling
- Loading states
- Error handling

#### Docker & Deployment
- Docker support
- Docker Compose konfiguratsiya
- PostgreSQL container
- Auto-migration support
- Health checks
- Volume persistence
- Cron container (optional)

#### Documentation
- README.md - Asosiy dokumentatsiya
- INSTALLATION.md - O'rnatish yo'riqnomasi
- QUICKSTART.md - Tez boshlash
- API.md - API hujjatlari
- PROJECT_STRUCTURE.md - Loyiha strukturasi
- CONTRIBUTING.md - Hissa qo'shish
- CREDENTIALS.md - Parollar ro'yxati
- CHANGELOG.md - O'zgarishlar tarixi

#### Scripts
- `deploy.sh` - Avtomatik deployment
- `setup-cron.sh` - Cron job setup
- `seed.ts` - Test ma'lumotlar

#### Security
- Environment variables
- Password protection
- Cron secret authorization
- Access logging
- Docker network isolation

### 🔧 Technical Stack
- **Frontend:** Next.js 16 (App Router), React 19, TailwindCSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL 16
- **ORM:** Drizzle ORM
- **Container:** Docker, Docker Compose
- **Language:** TypeScript 5.9

### 📦 Dependencies
```json
{
  "next": "16.2.6",
  "react": "19.2.6",
  "drizzle-orm": "0.45.2",
  "pg": "8.20.0",
  "tailwindcss": "4.1.17",
  "typescript": "5.9.3"
}
```

### 🎯 Features Summary

**Sublinklar:**
- ✅ Qo'shish, o'chirish, yangilash
- ✅ Avtomatik parse va tahlil
- ✅ Format detection
- ✅ Server counting
- ✅ Manual refresh

**Foydalanuvchilar:**
- ✅ User CRUD
- ✅ Sublink assignment
- ✅ Server limiting
- ✅ Expiration date
- ✅ Subscription URL

**Statistika:**
- ✅ Overview dashboard
- ✅ Server type breakdown
- ✅ Fetch statistics
- ✅ Access logs
- ✅ Per-sublink stats

**Avtomatizatsiya:**
- ✅ Cron job support
- ✅ Auto-refresh every 30-40 min
- ✅ Error handling
- ✅ Statistics logging

**Deployment:**
- ✅ Docker ready
- ✅ Portainer compatible
- ✅ One-command deploy
- ✅ Auto-migration
- ✅ Health monitoring

---

## [Unreleased]

### 🔮 Rejalashtirilgan (Planned)

#### v1.1.0
- [ ] Admin authentication panel
- [ ] Rate limiting
- [ ] User authentication
- [ ] Advanced filtering
- [ ] Export data (CSV, JSON)

#### v1.2.0
- [ ] Webhook support
- [ ] Email notifications
- [ ] Telegram bot integration
- [ ] Multi-language support (i18n)
- [ ] Dark mode

#### v1.3.0
- [ ] Advanced analytics
- [ ] Server ping test
- [ ] Load balancing
- [ ] Backup/Restore UI
- [ ] API key management

#### Future
- [ ] Mobile app
- [ ] Browser extension
- [ ] Grafana dashboard
- [ ] Prometheus metrics
- [ ] Clustering support

---

## Version History

### [1.0.0] - 2026-01-15
Initial release with core functionality.

---

**Format:**
- ✨ Added - Yangi xususiyatlar
- 🔧 Changed - O'zgartirishlar
- 🐛 Fixed - Bug fixes
- 🗑️ Removed - O'chirilgan
- 🔒 Security - Xavfsizlik
- 📝 Documentation - Hujjatlar

---

**Full Changelog:** https://github.com/YOUR_USERNAME/subconverter/commits/main
