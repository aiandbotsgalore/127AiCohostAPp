@echo off
echo.
echo ========================================
echo    DR. SNUGGLES AUDIO NODE
echo    Starting Development Mode...
echo ========================================
echo.

REM Change to the script's directory
cd /d "%~dp0"

REM Check if node_modules exists
if not exist "node_modules" (
    echo [!] node_modules not found. Running npm install...
    echo.
    call npm install
    echo.
)

REM Start the application in development mode
echo [*] Launching Dr. Snuggles...
echo [*] Press Ctrl+C to stop the application
echo.

call npm run dev

pause
