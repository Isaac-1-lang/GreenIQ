@echo off
echo Clearing React Native cache...
rmdir /s /q node_modules\.cache 2>nul
rmdir /s /q .expo 2>nul

echo Restarting Metro bundler...
echo Please run: npx expo start --clear

echo.
echo After Metro starts, press 'a' for Android or 'i' for iOS
pause
