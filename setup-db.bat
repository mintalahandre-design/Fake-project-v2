@echo off
echo =====================================================
echo  FutsalKu - Database Setup Script
echo =====================================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker Desktop belum berjalan!
    echo Buka Docker Desktop terlebih dahulu, tunggu hingga fully started,
    echo lalu jalankan script ini lagi.
    pause
    exit /b 1
)

echo [1/4] Membuat container PostgreSQL...
docker run -d ^
  --name futsal-postgres ^
  -e POSTGRES_USER=futsal_user ^
  -e POSTGRES_PASSWORD=futsal_pass123 ^
  -e POSTGRES_DB=futsal_rajawali ^
  -p 5432:5432 ^
  --restart unless-stopped ^
  postgres:16-alpine

if %errorlevel% neq 0 (
    echo [INFO] Container mungkin sudah ada, mencoba start ulang...
    docker start futsal-postgres
)

echo.
echo [2/4] Menunggu PostgreSQL siap (15 detik)...
timeout /t 15 /nobreak > nul

echo.
echo [3/4] Menjalankan Prisma migrations...
call npx prisma migrate dev --name init

echo.
echo [4/4] Seeding database (admin + lapangan)...
call npx prisma db seed

echo.
echo =====================================================
echo  SELESAI! Database siap digunakan.
echo.
echo  Akun Admin:
echo    Email   : admin@futsalrajawali.com
echo    Password: admin123
echo.
echo  Akun Demo Customer:
echo    Email   : demo@futsalrajawali.com
echo    Password: customer123
echo.
echo  Jalankan: npm run dev
echo  Buka    : http://localhost:3000
echo =====================================================
pause
