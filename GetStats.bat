@echo off
@chcp 65001
set /p count=How much apps display? (leave empty to display all) 
set /p filter=Filter by period of time: (1d = 1 day, 1m = 1 month, 1y = 1 year, leave empty to display by all time) 
node assets/getstat.js top %count% filter %filter%
pause