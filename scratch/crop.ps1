Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\deepa\.gemini\antigravity-ide\brain\680ce35d-1905-401f-a70b-e6591ccffa75\.user_uploaded\media_1788390130563.jpg"
$img = [System.Drawing.Bitmap]::FromFile($srcPath)

function Crop-Image($x, $y, $w, $h, $dest) {
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $cropped = $img.Clone($rect, $img.PixelFormat)
    $cropped.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
    $cropped.Dispose()
    Write-Output "Saved: $dest ($w x $h)"
}

# Accurate card picture boundaries
Crop-Image 62 260 290 148 "public/images/standards/guests-first.png"
Crop-Image 368 260 290 148 "public/images/standards/premium-quality.png"
Crop-Image 674 260 290 148 "public/images/standards/safety-security.png"

# Also extract the full cards if wanted
Crop-Image 62 225 290 388 "public/images/standards/card-guests-first.png"
Crop-Image 368 225 290 388 "public/images/standards/card-premium-quality.png"
Crop-Image 674 225 290 388 "public/images/standards/card-safety-security.png"

$img.Dispose()
