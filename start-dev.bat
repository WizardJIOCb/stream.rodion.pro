@echo off
chcp 65001 >nul
title stream.rodion.pro — dev

echo ========================================
echo  stream.rodion.pro — local dev startup
echo ========================================
echo.

:: Check Docker container
echo [1/4] Docker: checking postgres container...
docker inspect -f "{{.State.Running}}" a7e65b75f3e4 >nul 2>&1
if errorlevel 1 (
    echo        Container not found, starting...
    docker start a7e65b75f3e4
    if errorlevel 1 (
        echo        ERROR: Failed to start Docker container a7e65b75f3e4
        echo        Make sure Docker Desktop is running.
        pause
        exit /b 1
    )
    timeout /t 3 /nobreak >nul
) else (
    docker start a7e65b75f3e4 >nul 2>&1
)
echo        OK

:: Check DB connectivity
echo [2/4] Database: checking connection...
node -e "const pg=require('pg');const p=new pg.Pool({connectionString:process.env.DATABASE_URL||'postgresql://stream_user:stream_pass_2024@localhost:5432/stream_rodion'});p.query('SELECT 1').then(()=>{console.log('        OK');p.end()}).catch(e=>{console.error('        ERROR:',e.message);p.end();process.exit(1)})"
if errorlevel 1 (
    echo        Database is not reachable. Check Docker and .env
    pause
    exit /b 1
)

:: Check node_modules
echo [3/4] Dependencies: checking node_modules...
if not exist "node_modules" (
    echo        Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo        ERROR: npm install failed
        pause
        exit /b 1
    )
) else (
    echo        OK
)

:: Start dev server
echo [4/4] Starting dev server...
echo.
echo   Frontend: http://localhost:5173
echo   API:      http://localhost:3012
echo   Admin:    http://localhost:5173/admin  (password: admin123)
echo.
echo ========================================
echo.

npm run dev
