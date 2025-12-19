@echo off
echo.
echo ========================================
echo    DR. SNUGGLES AUDIO NODE
echo    Production Mode
echo ========================================
echo.

REM Change to the script's directory
cd /d "%~dp0"

REM Check if dist folder exists
if not exist "dist" (
    echo [!] Production build not found. Building now...
    echo [*] This may take a minute...
    echo.
    call npm run build
    echo.
)

REM Start the application in production mode
echo [*] Launching Dr. Snuggles (Production)...
echo [*] Press Ctrl+C to stop the application
echo.

call npm start

pause
