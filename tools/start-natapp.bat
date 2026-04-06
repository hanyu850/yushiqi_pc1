@echo off
chcp 65001 >nul
echo.
echo =====================================
echo    羽世奇 AI - 启动 Natapp 内网穿透
echo =====================================
echo.
echo 正在启动 Natapp...
echo.

cd /d "%~dp0"

start "羽世奇 AI - Natapp" natapp.exe -authtoken=3d394aaec0bfe11d

echo.
echo ✓ Natapp 已在新窗口启动
echo.
echo 公网访问地址: http://yushiqi.nat100.top
echo 本地前端地址: http://localhost:3000
echo 本地后端地址: http://localhost:3001
echo.
echo 按任意键关闭此窗口...
pause >nul
