# Zach Daily Learning - Scheduled Task Installer
# Schedule: Daily at 2:00 PM and 8:00 PM (different from Jack's 1PM/7PM)

$taskName = "Zach Daily Learning"
$scriptPath = "C:\Users\17589\.openclaw\workspace\zach-daily-learning.js"
$logPath = "C:\Users\17589\.openclaw\workspace\zach-daily-learning.log"

# Check if script exists
if (-not (Test-Path $scriptPath)) {
    Write-Host "ERROR: Script not found: $scriptPath"
    exit 1
}

# Remove existing tasks
schtasks /Delete /TN "$taskName" /F 2>$null
schtasks /Delete /TN "$taskName-2" /F 2>$null

# Create task for 2:00 PM
Write-Host "Creating task for 2:00 PM..."
schtasks /Create /TN "$taskName" /TR "node $scriptPath" /SC DAILY /ST 14:00 /RU $env:USERNAME /F

# Create task for 8:00 PM
Write-Host "Creating task for 8:00 PM..."
schtasks /Create /TN "$taskName-2" /TR "node $scriptPath" /SC DAILY /ST 20:00 /RU $env:USERNAME /F

Write-Host ""
Write-Host "SUCCESS: Tasks installed!"
Write-Host "  2:00 PM: $taskName"
Write-Host "  8:00 PM: $taskName-2"
Write-Host ""
Write-Host "To view: schtasks /Query /TN `"$taskName`""
Write-Host "To run manually: node $scriptPath"
