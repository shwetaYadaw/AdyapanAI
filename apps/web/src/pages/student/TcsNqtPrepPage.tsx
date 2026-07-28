import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code, ChevronRight, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import Card from '../../components/common/Card/Card';
import Badge from '../../components/common/Badge/Badge';
import Button from '../../components/common/Button/Button';
import { api } from '../../services/api';

interface TCSQuestion {
  id?: string;
  title: string;
  slug: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topics?: string[];
}

const ARRAY_PROBLEMS: TCSQuestion[] = [
  { title: 'Find the smallest number in an array', slug: 'find-the-smallest-number-in-an-array-tcs-nqt', difficulty: 'easy' },
  { title: 'Find the largest number in an array', slug: 'find-the-largest-number-in-an-array-tcs-nqt', difficulty: 'easy' },
  { title: 'Second Smallest and Second Largest element in an array', slug: 'second-smallest-and-second-largest-element-in-an-array-tcs-nqt', difficulty: 'medium' },
  { title: 'Reverse a given array', slug: 'reverse-a-given-array-tcs-nqt', difficulty: 'easy' },
  { title: 'Count frequency of each element in an array', slug: 'count-frequency-of-each-element-in-an-array-tcs-nqt', difficulty: 'medium' },
  { title: 'Rearrange array in increasing-decreasing order', slug: 'rearrange-array-in-increasing-decreasing-order-tcs-nqt', difficulty: 'medium' },
  { title: 'Calculate sum of the elements of the array', slug: 'calculate-sum-of-the-elements-of-the-array-tcs-nqt', difficulty: 'easy' },
  { title: 'Rotate array by K elements - Block Swap Algorithm', slug: 'rotate-array-by-k-elements-block-swap-algorithm-tcs-nqt', difficulty: 'hard' },
  { title: 'Average of all elements in an array', slug: 'average-of-all-elements-in-an-array-tcs-nqt', difficulty: 'easy' },
  { title: 'Find the median of the given array', slug: 'find-the-median-of-the-given-array-tcs-nqt', difficulty: 'easy' },
  { title: 'Remove duplicates from a sorted array', slug: 'remove-duplicates-from-a-sorted-array-tcs-nqt', difficulty: 'easy' },
  { title: 'Remove duplicates from unsorted array', slug: 'remove-duplicates-from-unsorted-array-tcs-nqt', difficulty: 'medium' },
  { title: 'Adding Element in an array', slug: 'adding-element-in-an-array-tcs-nqt', difficulty: 'easy' },
  { title: 'Find all repeating elements in an array', slug: 'find-all-repeating-elements-in-an-array-tcs-nqt', difficulty: 'medium' },
  { title: 'Find all non-repeating elements in an array', slug: 'find-all-non-repeating-elements-in-an-array-tcs-nqt', difficulty: 'medium' },
  { title: 'Find all symmetric pairs in array', slug: 'find-all-symmetric-pairs-in-array-tcs-nqt', difficulty: 'medium' },
  { title: 'Maximum product subarray in an array', slug: 'maximum-product-subarray-in-an-array-tcs-nqt', difficulty: 'hard' },
  { title: 'Replace each element of the array by its rank in the array', slug: 'replace-each-element-of-the-array-by-its-rank-in-the-array-tcs-nqt', difficulty: 'medium' },
  { title: 'Sorting elements of an array by frequency', slug: 'sorting-elements-of-an-array-by-frequency-tcs-nqt', difficulty: 'hard' },
  { title: 'Rotation of elements of array- left and right', slug: 'rotation-of-elements-of-array-left-and-right-tcs-nqt', difficulty: 'medium' },
  { title: 'Finding equilibrium index of an array', slug: 'finding-equilibrium-index-of-an-array-tcs-nqt', difficulty: 'medium' },
  { title: 'Finding Circular rotation of an array by K positions', slug: 'finding-circular-rotation-of-an-array-by-k-positions-tcs-nqt', difficulty: 'medium' },
  { title: 'Sort an array according to the order defined by another array', slug: 'sort-an-array-according-to-the-order-defined-by-another-array-tcs-nqt', difficulty: 'hard' },
  { title: 'Search an element in an array', slug: 'search-an-element-in-an-array-tcs-nqt', difficulty: 'easy' },
  { title: 'Check if Array is a subset of another array or not', slug: 'check-if-array-is-a-subset-of-another-array-or-not-tcs-nqt', difficulty: 'easy' },
];

