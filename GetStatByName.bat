@echo off
@chcp 65001
set /p appname=Write the app name: 
node assets/getstat.js find %appname%
pause