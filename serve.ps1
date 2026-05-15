# Statisk server for whistleblower-strict (port 4174 — 4173 brukes av whistleblower)
$port = 4174
$bind = "127.0.0.1"
$root = $PSScriptRoot
Set-Location $root

function Get-PortListeners {
  param([int]$Port)
  $conns = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
  if (-not $conns) { return @() }
  $conns | Group-Object -Property OwningProcess | ForEach-Object {
    $proc = Get-Process -Id $_.Name -ErrorAction SilentlyContinue
    [PSCustomObject]@{
      Pid         = [int]$_.Name
      ProcessName = if ($proc) { $proc.ProcessName } else { "?" }
      Addresses   = ($_.Group | Select-Object -ExpandProperty LocalAddress -Unique) -join ", "
    }
  }
}

$existing = @(Get-PortListeners -Port $port)
if ($existing.Count -gt 0) {
  Write-Host ""
  Write-Host "Feil: Port $port er allerede i bruk." -ForegroundColor Red
  Write-Host "Kjør bare én server om gangen. Aktive prosesser:" -ForegroundColor Yellow
  foreach ($l in $existing) {
    Write-Host "  - PID $($l.Pid) ($($l.ProcessName)) på $($l.Addresses)"
  }
  Write-Host ""
  Write-Host "Stopp eksisterende server med Ctrl+C i den terminalen,"
  Write-Host "eller kjør:"
  Write-Host "  Get-NetTCPConnection -LocalPort $port -State Listen | ForEach-Object { Stop-Process -Id `$_.OwningProcess -Force }"
  Write-Host ""
  exit 1
}

$url = "http://${bind}:$port/"
Write-Host "Starter statisk server på $url"
Write-Host "Norsk: $url  |  Engelsk: ${url}en.html"
Write-Host ""

if (Get-Command python -ErrorAction SilentlyContinue) {
  python "$root\serve-dev.py" $port $bind
  exit $LASTEXITCODE
}

if (Get-Command py -ErrorAction SilentlyContinue) {
  py "$root\serve-dev.py" $port $bind
  exit $LASTEXITCODE
}

Write-Host "Python ikke funnet. Prøver npx http-server ..."
npx --yes http-server -a $bind -p $port -c-1 .
exit $LASTEXITCODE
