# 📁 SubConverter - Loyiha Strukturasi

To'liq loyiha arxitekturasi va fayl tashkiloti.

## 🌳 Directory Tree

```
subconverter/
│
├── .github/                          # GitHub Actions workflows
│   └── workflows/
│       └── docker-publish.yml        # Docker image publish CI/CD
│
├── src/                              # Asosiy kodlar
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # Backend API endpoints
│   │   │   ├── cron/                 # Cron job endpoints
│   │   │   │   └── refresh-sublinks/
│   │   │   │       └── route.ts      # Auto-refresh barcha sublinks
│   │   │   ├── health/               
│   │   │   │   └── route.ts          # Health check endpoint
│   │   │   ├── statistics/           
│   │   │   │   └── route.ts          # Statistika API
│   │   │   ├── sublinks/             
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── route.ts      # GET, PUT sublink by ID
│   │   │   │   │   └── refresh/
│   │   │   │   │       └── route.ts  # Manual refresh sublink
│   │   │   │   └── route.ts          # GET, POST, DELETE sublinks
│   │   │   └── users/                
│   │   │       ├── [id]/
│   │   │       │   ├── route.ts      # GET, PUT user by ID
│   │   │       │   └── subscription/
│   │   │       │       └── route.ts  # Generate subscription URL
│   │   │       └── route.ts          # GET, POST, DELETE users
│   │   │
│   │   ├── globals.css               # Global CSS styles
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Main dashboard page
│   │
│   ├── components/                   # React components
│   │   ├── SublinksPanel.tsx         # Sublinklar panel
│   │   ├── UsersPanel.tsx            # Foydalanuvchilar panel
│   │   └── StatisticsPanel.tsx       # Statistika panel
│   │
│   ├── db/                           # Database layer
│   │   ├── index.ts                  # Drizzle client & connection
│   │   └── schema.ts                 # Database schema (tables)
│   │
│   └── lib/                          # Utility functions
│       └── sublink-parser.ts         # Sublink parser & decoder
│
├── public/                           # Static files
│   └── (empty - foydalanuvchi qo'shishi mumkin)
│
├── .dockerignore                     # Docker build ignore list
├── .env                              # Environment variables (gitignore)
├── .env.example                      # Environment template
├── .gitignore                        # Git ignore list
├── API.md                            # API documentation
├── CREDENTIALS.md                    # Parollar ro'yxati (gitignore!)
├── docker-compose.yml                # Docker Compose konfiguratsiya
├── Dockerfile                        # Docker build instructions
├── drizzle.config.json               # Drizzle ORM config
├── deploy.sh                         # Deploy script (chmod +x)
├── eslint.config.mjs                 # ESLint konfiguratsiya
├── INSTALLATION.md                   # O'rnatish yo'riqnomasi
├── next.config.ts                    # Next.js konfiguratsiya
├── package.json                      # NPM dependencies
├── package-lock.json                 # NPM lock file
├── postcss.config.mjs                # PostCSS config
├── PROJECT_STRUCTURE.md              # Bu fayl
├── QUICKSTART.md                     # Tez ishga tushirish
├── README.md                         # Asosiy dokumentatsiya
├── seed.ts                           # Database seed script
├── setup-cron.sh                     # Cron setup script (chmod +x)
├── tailwind.config.ts                # TailwindCSS config
└── tsconfig.json                     # TypeScript config
```

## 🔧 Asosiy Komponentlar

### 1. Backend API (`src/app/api/`)

**Sublinks Endpoints:**
- CRUD operatsiyalar
- Avtomatik fetch va parse
- Server turlari tahlili
- Manual refresh

**Users Endpoints:**
- CRUD operatsiyalar
- Sublink configs boshqaruvi
- Subscription URL generatsiya
- Access logging

**Statistics Endpoints:**
- Umumiy statistika
- Sublink-specific stats
- Access logs

**Cron Endpoints:**
- Avtomatik refresh
- Scheduled updates

### 2. Frontend (`src/app/`)

**Main Page (`page.tsx`):**
- Dashboard layout
- Tab navigation
- Panel routing

**Components:**
- `SublinksPanel` - Sublinklar boshqaruvi
- `UsersPanel` - Foydalanuvchilar boshqaruvi
- `StatisticsPanel` - Statistika ko'rinishi

### 3. Database (`src/db/`)

**Schema (`schema.ts`):**

```typescript
- sublinks          // Subscription linklar
- users             // Foydalanuvchilar
- statistics        // Fetch statistika
- accessLogs        // Access loglar
```

**Relations:**
- `statistics` → `sublinks` (foreign key)
- `accessLogs` → `users` (foreign key, nullable)
- `accessLogs` → `sublinks` (foreign key, nullable)

### 4. Utilities (`src/lib/`)

**sublink-parser.ts:**
- `fetchAndParseSublink()` - Fetch va parse
- `detectServerType()` - Server turi aniqlash
- `decodeBase64()` - Base64 decoder
- `parseSublink()` - Content parser
- `countServerTypes()` - Server soni
- `mergeServers()` - Ko'p sublinkdan merge
- `limitServers()` - Server limit
- `exportAsBase64()` - Base64 export
- `exportAsRaw()` - Raw export

## 🗄️ Database Schema