const NUMBER_PROBLEMS: TCSQuestion[] = [
  { title: 'Check if a number is palindrome or not', slug: 'check-if-a-number-is-palindrome-or-not-tcs-nqt', difficulty: 'easy' },
  { title: 'Find all Palindrome numbers in a given range', slug: 'find-all-palindrome-numbers-in-a-given-range-tcs-nqt', difficulty: 'medium' },
  { title: 'Check if a number is prime or not', slug: 'check-if-a-number-is-prime-or-not-tcs-nqt', difficulty: 'easy' },
  { title: 'Prime numbers in a given range', slug: 'prime-numbers-in-a-given-range-tcs-nqt', difficulty: 'medium' },
  { title: 'Check if a number is armstrong number of not', slug: 'check-if-a-number-is-armstrong-number-of-not-tcs-nqt', difficulty: 'easy' },
  { title: 'Check if a number is perfect number', slug: 'check-if-a-number-is-perfect-number-tcs-nqt', difficulty: 'easy' },
  { title: 'Even or Odd', slug: 'even-or-odd-tcs-nqt', difficulty: 'easy' },
  { title: 'Check weather a given number is positive or negative', slug: 'check-weather-a-given-number-is-positive-or-negative-tcs-nqt', difficulty: 'easy' },
  { title: 'Sum of first N natural numbers', slug: 'sum-of-first-n-natural-numbers-tcs-nqt', difficulty: 'easy' },
  { title: 'Find Sum of AP Series', slug: 'find-sum-of-ap-series-tcs-nqt', difficulty: 'easy' },
  { title: 'Program to find sum of GP Series', slug: 'program-to-find-sum-of-gp-series-tcs-nqt', difficulty: 'medium' },
  { title: 'Greatest of two numbers', slug: 'greatest-of-two-numbers-tcs-nqt', difficulty: 'easy' },
  { title: 'Greatest of three numbers', slug: 'greatest-of-three-numbers-tcs-nqt', difficulty: 'easy' },
  { title: 'Leap Year or not', slug: 'leap-year-or-not-tcs-nqt', difficulty: 'easy' },
  { title: 'Reverse digits of a number', slug: 'reverse-digits-of-a-number-tcs-nqt', difficulty: 'easy' },
  { title: 'Maximum and Minimum digit in a number', slug: 'maximum-and-minimum-digit-in-a-number-tcs-nqt', difficulty: 'easy' },
  { title: 'Print Fibonacci upto Nth Term', slug: 'print-fibonacci-upto-nth-term-tcs-nqt', difficulty: 'easy' },
  { title: 'Factorial of a number', slug: 'factorial-of-a-number-tcs-nqt', difficulty: 'easy' },
  { title: 'Power of a number', slug: 'power-of-a-number-tcs-nqt', difficulty: 'medium' },
  { title: 'Factors of a given number', slug: 'factors-of-a-given-number-tcs-nqt', difficulty: 'easy' },
  { title: 'Print all prime factors of the given number', slug: 'print-all-prime-factors-of-the-given-number-tcs-nqt', difficulty: 'medium' },
  { title: 'Check if a number is a strong number or not', slug: 'check-if-a-number-is-a-strong-number-or-not-tcs-nqt', difficulty: 'medium' },
  { title: 'Check if a Number is Automorphic', slug: 'check-if-a-number-is-automorphic-tcs-nqt', difficulty: 'medium' },
  { title: 'GCD of two numbers', slug: 'gcd-of-two-numbers-tcs-nqt', difficulty: 'easy' },
  { title: 'LCM of two numbers', slug: 'lcm-of-two-numbers-tcs-nqt', difficulty: 'easy' },
  { title: 'Sum of digits of a number', slug: 'sum-of-digits-of-a-number-tcs-nqt', difficulty: 'easy' },
  { title: 'Sum of numbers in the given range', slug: 'sum-of-numbers-in-the-given-range-tcs-nqt', difficulty: 'easy' },
  { title: 'Permutations in which N people can occupy R seats in a classroom', slug: 'permutations-in-which-n-people-can-occupy-r-seats-in-a-classroom-tcs-nqt', difficulty: 'medium' },
  { title: 'Program to add two fractions', slug: 'program-to-add-two-fractions-tcs-nqt', difficulty: 'medium' },
  { title: 'Replace all 0s with 1s in a given integer', slug: 'replace-all-0s-with-1s-in-a-given-integer-tcs-nqt', difficulty: 'easy' },
  { title: 'Can a number be expressed as a sum of two prime numbers', slug: 'can-a-number-be-expressed-as-a-sum-of-two-prime-numbers-tcs-nqt', difficulty: 'medium' },
  { title: 'Calculate the area of circle', slug: 'calculate-the-area-of-circle-tcs-nqt', difficulty: 'easy' },
  { title: 'Program to find roots of a Quadratic Equation', slug: 'program-to-find-roots-of-a-quadratic-equation-tcs-nqt', difficulty: 'hard' },
];

