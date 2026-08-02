$lines = Get-Content 'f:\Adyapan AI\AdyapanAI\apps\web\src\pages\student\AptitudePage.tsx'
for ($i = 4380; $i -lt 4560; $i++) {
    if ($lines[$i] -match "name:") {
        '{0}: {1}' -f ($i + 1), $lines[$i].Trim()
    }
}