### `sublinks` table

| Column | Type | Description |
|--------|------|-------------|
| id | serial | Primary key |
| name | text | Sublink nomi |
| url | text | Subscription URL (unique) |
| format | text | 'base64' yoki 'raw' |
| isActive | boolean | Faol yoki yo'q |
| totalServers | integer | Jami serverlar soni |
| vlessCount | integer | VLESS serverlar |
| vmessCount | integer | VMess serverlar |
| shadowsocksCount | integer | Shadowsocks serverlar |
| trojanCount | integer | Trojan serverlar |
| hysteria2Count | integer | Hysteria2 serverlar |
| otherCount | integer | Boshqa serverlar |
| lastFetchedAt | timestamp | Oxirgi fetch vaqti |
| lastFetchStatus | text | 'success' yoki 'error' |
| lastFetchError | text | Xato matni |
| serversData | jsonb | Barcha serverlar (JSON) |
| createdAt | timestamp | Yaratilgan vaqt |
| updatedAt | timestamp | Yangilangan vaqt |

### `users` table

| Column | Type | Description |
|--------|------|-------------|
| id | serial | Primary key |
| name | text | Foydalanuvchi ismi |
| note | text | Izoh (nullable) |
| sublinkConfigs | jsonb | Sublink configs (JSON array) |
| expiresAt | timestamp | Muddati (nullable) |
| isActive | boolean | Faol yoki yo'q |
| createdAt | timestamp | Yaratilgan vaqt |
| updatedAt | timestamp | Yangilangan vaqt |

**sublinkConfigs format:**
```json
[
  { "sublinkId": 1, "serverLimit": 10 },
  { "sublinkId": 2, "serverLimit": 5 }
]
```

### `statistics` table

| Column | Type | Description |
|--------|------|-------------|
| id | serial | Primary key |
| sublinkId | integer | FK → sublinks.id |
| fetchCount | integer | Jami fetch count |
| successCount | integer | Muvaffaqiyatli |
| errorCount | integer | Xatolar |
| date | timestamp | Sana |

### `accessLogs` table

| Column | Type | Description |
|--------|------|-------------|
| id | serial | Primary key |
| userId | integer | FK → users.id (nullable) |
| sublinkId | integer | FK → sublinks.id (nullable) |
| ipAddress | text | IP manzil |
| userAgent | text | User agent |
| createdAt | timestamp | Access vaqti |

## 🐳 Docker Architecture

### Services

1. **postgres** - PostgreSQL 16
   - Port: 5432
   - Volume: postgres_data
   - Healthcheck: pg_isready

2. **app** - Next.js application
   - Port: 3000
   - Depends: postgres
   - Healthcheck: /api/health

3. **cron** (optional) - Auto-refresh
   - Curl-based
   - 30-minute interval
   - Calls /api/cron/refresh-sublinks

### Volumes

- `postgres_data` - Database persistence

### Networks

- Default bridge network

## 🔄 Data Flow

### 1. Sublink qo'shish

```
User → POST /api/sublinks
  → fetchAndParseSublink(url)
    → HTTP fetch
    → Base64/Raw detection
    → Server parsing
    → Type counting
  → Database insert
  → Response
```

### 2. User subscription

```
Client → GET /api/users/[id]/subscription
  → User validation
  → Expiry check
  → Sublinklar fetch (from DB)
  → Server merging
  → Server limiting
  → Access log
  → Export (base64/raw)
  → Response
```

### 3. Cron refresh

```
Cron → GET /api/cron/refresh-sublinks
  → Auth check (Bearer token)
  → Active sublinks fetch
  → For each sublink:
    → fetchAndParseSublink()
    → Statistics insert
    → Sublink update
  → Response summary
```

## 📦 NPM Packages

### Dependencies

- `next` - React framework
- `react` & `react-dom` - React library
- `drizzle-orm` - TypeScript ORM
- `pg` - PostgreSQL driver
- `dotenv` - Environment variables

### Dev Dependencies

- `typescript` - TypeScript compiler
- `@types/*` - Type definitions
- `drizzle-kit` - Drizzle CLI tools
- `tailwindcss` - CSS framework
- `eslint` - Code linter
- `tsx` - TypeScript executor

## 🔐 Security Layers

1. **Environment Variables** - Sensitive data
2. **Database** - Internal network only
3. **Cron Auth** - Bearer token
4. **Docker Network** - Isolated containers
5. **Access Logs** - Tracking

## 🚀 Deployment Flow

1. Clone repository
2. Copy `.env.example` → `.env`
3. Edit credentials
4. Run `./deploy.sh`
5. Database migration
6. Setup cron
7. Monitor logs

## 📊 Monitoring Points

- `/api/health` - Health check
- `docker logs` - Application logs
- Database queries - Performance
- Cron execution - Success rate
- Access logs - User activity

## 🔮 Kelajakda qo'shilishi mumkin

- [ ] Admin panel (authentication)
- [ ] User authentication
- [ ] Rate limiting
- [ ] Webhook support
- [ ] Advanced analytics
- [ ] Multi-user admin
- [ ] Email notifications
- [ ] Telegram bot integration
- [ ] Custom server filtering
- [ ] Load balancing

---

**Project Structure** - SubConverter v1.0
