Add-Type -AssemblyName System.Drawing

$storeAssetsDir = Join-Path $PSScriptRoot "..\store-assets"
if (-not (Test-Path $storeAssetsDir)) { New-Item -ItemType Directory -Path $storeAssetsDir | Out-Null }

function Draw-DanglingCharm {
    param(
        [System.Drawing.Graphics]$g,
        [int]$anchorX,
        [int]$anchorY,
        [int]$ropeLength,
        [float]$angleDeg,
        [string]$charmImagePath,
        [int]$charmSize,
        [System.Drawing.Color]$ropeColor,
        [float]$ropeWidth
    )
    
    $rad = $angleDeg * [Math]::PI / 180.0
    $endX = $anchorX + [Math]::Sin($rad) * $ropeLength
    $endY = $anchorY + [Math]::Cos($rad) * $ropeLength

    # 1. Draw Rope Shadow
    $shadowPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(40, 0, 0, 0), ($ropeWidth + 2.0))
    $g.DrawLine($shadowPen, [float]($anchorX + 4), [float]($anchorY + 4), [float]($endX + 4), [float]($endY + 4))
    $shadowPen.Dispose()

    # 2. Draw Anchor Clip at top of screen
    $clipBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(230, 40, 40, 40))
    $g.FillEllipse($clipBrush, [float]($anchorX - 6), [float]($anchorY - 2), 12.0, 8.0)
    $clipBrush.Dispose()

    # 3. Draw Rope / Chain
    $ropePen = New-Object System.Drawing.Pen($ropeColor, $ropeWidth)
    $g.DrawLine($ropePen, [float]$anchorX, [float]$anchorY, [float]$endX, [float]$endY)
    $ropePen.Dispose()

    # 4. Ring / Connector at bottom of rope
    $ringPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(220, 200, 160, 50), 2.5)
    $g.DrawEllipse($ringPen, [float]($endX - 5), [float]($endY - 5), 10.0, 10.0)
    $ringPen.Dispose()

    # 5. Draw Charm with rotation and drop shadow
    if (Test-Path $charmImagePath) {
        $charmBmp = [System.Drawing.Bitmap]::FromFile((Resolve-Path $charmImagePath).Path)
        
        $state = $g.Save()
        $g.TranslateTransform($endX, $endY)
        $g.RotateTransform($angleDeg)

        # Draw soft drop shadow
        $shadowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(50, 0, 0, 0))
        $g.FillEllipse($shadowBrush, [float](-$charmSize/2 + 8), [float](8), [float]$charmSize, [float]$charmSize)
        $shadowBrush.Dispose()

        # Draw charm centered below the ring
        $g.DrawImage($charmBmp, [float](-$charmSize / 2), [float](0), [float]$charmSize, [float]$charmSize)
        
        $g.Restore($state)
        $charmBmp.Dispose()
    }
}

# --- Screenshot 1: Desktop with Banana Cat Hanging ---
Write-Host "Creating Screenshot 1 (Banana Cat on Desktop)..."
$bg1Path = Join-Path $PSScriptRoot "..\website\assets\gallery\gallery-windows-blue.png"
$charm1Path = Join-Path $PSScriptRoot "..\website\assets\charms\banana-cat.png"
$dest1Path = Join-Path $storeAssetsDir "screenshot-1.png"

$bg1 = [System.Drawing.Bitmap]::FromFile((Resolve-Path $bg1Path).Path)
$bmp1 = New-Object System.Drawing.Bitmap(1920, 1080, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g1 = [System.Drawing.Graphics]::FromImage($bmp1)
$g1.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g1.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

$g1.DrawImage($bg1, 0, 0, 1920, 1080)

# Draw hanging Banana Cat (center screen, slightly swaying)
Draw-DanglingCharm -g $g1 -anchorX 960 -anchorY 0 -ropeLength 200 -angleDeg -8.0 `
    -charmImagePath $charm1Path -charmSize 210 `
    -ropeColor ([System.Drawing.Color]::FromArgb(240, 190, 140, 30)) -ropeWidth 3.5

# Add sleek badge at top left of charm
$font = New-Object System.Drawing.Font("Segoe UI", 13, [System.Drawing.FontStyle]::Bold)
$pillBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(210, 24, 24, 27))
$pillPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(100, 255, 255, 255), 1)
$textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)

