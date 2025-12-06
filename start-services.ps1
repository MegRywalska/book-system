$ErrorActionPreference = "Stop"

function Start-ServiceProcess($name, $path) {
    Write-Host "Starting $name..."
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$path`"; mvn spring-boot:run"
}

$root = Split-Path $MyInvocation.MyCommand.Path

Start-ServiceProcess "auth-service (8081)" "$root\auth-service"
Start-ServiceProcess "lending-books-app (8080)" "$root\lending-books-app"
Start-ServiceProcess "log-service (8082)" "$root\log-service"
Start-ServiceProcess "gateway-service (8083 + web client)" "$root\gateway-service"
Write-Host "Starting frontend (Vite dev server on 5173)..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$root\client`"; npm run dev -- --host"

Write-Host "All services starting in separate PowerShell windows."
