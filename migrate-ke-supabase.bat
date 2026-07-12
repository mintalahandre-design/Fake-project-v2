@echo off
title Migrasi Database FutsalKu ke Supabase
echo ========================================================
echo   MIGRASI DATABASE FUTSAL RAJAWALI KE SUPABASE
echo ========================================================
echo.
echo Langkah 1: Buka dashboard Supabase Anda (https://supabase.com/dashboard)
echo Langkah 2: Pilih Project -> Project Settings -> Database -> Connection string (URI)
echo.
set /p SUPABASE_URL="Masukkan Connection String Supabase Anda (mulai dengan postgresql://...): "

if "%SUPABASE_URL%"=="" (
  echo [ERROR] URL Supabase tidak boleh kosong!
  pause
  exit /b 1
)

echo.
echo [1/3] Memperbarui file .env.local...
node -e "const fs = require('fs'); let c = fs.readFileSync('.env.local', 'utf8'); c = c.replace(/DATABASE_URL=.*(\r?\n|$)/, 'DATABASE_URL=\"' + process.argv[1] + '\"$1'); fs.writeFileSync('.env.local', c);" "%SUPABASE_URL%"

echo [2/3] Membangun skema tabel di database Supabase...
call npx prisma db push --accept-data-loss

echo [3/3] Mengisi data awal (Seeding Admin & Lapangan)...
call npx tsx prisma/seed.ts

echo.
echo ========================================================
echo   BERHASIL! DATABASE SUPABASE SIAP DIGUNAKAN!
echo ========================================================
echo Admin Login:
echo   Email    : admin@futsalrajawali.com (atau ketik: admin)
echo   Password : admin123
echo ========================================================
pause
