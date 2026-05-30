$max = 60
for ($i=0; $i -lt $max; $i++) {
    $ref = git -C 'e:\Chitrahaar Films\chitrahaar-website' ls-remote --heads origin gallery-normalize
    if ($ref -ne '') {
        Write-Output 'FOUND'
        Write-Output $ref
        exit 0
    } else {
        Write-Output ("Attempt {0}: not found" -f ($i+1))
        Start-Sleep -Seconds 10
    }
}
Write-Output 'NOTFOUND'
exit 2
