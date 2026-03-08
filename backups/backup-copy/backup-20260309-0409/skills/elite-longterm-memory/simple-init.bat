@echo off
echo Elite Longterm Memory - Simple Setup
echo ====================================
echo.

echo Creating directory structure...
mkdir memory 2>nul
mkdir memory\short-term 2>nul
mkdir memory\medium-term 2>nul
mkdir memory\long-term 2>nul
mkdir memory\archived 2>nul
mkdir memory\tags 2>nul
mkdir memory\indexes 2>nul
mkdir memory\backups 2>nul

echo ✓ Directories created
echo.

echo Creating config file...
echo { > memory\config.json
echo   "system_name": "Elite Longterm Memory", >> memory\config.json
echo   "version": "1.0", >> memory\config.json
echo   "initialized": "%date% %time%", >> memory\config.json
echo   "retention_policies": { >> memory\config.json
echo     "short_term": "24h", >> memory\config.json
echo     "medium_term": "30d", >> memory\config.json
echo     "long_term": "permanent", >> memory\config.json
echo     "archive_after": "365d" >> memory\config.json
echo   } >> memory\config.json
echo } >> memory\config.json

echo ✓ Config file created
echo.

echo Creating example memory...
echo # System Principles > memory\long-term\system-principles.md
echo. >> memory\long-term\system-principles.md
echo ## Core Principles >> memory\long-term\system-principles.md
echo 1. **Priority on Importance**: Important information is permanently saved >> memory\long-term\system-principles.md
echo 2. **Automatic Management**: System automatically categorizes and organizes >> memory\long-term\system-principles.md
echo 3. **Easy Retrieval**: Supports multiple search methods >> memory\long-term\system-principles.md
echo 4. **Safe and Reliable**: Regular backups prevent data loss >> memory\long-term\system-principles.md
echo. >> memory\long-term\system-principles.md
echo Created: %date% %time% >> memory\long-term\system-principles.md

echo ✓ Example memory created
echo.

echo Creating quick reference...
echo Memory Management Quick Reference > QUICK-REFERENCE.txt
echo ================================= >> QUICK-REFERENCE.txt
echo. >> QUICK-REFERENCE.txt
echo Add Short-term Memory: >> QUICK-REFERENCE.txt
echo   echo "content" ^> memory\short-term\%%date:~0,4%%%%date:~5,2%%%%date:~8,2%%-%%time:~0,2%%%%time:~3,2%%.md >> QUICK-REFERENCE.txt
echo. >> QUICK-REFERENCE.txt
echo Add Long-term Memory: >> QUICK-REFERENCE.txt
echo   echo "# Title" ^> memory\long-term\title.md >> QUICK-REFERENCE.txt
echo   echo. ^>^> memory\long-term\title.md >> QUICK-REFERENCE.txt
echo   echo "Content here" ^>^> memory\long-term\title.md >> QUICK-REFERENCE.txt
echo. >> QUICK-REFERENCE.txt
echo Search Memories: >> QUICK-REFERENCE.txt
echo   findstr /S /I "keyword" memory\*.md >> QUICK-REFERENCE.txt
echo. >> QUICK-REFERENCE.txt
echo List Recent Memories: >> QUICK-REFERENCE.txt
echo   dir memory /S /B /O:-D ^| findstr ".md" >> QUICK-REFERENCE.txt

echo ✓ Quick reference created
echo.

echo ====================================
echo Setup Complete!
echo.
echo Next Steps:
echo 1. Read SKILL.md for full documentation
echo 2. Check QUICK-REFERENCE.txt for commands
echo 3. Start using your memory system!
echo ====================================
echo.
pause