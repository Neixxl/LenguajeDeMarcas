@echo off
pause
REM --- Check if git is installed and available in PATH ---
where git >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo.
    echo ERROR: Git is not found in the system's PATH.
    echo Please install Git or ensure it's added to your environment variables.
    echo.
    pause
    exit /b 1
)

REM --- Define commit message ---
set /p "commit_message=Enter commit message (e.g., 'Update files'): "
if "%commit_message%"=="" set "commit_message=Automated update"

echo.
echo Starting Git process...

REM --- Add all files to the staging area ---
git add .
if %ERRORLEVEL% neq 0 (
    echo.
    echo ERROR: Failed to stage files (git add .).
    echo Check for any permission issues or if you are in the correct Git directory.
    echo.
    pause
    exit /b 1
)
echo Successfully staged all changes.

REM --- Commit the staged files ---
git commit -m "%commit_message%"
if %ERRORLEVEL% neq 0 (
    echo.
    REM Note: A non-zero error level might occur if there are no changes to commit,
    REM which is an acceptable condition. We'll check the output, but for simplicity,
    REM a simple check is sufficient unless you require more robust error handling.
    echo WARNING: Commit may have failed or there were no changes to commit. Proceeding to push...
)
echo Successfully committed changes with message: "%commit_message%"

REM --- Push changes to the 'main' branch on 'origin' ---
git push origin main
if %ERRORLEVEL% neq 0 (
    echo.
    echo ERROR: Failed to push changes to GitHub (git push origin main).
    echo Check your internet connection, credentials, and if the remote 'origin' is set correctly.
    echo.
    pause
    exit /b 1
)
echo.
echo **Successfully pushed changes to origin/main!**
echo.

pause
exit /b 0