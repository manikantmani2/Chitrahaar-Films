$headerPath = 'e:\Chitrahaar Films\chitrahaar-website\src\components\Header.tsx'
$header = [IO.File]::ReadAllText($headerPath)
$desktopPattern = '<Button href="/#contact" variant="primary" size="md" className="btn-primary">.*?Get in Touch.*?</Button>'
$desktopReplacement = @"
            <Button href="/#contact" variant="primary" size="md" className="btn-primary">
              Get in Touch
            </Button>
"@
$header = [regex]::Replace($header, $desktopPattern, $desktopReplacement, [System.Text.RegularExpressions.RegexOptions]::Singleline)
$mobilePattern = '<Button href="/#contact" variant="primary" size="md" className="w-full mt-4">.*?Get in Touch.*?</Button>'
$mobileReplacement = @"
            <Button href="/#contact" variant="primary" size="md" className="w-full mt-4">
              Get in Touch
            </Button>
"@
$header = [regex]::Replace($header, $mobilePattern, $mobileReplacement, [System.Text.RegularExpressions.RegexOptions]::Singleline)
[IO.File]::WriteAllText($headerPath, $header)

$appPath = 'e:\Chitrahaar Films\chitrahaar-website\src\pages\_app.tsx'
$app = [IO.File]::ReadAllText($appPath)
$app = [regex]::Replace($app, "\{theme === 'dark' \? '.*?' : '.*?'\}", "{theme === 'dark' ? '☾' : '☼'}")
[IO.File]::WriteAllText($appPath, $app)
