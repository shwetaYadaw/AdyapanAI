$lines = Get-Content 'f:\Adyapan AI\AdyapanAI\apps\web\src\pages\student\AptitudePage.tsx'
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match "name: '(Synonyms|Antonyms|Fill in the Blanks|Spotting Errors|Sentence Correction|Sentence Arrangement|Idioms|One Word Substitution|Reading Comprehension|Spelling Test)'" -or $lines[$i] -match 'TCS_VERBAL_TOPICS') {
        '{0}: {1}' -f ($i + 1), $lines[$i].Trim()
    }
}

