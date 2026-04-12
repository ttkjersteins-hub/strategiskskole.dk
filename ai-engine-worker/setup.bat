@echo off
chcp 65001 >nul
title AI Engine Worker — Setup & Deploy
echo.
echo ============================================================
echo   AI Engine Worker — Strategiskskole.dk
echo   Setup og Deploy (0 kr./md)
echo ============================================================
echo.

:: Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo FEJL: Node.js er ikke installeret.
    echo Download fra: https://nodejs.org
    echo Installer og kør dette script igen.
    pause
    exit /b 1
)
echo [OK] Node.js fundet

:: Install dependencies
echo.
echo Installerer dependencies...
cd /d "%~dp0"
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo FEJL: npm install fejlede
    pause
    exit /b 1
)
echo [OK] Dependencies installeret

:: Check wrangler
where wrangler >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Installerer Wrangler (Cloudflare CLI)...
    call npm install -g wrangler
)
echo [OK] Wrangler fundet

:: Login
echo.
echo ============================================================
echo   TRIN 1: Log ind i Cloudflare
echo   (Aabner browser — log ind og godkend)
echo ============================================================
call wrangler login
if %ERRORLEVEL% NEQ 0 (
    echo FEJL: Login fejlede. Proev igen.
    pause
    exit /b 1
)
echo [OK] Logget ind i Cloudflare

:: Create KV namespace
echo.
echo ============================================================
echo   TRIN 2: Opretter KV namespace (cache)
echo ============================================================
for /f "tokens=*" %%i in ('wrangler kv namespace create CACHE 2^>^&1') do (
    echo %%i
    echo %%i | findstr /C:"id =" >nul && (
        for /f "tokens=3 delims= " %%j in ("%%i") do (
            set KV_ID=%%j
        )
    )
)

if defined KV_ID (
    echo [OK] KV namespace oprettet: %KV_ID%
) else (
    echo.
    echo Kunne ikke auto-hente KV ID.
    echo Kopier ID fra output ovenfor og indsaet det her:
    set /p KV_ID="KV Namespace ID: "
)

:: Get Supabase credentials
echo.
echo ============================================================
echo   TRIN 3: Supabase credentials
echo   Hent fra: https://supabase.com/dashboard
echo   Gaa til: Settings - API
echo ============================================================
echo.
set /p SUPA_URL="Supabase Project URL (https://xxxxx.supabase.co): "
set /p SUPA_KEY="Supabase anon public key (eyJ...): "

:: Validate inputs
if "%SUPA_URL%"=="" (
    echo FEJL: Supabase URL er tom
    pause
    exit /b 1
)
if "%SUPA_KEY%"=="" (
    echo FEJL: Supabase key er tom
    pause
    exit /b 1
)

:: Write wrangler.toml
echo.
echo Konfigurerer wrangler.toml...
(
echo name = "ai-engine-worker"
echo main = "src/index.js"
echo compatibility_date = "2024-09-23"
echo.
echo [ai]
echo binding = "AI"
echo.
echo [[kv_namespaces]]
echo binding = "CACHE"
echo id = "%KV_ID%"
echo.
echo [vars]
echo SUPABASE_URL = "%SUPA_URL%"
echo ALLOWED_ORIGINS = "https://strategiskskole.dk"
)> wrangler.toml
echo [OK] wrangler.toml konfigureret

:: Set secret
echo.
echo ============================================================
echo   TRIN 4: Saetter Supabase secret
echo   (Indsaet samme anon key igen naar Wrangler spoerger)
echo ============================================================
echo %SUPA_KEY% | wrangler secret put SUPABASE_ANON_KEY
echo [OK] Secret sat

:: Deploy
echo.
echo ============================================================
echo   TRIN 5: Deployer til Cloudflare
echo ============================================================
call wrangler deploy
if %ERRORLEVEL% NEQ 0 (
    echo FEJL: Deploy fejlede. Se fejlbesked ovenfor.
    pause
    exit /b 1
)

echo.
echo ============================================================
echo   DEPLOY FAERDIG!
echo ============================================================
echo.
echo Naeste skridt:
echo   1. Koer supabase-migration.sql i Supabase SQL Editor
echo   2. Test: curl DIN-WORKER-URL/api/health
echo   3. Opdater chatbot.js med ny worker URL
echo.
pause
