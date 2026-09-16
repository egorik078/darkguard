#!/bin/bash

# Cron job setup script
# Bu script server crontab ga auto-refresh job qo'shadi

echo "⏰ Cron Job Setup - SubConverter Auto Refresh"
echo "=============================================="

# Get CRON_SECRET from .env
if [ -f .env ]; then
    export $(cat .env | grep CRON_SECRET | xargs)
else
    echo "❌ .env fayli topilmadi!"
    exit 1
fi

if [ -z "$CRON_SECRET" ]; then
    echo "❌ CRON_SECRET topilmadi .env faylida!"
    exit 1
fi

echo "🔑 CRON_SECRET topildi: ${CRON_SECRET:0:10}..."

# Get APP_PORT from .env or use default
if [ -f .env ]; then
    export $(cat .env | grep APP_PORT | xargs)
fi
APP_PORT=${APP_PORT:-3000}

# Ask for interval
echo ""
echo "Qancha vaqt oralig'ida yangilansin?"
echo "1) Har 30 daqiqada"
echo "2) Har 40 daqiqada"
echo "3) Har soatda"
echo "4) Custom"
read -p "Tanlang (1-4): " choice

case $choice in
    1)
        CRON_SCHEDULE="*/30 * * * *"
        ;;
    2)
        CRON_SCHEDULE="*/40 * * * *"
        ;;
    3)
        CRON_SCHEDULE="0 * * * *"
        ;;
    4)
        read -p "Cron schedule kiriting (masalan: */30 * * * *): " CRON_SCHEDULE
        ;;
    *)
        echo "❌ Noto'g'ri tanlov!"
        exit 1
        ;;
esac

# Create cron job command
CRON_COMMAND="curl -s -H \"Authorization: Bearer $CRON_SECRET\" http://localhost:$APP_PORT/api/cron/refresh-sublinks >> /var/log/subconverter-cron.log 2>&1"

# Full cron line
CRON_LINE="$CRON_SCHEDULE $CRON_COMMAND"

echo ""
echo "📋 Quyidagi cron job qo'shiladi:"
echo "$CRON_LINE"
echo ""
read -p "Davom etamizmi? (y/n): " confirm

if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "❌ Bekor qilindi"
    exit 0
fi

# Add to crontab
(crontab -l 2>/dev/null; echo "$CRON_LINE") | crontab -

echo "✅ Cron job muvaffaqiyatli qo'shildi!"
echo ""
echo "🔍 Joriy crontab:"
crontab -l | grep subconverter
echo ""
echo "📝 Loglar: tail -f /var/log/subconverter-cron.log"
echo ""
echo "🗑️  Cron job ni o'chirish uchun: crontab -e"
