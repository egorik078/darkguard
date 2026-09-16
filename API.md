# 📡 API Documentation

SubConverter REST API to'liq hujjatlari.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Ba'zi endpointlar autentifikatsiya talab qiladi:

- **Cron endpoints:** `Authorization: Bearer {CRON_SECRET}` header kerak

## Endpoints

### 🔗 Sublinks

#### GET /sublinks

Barcha sublinklar ro'yxatini olish.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Test Sublink",
      "url": "https://example.com/sub",
      "format": "base64",
      "isActive": true,
      "totalServers": 15,
      "vlessCount": 5,
      "vmessCount": 7,
      "shadowsocksCount": 3,
      "trojanCount": 0,
      "hysteria2Count": 0,
      "otherCount": 0,
      "lastFetchedAt": "2026-01-15T10:30:00.000Z",
      "lastFetchStatus": "success",
      "lastFetchError": null,
      "createdAt": "2026-01-15T09:00:00.000Z",
      "updatedAt": "2026-01-15T10:30:00.000Z"
    }
  ]
}
```

#### POST /sublinks

Yangi sublink qo'shish.

**Request Body:**

```json
{
  "name": "My Sublink",
  "url": "https://example.com/subscription"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "My Sublink",
    "url": "https://example.com/subscription",
    "format": "base64",
    "totalServers": 10,
    ...
  }
}
```

#### GET /sublinks/[id]

Bitta sublinkni olish.

**Response:**

```json
{
  "success": true,
  "data": { ... }
}
```

#### PUT /sublinks/[id]

Sublinkni yangilash.

**Request Body:**

```json
{
  "name": "Updated Name",
  "url": "https://new-url.com/sub",
  "isActive": false
}
```

#### DELETE /sublinks?id=[id]

Sublinkni o'chirish.

**Response:**

```json
{
  "success": true,
  "message": "Sublink deleted"
}
```

#### POST /sublinks/[id]/refresh

Sublinkni manual refresh qilish (yangi ma'lumotlarni fetch).

**Response:**

```json
{
  "success": true,
  "data": { ... }
}
```

---

### 👥 Users

#### GET /users

Barcha userlar ro'yxati.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Ali",
      "note": "Premium user",
      "sublinkConfigs": [
        {
          "sublinkId": 1,
          "serverLimit": 10
        },
        {
          "sublinkId": 2,
          "serverLimit": 5
        }
      ],
      "expiresAt": "2026-02-15T00:00:00.000Z",
      "isActive": true,
      "createdAt": "2026-01-15T09:00:00.000Z",
      "updatedAt": "2026-01-15T09:00:00.000Z"
    }
  ]
}
```

#### POST /users

Yangi user yaratish.

**Request Body:**

```json
{
  "name": "Vali",
  "note": "Test user",
  "sublinkConfigs": [
    {
      "sublinkId": 1,
      "serverLimit": 20
    }
  ],
  "expiresAt": "2026-03-01T00:00:00.000Z"
}
```

**Response:**

```json
{
  "success": true,
  "data": { ... }
}
```

#### GET /users/[id]

Bitta userni olish.

#### PUT /users/[id]

Userni yangilash.

**Request Body:**

```json
{
  "name": "Vali Updated",
  "isActive": false,
  "expiresAt": "2026-04-01T00:00:00.000Z"
}
```

#### DELETE /users?id=[id]

Userni o'chirish.

#### GET /users/[id]/subscription?format=[base64|raw]

User uchun subscription content generatsiya qilish.

**Query Parameters:**
- `format` (optional): `base64` (default) yoki `raw`

**Response Headers:**

```
Content-Type: text/plain; charset=utf-8
Content-Disposition: attachment; filename="user-subscription.txt"
Subscription-Userinfo: upload=0; download=0; total=0; expire=1234567890
```

**Response Body:**

```
# Base64 format
dmxlc3M6Ly8xMjM0NTY3ODkwYWJjZGVmLi4u
...

# Raw format
vless://uuid@server:443?...
vmess://base64config...
ss://base64config...
```

---

### 📊 Statistics

#### GET /statistics?type=overview

Umumiy statistika.

**Response:**

