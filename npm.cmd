@echo off
set npm_command=%1
set npm_args=%*
if "%npm_command%"=="install" (
  bun install > nul 2>&1
  exit /b 0
)
bun %npm_args%
