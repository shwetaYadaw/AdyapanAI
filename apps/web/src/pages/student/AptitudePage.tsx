import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Lock, GraduationCap, ArrowRight, BookOpen } from 'lucide-react';
import Card from '../../components/common/Card/Card';
import Badge from '../../components/common/Badge/Badge';
import { topicSlug } from './aptitudeData';

export interface Question {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface Topic {
  name: string;
  pageNumber: number;
  questions: Question[];
}

export const TCS_NUMERICAL_TOPICS: Topic[] = [
  {
    name: 'Percentage',
    pageNumber: 4,
    questions: [
      {
        question: 'A number is increased by 25%, then it becomes 600. The original number is:',
        options: ['450', '480', '500', '520'],
        answer: '480',
        explanation: 'Let the original number be x. x + 0.25x = 600 => 1.25x = 600 => x = 480.'
      },
      {
        question: 'A number is decreased by 20%, then it becomes 120. The original number is:',
        options: ['140', '150', '160', '180'],
        answer: '150',
        explanation: 'Let the original number be x. x - 0.20x = 120 => 0.8x = 120 => x = 150.'
      },
      {
        question: 'A number is decreased by 33 + 1/3 %, then it becomes 180. The original number is:',
        options: ['240', '250', '270', '300'],
        answer: '270',
        explanation: '33 + 1/3% is equal to 1/3 in fraction. If a number is decreased by 1/3, it becomes 2/3 of its original value. (2/3) * x = 180 => x = 270.'
      },
      {
        question: 'The total income of Yash Sir of 2017, 2018, 2019 is Rs. 364. Every year the salary increases by 20%. What is the income in 2017?',
        options: ['Rs. 100', 'Rs. 120', 'Rs. 144', 'Rs. 150'],
        answer: 'Rs. 100',
        explanation: 'Let the income in 2017 be x. In 2018, it is 1.2x. In 2019, it is 1.44x. Sum = x + 1.2x + 1.44x = 3.64x = 364 => x = 100.'
      },
      {
        question: 'The total income of Eesha in the years 2003, 2004, 2005 was $36,400. Her income increased by 20% each year. What was her income in 2005?',
        options: ['$10,000', '$12,000', '$14,400', '$16,000'],
        answer: '$14,400',
        explanation: 'Let the income in 2003 be x. Total income = x + 1.2x + 1.44x = 3.64x = 36,400 => x = 10,000. Her income in 2005 is 1.44 * 10,000 = $14,400.'
      },
      {
        question: 'The price of petrol is increased by 10%, in order to keep the expenditure as constant, by what % usage must be reduced?',
        options: ['9.09%', '10%', '11.11%', '8.33%'],
        answer: '9.09%',
        explanation: 'Formula: [R / (100 + R)] * 100 % => [10 / 110] * 100% = 9.09%.'
      },
      {
        question: 'The price of onion decreased by 25%, in order to keep the expenditure as constant, by what % consumption must be increased?',
        options: ['25%', '33.33%', '50%', '20%'],
        answer: '33.33%',
        explanation: 'Formula: [R / (100 - R)] * 100 % => [25 / 75] * 100% = 33.33%.'
      },
      {
        question: 'A is 25% less than B. By what % is B more than A?',
        options: ['25%', '30%', '33.33%', '50%'],
        answer: '33.33%',
        explanation: 'If A is 25% less, B is more by [25 / (100 - 25)] * 100 = 33.33%.'
      },
      {
        question: 'A is 25% more than B. By what % is B less than A?',
        options: ['20%', '25%', '33.33%', '16.67%'],
        answer: '20%',
        explanation: 'If A is 25% more, B is less by [25 / (100 + 25)] * 100 = 20%.'
      },
      {
        question: 'Indian Film Industry is 2/7 more rich than Indian TV Industry. By what % is Indian TV Industry less rich than Indian Film Industry?',
        options: ['22.22%', '28.57%', '20%', '25%'],
        answer: '22.22%',
        explanation: 'Let TV Industry wealth be 7. Film Industry wealth is 7 + 2 = 9. TV is less rich by 2/9. (2/9) * 100% = 22.22%.'
      },
      {
        question: 'You and your crush wrote the TCS NQT test. While you scored 45% and got 4 marks below the cut-off. Your crush scored 60% and got 8 marks above cut-off and got selected for the interview. What was the maximum marks in the test?',
        options: ['80', '100', '120', '150'],
        answer: '80',
        explanation: 'Difference in percentage = 60% - 45% = 15%. Difference in marks = 8 - (-4) = 12. 15% of Maximum Marks = 12 => Maximum Marks = 12 / 0.15 = 80.'
      },
      {
        question: 'A batsman scored 110 runs which included 3 boundaries and 8 sixes. What percent of his total score did he make by running between the wickets?',
        options: ['45%', '45 5/11%', '54 6/11%', '55%'],
        answer: '45 5/11%',
        explanation: 'Number of runs made by running = 110 - (3 × 4 + 8 × 6) = 110 - (12 + 48) = 110 - 60 = 50. Required percentage = (50/110) × 100 = 500/11 = 45 5/11%.'
      },
      {
        question: 'Two students appeared at an examination. One of them secured 9 marks more than the other and his marks was 56% of the sum of their marks. The marks obtained by them are:',
        options: ['39, 30', '41, 32', '42, 33', '43, 34'],
        answer: '42, 33',
        explanation: 'Let their marks be (x + 9) and x. Then x + 9 = (56/100)(2x + 9) => 25(x + 9) = 14(2x + 9) => 25x + 225 = 28x + 126 => 3x = 99 => x = 33. So marks are 42 and 33.'
      },
      {
        question: 'A fruit seller had some apples. He sells 40% apples and still has 420 apples. Originally, he had:',
        options: ['588 apples', '600 apples', '672 apples', '700 apples'],
        answer: '700 apples',
        explanation: 'Suppose originally he had x apples. Then (100 - 40)% of x = 420. => (60/100) × x = 420 => x = (420 × 100)/60 = 700.'
      },
      {
        question: 'What percentage of numbers from 1 to 70 have 1 or 9 in the unit\'s digit?',
        options: ['1', '14', '20', '21'],
        answer: '20',
        explanation: 'Numbers with 1 or 9 in units digit from 1 to 70: 1, 9, 11, 19, 21, 29, 31, 39, 41, 49, 51, 59, 61, 69 = 14 numbers. Required percentage = (14/70) × 100 = 20%.'
      },
      {
        question: 'If A = x% of y and B = y% of x, then which of the following is true?',
        options: ['A is smaller than B', 'A is greater than B', 'Relationship between A and B cannot be determined', 'If x is smaller than y, then A is greater than B', 'None of these'],
        answer: 'None of these',
        explanation: 'x% of y = (x/100) × y = xy/100. y% of x = (y/100) × x = xy/100. Therefore A = B. So "None of these" (A equals B) is correct.'
      },
      {
        question: 'If 20% of a = b, then b % of 20 is the same as:',
        options: ['4% of a', '5% of a', '20% of a', 'None of these'],
        answer: '4% of a',
        explanation: '20% of a = b => (20/100) × a = b. b% of 20 = (b/100) × 20 = (20a/100 × 1/100) × 20 = (4/100) × a = 4% of a.'
      },
      {
        question: 'In a certain school, 20% of students are below 8 years of age. The number of students above 8 years of age is 2/3 of the number of students of 8 years of age which is 48. What is the total number of students in the school?',
        options: ['72', '80', '120', '150', '100'],
        answer: '100',
        explanation: 'Let total students = x. Students above 8 = 80% of x. Students of age 8 = 48. Students above 8 = (2/3) × 48 = 32. So 80% of x = 48 + 32 = 80. => (80/100) × x = 80 => x = 100.'
      },
      {
        question: 'Two numbers A and B are such that the sum of 5% of A and 4% of B is two-third of the sum of 6% of A and 8% of B. Find the ratio of A : B.',
        options: ['2 : 3', '1 : 1', '3 : 4', '4 : 3'],
        answer: '4 : 3',
        explanation: '5% of A + 4% of B = (2/3)(6% of A + 8% of B). => (1/20)A + (1/25)B = (1/25)A + (4/75)B. => (1/20 - 1/25)A = (4/75 - 1/25)B. => (1/100)A = (1/75)B. => A/B = 100/75 = 4/3. Required ratio = 4 : 3.'
      },
      {
        question: 'A student multiplied a number by 3/5 instead of 5/3. What is the percentage error in the calculation?',
        options: ['34%', '44%', '54%', '64%'],
        answer: '64%',
        explanation: 'Let the number be x. Error = (5/3)x - (3/5)x = (16/15)x. Error% = [(16/15)x / (5/3)x] × 100 = [(16/15) × (3/5)] × 100 = (48/75) × 100 = 64%.'
      }
    ]
  },
  {
    name: 'Number System',
    pageNumber: 93,
    questions: [
      {
        question: 'Find Number of Factors and Product of Factors of 72.',
        options: ['12 and 72^6', '10 and 72^5', '12 and 72^12', '8 and 72^4'],
        answer: '12 and 72^6',
        explanation: '72 = 2^3 * 3^2. Number of factors = (3+1)*(2+1) = 12. Product of factors = N^(F/2) = 72^(12/2) = 72^6.'
      },
      {
        question: "Consider the expression: (999â€¦.9)Â² , if there are a total of 2020 9's, find the total number of digits and the digit sum of the result.",
        options: ['Digits: 4040, Digit Sum: 18180', 'Digits: 2020, Digit Sum: 9090', 'Digits: 4040, Digit Sum: 18171', 'Digits: 4039, Digit Sum: 18180'],
        answer: 'Digits: 4040, Digit Sum: 18180',
        explanation: '(999...9)^2 has a pattern: N-1 nines, one 8, N-1 zeros, one 1. Digits = 2020 * 2 = 4040. Sum of digits = 2019 * 9 + 8 + 0 + 1 = 18180.'
      },
      {
        question: "Consider the expression: (999â€¦.9)Â³ , if there are a total of 2020 9's, find the total number of digits and the digit sum of the result.",
        options: ['Digits: 6060, Digit Sum: 36360', 'Digits: 6060, Digit Sum: 18180', 'Digits: 4040, Digit Sum: 36360', 'Digits: 6059, Digit Sum: 36359'],
        answer: 'Digits: 6060, Digit Sum: 36360',
        explanation: 'For N nines, (99..9)^3 has 3N digits (6060 here). Sum of digits = 18 * N = 18 * 2020 = 36360.'
      },
      {
        question: 'The square root of 12345678987654321 is nnnnnnâ€¦. upto â€˜pâ€™ times, find the sum of n and p.',
        options: ['9', '10', '11', '12'],
        answer: '10',
        explanation: 'The square root of 12345678987654321 is 111111111 (nine 1s). So n = 1, p = 9. Sum = 1 + 9 = 10.'
      },
      {
        question: 'A number when divided by 406 leaves remainder 115. What will be the remainder when it is divided by 29?',
        options: ['15', '28', '27', '18'],
        answer: '28',
        explanation: 'Since 406 is divisible by 29, the remainder is simply 115 % 29. 115 = 29 * 3 + 28. Remainder is 28.'
      },
      {
        question: 'When a four digit number is divided by 85, it leaves a remainder of 39. If the same number is divided by 17, the remainder would be:',
        options: ['5', '6', '12', '15'],
        answer: '5',
        explanation: '85 is divisible by 17. The remainder when divided by 17 is 39 % 17 = 5.'
      },
      {
        question: 'When a number is divided by 899, it leaves a remainder of 63. If the same number is divided by 29, the remainder would be:',
        options: ['5', '7', '12', '15'],
        answer: '5',
        explanation: '899 is divisible by 29. Remainder is 63 % 29 = 5.'
      },
      {
        question: 'Which one of the following is not a prime number?',
        options: ['31', '61', '71', '91'],
        answer: '91',
        explanation: '91 = 7 × 13. So 91 is divisible by 7 and is not a prime number. 31, 61, and 71 are all prime numbers.'
      },
      {
        question: '(112 × 5^4) = ?',
        options: ['67000', '70000', '76500', '77200'],
        answer: '70000',
        explanation: '112 × 5^4 = 112 × (10/2)^4 = 112 × 10^4 / 2^4 = 112 × 10000 / 16 = 1120000 / 16 = 70000.'
      },
      {
        question: 'It is being given that (2^32 + 1) is completely divisible by a whole number. Which of the following numbers is completely divisible by this number?',
        options: ['(2^16 + 1)', '(2^16 - 1)', '(7 × 2^23)', '(2^96 + 1)'],
        answer: '(2^96 + 1)',
        explanation: 'Let 2^32 = x. Then (2^32 + 1) = (x + 1). (2^96 + 1) = [(2^32)^3 + 1] = (x^3 + 1) = (x + 1)(x^2 - x + 1), which is completely divisible by (x + 1) = (2^32 + 1).'
      },
      {
        question: 'What least number must be added to 1056, so that the sum is completely divisible by 23?',
        options: ['2', '3', '18', '21', 'None of these'],
        answer: '2',
        explanation: '1056 ÷ 23 = 45 remainder 21. Required number = 23 - 21 = 2. So 1056 + 2 = 1058 is divisible by 23.'
      },
      {
        question: '1397 × 1397 = ?',
        options: ['1951609', '1981709', '18362619', '2031719', 'None of these'],
        answer: '1951609',
        explanation: '1397 × 1397 = (1397)^2 = (1400 - 3)^2 = 1400^2 + 3^2 - 2 × 1400 × 3 = 1960000 + 9 - 8400 = 1951609.'
      },
      {
        question: 'How many of the following numbers are divisible by 132? 264, 396, 462, 792, 968, 2178, 5184, 6336',
        options: ['4', '5', '6', '7'],
        answer: '4',
        explanation: '132 = 4 × 3 × 11. A number divisible by 132 must be divisible by 4, 3, and 11. Checking: 264 ✓, 396 ✓, 462 ✗, 792 ✓, 968 ✗, 2178 ✗, 5184 ✗, 6336 ✓. Total = 4.'
      },
      {
        question: '(935421 × 625) = ?',
        options: ['575648125', '584638125', '584649125', '585628125'],
        answer: '584638125',
        explanation: '935421 × 625 = 935421 × 5^4 = 935421 × (10/2)^4 = (935421 × 10^4) / 2^4 = 9354210000 / 16 = 584638125.'
      },
      {
        question: 'The largest 4 digit number exactly divisible by 88 is:',
        options: ['9944', '9768', '9988', '8888', 'None of these'],
        answer: '9944',
        explanation: 'Largest 4-digit number = 9999. 9999 ÷ 88 = 113 remainder 55. Required number = 9999 - 55 = 9944.'
      },
      {
        question: 'Which of the following is a prime number?',
        options: ['33', '81', '93', '97'],
        answer: '97',
        explanation: '33 = 3 × 11, 81 = 3^4, 93 = 3 × 31. 97 has no divisors other than 1 and itself. Clearly, 97 is a prime number.'
      },
      {
        question: 'What is the unit digit in {(6374)^1793 × (625)^317 × (341^491)}?',
        options: ['0', '2', '3', '5'],
        answer: '0',
        explanation: 'Unit digit of (6374)^1793 = unit digit of (4)^1793 = unit digit of [(4^2)^896 × 4] = unit digit of [6 × 4] = 4. Unit digit of (625)^317 = unit digit of (5)^317 = 5. Unit digit of (341)^491 = unit digit of (1)^491 = 1. Required unit digit = unit digit of (4 × 5 × 1) = 0.'
      },
      {
        question: '5358 × 51 = ?',
        options: ['273258', '273268', '273348', '273358'],
        answer: '273258',
        explanation: '5358 × 51 = 5358 × (50 + 1) = 5358 × 50 + 5358 × 1 = 267900 + 5358 = 273258.'
      },
      {
        question: 'The sum of first five prime numbers is:',
        options: ['11', '18', '26', '28'],
        answer: '28',
        explanation: 'First five prime numbers are 2, 3, 5, 7, 11. Note: 1 is not a prime number. Sum = 2 + 3 + 5 + 7 + 11 = 28.'
      },
      {
        question: 'The difference of two numbers is 1365. On dividing the larger number by the smaller, we get 6 as quotient and 15 as remainder. What is the smaller number?',
        options: ['240', '270', '295', '360'],
        answer: '270',
        explanation: 'Let the smaller number be x. Then larger = x + 1365. x + 1365 = 6x + 15 => 5x = 1350 => x = 270. Smaller number = 270.'
      },
      {
        question: '(12)^3 × 6^4 ÷ 432 = ?',
        options: ['5184', '5060', '5148', '5084', 'None of these'],
        answer: '5184',
        explanation: '(12)^3 × 6^4 ÷ 432 = (12)^3 × 6^4 / (12 × 6^2) = (12)^2 × 6^2 = 144 × 36 = 5184. Alternatively, (72)^2 = 5184.'
      },
      {
        question: '72519 × 9999 = ?',
        options: ['725117481', '674217481', '685126481', '696217481', 'None of these'],
        answer: '725117481',
        explanation: '72519 × 9999 = 72519 × (10000 - 1) = 72519 × 10000 - 72519 × 1 = 725190000 - 72519 = 725117481.'
      }
    ]
  },
  {
    name: 'Profit & Loss',
    pageNumber: 204,
    questions: [
      { question: 'Alfred buys an old scooter for Rs.4700 and spends Rs.800 on repairs. He sells it for Rs.5800. His gain percent is:', options: ['4 4/7%', '5 5/11%', '10%', '12%'], answer: '5 5/11%', explanation: 'CP = 4700+800 = 5500. Gain = 5800-5500 = 300. Gain% = (300/5500)x100 = 5 5/11%.' },
      { question: 'The cost price of 20 articles is the same as the selling price of x articles. If the profit is 25%, then x is:', options: ['15', '16', '18', '25'], answer: '16', explanation: 'Let CP of each = Re.1. CP of x = Rs.x. SP of x = Rs.20. Profit = (20-x)/x x 100 = 25 => x = 16.' },
      { question: 'If selling price is doubled, the profit triples. Find the profit percent.', options: ['66 2/3%', '100%', '105 1/3%', '120%'], answer: '100%', explanation: 'Let CP=x, SP=y. 3(y-x) = 2y-x => y=2x. Profit = x. Profit% = (x/x)x100 = 100%.' },
      { question: 'In a store, profit is 320% of cost. If cost increases by 25% but SP remains constant, what % of SP is the profit?', options: ['30%', '70%', '100%', '250%'], answer: '70%', explanation: 'Let CP=100. Profit=320, SP=420. New CP=125. Profit=420-125=295. % of SP = 295/420x100 = 70%.' },
      { question: 'A vendor bought toffees at 6 for a rupee. How many for a rupee must he sell to gain 20%?', options: ['3', '4', '5', '6'], answer: '5', explanation: 'CP of 6 = Re.1. SP of 6 = 120% of 1 = Rs.6/5. For Rs.6/5, toffees=6. For Re.1, toffees = 6x5/6 = 5.' },
      { question: 'The % profit earned by selling an article for Rs.1920 is equal to the % loss by selling it for Rs.1280. SP to make 25% profit?', options: ['Rs.2000', 'Rs.2200', 'Rs.2400', 'Data inadequate'], answer: 'Rs.2000', explanation: '(1920-x)/x = (x-1280)/x => 1920-x = x-1280 => 2x=3200 => x=1600. SP for 25% profit = 1600x1.25 = Rs.2000.' },
      { question: 'A shopkeeper expects 22.5% gain on CP. If sale was Rs.392, what was his profit?', options: ['Rs.18.20', 'Rs.70', 'Rs.72', 'Rs.88.25'], answer: 'Rs.72', explanation: 'CP = (100/122.5)x392 = Rs.320. Profit = 392-320 = Rs.72.' },
      { question: 'A man buys a cycle for Rs.1400 and sells at loss of 15%. Selling price?', options: ['Rs.1090', 'Rs.1160', 'Rs.1190', 'Rs.1202'], answer: 'Rs.1190', explanation: 'SP = 85% of 1400 = 0.85x1400 = Rs.1190.' },
      { question: 'Sam purchased 20 dozens of toys at Rs.375 per dozen. Sold each at Rs.33. Profit%?', options: ['3.5', '4.5', '5.6', '6.5'], answer: '5.6', explanation: 'CP/toy = 375/12 = Rs.31.25. Gain = 33-31.25 = 1.75. Gain% = (1.75/31.25)x100 = 5.6%.' },
      { question: 'Some articles bought at 6 for Rs.5 and sold at 5 for Rs.6. Gain percent?', options: ['30%', '33 1/3%', '35%', '44%'], answer: '44%', explanation: 'Buy 30 articles: CP = 5x5 = Rs.25. SP = 6x6 = Rs.36. Gain = 11/25x100 = 44%.' },
      { question: 'On selling 17 balls at Rs.720, loss equals CP of 5 balls. CP of a ball?', options: ['Rs.45', 'Rs.50', 'Rs.55', 'Rs.60'], answer: 'Rs.60', explanation: 'CP of 17 - 720 = CP of 5. CP of 12 = 720. CP of 1 = 720/12 = Rs.60.' },
      { question: 'A plot sold for Rs.18700, owner loses 15%. Price for 15% gain?', options: ['Rs.21000', 'Rs.22500', 'Rs.25300', 'Rs.25800'], answer: 'Rs.25300', explanation: 'CP = 18700/0.85 = Rs.22000. SP for 15% gain = 22000x1.15 = Rs.25300.' },
      { question: '100 oranges bought at Rs.350, sold at Rs.48 per dozen. Profit or loss%?', options: ['14 2/7% gain', '15% gain', '14 2/7% loss', '15% loss'], answer: '14 2/7% gain', explanation: 'CP/orange = 3.50. SP/orange = 48/12 = Rs.4. Gain = 0.50. Gain% = 0.50/3.50x100 = 14 2/7%.' },
      { question: 'A shopkeeper sells at profit of 25%. To find exact profit, which info needed? I. Sale price II. Number sold', options: ['Only I', 'Only II', 'Either I or II', 'Both I and II', 'None of these'], answer: 'Both I and II', explanation: 'Gain=25% of CP. To find amount of profit, need SP (to get CP) and number of articles sold.' },
      { question: 'A shopkeeper sells toys at Rs.250 each. To find profit%, which info? I. Number sold II. Cost price of each', options: ['Only I', 'Only II', 'Both I and II', 'Either I or II', 'None of these'], answer: 'Only II', explanation: 'SP = Rs.250. To find gain%, must know CP of each. Number sold is irrelevant for %.' },
      { question: 'A man mixes rice X(Rs.20/kg) and Y(Rs.13/kg), sells at Rs.17/kg. Find profit%. I. Rate of X=20. II. Rate of Y=13.', options: ['I alone sufficient', 'II alone sufficient', 'Either I or II alone', 'Both not sufficient', 'Both necessary'], answer: 'Both not sufficient', explanation: 'Without knowing the ratio of mixing, profit% cannot be determined. Both statements together are insufficient.' },
      { question: 'By selling product at 20% profit, how much earned? I. Difference between cost and selling price=Rs.40. II. SP is 120% of CP.', options: ['I alone sufficient', 'II alone sufficient', 'Either alone', 'Both not sufficient', 'Both necessary'], answer: 'I alone sufficient', explanation: 'Gain=20%. From I, profit = Rs.40. That directly answers the question. II just restates 20% profit.' },
      { question: 'By selling an article, what is profit% gained? I. 5% discount on list price. II. No discount gives 20% profit. III. CP is Rs.5000.', options: ['Only I and II', 'Only II and III', 'Only I and III', 'All I, II, III', 'None of these'], answer: 'Only I and II', explanation: 'From I: SP=0.95xList. From II: List=1.2xCP. So SP=0.95x1.2xCP=1.14xCP. Profit=14%. III not needed.' },
      { question: 'What % discount given? I. 23.5% profit by selling almirah for Rs.12350. II. No discount gives 30% profit. III. CP=Rs.10000.', options: ['Only I and II', 'Only II and III', 'Only I and III', 'Any two of three', 'None of these'], answer: 'None of these', explanation: 'From I: CP=12350/1.235=10000. MP=1.3x10000=13000. Discount=13000-12350=650. Discount%=650/13000x100=5%. I and II or I and III give the answer.' },
      { question: 'What is profit% earned by shopkeeper? I. Labeled price=130% of CP. II. CP=Rs.550. III. Discount=10% on labeled price.', options: ['Only I', 'Only II', 'I and III', 'All three', 'Cannot be answered'], answer: 'I and III', explanation: 'From I: MP=1.3xCP. From III: SP=0.9xMP=0.9x1.3xCP=1.17xCP. Profit=17%. II is not needed.' }
    ]
  },
  {
    name: 'Ratio & Proportion',
    pageNumber: 237,
    questions: [
      { question: 'A and B together have Rs.1210. If 4/15 of A equals 2/5 of B, how much does B have?', options: ['Rs.460', 'Rs.484', 'Rs.550', 'Rs.664'], answer: 'Rs.484', explanation: '(4/15)A = (2/5)B => A = (2/5)x(15/4)B = (3/2)B. A:B = 3:2. B = 1210x(2/5) = Rs.484.' },
      { question: 'Two numbers are respectively 20% and 50% more than a third number. Ratio of the two numbers is:', options: ['2:5', '3:5', '4:5', '6:7'], answer: '4:5', explanation: 'Let third = x. First = 1.2x, Second = 1.5x. Ratio = 1.2x:1.5x = 12:15 = 4:5.' },
      { question: 'A sum distributed among A, B, C, D in ratio 5:2:4:3. If C gets Rs.1000 more than D, B share is:', options: ['Rs.500', 'Rs.1500', 'Rs.2000', 'None of these'], answer: 'Rs.2000', explanation: 'C-D = 4x-3x = x = 1000. B = 2x = Rs.2000.' },
      { question: 'Seats for Maths, Physics, Bio in ratio 5:7:8. Increased by 40%, 50%, 75%. New ratio?', options: ['2:3:4', '6:7:8', '6:8:9', 'None of these'], answer: '2:3:4', explanation: 'New = 140%x5:150%x7:175%x8 = 7:10.5:14 = 14:21:28 = 2:3:4.' },
      { question: 'In mixture of 60 litres, milk:water = 2:1. To make ratio 1:2, water to add?', options: ['20 litres', '30 litres', '40 litres', '60 litres'], answer: '60 litres', explanation: 'Milk=40L, Water=20L. For 1:2 ratio: 40/(20+x) = 1/2 => 20+x=80 => x=60 litres.' },
      { question: 'Boys:Girls in college = 7:8. If boys increase 20% and girls 10%, new ratio?', options: ['8:9', '17:18', '21:22', 'Cannot be determined'], answer: '21:22', explanation: 'New boys = 120% of 7x = 42x/5. New girls = 110% of 8x = 44x/5. Ratio = 42:44 = 21:22.' },
      { question: 'Salaries of Ravi and Sumit in ratio 2:3. Each increased by Rs.4000, new ratio 40:57. Sumit salary?', options: ['Rs.17000', 'Rs.20000', 'Rs.25500', 'Rs.38000'], answer: 'Rs.38000', explanation: '(2x+4000)/(3x+4000) = 40/57. 57(2x+4000)=40(3x+4000) => 114x+228000=120x+160000 => 6x=68000 => x=11333. Sumit = 3x+4000 = 34000+4000 = Rs.38000.' },
      { question: 'If 0.75:x :: 5:8, then x equals:', options: ['1.12', '1.2', '1.25', '1.30'], answer: '1.2', explanation: '0.75/x = 5/8 => x = 0.75x8/5 = 6/5 = 1.2.' },
      { question: 'Sum of three numbers is 98. First:Second = 2:3 and Second:Third = 5:8. Second number?', options: ['20', '30', '48', '58'], answer: '30', explanation: 'A:B = 2:3. B:C = 5:8. A:B:C = 10:15:24. B = 98x15/49 = 30.' },
      { question: 'Rs.782 divided in parts proportional to 1/2:2/3:3/4. First part?', options: ['Rs.182', 'Rs.190', 'Rs.196', 'Rs.204'], answer: 'Rs.204', explanation: 'Ratio = 1/2:2/3:3/4 = 6:8:9. First part = 782x6/23 = Rs.204.' },
      { question: 'Salaries A:B:C = 2:3:5. Increments 15%, 10%, 20%. New ratio?', options: ['3:3:10', '10:11:20', '23:33:60', 'Cannot be determined'], answer: '23:33:60', explanation: 'New = 2.3k:3.3k:6k = 23:33:60.' },
      { question: 'If 40% of a number equals 2/3 of another, ratio of first to second?', options: ['2:5', '3:7', '5:3', '7:3'], answer: '5:3', explanation: '40A/100 = 2B/3 => 2A/5 = 2B/3 => A/B = 5/3. Ratio = 5:3.' },
      { question: 'The fourth proportional to 5, 8, 15 is:', options: ['18', '24', '19', '20'], answer: '24', explanation: '5:8 = 15:x => 5x = 120 => x = 24.' },
      { question: 'Two numbers in ratio 3:5. If 9 subtracted from each, new ratio 12:23. Smaller number?', options: ['27', '33', '49', '55'], answer: '33', explanation: '(3x-9)/(5x-9) = 12/23. 23(3x-9)=12(5x-9) => 69x-207=60x-108 => 9x=99 => x=11. Smaller = 3x11 = 33.' },
      { question: 'Coins of 25p, 10p, 5p in ratio 1:2:3. Total Rs.30. Number of 5p coins?', options: ['50', '100', '150', '200'], answer: '150', explanation: 'Let coins be x, 2x, 3x. Value = 25x/100 + 10(2x)/100 + 5(3x)/100 = 60x/100 = 30 => x=50. 5p coins = 3x50 = 150.' }
    ]
  },
  {
    name: 'Time & Work',
    pageNumber: 271,
    questions: []
  },
  {
    name: 'Simplification',
    pageNumber: 291,
    questions: []
  },
  {
    name: 'Speed, Time & Distance',
    pageNumber: 310,
    questions: []
  },
  {
    name: 'LCM HCF',
    pageNumber: 329,
    questions: []
  },
  {
    name: 'Mixture & Aligation',
    pageNumber: 395,
    questions: []
  },
  {
    name: 'Permutation & Combination',
    pageNumber: 406,
    questions: []
  },
  {
    name: 'Simple & Compound Interest',
    pageNumber: 426,
    questions: []
  },
  {
    name: 'Average',
    pageNumber: 460,
    questions: []
  },
  {
    name: 'Partnership',
    pageNumber: 502,
    questions: []
  },
  {
    name: 'Probability',
    pageNumber: 536,
    questions: []
  },
  {
    name: 'Age Problems',
    pageNumber: 551,
    questions: []
  },
  {
    name: 'Train Problems',
    pageNumber: 569,
    questions: []
  },
  {
    name: 'Chain Rule',
    pageNumber: 600,
    questions: []
  },
  {
    name: 'Square Root & Cube Root',
    pageNumber: 601,
    questions: []
  },
  {
    name: 'Stocks & Shares',
    pageNumber: 602,
    questions: []
  },
  {
    name: "Banker's Discount",
    pageNumber: 603,
    questions: [
      {
        question: "The banker's discount on a bill due 4 months hence at 15% per annum is Rs. 420. What is the true discount?",
        options: ['Rs. 400', 'Rs. 410', 'Rs. 415', 'Rs. 425'],
        answer: 'Rs. 400',
        explanation: "BD = Rs. 420, T = 4/12 = 1/3 year, R = 15%. TD = BD/(1 + RT) = 420/(1 + 15*1/3/100) = 420/(1.05) = Rs. 400."
      },
      {
        question: "The banker's gain on a certain sum due 2 years hence at 10% per annum is Rs. 24. What is the present worth?",
        options: ['Rs. 480', 'Rs. 500', 'Rs. 600', 'Rs. 720'],
        answer: 'Rs. 600',
        explanation: "BG = TD * TR/100. 24 = TD * (10*2)/100 = TD * 0.2 => TD = 120. PW = TD * 100/(R*T) = 120 * 100/20 = Rs. 600."
      },
      {
        question: "The banker's discount on Rs. 1600 at 15% per annum is the same as true discount on Rs. 1680 for the same time and at the same rate. Find the time.",
        options: ['3 months', '4 months', '6 months', '1 year'],
        answer: '4 months',
        explanation: "BD on 1600 = 1600*R*T/100. TD on 1680 = 1680*R*T/(100 + RT). Setting equal: 1600 = 1680*100/(100+RT) => 100+RT = 105 => RT = 5. With R=15, T = 5/15 = 1/3 year = 4 months."
      },
      {
        question: "The banker's discount and true discount on a sum of money due 8 months hence are Rs. 120 and Rs. 110 respectively. Find the sum.",
        options: ['Rs. 1220', 'Rs. 1320', 'Rs. 1420', 'Rs. 1500'],
        answer: 'Rs. 1320',
        explanation: "Sum = BD * TD / (BD - TD) = 120 * 110 / (120 - 110) = 13200/10 = Rs. 1320."
      }
    ]
  },
  {
    name: 'Calendar',
    pageNumber: 604,
    questions: []
  },
  {
    name: 'Area',
    pageNumber: 605,
    questions: []
  },
  {
    name: 'Decimal Fraction',
    pageNumber: 606,
    questions: []
  },
  {
    name: 'Surds & Indices',
    pageNumber: 607,
    questions: []
  },
  {
    name: 'Pipes & Cisterns',
    pageNumber: 608,
    questions: []
  },
  {
    name: 'Logarithm',
    pageNumber: 609,
    questions: []
  },
  {
    name: 'True Discount',
    pageNumber: 610,
    questions: []
  },
  {
    name: 'Odd Man Out & Series',
    pageNumber: 611,
    questions: []
  },
  {
    name: 'Height & Distance',
    pageNumber: 612,
    questions: []
  },
  {
    name: 'Clock',
    pageNumber: 613,
    questions: []
  },
  {
    name: 'Volume & Surface Area',
    pageNumber: 614,
    questions: []
  },
  {
    name: 'Problem on Numbers',
    pageNumber: 615,
    questions: []
  },
  {
    name: 'Boats & Streams',
    pageNumber: 616,
    questions: []
  },
  {
    name: 'Races & Games',
    pageNumber: 617,
    questions: []
  },
  {
    name: 'Chain Rule',
    pageNumber: 600,
    questions: []
  },
  {
    name: 'Square Root & Cube Root',
    pageNumber: 610,
    questions: []
  },
  {
    name: 'Stocks & Shares',
    pageNumber: 620,
    questions: []
  },
  {
    name: "Banker's Discount",
    pageNumber: 630,
    questions: [
      { question: "Banker's discount on bill due 4 months at 15% is Rs.420. True discount?", options: ['Rs.400', 'Rs.405', 'Rs.410', 'Rs.420'], answer: 'Rs.400', explanation: 'TD = 420x100/105 = Rs.400.' },
      { question: "BD if true discount is Rs.60 and banker's gain is Rs.6?", options: ['Rs.60', 'Rs.66', 'Rs.72', 'Rs.54'], answer: 'Rs.66', explanation: 'BD = TD + BG = 66.' },
      { question: "PW=Rs.1100, TD=Rs.110. Banker's discount?", options: ['Rs.121', 'Rs.110', 'Rs.100', 'Rs.130'], answer: 'Rs.121', explanation: 'BD = TD + TD^2/PW = 110+11 = 121.' }
    ]
  },
  {
    name: 'Calendar',
    pageNumber: 640,
    questions: []
  },
  {
    name: 'Area',
    pageNumber: 650,
    questions: []
  },
  {
    name: 'Decimal Fraction',
    pageNumber: 660,
    questions: []
  },
  {
    name: 'Surds & Indices',
    pageNumber: 670,
    questions: []
  },
  {
    name: 'Pipes & Cisterns',
    pageNumber: 680,
    questions: []
  },
  {
    name: 'Logarithm',
    pageNumber: 690,
    questions: []
  },
  {
    name: 'True Discount',
    pageNumber: 700,
    questions: []
  },
  {
    name: 'Odd Man Out & Series',
    pageNumber: 710,
    questions: []
  },
  {
    name: 'Height & Distance',
    pageNumber: 720,
    questions: []
  },
  {
    name: 'Clock',
    pageNumber: 730,
    questions: []
  },
  {
    name: 'Volume & Surface Area',
    pageNumber: 740,
    questions: []
  },
  {
    name: 'Problem on Numbers',
    pageNumber: 750,
    questions: []
  },
  {
    name: 'Boats & Streams',
    pageNumber: 760,
    questions: []
  },
  {
    name: 'Races & Games',
    pageNumber: 770,
    questions: []
  }
];

export const TCS_REASONING_TOPICS: Topic[] = [
  {
    name: 'Logical Deduction',
    pageNumber: 5,
    questions: []
  },
  {
    name: 'Identifying Word and Numeric Patterns (Letter & Number Series)',
    pageNumber: 24,
    questions: []
  },
  {
    name: 'Data Sufficiency',
    pageNumber: 42,
    questions: []
  },
  {
    name: 'Non-Verbal Reasoning',
    pageNumber: 58,
    questions: []
  },
  {
    name: 'Syllogism',
    pageNumber: 72,
    questions: []
  },
  {
    name: 'Blood Relation',
    pageNumber: 90,
    questions: []
  },
  {
    name: 'Data Arrangement',
    pageNumber: 108,
    questions: []
  },
  {
    name: 'Visual Reasoning (Analytical Reasoning)',
    pageNumber: 124,
    questions: []
  },
  {
    name: 'Spatial Reasoning',
    pageNumber: 140,
    questions: []
  },
  {
    name: 'Attention to Detail',
    pageNumber: 155,
    questions: []
  },
  {
    name: 'Venn Diagram',
    pageNumber: 172,
    questions: []
  },
  {
    name: 'Calendar',
    pageNumber: 190,
    questions: []
  },
  {
    name: 'Coding Decoding',
    pageNumber: 205,
    questions: []
  },
  {
    name: 'Direction Sense',
    pageNumber: 220,
    questions: []
  },
  {
    name: 'Seating Arrangement',
    pageNumber: 235,
    questions: []
  }
];

export default function AptitudePage() {
  const navigate = useNavigate();
  const [selectedSubModule, setSelectedSubModule] = useState<'tcs-numerical' | 'tcs-reasoning'>('tcs-numerical');

  const currentTopics = selectedSubModule === 'tcs-numerical' ? TCS_NUMERICAL_TOPICS : TCS_REASONING_TOPICS;

  const handleTopicClick = (topicName: string) => {
    const slug = topicSlug(topicName);
    navigate(`/student/aptitude/${selectedSubModule}/${slug}`);
  };

  return (
    <div className="page-wrapper">

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 to-amber-500 p-8 text-white shadow-lg">
        <div className="absolute right-0 top-0 opacity-15 pointer-events-none transform translate-x-12 -translate-y-12 scale-150">
          <Brain className="w-96 h-96 text-white" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-4">
          <h1 className="font-display font-black text-3xl sm:text-4xl tracking-tight leading-tight">
            Aptitude Preparation
          </h1>
          <p className="text-white/90 text-sm sm:text-base leading-relaxed">
            Master quantitative ability, logical reasoning, and verbal skills chapter-wise to ace top MNC placement assessments.
          </p>
        </div>
      </div>

      {/* Sub-module Selector */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setSelectedSubModule('tcs-numerical')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
            selectedSubModule === 'tcs-numerical'
              ? 'bg-primary-500 text-white shadow'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          TCS Numerical Ability
        </button>
        <button
          onClick={() => setSelectedSubModule('tcs-reasoning')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
            selectedSubModule === 'tcs-reasoning'
              ? 'bg-primary-500 text-white shadow'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          TCS Reasoning Ability
        </button>
        <button
          disabled
          className="px-4 py-2 text-sm font-semibold rounded-lg text-gray-400 dark:text-gray-600 cursor-not-allowed flex items-center gap-1.5 whitespace-nowrap"
        >
          <Lock className="w-3.5 h-3.5" /> Verbal Ability (Locked)
        </button>
      </div>

      {/* Chapter Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary-500" />
              {selectedSubModule === 'tcs-numerical' ? 'TCS Numerical Ability' : 'TCS Reasoning Ability'} Chapters
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Click a chapter to open the question set and start practising.
            </p>
          </div>
          <Badge variant="primary">{currentTopics.length} Chapters</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentTopics.map((topic, idx) => (
            <Card
              key={topic.name}
              padding="none"
              className="overflow-hidden border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-200 cursor-pointer group"
              onClick={() => handleTopicClick(topic.name)}
            >
              <div className="p-5 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center font-bold text-xs text-primary-600 dark:text-primary-400 flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white leading-snug">
                      {topic.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> {topic.questions.length} Questions
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-50 dark:bg-gray-800 group-hover:bg-primary-50 dark:group-hover:bg-primary-950/40 flex items-center justify-center transition-colors">
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary-500 transition-colors" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

