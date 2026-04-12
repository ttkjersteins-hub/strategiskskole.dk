@echo off
title Strategiskskole App - Push til GitHub
echo.
echo  ================================================
echo   Strategiskskole App - Deploy til GitHub
echo  ================================================
echo.

cd /d "%~dp0"

echo  Tjekker om Git er installeret...
git --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo  FEJL: Git er ikke installeret!
    echo  Hent Git gratis paa: https://git-scm.com/download/win
    echo  Installér Git og kør denne fil igen.
    pause
    exit /b 1
)
echo  Git fundet OK

echo.
echo  Initialiserer git-repository...
git init

echo.
echo  Tilfojer GitHub som remote...
git remote remove origin 2>nul
git remote add origin https://github.com/ttkjersteins-hub/strategiskskole-app.git

echo.
echo  Tilfojer alle filer...
git add .

echo.
echo  Laver commit...
git commit -m "Strategiskskole App - initial deploy"

echo.
echo  Skifter til main branch...
git branch -M main

echo.
echo  Pusher til GitHub (du skal evt. logge ind i browservindue)...
git push -f -u origin main

if errorlevel 1 (
    echo.
    echo  Noget gik galt. Proev at aabne GitHub Desktop
    echo  eller kontakt support.
    pause
    exit /b 1
)

echo.
echo  ================================================
echo   Koden er nu paa GitHub!
echo   https://github.com/ttkjersteins-hub/strategiskskole-app
echo  ================================================
echo.
echo  Naeste skridt: Gaa til vercel.com og kobl GitHub-repo'et
echo  til Vercel for at deploye appen live.
echo.
pause
