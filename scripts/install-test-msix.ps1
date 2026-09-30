# Test-install the generated DeskDangle MSIX package locally on Windows
[CmdletBinding()]
param (
    [string]$PackagePath = ""
)

$ErrorActionPreference = 'Stop'

# 1. Verify/Install Test Certificate into LocalMachine\TrustedPeople
$CerPath = Join-Path $PSScriptRoot "..\certs\DeskDangleTest.cer"
if (Test-Path $CerPath) {
    $cerObj = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2((Resolve-Path $CerPath).Path)
    $thumbprint = $cerObj.Thumbprint
    $isTrusted = Test-Path "Cert:\LocalMachine\TrustedPeople\$thumbprint"

    if (-not $isTrusted) {
        Write-Host "Test certificate is not yet in LocalMachine\TrustedPeople."
        $isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
        if ($isAdmin) {
            Write-Host "Installing certificate to LocalMachine\TrustedPeople..."
            Import-Certificate -FilePath (Resolve-Path $CerPath).Path -CertStoreLocation "Cert:\LocalMachine\TrustedPeople" | Out-Null
            Write-Host "Certificate installed."
        } else {
            Write-Host "Requesting elevation to install test certificate to LocalMachine\TrustedPeople..."
            $cerPathResolved = (Resolve-Path $CerPath).Path
            Start-Process powershell -Verb RunAs -Wait -ArgumentList "-ExecutionPolicy Bypass -Command Import-Certificate -FilePath `"$cerPathResolved`" -CertStoreLocation Cert:\LocalMachine\TrustedPeople"
        }
    } else {
        Write-Host "Test certificate is already trusted in LocalMachine\TrustedPeople."
    }
}

# 2. Locate MSIX Package
if ([string]::IsNullOrWhiteSpace($PackagePath)) {
    $ReleaseDir = Join-Path $PSScriptRoot "..\release"
    $msixFiles = Get-ChildItem -Path $ReleaseDir -Filter "*.msix" -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending
    if (-not $msixFiles -or $msixFiles.Count -eq 0) {
        # Check for .appx as fallback
        $msixFiles = Get-ChildItem -Path $ReleaseDir -Filter "*.appx" -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending
    }

    if (-not $msixFiles -or $msixFiles.Count -eq 0) {
        Write-Error "No .msix package found in '$ReleaseDir'. Please run 'npm run package:msix' first."
        exit 1
    }
    $PackagePath = $msixFiles[0].FullName
}

Write-Host "Installing MSIX package: $PackagePath"

# 3. Stop running instance of DeskDangle if running
$proc = Get-Process -Name "DeskDangle" -ErrorAction SilentlyContinue
if ($proc) {
    Write-Host "Stopping running DeskDangle process before installing..."
    Stop-Process -Name "DeskDangle" -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
}

# 4. Install using Add-AppxPackage
try {
    Add-AppxPackage -Path $PackagePath
    Write-Host "MSIX package installed successfully!" -ForegroundColor Green
    Write-Host "You can now launch DeskDangle from the Windows Start menu or run:"
    Write-Host "  explorer.exe shell:AppsFolder\DeskDangle_1.0.1.0_x64__...\DeskDangle"
}
catch {
    Write-Error "Installation failed: $_"
    exit 1
}
