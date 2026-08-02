$lines = Get-Content 'f:\Adyapan AI\AdyapanAI\apps\web\src\pages\student\AptitudePage.tsx'

$starts = @{
    'Synonyms' = 3782
    'Antonyms' = 3926
    'Fill in the Blanks' = 4070
    'Spotting Errors' = 4208
    'Sentence Correction' = 4274
    'Sentence Arrangement' = 4390
    'Idioms & Phrases' = 4456
    'One Word Substitution' = 4522
    'Reading Comprehension' = 4588
    'Spelling Test' = 4642
}
$order = @('Synonyms','Antonyms','Fill in the Blanks','Spotting Errors','Sentence Correction','Sentence Arrangement','Idioms & Phrases','One Word Substitution','Reading Comprehension','Spelling Test')

$endLine = 4716

for ($i = 0; $i -lt $order.Count; $i++) {
    $name = $order[$i]
    $s = $starts[$name]
    if ($i -lt $order.Count - 1) {
        $e = $starts[$order[$i+1]] - 1
    } else {
        $e = $endLine
    }
    $count = 0
    for ($j = $s; $j -le $e; $j++) {
        if ($lines[$j-1] -match '^\s+question:') {
            $count++
        }
    }
    Write-Output ("{0}: {1} questions (lines {2}-{3})" -f $name, $count, $s, $e)
}

