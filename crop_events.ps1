Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\deepa\.gemini\antigravity-ide\brain\680ce35d-1905-401f-a70b-e6591ccffa75\.tempmediaStorage\media_1788376310981.png"
if (-not (Test-Path $srcPath)) {
    Write-Error "Source file not found: $srcPath"
    exit 1
}

$img = [System.Drawing.Bitmap]::FromFile($srcPath)
Write-Output "Image Dimensions: $($img.Width) x $($img.Height)"

# In the screenshot layout:
# The 3 cards are horizontally distributed in the middle-to-lower portion of the screenshot.
# Let's crop each card image precisely without the white label or top header:
# Image 1 (Left: Meetings & Conferences)
# Image 2 (Middle: Events Banquet Ballroom)
# Image 3 (Right: Timeless Weddings Couple)

$y = [int]($img.Height * 0.28)
$h = [int]($img.Height * 0.45)
$w = [int]($img.Width * 0.26)

# Card 1 (Left)
$x1 = [int]($img.Width * 0.11)
$rect1 = New-Object System.Drawing.Rectangle($x1, $y, $w, $h)
$crop1 = $img.Clone($rect1, $img.PixelFormat)
$crop1.Save("c:\Users\deepa\OneDrive\Desktop\hotel reliance\public\images\banquet\events-meetings.png", [System.Drawing.Imaging.ImageFormat]::Png)
$crop1.Dispose()

# Card 2 (Middle)
$x2 = [int]($img.Width * 0.395)
$rect2 = New-Object System.Drawing.Rectangle($x2, $y, $w, $h)
$crop2 = $img.Clone($rect2, $img.PixelFormat)
$crop2.Save("c:\Users\deepa\OneDrive\Desktop\hotel reliance\public\images\banquet\events-ballroom.png", [System.Drawing.Imaging.ImageFormat]::Png)
$crop2.Dispose()

# Card 3 (Right)
$x3 = [int]($img.Width * 0.68)
$rect3 = New-Object System.Drawing.Rectangle($x3, $y, $w, $h)
$crop3 = $img.Clone($rect3, $img.PixelFormat)
$crop3.Save("c:\Users\deepa\OneDrive\Desktop\hotel reliance\public\images\banquet\events-weddings.png", [System.Drawing.Imaging.ImageFormat]::Png)
$crop3.Dispose()

$img.Dispose()
Write-Output "Successfully cropped all 3 event images into public\images\banquet\"
