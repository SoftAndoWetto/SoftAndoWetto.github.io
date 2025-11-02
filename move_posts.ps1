# Create directories if they don't exist
New-Item -ItemType Directory -Force -Path "_blog" | Out-Null
New-Item -ItemType Directory -Force -Path "_writeups" | Out-Null

# Move blog posts
Get-ChildItem -Path "_posts\blog\*.md" | ForEach-Object {
    $content = Get-Content $_.FullName
    # Update front matter
    $content = $content -replace "categories:\s*\[blog\]", "collection: blog"
    Set-Content -Path "_blog\$($_.Name)" -Value $content
}

# Move writeups
Get-ChildItem -Path "_posts\writeups\*.md" | ForEach-Object {
    $content = Get-Content $_.FullName
    # Update front matter
    $content = $content -replace "categories:\s*\[writeups\]", "collection: writeups"
    Set-Content -Path "_writeups\$($_.Name)" -Value $content
}

# Remove _posts directory after moving
Remove-Item -Path "_posts" -Recurse -Force