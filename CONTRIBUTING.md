# 🤝 Contributing to SubConverter

SubConverter loyihasiga hissa qo'shganingiz uchun rahmat! Biz har qanday turdagi hissalarni qabul qilamiz.

## 📋 Qanday hissa qo'shish mumkin?

- 🐛 Bug report (xato hisoboti)
- ✨ Feature request (yangi xususiyat taklifi)
- 📝 Documentation improvements (dokumentatsiya yaxshilash)
- 💻 Code contributions (kod hissalari)
- 🌍 Translations (tarjimalar)
- 🧪 Testing (test yozish)

## 🚀 Getting Started

### 1. Fork qiling

GitHub da repository ni fork qiling.

### 2. Clone qiling

```bash
git clone https://github.com/YOUR_USERNAME/subconverter.git
cd subconverter
```

### 3. Development environment

```bash
# Dependencies o'rnatish
npm install

# Environment sozlash
cp .env.example .env
# .env ni tahrirlang

# Database ishga tushirish (Docker orqali)
docker-compose up -d postgres

# Database migration
npx drizzle-kit push

# Development server
npm run dev
```

Browser: http://localhost:3000

## 🔧 Development Workflow

### Branch yaratish

```bash
# Feature branch
git checkout -b feature/amazing-feature

# Bug fix branch
git checkout -b fix/bug-description

# Documentation branch
git checkout -b docs/update-readme
```

### Kod yozish

1. **TypeScript** ishlatamiz - type safety uchun
2. **ESLint** qoidalariga amal qiling
3. **TailwindCSS** ishlatamiz - styling uchun
4. **Comments** yozing - murakkab logika uchun

**Code style:**

```typescript
// ✅ Yaxshi
async function fetchSublink(url: string): Promise<ServerInfo[]> {
  try {
    const response = await fetch(url);
    // ...
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// ❌ Yomon
async function fetchSublink(url) {
  const response = await fetch(url);
  // error handling yo'q
}
```

### Testing

```bash
# Type checking
npm run typecheck

# Build test
npm run build

# Linting
npm run lint
```

### Commit messages

Conventional Commits format ishlatamiz:

```bash
# Feature
git commit -m "feat: add hysteria2 protocol support"

# Bug fix
git commit -m "fix: correct base64 decoding for large files"

# Documentation
git commit -m "docs: update installation guide"

# Refactor
git commit -m "refactor: improve sublink parser performance"

# Style
git commit -m "style: format code with prettier"

# Test
git commit -m "test: add unit tests for parser"
```

**Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat` - Yangi xususiyat
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting, CSS
- `refactor` - Code refactoring
- `test` - Tests
- `chore` - Build, dependencies

### Pull Request

1. Push to your fork:
   ```bash
   git push origin feature/amazing-feature
   ```

2. GitHub da Pull Request oching

3. PR description:
   ```markdown
   ## Changes
   - Feature X qo'shildi
   - Bug Y tuzatildi
   
   ## Testing
   - Manual testing amalga oshirildi
   - TypeScript check o'tdi
   
   ## Screenshots (agar UI o'zgarsa)
   ![Screenshot](url)
   ```

4. Review jarayonini kuting

## 📝 Code Guidelines

### TypeScript

- Har doim type annotation yozing
- `any` dan qoching
- Interface va Type ishlatamiz
- Strict mode yoqiq

```typescript
// ✅ Yaxshi
interface User {
  id: number;
  name: string;
  configs: SublinkConfig[];
}

function getUser(id: number): Promise<User | null> {
  // ...
}

// ❌ Yomon
function getUser(id) {
  // type yo'q
}
```

### React Components

- Functional components ishlatamiz
- Hooks to'g'ri ishlatamiz
- Props typing

```typescript
// ✅ Yaxshi
interface PanelProps {
  title: string;
  onRefresh: () => void;
}

export default function Panel({ title, onRefresh }: PanelProps) {
  const [data, setData] = useState<Data[]>([]);
  // ...
}
```

### API Routes

- Error handling
- Input validation
- Consistent response format

```typescript
// ✅ Yaxshi
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validation
    if (!body.name || !body.url) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Logic
    const result = await createSublink(body);
    
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Database

- Drizzle ORM ishlatamiz
- Migration orqali schema o'zgartirish
- Transaction ishlatamiz (kerak bo'lganda)

```typescript
// ✅ Yaxshi
const [user] = await db.insert(users)
  .values({ name, configs })
  .returning();

// ❌ Yomon
// Raw SQL (faqat kerak bo'lganda)
```

## 🐛 Bug Report

GitHub Issues da yangi issue oching:

**Template:**

```markdown
## Bug tavsifi
Qisqa tavsif

## Takrorlash qadamlari
1. Birinchi qadam
2. Ikkinchi qadam
3. Xato paydo bo'ladi

## Kutilgan natija
Nima bo'lishi kerak edi

## Haqiqiy natija
Nima bo'ldi

## Screenshots
(Agar mavjud bo'lsa)

## Environment
- OS: Ubuntu 22.04
- Docker: 24.0.5
- Browser: Chrome 120

## Qo'shimcha ma'lumot
```

## ✨ Feature Request

**Template:**

```markdown
## Feature tavsifi
Yangi xususiyat haqida

## Muammo
Qanday muammo hal qiladi

## Taklif qilingan yechim
Qanday ishlashi kerak

## Alternativalar
Boshqa yechimlar

## Qo'shimcha
```

## 📚 Documentation

Documentation yaxshilash:

- Typo tuzatish
- Misollar qo'shish
- Tushuntirish yaxshilash
- Screenshot qo'shish
- Translation

**Fayllar:**
- `README.md` - Asosiy
- `INSTALLATION.md` - O'rnatish
- `QUICKSTART.md` - Tez boshlash
- `API.md` - API docs
- `PROJECT_STRUCTURE.md` - Struktura

## 🧪 Testing

Unit test yozish:

```typescript
// __tests__/sublink-parser.test.ts
import { detectServerType } from '@/lib/sublink-parser';

describe('detectServerType', () => {
  it('should detect VLESS protocol', () => {
    const result = detectServerType('vless://uuid@server:443');
    expect(result).toBe('vless');
  });
  
  // More tests...
});
```

## 🌍 Translation

Yangi til qo'shish:

1. `src/locales/` papka yaratish
2. Translation files qo'shish
3. i18n setup
4. Components update

## ✅ Checklist before PR

- [ ] Code TypeScript type checking o'tdi
- [ ] Lint xatolari yo'q
- [ ] Build muvaffaqiyatli
- [ ] Manual testing amalga oshirildi
- [ ] Documentation yangilandi
- [ ] Commit messages to'g'ri
- [ ] Branch up-to-date with main

## 🎯 Priority Areas

Yordam kerak bo'lgan joylar:

1. **Testing** - Unit va integration tests
2. **Documentation** - Misollar, screenshot
3. **Performance** - Optimization
4. **Security** - Security review
5. **UI/UX** - Design improvements
6. **i18n** - Multi-language support

## 💬 Communication

- **GitHub Issues** - Bug va feature request
- **Pull Requests** - Code review
- **Discussions** - Umumiy muhokama

## 📄 License

Hissa qo'shish orqali, kodingiz MIT License ostida bo'lishiga rozisiz.

## 🙏 Rahmat!

Har bir hissa muhim! Katta yoki kichik, hammasini qadrlaymiz.

---

**Savollar bor?** Issue oching yoki PR da so'rang!
