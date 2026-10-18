@echo off
setlocal enabledelayedexpansion

title Connected Intelligence Launcher
echo ======================================================================
echo           Connected Intelligence - System Launcher
echo           FalkorDB + FastAPI Backend + React Vite Frontend
echo ======================================================================
echo.

set "ROOT_DIR=%~dp0"

:: 1. Launch FalkorDB Container
echo [1/3] Starting FalkorDB Graph Database (Port 6379)...
start "Connected Intelligence - FalkorDB" cmd /k "title FalkorDB (Port 6379) && echo Starting FalkorDB container... && docker run -p 6379:6379 --rm --name connected-intelligence-falkordb falkordb/falkordb || (echo. && echo [WARNING] Docker failed to start FalkorDB. && echo Please make sure Docker Desktop is running, or use FalkorDB Cloud. && pause)"

:: Brief pause to let DB initialize
timeout /t 3 /nobreak >nul

:: 2. Launch FastAPI Backend
echo [2/3] Starting FastAPI Backend (Port 8000)...
start "Connected Intelligence - Backend" cmd /k "title FastAPI Backend (Port 8000) && cd /d "%ROOT_DIR%backend" && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

:: Brief pause before launching frontend
timeout /t 2 /nobreak >nul

:: 3. Launch React Frontend
echo [3/3] Starting React Frontend (Port 5173)...
start "Connected Intelligence - Frontend" cmd /k "title React Frontend (Port 5173) && cd /d "%ROOT_DIR%frontend" && npm run dev"

echo.
echo ======================================================================
echo   All 3 services are launching in their own dedicated windows:
echo     * FalkorDB:   Port 6379
echo     * Backend:    http://127.0.0.1:8000 (Docs: /docs)
echo     * Frontend:   http://127.0.0.1:5173
echo ======================================================================
echo.
echo You can keep this window open or close it. Press any key to exit launcher.
pause >nul