const NUMBER_SYSTEM_PROBLEMS: TCSQuestion[] = [
  { title: 'Convert Binary to Decimal', slug: 'convert-binary-to-decimal-tcs-nqt', difficulty: 'easy' },
  { title: 'Convert binary to octal', slug: 'convert-binary-to-octal-tcs-nqt', difficulty: 'medium' },
  { title: 'Decimal to Binary conversion', slug: 'decimal-to-binary-conversion-tcs-nqt', difficulty: 'easy' },
  { title: 'Convert decimal to octal', slug: 'convert-decimal-to-octal-tcs-nqt', difficulty: 'medium' },
  { title: 'Convert octal to binary', slug: 'convert-octal-to-binary-tcs-nqt', difficulty: 'medium' },
  { title: 'Convert octal to decimal', slug: 'convert-octal-to-decimal-tcs-nqt', difficulty: 'medium' },
  { title: 'Convert digits/numbers to words', slug: 'convert-digitsnumbers-to-words-tcs-nqt', difficulty: 'hard' },
];

const SORTING_PROBLEMS: TCSQuestion[] = [
  { title: 'Bubble Sort Algorithm', slug: 'bubble-sort-algorithm-tcs-nqt', difficulty: 'easy' },
  { title: 'Selection Sort Algorithm', slug: 'selection-sort-algorithm-tcs-nqt', difficulty: 'easy' },
  { title: 'Insertion Sort Algorithm', slug: 'insertion-sort-algorithm-tcs-nqt', difficulty: 'easy' },
  { title: 'Quick Sort Algorithm', slug: 'quick-sort-algorithm-tcs-nqt', difficulty: 'medium' },
  { title: 'Merge sort algorithm', slug: 'merge-sort-algorithm-tcs-nqt', difficulty: 'medium' },
];

