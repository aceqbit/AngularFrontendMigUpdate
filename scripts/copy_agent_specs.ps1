$source = Join-Path $PSScriptRoot "..\archive\AngularFrontendMigAgent\src"
$destRoot = Join-Path $PSScriptRoot "..\src\app\generated-specs"
Get-ChildItem -Path $source -Filter "*.spec.ts" -Recurse | ForEach-Object {
    $relative = $_.FullName.Substring($source.Length).TrimStart('\')
    $dest = Join-Path $destRoot $relative
    $destDir = Split-Path $dest -Parent
    if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir | Out-Null }
    Copy-Item -Path $_.FullName -Destination $dest -Force
}
Write-Output "Copied specs to: $destRoot"
