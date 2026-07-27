@echo off
chcp 65001 > nul
title Git Pull Request Helper

:: ==========================================
:: [설정] GitHub 저장소 웹 주소 및 메인 브랜치
:: 웹 주소에는 끝의 .git을 붙이지 않습니다.
:: ==========================================
set REPO_WEB_URL=https://github.com/HO-0219/todoProject
set MAIN_BRANCH=main

echo ==========================================
echo           4. Open Pull Request
echo ==========================================

for /f "tokens=*" %%i in ('git rev-parse --abbrev-ref HEAD 2^>nul') do set CURRENT_BRANCH=%%i

if "%CURRENT_BRANCH%"=="" (
    echo [오류] Git 저장소 또는 현재 브랜치를 확인할 수 없습니다.
    pause
    exit /b 1
)

if "%CURRENT_BRANCH%"=="%MAIN_BRANCH%" (
    echo [오류] 현재 브랜치가 메인 브랜치입니다.
    echo 먼저 2_new_branch.bat를 실행하여 작업 브랜치로 이동해 주세요.
    pause
    exit /b 1
)

echo 현재 작업 브랜치: [%CURRENT_BRANCH%]
echo 대상 브랜치:     [%MAIN_BRANCH%]
echo.

:: GitHub CLI(gh)가 설치된 환경이라면 CLI로 오픈
where gh >nul 2>nul
if %errorlevel% equ 0 (
    gh pr create --web --base %MAIN_BRANCH% --head %CURRENT_BRANCH%
    pause
    exit /b
)

:: 브라우저에서 바로 PR 작성 페이지 열기
set PR_URL=%REPO_WEB_URL%/compare/%MAIN_BRANCH%...%CURRENT_BRANCH%?expand=1

echo [알림] 브라우저에서 PR 페이지를 열고 있습니다...
start "" "%PR_URL%"

echo [완료] 웹 브라우저에서 PR 작성을 진행해 주세요.
pause