const STRING_PROBLEMS: TCSQuestion[] = [
  { title: 'Check if a given string is palindrome or not', slug: 'check-if-a-given-string-is-palindrome-or-not-tcs-nqt', difficulty: 'easy' },
  { title: 'Count number of vowels, consonants, spaces in String', slug: 'count-number-of-vowels-consonants-spaces-in-string-tcs-nqt', difficulty: 'easy' },
  { title: 'Find the ASCII value of a character', slug: 'find-the-ascii-value-of-a-character-tcs-nqt', difficulty: 'easy' },
  { title: 'Remove all vowels from the string', slug: 'remove-all-vowels-from-the-string-tcs-nqt', difficulty: 'easy' },
  { title: 'Remove spaces from a string', slug: 'remove-spaces-from-a-string-tcs-nqt', difficulty: 'easy' },
  { title: 'Remove characters from a string except alphabets', slug: 'remove-characters-from-a-string-except-alphabets-tcs-nqt', difficulty: 'easy' },
  { title: 'Reverse a String', slug: 'reverse-a-string-tcs-nqt', difficulty: 'easy' },
  { title: 'Remove brackets from an algebraic expression', slug: 'remove-brackets-from-an-algebraic-expression-tcs-nqt', difficulty: 'medium' },
  { title: 'Sum of the numbers in a String', slug: 'sum-of-the-numbers-in-a-string-tcs-nqt', difficulty: 'easy' },
  { title: 'Capitalize first and last character of each word', slug: 'capitalize-first-and-last-character-of-each-word-tcs-nqt', difficulty: 'medium' },
  { title: 'Calculate frequency of characters in a string', slug: 'calculate-frequency-of-characters-in-a-string-tcs-nqt', difficulty: 'medium' },
  { title: 'Find Non-repeating characters of a String', slug: 'find-non-repeating-characters-of-a-string-tcs-nqt', difficulty: 'medium' },
  { title: 'Check if two strings are anagram of each other', slug: 'check-if-two-strings-are-anagram-of-each-other-tcs-nqt', difficulty: 'easy' },
  { title: 'Count common sub-sequence in two strings', slug: 'count-common-sub-sequence-in-two-strings-tcs-nqt', difficulty: 'hard' },
  { title: 'Check if two strings match where one string contains wildcard characters', slug: 'check-if-two-strings-match-where-one-string-contains-wildcard-characters-tcs-nqt', difficulty: 'hard' },
  { title: 'Return maximum occurring character in the input string', slug: 'return-maximum-occurring-character-in-the-input-string-tcs-nqt', difficulty: 'medium' },
  { title: 'Remove all duplicates from the input string', slug: 'remove-all-duplicates-from-the-input-string-tcs-nqt', difficulty: 'medium' },
  { title: 'Print all the duplicates in the input string', slug: 'print-all-the-duplicates-in-the-input-string-tcs-nqt', difficulty: 'medium' },
  { title: 'Remove characters from first string present in the second string', slug: 'remove-characters-from-first-string-present-in-the-second-string-tcs-nqt', difficulty: 'medium' },
  { title: 'Change every letter with the next lexicographic alphabet in the given string', slug: 'change-every-letter-with-the-next-lexicographic-alphabet-in-the-given-string-tcs-nqt', difficulty: 'medium' },
  { title: 'Write a program to find the largest word in a given string', slug: 'write-a-program-to-find-the-largest-word-in-a-given-string-tcs-nqt', difficulty: 'medium' },
  { title: 'Write a program to sort characters in a string', slug: 'write-a-program-to-sort-characters-in-a-string-tcs-nqt', difficulty: 'medium' },
  { title: 'Count number of words in a given string', slug: 'count-number-of-words-in-a-given-string-tcs-nqt', difficulty: 'easy' },
  { title: 'Write a program to find a word in a given string which has the highest number of repeated letters', slug: 'write-a-program-to-find-a-word-in-a-given-string-which-has-the-highest-number-of-repeated-letters-tcs-nqt', difficulty: 'hard' },
  { title: 'Change case of each character in a string', slug: 'change-case-of-each-character-in-a-string-tcs-nqt', difficulty: 'easy' },
  { title: 'Concatenate one string to another', slug: 'concatenate-one-string-to-another-tcs-nqt', difficulty: 'easy' },
  { title: 'Write a program to find a substring within a string, if found display its starting position', slug: 'write-a-program-to-find-a-substring-within-a-string-if-found-display-its-starting-position-tcs-nqt', difficulty: 'medium' },
  { title: 'Reverse words in a string', slug: 'reverse-words-in-a-string-tcs-nqt', difficulty: 'medium' },
];

