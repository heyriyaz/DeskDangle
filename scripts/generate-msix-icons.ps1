# Generate all required MSIX icon assets from build/icon.png
[CmdletBinding()]
param (
    [string]$SourceIcon = "",
    [string]$OutputDir = ""
)

$ErrorActionPreference = 'Stop'

if ([string]::IsNullOrWhiteSpace($SourceIcon)) {
    $SourceIcon = Join-Path $PSScriptRoot "..\build\icon.png"
}
if ([string]::IsNullOrWhiteSpace($OutputDir)) {
    $OutputDir = Join-Path $PSScriptRoot "..\build\appx"
}

Add-Type -AssemblyName System.Drawing

if (-not (Test-Path $SourceIcon)) {
    Write-Error "Source icon not found at: $SourceIcon"
    exit 1
}

# Resolve full paths
$SourceIconFull = (Resolve-Path $SourceIcon).Path
$OutputDirFull = [System.IO.Path]::GetFullPath($OutputDir)
$AssetsDirFull = [System.IO.Path]::Combine($OutputDirFull, "assets")

if (-not (Test-Path $OutputDirFull)) {
    New-Item -ItemType Directory -Path $OutputDirFull -Force | Out-Null
}
if (-not (Test-Path $AssetsDirFull)) {
    New-Item -ItemType Directory -Path $AssetsDirFull -Force | Out-Null
}

Write-Host "Loading source icon from: $SourceIconFull"
$srcBmp = [System.Drawing.Bitmap]::FromFile($SourceIconFull)

function Resize-SquareImage {
    param (
        [System.Drawing.Bitmap]$Source,
        [int]$Size,
        [string]$DestinationPath
    )
    $destBmp = New-Object System.Drawing.Bitmap($Size, $Size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($destBmp)
    
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.Clear([System.Drawing.Color]::Transparent)

    $rect = New-Object System.Drawing.Rectangle(0, 0, $Size, $Size)
    $graphics.DrawImage($Source, $rect)

    $graphics.Dispose()
    $destBmp.Save($DestinationPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $destBmp.Dispose()
}

function Resize-LetterboxImage {
    param (
        [System.Drawing.Bitmap]$Source,
        [int]$TargetWidth,
        [int]$TargetHeight,
        [int]$IconSize,
        [string]$DestinationPath
    )
    $destBmp = New-Object System.Drawing.Bitmap($TargetWidth, $TargetHeight, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($destBmp)
    
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.Clear([System.Drawing.Color]::Transparent)

    $x = [int](($TargetWidth - $IconSize) / 2)
    $y = [int](($TargetHeight - $IconSize) / 2)
    $rect = New-Object System.Drawing.Rectangle($x, $y, $IconSize, $IconSize)
    $graphics.DrawImage($Source, $rect)

    $graphics.Dispose()
    $destBmp.Save($DestinationPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $destBmp.Dispose()
}

try {
    # 1. Square44x44Logo.png (44x44)
    Write-Host "Generating Square44x44Logo.png (44x44)..."
    Resize-SquareImage -Source $srcBmp -Size 44 -DestinationPath "$OutputDirFull\Square44x44Logo.png"
    Copy-Item "$OutputDirFull\Square44x44Logo.png" "$AssetsDirFull\Square44x44Logo.png" -Force

    # 2. Square150x150Logo.png (150x150)
    Write-Host "Generating Square150x150Logo.png (150x150)..."
    Resize-SquareImage -Source $srcBmp -Size 150 -DestinationPath "$OutputDirFull\Square150x150Logo.png"
    Copy-Item "$OutputDirFull\Square150x150Logo.png" "$AssetsDirFull\Square150x150Logo.png" -Force

    # 3. Wide310x150Logo.png (310x150)
    Write-Host "Generating Wide310x150Logo.png (310x150)..."
    Resize-LetterboxImage -Source $srcBmp -TargetWidth 310 -TargetHeight 150 -IconSize 130 -DestinationPath "$OutputDirFull\Wide310x150Logo.png"
    Copy-Item "$OutputDirFull\Wide310x150Logo.png" "$AssetsDirFull\Wide310x150Logo.png" -Force

    # 4. Square71x71Logo.png & SmallTile.png (71x71)
    Write-Host "Generating Square71x71Logo.png / SmallTile.png (71x71)..."
    Resize-SquareImage -Source $srcBmp -Size 71 -DestinationPath "$OutputDirFull\Square71x71Logo.png"
    Copy-Item "$OutputDirFull\Square71x71Logo.png" "$OutputDirFull\SmallTile.png" -Force
    Copy-Item "$OutputDirFull\Square71x71Logo.png" "$AssetsDirFull\Square71x71Logo.png" -Force
    Copy-Item "$OutputDirFull\Square71x71Logo.png" "$AssetsDirFull\SmallTile.png" -Force

    # 5. Square310x310Logo.png & LargeTile.png (310x310)
    Write-Host "Generating Square310x310Logo.png / LargeTile.png (310x310)..."
    Resize-SquareImage -Source $srcBmp -Size 310 -DestinationPath "$OutputDirFull\Square310x310Logo.png"
    Copy-Item "$OutputDirFull\Square310x310Logo.png" "$OutputDirFull\LargeTile.png" -Force
    Copy-Item "$OutputDirFull\Square310x310Logo.png" "$AssetsDirFull\Square310x310Logo.png" -Force
    Copy-Item "$OutputDirFull\Square310x310Logo.png" "$AssetsDirFull\LargeTile.png" -Force

    # 6. StoreLogo.png (50x50)
    Write-Host "Generating StoreLogo.png (50x50)..."
    Resize-SquareImage -Source $srcBmp -Size 50 -DestinationPath "$OutputDirFull\StoreLogo.png"
    Copy-Item "$OutputDirFull\StoreLogo.png" "$AssetsDirFull\StoreLogo.png" -Force

    # 7. SplashScreen.png (620x300)
    Write-Host "Generating SplashScreen.png (620x300)..."
    Resize-LetterboxImage -Source $srcBmp -TargetWidth 620 -TargetHeight 300 -IconSize 200 -DestinationPath "$OutputDirFull\SplashScreen.png"
    Copy-Item "$OutputDirFull\SplashScreen.png" "$AssetsDirFull\SplashScreen.png" -Force

    Write-Host "Successfully generated all 7 required MSIX icon assets in $OutputDirFull and $AssetsDirFull."
}
finally {
    $srcBmp.Dispose()
}
