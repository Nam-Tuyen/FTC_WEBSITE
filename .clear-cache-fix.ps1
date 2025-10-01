# PowerShell script to completely clear Next.js cache and rebuild

Write-Host "🧹 Clearing Next.js cache..." -ForegroundColor Yellow

# Remove .next directory
if (Test-Path ".next") {
    Remove-Item -Path ".next" -Recurse -Force
    Write-Host "✓ Removed .next directory" -ForegroundColor Green
}

# Remove node_modules/.cache
if (Test-Path "node_modules\.cache") {
    Remove-Item -Path "node_modules\.cache" -Recurse -Force
    Write-Host "✓ Removed node_modules\.cache" -ForegroundColor Green
}

# Remove out directory if exists
if (Test-Path "out") {
    Remove-Item -Path "out" -Recurse -Force
    Write-Host "✓ Removed out directory" -ForegroundColor Green
}

# Clear npm cache
Write-Host "📦 Clearing npm cache..." -ForegroundColor Yellow
try {
    npm cache clean --force
    Write-Host "✓ npm cache cleared" -ForegroundColor Green
} catch {
    Write-Host "! Could not clear npm cache (this is OK)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Cache cleared successfully!" -ForegroundColor Green
Write-Host "🔨 Now rebuild with: npm run build" -ForegroundColor Cyan

