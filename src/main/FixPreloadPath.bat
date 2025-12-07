@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

echo.
echo =====================================================
echo      SnugglesAI Preload Import Auto-Fix Script
echo =====================================================
echo.

REM === Correct preload.ts source path ===
SET PRELOAD_FILE="C:\Users\Logan\SnugglesAiCohost\aiagentlclonenew-main (4)\aiagentlclonenew-main\Snuggles_Audio_Node\src\main\preload.ts"

echo Checking preload file...
IF NOT EXIST %PRELOAD_FILE% (
    echo ERROR: preload.ts not found at:
    echo %PRELOAD_FILE%
    echo.
    pause
    exit /b 1
)

echo Backing up preload.ts to preload_backup.ts...
copy %PRELOAD_FILE% "%PRELOAD_FILE:.ts=_backup.ts%" >nul

echo Applying import path fix...

REM Replace "@/shared/types" or "../shared/types" with "../../shared/types"
powershell -Command "(Get-Content %PRELOAD_FILE%) `
    -replace '@/shared/types', '../../shared/types' `
    -replace '../shared/types', '../../shared/types' `
    | Set-Content %PRELOAD_FILE%"

echo.
echo Import path has been updated to:
echo     ../../shared/types
echo.

echo Fix complete. Rebuild your app to activate changes.
echo =====================================================
echo.

pause
ENDLOCAL
