@echo off
setlocal
cd /d "%~dp0"

where py >nul 2>nul
if %errorlevel%==0 (
  start "Wedding Invite Server" cmd /k "py -m http.server 5500"
  timeout /t 2 >nul
  start "" "http://127.0.0.1:5500/index.html"
  goto :eof
)

where python >nul 2>nul
if %errorlevel%==0 (
  start "Wedding Invite Server" cmd /k "python -m http.server 5500"
  timeout /t 2 >nul
  start "" "http://127.0.0.1:5500/index.html"
  goto :eof
)

start "" "index.html"
echo.
echo Python was not found, so index.html was opened directly.
pause