$rect = New-Object System.Drawing.RectangleF(830, 430, 260, 38)
$g1.FillRectangle($pillBrush, $rect)
$g1.DrawRectangle($pillPen, $rect.X, $rect.Y, $rect.Width, $rect.Height)

$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = [System.Drawing.StringAlignment]::Center
$sf.LineAlignment = [System.Drawing.StringAlignment]::Center
$g1.DrawString("DeskDangle  Physics Charm", $font, $textBrush, $rect, $sf)

$g1.Dispose()
$bmp1.Save($dest1Path, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp1.Dispose()
$bg1.Dispose()

# --- Screenshot 2: Desktop with Two Charms (Orange Cat + Glass Heart) ---
Write-Host "Creating Screenshot 2 (Orange Cat & Glass Heart)..."
$charm2APath = Join-Path $PSScriptRoot "..\website\assets\charms\orange-cat.png"
$charm2BPath = Join-Path $PSScriptRoot "..\website\assets\charms\glass-heart.png"
$dest2Path = Join-Path $storeAssetsDir "screenshot-2.png"

$bg2 = [System.Drawing.Bitmap]::FromFile((Resolve-Path $bg1Path).Path)
$bmp2 = New-Object System.Drawing.Bitmap(1920, 1080, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g2 = [System.Drawing.Graphics]::FromImage($bmp2)
$g2.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g2.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

$g2.DrawImage($bg2, 0, 0, 1920, 1080)

# Charm A (Left side)
Draw-DanglingCharm -g $g2 -anchorX 750 -anchorY 0 -ropeLength 220 -angleDeg -12.0 `
    -charmImagePath $charm2APath -charmSize 210 `
    -ropeColor ([System.Drawing.Color]::FromArgb(240, 180, 120, 60)) -ropeWidth 3.5

# Charm B (Right side)
Draw-DanglingCharm -g $g2 -anchorX 1150 -anchorY 0 -ropeLength 180 -angleDeg 10.0 `
    -charmImagePath $charm2BPath -charmSize 200 `
    -ropeColor ([System.Drawing.Color]::FromArgb(240, 230, 230, 230)) -ropeWidth 3.0

$g2.Dispose()
$bmp2.Save($dest2Path, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp2.Dispose()
$bg2.Dispose()

# --- Screenshot 3: Dark Minimal Setup with Pink Cassette ---
Write-Host "Creating Screenshot 3 (Pink Cassette on Setup)..."
$bg3Path = Join-Path $PSScriptRoot "..\website\assets\setup_dark.jpg"
$charm3Path = Join-Path $PSScriptRoot "..\website\assets\charms\pink-cassette.png"
$dest3Path = Join-Path $storeAssetsDir "screenshot-3.png"

$bg3 = [System.Drawing.Bitmap]::FromFile((Resolve-Path $bg3Path).Path)
$bmp3 = New-Object System.Drawing.Bitmap(1920, 1080, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g3 = [System.Drawing.Graphics]::FromImage($bmp3)
$g3.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g3.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

$g3.DrawImage($bg3, 0, 0, 1920, 1080)

# Draw Pink Cassette hanging on setup
Draw-DanglingCharm -g $g3 -anchorX 1060 -anchorY 260 -ropeLength 110 -angleDeg 6.0 `
    -charmImagePath $charm3Path -charmSize 120 `
    -ropeColor ([System.Drawing.Color]::FromArgb(240, 244, 114, 182)) -ropeWidth 2.5

$g3.Dispose()
$bmp3.Save($dest3Path, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp3.Dispose()
$bg3.Dispose()

Write-Host "Screenshots with hanging charms successfully generated in $storeAssetsDir!"