```json
{
  "success": true,
  "data": {
    "sublinks": {
      "total": 5,
      "active": 4
    },
    "servers": {
      "total": 150,
      "byType": {
        "vless": 50,
        "vmess": 60,
        "shadowsocks": 30,
        "trojan": 5,
        "hysteria2": 3,
        "other": 2
      }
    },
    "access": {
      "last24h": 120
    }
  }
}
```

#### GET /statistics?type=sublinks

Har bir sublink uchun statistika.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Sublink 1",
      "url": "https://...",
      "isActive": true,
      "totalServers": 30,
      "serverTypes": {
        "vless": 10,
        "vmess": 15,
        "shadowsocks": 5,
        ...
      },
      "lastFetchedAt": "2026-01-15T10:30:00.000Z",
      "lastFetchStatus": "success",
      "statistics": {
        "totalFetches": 100,
        "successFetches": 98,
        "errorFetches": 2
      }
    }
  ]
}
```

#### GET /statistics?type=access&limit=100

Access loglar.

**Query Parameters:**
- `limit` (optional): Log soni (default: 100)

**Response:**

```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": 1,
        "userId": 1,
        "sublinkId": null,
        "ipAddress": "192.168.1.100",
        "userAgent": "V2RayNG/1.8.1",
        "createdAt": "2026-01-15T10:30:00.000Z"
      }
    ],
    "userAccessCounts": [
      {
        "userId": 1,
        "count": 25
      }
    ]
  }
}
```

---

### 🔄 Cron

#### GET /cron/refresh-sublinks

Barcha aktiv sublinklar uchun refresh.

**Headers:**

```
Authorization: Bearer {CRON_SECRET}
```

**Response:**

```json
{
  "success": true,
  "timestamp": "2026-01-15T10:30:00.000Z",
  "processedCount": 5,
  "results": [
    {
      "id": 1,
      "name": "Sublink 1",
      "success": true,
      "serversCount": 30,
      "error": null
    },
    {
      "id": 2,
      "name": "Sublink 2",
      "success": false,
      "error": "Network timeout"
    }
  ]
}
```

---

### 🏥 Health

#### GET /health

Database connection check.

**Response:**

```json
{
  "ok": true
}
```

## Error Responses

Barcha xatolar quyidagi formatda:

```json
{
  "success": false,
  "error": "Error message"
}
```

**HTTP Status Codes:**
- `400` - Bad Request (noto'g'ri parametrlar)
- `401` - Unauthorized (autentifikatsiya xatosi)
- `403` - Forbidden (ruxsat yo'q)
- `404` - Not Found (topilmadi)
- `500` - Internal Server Error (server xatosi)

## Examples

### cURL

**Sublink qo'shish:**

```bash
curl -X POST http://localhost:3000/api/sublinks \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Sublink",
    "url": "https://example.com/sub"
  }'
```

**User subscription olish:**

```bash
curl http://localhost:3000/api/users/1/subscription?format=base64
```

**Cron refresh:**

```bash
curl -H "Authorization: Bearer your-cron-secret" \
  http://localhost:3000/api/cron/refresh-sublinks
```

### JavaScript (Fetch)

```javascript
// Sublink qo'shish
const response = await fetch('http://localhost:3000/api/sublinks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'My Sublink',
    url: 'https://example.com/subscription'
  })
});

const data = await response.json();
console.log(data);
```

### Python

```python
import requests

# User yaratish
response = requests.post(
    'http://localhost:3000/api/users',
    json={
        'name': 'Ali',
        'sublinkConfigs': [
            {'sublinkId': 1, 'serverLimit': 10}
        ]
    }
)

print(response.json())
```

## Rate Limiting

Hozircha rate limiting yo'q, lekin production da qo'shish tavsiya etiladi.

## CORS

API barcha originlarga ochiq. Production da faqat kerakli originlarga ruxsat berish tavsiya etiladi.

## Webhooks (Kelajakda)

Kelajakda webhook support qo'shilishi rejalashtirilgan:
- Sublink yangilanganda
- User expiration yaqinlashganda
- Server soni o'zgarganda

---

**API Documentation** - SubConverter v1.0
