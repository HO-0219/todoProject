@echo off
chcp 65001 > nul
title Git Clone Automator

:: ==========================================
:: [설정] SSH 저장소 주소 & 생성될 폴더명
:: ==========================================
set REPO_URL=https://github.com/HO-0219/todoProject.git
set REPO_DIR=todoProject

echo ==========================================
echo           1. Git Clone Automator
echo ==========================================
echo 대상 저장소: %REPO_URL%
echo.

echo [알림] 리포지토리를 클론합니다...
git clone %REPO_URL%

if not exist "%REPO_DIR%" (
    echo.
    echo [오류] 클론에 실패하였거나 폴더를 찾을 수 없습니다.
    echo SSH 키가 등록되어 있는지 확인해 주세요.
    pause
    exit /b
)

echo.
echo [완료] 클론 작업이 완료되었습니다!
echo [알림] 프로젝트 폴더(%REPO_DIR%)로 이동하여 브랜치 설정을 시작합니다...
echo.
timeout /t 2 > nul

:: 프로젝트 폴더 내부로 이동
cd /d "%~dp0%REPO_DIR%"

:: 깃에 이미 들어있는 2번 브랜치 선택 스크립트 실행
if exist "2_select_branch.bat" (
    call 2_select_branch.bat
) else (
    echo [안내] 2_select_branch.bat 파일을 찾을 수 없습니다.
    echo 프로젝트 폴더 내부에서 2번 스크립트를 직접 실행해 주세요.
    pause
)