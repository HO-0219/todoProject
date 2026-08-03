@echo off
setlocal
title Git Pull Request Helper

rem GitHub web URL must not end with .git
set "REPO_WEB_URL=https://github.com/HO-0219/todoProject"
set "MAIN_BRANCH=main"
set "CURRENT_BRANCH="

echo ==========================================
echo           4. Open Pull Request
echo ==========================================

for /f "delims=" %%i in ('git rev-parse --abbrev-ref HEAD 2^>nul') do set "CURRENT_BRANCH=%%i"

if not defined CURRENT_BRANCH (
    echo [ERROR] Git repository or current branch was not found.
    pause
    exit /b 1
)

echo Current branch: [%CURRENT_BRANCH%]
echo Target branch:  [%MAIN_BRANCH%]
echo.

if /i "%CURRENT_BRANCH%"=="%MAIN_BRANCH%" (
    echo [BLOCKED] Pull Request cannot be created from the main branch.
    echo Run 2_new_branch.bat and switch to your member branch first.
    pause
    exit /b 1
)

where gh >nul 2>nul
if not errorlevel 1 (
    gh pr create --web --base "%MAIN_BRANCH%" --head "%CURRENT_BRANCH%"
    pause
    exit /b
)

set "PR_URL=%REPO_WEB_URL%/compare/%MAIN_BRANCH%...%CURRENT_BRANCH%?expand=1"

echo Opening the GitHub Pull Request page...
start "" "%PR_URL%"

echo [DONE] Complete the Pull Request in your web browser.
pause
endlocal
