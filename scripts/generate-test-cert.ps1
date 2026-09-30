# Generate a self-signed code signing certificate for local MSIX test-install
[CmdletBinding()]
param (
    [string]$Publisher = "CN=84CCE9A5-1585-4D4A-A911-F08CBC54D25D",
    [string]$Password = "DeskDangle123!",
    [string]$CertDir = "",
    [switch]$Install,
    [switch]$Force
)

$ErrorActionPreference = 'Stop'

if ([string]::IsNullOrWhiteSpace($CertDir)) {
    $CertDir = Join-Path $PSScriptRoot "..\certs"
}

$CertDirFull = [System.IO.Path]::GetFullPath($CertDir)
if (-not (Test-Path $CertDirFull)) {
    New-Item -ItemType Directory -Path $CertDirFull -Force | Out-Null
}

$PfxPath = Join-Path $CertDirFull "DeskDangleTest.pfx"
$CerPath = Join-Path $CertDirFull "DeskDangleTest.cer"

if ((Test-Path $PfxPath) -and (Test-Path $CerPath) -and (-not $Force)) {
    Write-Host "Existing test certificate found at: $PfxPath"
    if ($Install) {
        Write-Host "Installing public certificate into CurrentUser\TrustedPeople..."
        Import-Certificate -FilePath $CerPath -CertStoreLocation "Cert:\CurrentUser\TrustedPeople" | Out-Null
        Write-Host "Certificate installed into CurrentUser\TrustedPeople successfully."
    }
    return
}

Write-Host "Creating self-signed code signing certificate for '$Publisher'..."
$cert = New-SelfSignedCertificate `
    -Type Custom `
    -Subject $Publisher `
    -KeyUsage DigitalSignature `
    -FriendlyName "DeskDangle Test Certificate" `
    -CertStoreLocation "Cert:\CurrentUser\My" `
    -TextExtension @("2.5.29.37={text}1.3.6.1.5.5.7.3.3")

$securePassword = ConvertTo-SecureString -String $Password -Force -AsPlainText

Write-Host "Exporting PFX certificate to: $PfxPath"
Export-PfxCertificate -Cert $cert -FilePath $PfxPath -Password $securePassword | Out-Null

Write-Host "Exporting CER public certificate to: $CerPath"
Export-Certificate -Cert $cert -FilePath $CerPath | Out-Null

if ($Install) {
    Write-Host "Installing public certificate into CurrentUser\TrustedPeople..."
    Import-Certificate -FilePath $CerPath -CertStoreLocation "Cert:\CurrentUser\TrustedPeople" | Out-Null
    Write-Host "Certificate installed into CurrentUser\TrustedPeople successfully."
}

Write-Host "Test certificate generated successfully."