export default function TcsNqtPrepPage() {
  const [activeTab, setActiveTab] = useState<'arrays' | 'numbers' | 'number-system' | 'sorting' | 'strings'>('arrays');

  const { data: storedQuestions = [], isLoading, isError } = useQuery<TCSQuestion[]>({
    queryKey: ['tcsNqtQuestions'],
    queryFn: async () => {
      const { data } = await api.get('/challenges/questions');
      return (data.data ?? [])
        .map((question: any) => ({
          ...question,
          id: question.id ?? question._id,
          topics: Array.isArray(question.topics)
            ? question.topics
            : typeof question.topics === 'string'
              ? JSON.parse(question.topics)
              : [],
        }))
        .filter((question: TCSQuestion) => question.topics?.includes('tcs-nqt'));
    },
  });

  const getQuestions = () => {
    switch (activeTab) {
      case 'arrays': return ARRAY_PROBLEMS;
      case 'numbers': return NUMBER_PROBLEMS;
      case 'number-system': return NUMBER_SYSTEM_PROBLEMS;
      case 'sorting': return SORTING_PROBLEMS;
      case 'strings': return STRING_PROBLEMS;
      default: return ARRAY_PROBLEMS;
    }
  };

  // The local lists define the NQT sections and display order. The actual
  // question data always comes from MySQL, so this screen cannot link to a
  // problem that is missing from the coding portal.
  const questions = getQuestions()
    .map((reference) => storedQuestions.find((question) => question.slug === reference.slug))
    .filter((question): question is TCSQuestion => Boolean(question));

  return (
    <div className="page-wrapper space-y-6">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 p-8 sm:p-10 text-white shadow-brand"
      >
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-12 -translate-y-12 scale-150">
          <Code className="w-96 h-96 text-white" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-bold uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5" /> Special Prep Track
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="font-display font-black text-3xl sm:text-4xl tracking-tight leading-tight"
          >
            TCS NQT Coding Sheet
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="text-white/90 text-sm sm:text-base leading-relaxed"
          >
            Master the top coding challenges frequently asked in the TCS National Qualifier Test (NQT) and similar placement assessments.
          </motion.p>
          <div className="flex flex-wrap gap-4 text-xs text-white/70 pt-2 border-t border-white/20">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-white" /> {storedQuestions.length} MySQL-backed Problems</span>
            <span className="flex items-center gap-1.5"><Code className="w-4 h-4 text-white" /> Multilanguage Editor</span>
            <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-white" /> TCS Specific Test Cases</span>
          </div>
        </div>
      </motion.div>

      {/* Navigation tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-gray-100 dark:bg-gray-800/60 rounded-xl w-fit overflow-x-auto">
        {[
          { key: 'arrays', label: 'Problems on Arrays' },
          { key: 'numbers', label: 'Problems on Numbers' },
          { key: 'number-system', label: 'Number System' },
          { key: 'sorting', label: 'Sorting' },
          { key: 'strings', label: 'String' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-300 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid of Coding challenges */}
      <div className="space-y-4">
        {isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Unable to load TCS NQT questions from MySQL. Please make sure the backend and database are running.
          </div>
        )}
        {!isError && !isLoading && questions.length === 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            No TCS NQT questions have been restored for this section yet.
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {questions.map((q, idx) => (
            <motion.div
              key={q.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.015 }}
            >
              <Card padding="md" className="hover:border-purple-500/30 transition-all group flex flex-col justify-between h-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                <div className="space-y-2">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-xs font-bold font-mono text-purple-500/80">
                      Q{idx + 1}.
                    </span>
                    <Badge
                      variant={
                        q.difficulty === 'easy' ? 'success' : q.difficulty === 'medium' ? 'warning' : 'danger'
                      }
                      className="capitalize"
                    >
                      {q.difficulty}
                    </Badge>
                  </div>
                  <h3 className="font-display font-bold text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors text-sm sm:text-base">
                    {q.title}
                  </h3>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                  <Link to={`/student/challenges/${q.slug}`}>
                    <Button size="sm" variant="primary" rightIcon={<ChevronRight className="w-4 h-4" />}>
                      Solve Challenge
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
