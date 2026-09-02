Add-Type -AssemblyName System.Drawing

Get-ChildItem "C:\Users\deepa\.gemini\antigravity-ide\brain\680ce35d-1905-401f-a70b-e6591ccffa75\.tempmediaStorage" | ForEach-Object {
    try {
        $b = [System.Drawing.Bitmap]::FromFile($_.FullName)
        Write-Output "$($_.Name) -> $($b.Width)x$($b.Height)"
        $b.Dispose()
    } catch {
        Write-Output "$($_.Name) -> Error opening"
    }
}
