@echo off
title Strategiskskole App - Starter...
echo.
echo  ================================================
echo   Strategiskskole App - starter lokal server
echo  ================================================
echo.

cd /d "%~dp0"

echo  [1/3] Sletter gammel node_modules...
if exist node_modules (
    rmdir /s /q node_modules
    echo       OK
) else (
    echo       Ikke fundet - springer over
)

echo.
echo  [2/3] Installerer pakker (dette tager 1-2 minutter)...
call npm install
if errorlevel 1 (
    echo.
    echo  FEJL: npm install fejlede. Er Node.js installeret?
    echo  Hent det gratis paa: https://nodejs.org
    pause
    exit /b 1
)

echo.
echo  [3/3] Starter appen...
echo.
echo  Aabner browser om et ojeblik...
timeout /t 3 /nobreak >nul
start http://localhost:3000

npm run dev
