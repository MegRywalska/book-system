$ports = @(8080, 8081, 8082, 8083, 5173)
$procs = Get-NetTCPConnection -ErrorAction SilentlyContinue |
    Where-Object { $ports -contains $_.LocalPort } |
    Select-Object -ExpandProperty OwningProcess -Unique |
    Where-Object { $_ -gt 0 }

if ($procs.Count -eq 0) {
    Write-Host "No services to stop on ports $($ports -join ', ')."
    return
}

Write-Host "Stopping processes on ports $($ports -join ', '): $($procs -join ', ')"
foreach ($procId in $procs) {
    try {
        Stop-Process -Id $procId -Force -ErrorAction Stop
        Write-Host "Stopped PID $procId"
    } catch {
        $err = $_
        Write-Warning ("Failed to stop PID {0}: {1}" -f $procId, $err)
    }
}
