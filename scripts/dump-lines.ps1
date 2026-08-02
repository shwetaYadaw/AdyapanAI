param(
    [string]$Path = "f:\Adyapan AI\AdyapanAI\apps\web\src\pages\student\AptitudePage.tsx",
    [int]$Start = 1,
    [int]$End = 10
)
$lines = Get-Content $Path
for ($i = $Start; $i -le $End; $i++) {
    if ($i -le $lines.Count) {
        "{0}: {1}" -f $i, $lines[$i-1]
    }
}

