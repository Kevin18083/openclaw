@echo off
REM 缓存优化自动排查 - 定时运行脚本
REM 频率：每 3 天运行一次
REM 使用方法：创建 Windows 任务计划程序，设置触发器为每 3 天

cd /d "C:\Users\17589\.openclaw\workspace"
node cache-auto-check.js

REM 退出
exit /b 0
