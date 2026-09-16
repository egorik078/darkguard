#!/bin/bash

# SubConverter Deployment Script
# Bu script VPS serverda osongina deploy qilish uchun

set -e

echo "🚀 SubConverter Deployment Script"
echo "=================================="

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env fayli topilmadi. .env.example dan nusxa olinmoqda..."
    cp .env.example .env
    echo "✅ .env fayli yaratildi. Iltimos, parollarni o'zgartiring!"
    echo "📝 nano .env - buyrug'i bilan tahrirlang"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker o'rnatilmagan! Docker o'rnatish kerak."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose o'rnatilmagan! Docker Compose o'rnatish kerak."
    exit 1
fi

echo "📦 Docker containers build qilinmoqda..."
docker-compose build

echo "🔄 Containers ishga tushirilmoqda..."
docker-compose up -d

echo "⏳ Database tayyor bo'lishini kutmoqda..."
sleep 10

echo "🗄️  Database migration qo'llanmoqda..."
docker exec -it subconverter-app npx drizzle-kit push || {
    echo "⚠️  Migration xatosi. Qayta urinib ko'ring:"
    echo "   docker exec -it subconverter-app npx drizzle-kit push"
}

echo ""
echo "✅ Deployment muvaffaqiyatli yakunlandi!"
echo ""
echo "📊 Dashboard: http://localhost:3000"
echo "🔍 Loglarni ko'rish: docker logs -f subconverter-app"
echo "🛑 To'xtatish: docker-compose down"
echo "♻️  Qayta ishga tushirish: docker-compose restart"
echo ""
echo "🎉 SubConverter tayyor!"
