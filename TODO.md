# TODO: Fix TCS Verbal Ability topics showing no questions

## Problem
Clicking a TCS Verbal Ability topic (Synonyms, Antonyms, etc.) shows no questions / "Topic not found" even though questions exist in `TCS_VERBAL_TOPICS`.

## Root Cause
`AptitudeQuizPage.tsx` only imported `TCS_NUMERICAL_TOPICS` and `TCS_REASONING_TOPICS`. When `module === 'tcs-verbal'`, it fell back to numerical topics, so `findTopic()` returned `undefined`.

## Steps
- [x] 1. Investigate and locate the root cause (AptitudePage.tsx + AptitudeQuizPage.tsx)
- [x] 2. Import `TCS_VERBAL_TOPICS` in AptitudeQuizPage.tsx
- [x] 3. Fix `allTopics` logic to map `tcs-verbal` → `TCS_VERBAL_TOPICS`
- [x] 4. Fix `moduleLabel` to show "TCS Verbal Ability" for `tcs-verbal`
- [x] 5. Verify build/tests pass (tsc --noEmit: no errors in AptitudeQuizPage.tsx; 8 pre-existing errors in unrelated files only)

