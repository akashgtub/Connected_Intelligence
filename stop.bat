@echo off
title Connected Intelligence Stopper
echo ======================================================================
echo           Stopping Connected Intelligence Services
echo ======================================================================
echo.

echo Stopping FalkorDB container...
docker stop connected-intelligence-falkordb 2>nul
if %errorlevel% equ 0 (
    echo FalkorDB container stopped successfully.
) else (
    echo No active FalkorDB container found.
)

echo.
echo Note: To stop the Backend and Frontend processes, simply close their
echo respective command prompt windows or press Ctrl+C inside them.
echo.
pause
