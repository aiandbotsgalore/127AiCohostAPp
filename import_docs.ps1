$Source = "C:\Users\Logan\GoogleDocs\gemini_api_docs_site"
$Dest = "d:\DrSnuggles\gemini_api_docs_site"

Write-Host "Copying Gemini Docs from $Source to $Dest..."

if (Test-Path $Source) {
    Copy-Item -Path $Source -Destination $Dest -Recurse -Force
    Write-Host "Success! Docs imported."
} else {
    Write-Error "Source directory not found: $Source"
}
