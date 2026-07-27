import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Lock, GraduationCap, ArrowRight, BookOpen } from 'lucide-react';
import Card from '../../components/common/Card/Card';
import Badge from '../../components/common/Badge/Badge';
import { topicSlug, Question, Topic } from './aptitudeData';

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
    questions: [
      { question: 'A can do a work in 15 days and B in 20 days. They work together for 4 days. Fraction of work left?', options: ['1/4', '1/10', '7/15', '8/15'], answer: '8/15', explanation: '(A+B) 1 day = 1/15+1/20 = 7/60. In 4 days = 28/60 = 7/15. Left = 1-7/15 = 8/15.' },
      { question: 'A lays railway track in 16 days, B in 12 days. With C, done in 4 days. C alone?', options: ['9 1/5 days', '9 2/5 days', '9 3/5 days', '10'], answer: '9 3/5 days', explanation: 'C = 1/4 - (1/16+1/12) = 1/4-7/48 = 5/48. C alone = 48/5 = 9 3/5 days.' },
      { question: 'A, B, C do work in 20, 30, 60 days. A assisted by B and C every third day. Total days?', options: ['12', '15', '16', '18'], answer: '15', explanation: 'A works 2 days alone + 1 day with B,C. In 3 days: 2/20 + 1/10 = 1/10+1/10 = 1/5. Total = 3x5 = 15 days.' },
      { question: 'A is thrice as good as B. A finishes 60 days less than B. Together they finish in:', options: ['20 days', '22 1/2 days', '25 days', '30 days'], answer: '22 1/2 days', explanation: 'Ratio of time = 1:3. Diff = 2 parts = 60 days => 1 part = 30. A=30, B=90. Together = 1/(1/30+1/90) = 90/4 = 22.5 days.' },
      { question: 'A does work in 6 days, B in 8 days. They do it for Rs.3200. With C, done in 3 days. C gets?', options: ['Rs.375', 'Rs.400', 'Rs.600', 'Rs.800'], answer: 'Rs.400', explanation: 'C rate = 1/3-(1/6+1/8) = 1/3-7/24 = 1/24. Wages ratio = 1/6:1/8:1/24 = 4:3:1. C share = 3200x(1/8) = Rs.400.' },
      { question: 'A+B together in 7 days. B alone in 20 days. A worked alone after they worked 5 days together. Work done by A? (I alone sufficient, II irrelevant)', options: ['I alone sufficient', 'II alone sufficient', 'Either alone', 'Both not sufficient', 'Both necessary'], answer: 'I alone sufficient', explanation: '(A+B) 5 days work = 5/7. Remaining = 2/7 done by A alone. Statement I gives this directly. II is irrelevant.' },
      { question: 'Machine Y alone produces x candles in how long? I. Machine X produces x in 5 min. II. X and Y together produce x in 2 min.', options: ['I alone sufficient', 'II alone sufficient', 'Either alone', 'Both not sufficient', 'Both necessary'], answer: 'Both necessary', explanation: 'From I: X rate = x/5. From II: X+Y rate = x/2. Y rate = x/2-x/5 = 3x/10. Y time = 10/3 min. Both needed.' },
      { question: '10 women finish work in how many days? I. 10 men do it in 6 days. II. 10 men+10 women in 3 3/7 days. III. 10 men 3 days then 10 women finish in 4 days.', options: ['Any two of three', 'I and II only', 'II and III only', 'I and III only', 'None of these'], answer: 'Any two of three', explanation: 'From I: 1 man = 1/60. Using any two statements, we can find 1 woman rate. Any two give the answer.' },
      { question: 'Workers needed for construction in 10 days? I. 20% done by 8 workers in 8 days. II. 20 workers in 16 days. III. 1/8 done by 8 workers in 5 days.', options: ['I only', 'II and III only', 'III only', 'I and III only', 'Any one of three'], answer: 'Any one of three', explanation: 'From I: 8x8/0.2 = 320 man-days. Workers = 320/10 = 32. Each statement independently gives 32 workers.' },
      { question: '8 men+14 women work 3 days, then 5 men+8 women leave. More days needed? I. 19M+12W in 18 days. II. 16M do 2/3 in 16 days. III. 3 men work = 4 women work per day.', options: ['I only', 'II only', 'III only', 'I or II or III', 'II or III only'], answer: 'I or II or III', explanation: 'Each statement alone lets us find the man-to-woman work ratio and solve. Any one is sufficient.' },
      { question: '6 men+8 boys do work in 10 days, 26 men+48 boys in 2 days. Time for 15 men+20 boys?', options: ['4 days', '5 days', '6 days', '7 days'], answer: '4 days', explanation: '6x+8y=1/10 and 26x+48y=1/2. Solving: x=1/100, y=1/200. 15 men+20 boys = 15/100+20/200 = 1/4. Time = 4 days.' },
      { question: 'A does work in 4 hrs, B+C in 3 hrs, A+C in 2 hrs. B alone?', options: ['8 hours', '10 hours', '12 hours', '24 hours'], answer: '12 hours', explanation: 'A=1/4. B+C=1/3. A+C=1/2. (A+B+C) = A+(B+C) = 1/4+1/3 = 7/12. B = 7/12-1/2 = 1/12. B alone = 12 hrs.' },
      { question: 'A does same time as B+C together. A+B in 10 days, C alone 50 days. B alone?', options: ['15 days', '20 days', '25 days', '30 days'], answer: '25 days', explanation: '(A+B)=1/10. C=1/50. A=(B+C) => A+B+C = 2A. (A+B)+C = 1/10+1/50 = 6/50 = 3/25. A=3/50. B=1/10-3/50=2/50=1/25. B=25 days.' },
      { question: 'A does 80% in 20 days. Calls B, they finish remaining in 3 days. B alone?', options: ['23 days', '37 days', '37 1/2 days', '40 days'], answer: '37 1/2 days', explanation: 'A does full work in 25 days. Remaining 1/5 by A+B in 3 days. (A+B) rate = 1/15. B=1/15-1/25=2/75. B alone = 75/2 = 37.5 days.' },
      { question: 'Machine P prints in 8 hrs, Q in 10 hrs, R in 12 hrs. All start at 9 AM. P stops at 11 AM. Work finishes at?', options: ['11:30 AM', '12 noon', '12:30 PM', '1:00 PM'], answer: '1:00 PM', explanation: 'P+Q+R rate = 1/8+1/10+1/12 = 37/120. In 2 hrs = 37/60. Remaining = 23/60. Q+R rate = 1/10+1/12 = 11/60. Time = 23/11 hrs ~ 2 hrs. Finish ~ 1 PM.' },
      { question: 'A finishes work in 18 days, B in 15 days. B worked 10 days and left. A finishes remaining in?', options: ['5', '5 1/2', '6', '8'], answer: '6', explanation: 'B 10 days = 10/15 = 2/3. Remaining = 1/3. A does 1/3 in 18x(1/3) = 6 days.' },
      { question: '4 men+6 women do work in 8 days, 3 men+7 women in 10 days. 10 women alone?', options: ['35', '40', '45', '50'], answer: '40', explanation: '4m+6w=1/8, 3m+7w=1/10. Solving: m=11/400, w=1/400. 10 women = 10/400 = 1/40. Time = 40 days.' },
      { question: 'A+B together finish work 30 days. They work 20 days, B leaves, A finishes in 20 more days. A alone?', options: ['40', '50', '54', '60'], answer: '60', explanation: '(A+B) 20 days = 20/30 = 2/3. Remaining 1/3 by A in 20 days. A full = 60 days.' },
      { question: 'P works 12 days (8 hrs/day), Q works 8 days (10 hrs/day). Together 8 hrs/day, days?', options: ['5 5/11', '5 6/11', '6 5/11', '6 6/11'], answer: '5 5/11', explanation: 'P total = 96 hrs, Q total = 80 hrs. P rate = 1/96, Q rate = 1/80. Together per hr = 11/480. At 8 hrs/day = 11/60 per day. Days = 60/11 = 5 5/11.' },
      { question: '10 women do work in 7 days, 10 children in 14 days. 5 women+10 children?', options: ['3', '5', '7', 'Cannot be determined', 'None of these'], answer: '7', explanation: '1 woman = 1/70. 1 child = 1/140. 5 women+10 children = 5/70+10/140 = 1/14+1/14 = 1/7. Time = 7 days.' }
    ]
  },
  {
    name: 'Simplification',
    pageNumber: 291,
    questions: [
      {
        question: 'A man has Rs.480 in the denominations of one-rupee notes, five-rupee notes and ten-rupee notes. The number of notes of each denomination is equal. What is the total number of notes that he has?',
        options: ['45', '60', '75', '90'],
        answer: '90',
        explanation: 'Let number of notes of each denomination be x. Then x + 5x + 10x = 480 => 16x = 480 => x = 30. Hence, total number of notes = 3x = 90.'
      },
      {
        question: 'There are two examination rooms A and B. If 10 students are sent from A to B, then the number of students in each room is the same. If 20 candidates are sent from B to A, then the number of students in A is double the number of students in B. The number of students in room A is:',
        options: ['20', '80', '100', '200'],
        answer: '100',
        explanation: 'Let the number of students in rooms A and B be x and y respectively. Then, x - 10 = y + 10 => x - y = 20 ... (i). And x + 20 = 2(y - 20) => x - 2y = -60 ... (ii). Solving (i) and (ii) we get: x = 100, y = 80. The required answer A = 100.'
      },
      {
        question: 'The price of 10 chairs is equal to that of 4 tables. The price of 15 chairs and 2 tables together is Rs. 4000. The total price of 12 chairs and 3 tables is:',
        options: ['Rs. 3500', 'Rs. 3750', 'Rs. 3840', 'Rs. 3900'],
        answer: 'Rs. 3900',
        explanation: 'Let the cost of a chair and that of a table be Rs. x and Rs. y respectively. Then, 10x = 4y or y = (5/2)x. So 15x + 2y = 4000 => 15x + 2×(5/2)x = 4000 => 20x = 4000 => x = 200. So y = (5/2) × 200 = 500. Hence, the cost of 12 chairs and 3 tables = 12x + 3y = Rs. (2400 + 1500) = Rs. 3900.'
      },
      {
        question: 'If a - b = 3 and a² + b² = 29, find the value of ab.',
        options: ['10', '12', '15', '18'],
        answer: '10',
        explanation: '2ab = (a² + b²) - (a - b)² = 29 - 9 = 20. Therefore ab = 10.'
      },
      {
        question: 'The price of 2 sarees and 4 shirts is Rs. 1600. With the same money one can buy 1 saree and 6 shirts. If one wants to buy 12 shirts, how much shall he have to pay?',
        options: ['Rs. 1200', 'Rs. 2400', 'Rs. 4800', 'Cannot be determined', 'None of these'],
        answer: 'Rs. 2400',
        explanation: 'Let the price of a saree and a shirt be Rs. x and Rs. y respectively. Then, 2x + 4y = 1600 ... (i) and x + 6y = 1600 ... (ii). Divide equation (i) by 2: x + 2y = 800 ... (iii). Subtract (iii) from (ii): 4y = 800 => y = 200. Solving: x = 400. Cost of 12 shirts = 12 × 200 = Rs. 2400.'
      },
      {
        question: 'A sum of Rs. 1360 has been divided among A, B and C such that A gets 2/3 of what B gets and B gets 1/4 of what C gets. B\'s share is:',
        options: ['Rs. 120', 'Rs. 160', 'Rs. 240', 'Rs. 300'],
        answer: 'Rs. 240',
        explanation: 'Let C\'s share = Rs. x. Then, B\'s share = Rs. x/4, A\'s share = Rs. (2/3 × x/4) = Rs. x/6. So x/6 + x/4 + x = 1360 => 17x/12 = 1360 => x = 1360 × 12/17 = Rs. 960. Hence, B\'s share = Rs. (960/4) = Rs. 240.'
      },
      {
        question: 'One-third of Rahul\'s savings in National Savings Certificate is equal to one-half of his savings in Public Provident Fund. If he has Rs. 1,50,000 as total savings, how much has he saved in Public Provident Fund?',
        options: ['Rs. 30,000', 'Rs. 50,000', 'Rs. 60,000', 'Rs. 90,000'],
        answer: 'Rs. 60,000',
        explanation: 'Let savings in N.S.C and P.P.F. be Rs. x and Rs. (150000 - x) respectively. Then, (1/3)x = (1/2)(150000 - x) => x/3 + x/2 = 75000 => 5x/6 = 75000 => x = 75000 × 6/5 = 90000. Savings in Public Provident Fund = Rs. (150000 - 90000) = Rs. 60000.'
      },
      {
        question: 'A fires 5 shots to B\'s 3 but A kills only once in 3 shots while B kills once in 2 shots. When B has missed 27 times, A has killed:',
        options: ['30 birds', '60 birds', '72 birds', '90 birds'],
        answer: '30 birds',
        explanation: 'Let the total number of shots be x. Then, Shots fired by A = (5/8)x. Shots fired by B = (3/8)x. Killing shots by A = (1/3) of (5/8)x = 5x/24. Shots missed by B = (1/2) of (3/8)x = 3x/16. So 3x/16 = 27 or x = (27 × 16)/3 = 144. Birds killed by A = 5x/24 = (5/24) × 144 = 30.'
      },
      {
        question: 'Eight people are planning to share equally the cost of a rental car. If one person withdraws from the arrangement and the others share equally the entire cost of the car, then the share of each of the remaining persons increased by:',
        options: ['1/7', '1/8', '1/9', '7/8'],
        answer: '1/7',
        explanation: 'Original share of 1 person = 1/8. New share of 1 person = 1/7. Increase = 1/7 - 1/8 = 1/56. Required fraction = (1/56)/(1/8) = (1/56) × (8/1) = 1/7.'
      },
      {
        question: 'To fill a tank, 25 buckets of water is required. How many buckets of water will be required to fill the same tank if the capacity of the bucket is reduced to two-fifth of its present?',
        options: ['10', '35', '62.5', 'Cannot be determined', 'None of these'],
        answer: '62.5',
        explanation: 'Let the capacity of 1 bucket = x. Then, the capacity of tank = 25x. New capacity of bucket = (2/5)x. Required number of buckets = 25x / (2x/5) = 25x × (5/2x) = 125/2 = 62.5.'
      },
      {
        question: 'In a regular week, there are 5 working days and for each day, the working hours are 8. A man gets Rs. 2.40 per hour for regular work and Rs. 3.20 per hours for overtime. If he earns Rs. 432 in 4 weeks, then how many hours does he work for?',
        options: ['160', '175', '180', '195'],
        answer: '175',
        explanation: 'Suppose the man works overtime for x hours. Now, working hours in 4 weeks = (5 × 8 × 4) = 160. So 160 × 2.40 + x × 3.20 = 432 => 384 + 3.20x = 432 => 3.20x = 48 => x = 15. Hence, total hours of work = (160 + 15) = 175.'
      },
      {
        question: 'Free notebooks were distributed equally among children of a class. The number of notebooks each child got was one-eighth of the number of children. Had the number of children been half, each child would have got 16 notebooks. Total how many notebooks were distributed?',
        options: ['256', '432', '512', '640', 'None of these'],
        answer: '512',
        explanation: 'Let total number of children be x. Then, x × (1/8)x = (x/2) × 16 => x²/8 = 8x => x = 64. Number of notebooks = (1/8)x² = (1/8) × 64 × 64 = 512.'
      },
      {
        question: 'A man has some hens and cows. If the number of heads be 48 and the number of feet equals 140, then the number of hens will be:',
        options: ['22', '23', '24', '26'],
        answer: '26',
        explanation: 'Let the number of hens be x and the number of cows be y. Then, x + y = 48 ... (i) and 2x + 4y = 140 => x + 2y = 70 ... (ii). Solving (i) and (ii) we get: x = 26, y = 22. The required answer = 26.'
      },
      {
        question: '(469 + 174)² - (469 - 174)² / (469 × 174) = ?',
        options: ['2', '4', '295', '643'],
        answer: '4',
        explanation: 'Given exp. = [(a + b)² - (a - b)²] / ab = 4ab / ab = 4 (where a = 469, b = 174).'
      },
      {
        question: 'David gets on the elevator at the 11th floor of a building and rides up at the rate of 57 floors per minute. At the same time, Albert gets on an elevator at the 51st floor of the same building and rides down at the rate of 63 floors per minute. If they continue travelling at these rates, then at which floor will their paths cross?',
        options: ['19', '28', '30', '37'],
        answer: '30',
        explanation: 'Suppose their paths cross after x minutes. Then, 11 + 57x = 51 - 63x => 120x = 40 => x = 1/3. Number of floors covered by David in (1/3) min = (1/3) × 57 = 19. So, their paths cross at (11 + 19) i.e., 30th floor.'
      }
    ]
  },
  {
    name: 'Speed, Time & Distance',
    pageNumber: 310,
    questions: [
      {
        question: 'A person crosses a 600 m long street in 5 minutes. What is his speed in km per hour?',
        options: ['3.6', '7.2', '8.4', '10'],
        answer: '7.2',
        explanation: 'Speed = 600 / (5 × 60) m/sec = 2 m/sec. Converting m/sec to km/hr: 2 × (18/5) = 7.2 km/hr.'
      },
      {
        question: 'An aeroplane covers a certain distance at a speed of 240 kmph in 5 hours. To cover the same distance in 1 2/3 hours, it must travel at a speed of:',
        options: ['300 kmph', '360 kmph', '600 kmph', '720 kmph'],
        answer: '720 kmph',
        explanation: 'Distance = 240 × 5 = 1200 km. Time = 5/3 hours. Required speed = 1200 / (5/3) = 1200 × (3/5) = 720 km/hr.'
      },
      {
        question: 'If a person walks at 14 km/hr instead of 10 km/hr, he would have walked 20 km more. The actual distance travelled by him is:',
        options: ['50 km', '56 km', '70 km', '80 km'],
        answer: '50 km',
        explanation: 'Let the actual distance travelled be x km. Then, x/10 = (x + 20)/14 => 14x = 10x + 200 => 4x = 200 => x = 50 km.'
      },
      {
        question: 'A train can travel 50% faster than a car. Both start from point A at the same time and reach point B 75 kms away from A at the same time. On the way, however, the train lost about 12.5 minutes while stopping at the stations. The speed of the car is:',
        options: ['100 kmph', '110 kmph', '120 kmph', '130 kmph'],
        answer: '120 kmph',
        explanation: 'Let speed of the car be x kmph. Then, speed of the train = (150/100)x = (3/2)x kmph. So 75/x - 75/((3/2)x) = 12.5/(10×60) => 75/x - 50/x = 5/24 => 25/x = 5/24 => x = (25×24)/5 = 120 kmph.'
      },
      {
        question: 'Excluding stoppages, the speed of a bus is 54 kmph and including stoppages, it is 45 kmph. For how many minutes does the bus stop per hour?',
        options: ['9', '10', '12', '20'],
        answer: '10',
        explanation: 'Due to stoppages, it covers 9 km less. Time taken to cover 9 km = (9/54) × 60 min = 10 min.'
      },
      {
        question: 'In a flight of 600 km, an aircraft was slowed down due to bad weather. Its average speed for the trip was reduced by 200 km/hr and the time of flight increased by 30 minutes. The duration of the flight is:',
        options: ['1 hour', '2 hours', '3 hours', '4 hours'],
        answer: '1 hour',
        explanation: 'Let the duration of the flight be x hours. Then, 600/x - 600/(x + 1/2) = 200 => 600/x - 1200/(2x+1) = 200 => x(2x+1) = 3 => 2x² + x - 3 = 0 => (2x+3)(x-1) = 0 => x = 1 hr (neglecting the negative value).'
      },
      {
        question: 'A man complete a journey in 10 hours. He travels first half of the journey at the rate of 21 km/hr and second half at the rate of 24 km/hr. Find the total journey in km.',
        options: ['220 km', '224 km', '230 km', '234 km'],
        answer: '224 km',
        explanation: '(1/2)x/21 + (1/2)x/24 = 10 => x/21 + x/24 = 20 => 15x = 168 × 20 => x = (168 × 20)/15 = 224 km.'
      },
      {
        question: 'The ratio between the speeds of two trains is 7:8. If the second train runs 400 km in 4 hours, then the speed of the first train is:',
        options: ['70 km/hr', '75 km/hr', '84 km/hr', '87.5 km/hr'],
        answer: '87.5 km/hr',
        explanation: 'Let the speed of two trains be 7x and 8x km/hr. Then, 8x = 400/4 = 100 => x = 100/8 = 12.5. Speed of first train = 7 × 12.5 = 87.5 km/hr.'
      },
      {
        question: 'A man on tour travels first 160 km at 64 km/hr and the next 160 km at 80 km/hr. The average speed for the first 320 km of the tour is:',
        options: ['35.55 km/hr', '36 km/hr', '71.11 km/hr', '71 km/hr'],
        answer: '71.11 km/hr',
        explanation: 'Total time taken = (160/64 + 160/80) hrs = (2.5 + 2) hrs = 9/2 hrs. Average speed = 320 × (2/9) km/hr = 71.11 km/hr.'
      },
      {
        question: 'A car travelling with 5/7 of its actual speed covers 42 km in 1 hr 40 min 48 sec. Find the actual speed of the car.',
        options: ['17 6/7 km/hr', '25 km/hr', '30 km/hr', '35 km/hr'],
        answer: '35 km/hr',
        explanation: 'Time taken = 1 hr 40 min 48 sec = 126/75 hrs. Let the actual speed be x km/hr. Then, (5/7)x × (126/75) = 42 => x = (42 × 7 × 75) / (5 × 126) = 35 km/hr.'
      },
      {
        question: 'In covering a distance of 30 km, Abhay takes 2 hours more than Sameer. If Abhay doubles his speed, then he would take 1 hour less than Sameer. Abhay\'s speed is:',
        options: ['5 kmph', '6 kmph', '6.25 kmph', '7.5 kmph'],
        answer: '5 kmph',
        explanation: 'Let Abhay\'s speed be x km/hr. Then, 30/x - 30/2x = 3 => 30/x - 15/x = 3 => 15/x = 3... Wait, let Sameer\'s time = t. Then Abhay\'s time = t+2. At double speed, Abhay\'s time = (t+2)/2 = t-1 => t+2 = 2t-2 => t=4. Abhay\'s time = 6 hrs. Speed = 30/6 = 5 kmph.'
      },
      {
        question: 'Robert is travelling on his cycle and has calculated to reach point A at 2 P.M. if he travels at 10 kmph, he will reach there at 12 noon if he travels at 15 kmph. At what speed must he travel to reach A at 1 P.M.?',
        options: ['8 kmph', '11 kmph', '12 kmph', '14 kmph'],
        answer: '12 kmph',
        explanation: 'Let the distance travelled by x km. Then, x/10 - x/15 = 2 => 3x - 2x = 60 => x = 60 km. Time taken to travel 60 km at 10 km/hr = 60/10 = 6 hrs. So, Robert started 6 hours before 2 P.M. i.e., at 8 A.M. Required speed = 60/5 = 12 kmph.'
      },
      {
        question: 'It takes eight hours for a 600 km journey, if 120 km is done by train and the rest by car. It takes 20 minutes more, if 200 km is done by train and the rest by car. The ratio of the speed of the train to that of the car is:',
        options: ['2:3', '3:2', '3:4', '4:3'],
        answer: '3:4',
        explanation: 'Let the speed of the train be x km/hr and that of the car be y km/hr. Then, 120/x + 480/y = 8 => 1/x + 4/y = 1/15 ...(i). And, 200/x + 400/y = 25/3 => 1/x + 2/y = 1/24 ...(ii). Solving (i) and (ii), we get: x = 60 and y = 80. Ratio of speeds = 60:80 = 3:4.'
      },
      {
        question: 'A farmer travelled a distance of 61 km in 9 hours. He travelled partly on foot @ 4 km/hr and partly on bicycle @ 9 km/hr. The distance travelled on foot is:',
        options: ['14 km', '15 km', '16 km', '17 km'],
        answer: '16 km',
        explanation: 'Let the distance travelled on foot be x km. Then, distance travelled on bicycle = (61 - x) km. So, x/4 + (61-x)/9 = 9 => 9x + 4(61-x) = 9×36 => 9x + 244 - 4x = 324 => 5x = 80 => x = 16 km.'
      },
      {
        question: 'A man covered a certain distance at some speed. Had he moved 3 kmph faster, he would have taken 40 minutes less. If he had moved 2 kmph slower, he would have taken 40 minutes more. The distance (in km) is:',
        options: ['35', '36 2/3', '37 1/2', '40'],
        answer: '40',
        explanation: 'Let distance = x km and usual rate = y kmph. Then, x/y - x/(y+3) = 40/60 => 2y(y+3) = 9x ...(i). And, x/(y-2) - x/y = 40/60 => y(y-2) = 3x ...(ii). On dividing (i) by (ii), we get: x = 40.'
      },
      {
        question: 'Two towns are connected by railway. Can you find the distance between them? I. The speed of the mail train is 12 km/hr more than that of an express train. II. A mail train takes 40 minutes less than an express train to cover the distance.',
        options: ['I alone sufficient while II alone not sufficient to answer', 'II alone sufficient while I alone not sufficient to answer', 'Either I or II alone sufficient to answer', 'Both I and II are not sufficient to answer', 'Both I and II are necessary to answer'],
        answer: 'Both I and II are not sufficient to answer',
        explanation: 'Let the distance between the two stations be x km. I. Then, speed of the mail train = (y + 12) km/hr. II. x/y - x/(y+12) = 40/60. Thus, even I and II together do not give x. Correct answer is (D).'
      },
      {
        question: 'The towns A, B and C are on a straight line. Town C is between A and B. The distance from A to B is 100 km. How far is A from C? I. The distance from A to B is 25% more than the distance from C to B. II. The distance from A to C is 1/4 of the distance C to B.',
        options: ['I alone sufficient while II alone not sufficient to answer', 'II alone sufficient while I alone not sufficient to answer', 'Either I or II alone sufficient to answer', 'Both I and II are not sufficient to answer', 'Both I and II are necessary to answer'],
        answer: 'Either I or II alone sufficient to answer',
        explanation: 'Let AC = x km. Then, CB = (100 - x) km. I. AB = 125% of CB => 100 = (125/100) × (100-x) => 100-x = 80 => x = 20 km. II. AC = (1/4)CB => x = (1/4)(100-x) => 5x = 100 => x = 20 km. Either I or II alone gives the answer.'
      },
      {
        question: 'Two cars pass each other in opposite direction. How long would they take to be 500 km apart? I. The sum of their speeds is 135 km/hr. II. The difference of their speed is 25 km/hr.',
        options: ['I alone sufficient while II alone not sufficient to answer', 'II alone sufficient while I alone not sufficient to answer', 'Either I or II alone sufficient to answer', 'Both I and II are not sufficient to answer', 'Both I and II are necessary to answer'],
        answer: 'I alone sufficient while II alone not sufficient to answer',
        explanation: 'I gives, relative speed = 135 km/hr. Time taken = 500/135 hrs. II does not give the relative speed. I alone gives the answer and II is irrelevant. Correct answer is (A).'
      },
      {
        question: 'How much time did X take to reach the destination? I. The ratio between the speed of X and Y is 3:4. II. Y takes 36 minutes to reach the same destination.',
        options: ['I alone sufficient while II alone not sufficient to answer', 'II alone sufficient while I alone not sufficient to answer', 'Either I or II alone sufficient to answer', 'Both I and II are not sufficient to answer', 'Both I and II are necessary to answer'],
        answer: 'Both I and II are necessary to answer',
        explanation: 'Since ratio of speed of X:Y is 3:4, then ratio of time will be 4:3. I. If Y takes 3 min, then X takes 4 min. II. If Y takes 36 min, then X takes (4/3) × 36 min = 48 min. Thus, I and II together give the answer. Correct answer is (E).'
      }
    ]
  },
  {
    name: 'LCM HCF',
    pageNumber: 329,
    questions: [
      {
        question: 'Find the greatest number that will divide 43, 91 and 183 so as to leave the same remainder in each case.',
        options: ['4', '7', '9', '13'],
        answer: '4',
        explanation: 'Required number = H.C.F. of (91 - 43), (183 - 91) and (183 - 43) = H.C.F. of 48, 92 and 140 = 4.'
      },
      {
        question: 'The H.C.F. of two numbers is 23 and the other two factors of their L.C.M. are 13 and 14. The larger of the two numbers is:',
        options: ['276', '299', '322', '345'],
        answer: '322',
        explanation: 'Clearly, the numbers are (23 × 13) and (23 × 14). Larger number = (23 × 14) = 322.'
      },
      {
        question: 'Six bells commence tolling together and toll at intervals of 2, 4, 6, 8, 10 and 12 seconds respectively. In 30 minutes, how many times do they toll together?',
        options: ['4', '10', '15', '16'],
        answer: '16',
        explanation: 'L.C.M. of 2, 4, 6, 8, 10, 12 is 120. So, the bells will toll together after every 120 seconds (2 minutes). In 30 minutes, they will toll together 30/2 + 1 = 16 times.'
      },
      {
        question: 'Let N be the greatest number that will divide 1305, 4665 and 6905, leaving the same remainder in each case. Then sum of the digits in N is:',
        options: ['4', '5', '6', '8'],
        answer: '4',
        explanation: 'N = H.C.F. of (4665 - 1305), (6905 - 4665) and (6905 - 1305) = H.C.F. of 3360, 2240 and 5600 = 1120. Sum of digits in N = (1 + 1 + 2 + 0) = 4.'
      },
      {
        question: 'The greatest number of four digits which is divisible by 15, 25, 40 and 75 is:',
        options: ['9000', '9400', '9600', '9800'],
        answer: '9600',
        explanation: 'Greatest number of 4-digits is 9999. L.C.M. of 15, 25, 40 and 75 is 600. On dividing 9999 by 600, the remainder is 399. Required number = (9999 - 399) = 9600.'
      },
      {
        question: 'The product of two numbers is 4107. If the H.C.F. of these numbers is 37, then the greater number is:',
        options: ['101', '107', '111', '185'],
        answer: '111',
        explanation: 'Let the numbers be 37a and 37b. Then, 37a × 37b = 4107 => ab = 3. Now, co-primes with product 3 are (1, 3). So, the required numbers are (37 × 1, 37 × 3) i.e., (37, 111). Greater number = 111.'
      },
      {
        question: 'Three numbers are in the ratio of 3:4:5 and their L.C.M. is 2400. Their H.C.F. is:',
        options: ['40', '80', '120', '200'],
        answer: '40',
        explanation: 'Let the numbers be 3x, 4x and 5x. Then, their L.C.M. = 60x. So, 60x = 2400 or x = 40. The numbers are (3 × 40), (4 × 40) and (5 × 40). Hence, required H.C.F. = 40.'
      },
      {
        question: 'The G.C.D. of 1.08, 0.36 and 0.9 is:',
        options: ['0.03', '0.9', '0.18', '0.108'],
        answer: '0.18',
        explanation: 'Given numbers are 1.08, 0.36 and 0.90. H.C.F. of 108, 36 and 90 is 18. H.C.F. of given numbers = 0.18.'
      },
      {
        question: 'The product of two numbers is 2028 and their H.C.F. is 13. The number of such pairs is:',
        options: ['1', '2', '3', '4'],
        answer: '2',
        explanation: 'Let the numbers be 13a and 13b. Then, 13a × 13b = 2028 => ab = 12. Now, the co-primes with product 12 are (1, 12) and (3, 4). So, the required numbers are (13 × 1, 13 × 12) and (13 × 3, 13 × 4). Clearly, there are 2 such pairs.'
      },
      {
        question: 'The least multiple of 7, which leaves a remainder of 4, when divided by 6, 9, 15 and 18 is:',
        options: ['74', '94', '184', '364'],
        answer: '364',
        explanation: 'L.C.M. of 6, 9, 15 and 18 is 90. Let required number be 90k + 4, which is multiple of 7. Least value of k for which (90k + 4) is divisible by 7 is k = 4. Required number = (90 × 4) + 4 = 364.'
      },
      {
        question: 'Find the lowest common multiple of 24, 36 and 40.',
        options: ['120', '240', '360', '480'],
        answer: '360',
        explanation: 'L.C.M. = 2 × 2 × 2 × 3 × 3 × 5 = 360.'
      },
      {
        question: 'The least number which should be added to 2497 so that the sum is exactly divisible by 5, 6, 4 and 3 is:',
        options: ['3', '13', '23', '33'],
        answer: '23',
        explanation: 'L.C.M. of 5, 6, 4 and 3 = 60. On dividing 2497 by 60, the remainder is 37. Number to be added = (60 - 37) = 23.'
      },
      {
        question: 'Reduce 128352/238368 to its lowest terms.',
        options: ['3/4', '5/13', '7/13', '9/13'],
        answer: '7/13',
        explanation: 'Using successive division, H.C.F. of 128352 and 238368 = 18336. Therefore 128352/238368 = (128352 ÷ 18336)/(238368 ÷ 18336) = 7/13.'
      },
      {
        question: 'The least number which when divided by 5, 6, 7 and 8 leaves a remainder 3, but when divided by 9 leaves no remainder, is:',
        options: ['1677', '1683', '2523', '3363'],
        answer: '1683',
        explanation: 'L.C.M. of 5, 6, 7, 8 = 840. Required number is of the form 840k + 3. Least value of k for which (840k + 3) is divisible by 9 is k = 2. Required number = (840 × 2 + 3) = 1683.'
      },
      {
        question: 'A, B and C start at the same time in the same direction to run around a circular stadium. A completes a round in 252 seconds, B in 308 seconds and C in 198 seconds, all starting at the same point. After what time will they again at the starting point?',
        options: ['26 minutes and 18 seconds', '42 minutes and 36 seconds', '45 minutes', '46 minutes and 12 seconds'],
        answer: '46 minutes and 12 seconds',
        explanation: 'L.C.M. of 252, 308 and 198 = 2772. So, A, B and C will again meet at the starting point in 2772 sec. i.e., 46 min. 12 sec.'
      },
      {
        question: 'The H.C.F. of two numbers is 11 and their L.C.M. is 7700. If one of the numbers is 275, then the other is:',
        options: ['279', '283', '308', '318'],
        answer: '308',
        explanation: 'Other number = (11 × 7700) / 275 = 308.'
      },
      {
        question: 'What will be the least number which when doubled will be exactly divisible by 12, 18, 21 and 30?',
        options: ['196', '630', '1260', '2520'],
        answer: '630',
        explanation: 'L.C.M. of 12, 18, 21, 30 = 2 × 3 × 2 × 3 × 7 × 5 = 1260. Required number = 1260 ÷ 2 = 630.'
      },
      {
        question: 'The ratio of two numbers is 3:4 and their H.C.F. is 4. Their L.C.M. is:',
        options: ['12', '16', '24', '48'],
        answer: '48',
        explanation: 'Let the numbers be 3x and 4x. Then, their H.C.F. = x. So, x = 4. So, the numbers are 12 and 16. L.C.M. of 12 and 16 = 48.'
      },
      {
        question: 'The smallest number which when diminished by 7, is divisible by 12, 16, 18, 21 and 28 is:',
        options: ['1008', '1015', '1022', '1032'],
        answer: '1015',
        explanation: 'Required number = (L.C.M. of 12, 16, 18, 21, 28) + 7 = 1008 + 7 = 1015.'
      },
      {
        question: '252 can be expressed as a product of primes as:',
        options: ['2 × 2 × 3 × 3 × 7', '2 × 2 × 2 × 3 × 7', '3 × 3 × 3 × 3 × 7', '2 × 3 × 3 × 3 × 7'],
        answer: '2 × 2 × 3 × 3 × 7',
        explanation: 'Clearly, 252 = 2 × 2 × 3 × 3 × 7.'
      }
    ]
  },
  {
    name: 'Mixture & Aligation',
    pageNumber: 395,
    questions: [
      {
        question: 'A vessel is filled with liquid, 3 parts of which are water and 5 parts syrup. How much of the mixture must be drawn off and replaced with water so that the mixture may be half water and half syrup?',
        options: ['1/3', '1/4', '1/5', '1/7'],
        answer: '1/5',
        explanation: 'Suppose the vessel initially contains 8 litres of liquid. Let x litres of this liquid be replaced with water. Quantity of water in new mixture = (3 - 3x/8 + x) litres. Quantity of syrup in new mixture = (5 - 5x/8) litres. So (3 - 3x/8 + x) = (5 - 5x/8) => 5x + 24 = 40 - 5x => 10x = 16 => x = 8/5. So, part of the mixture replaced = (8/5) × (1/8) = 1/5.'
      },
      {
        question: 'Tea worth Rs. 126 per kg and Rs. 135 per kg are mixed with a third variety in the ratio 1:1:2. If the mixture is worth Rs. 153 per kg, the price of the third variety per kg will be:',
        options: ['Rs. 169.50', 'Rs. 170', 'Rs. 175.50', 'Rs. 180'],
        answer: 'Rs. 175.50',
        explanation: 'Since first and second varieties are mixed in equal proportions, their average price = Rs. (126 + 135)/2 = Rs. 130.50. So, the mixture is formed by mixing two varieties, one at Rs. 130.50 per kg and the other at say Rs. x per kg in the ratio 2:2 i.e., 1:1. By the rule of alligation: (x - 153)/22.50 = 1 => x - 153 = 22.50 => x = 175.50.'
      },
      {
        question: 'A can contains a mixture of two liquids A and B in the ratio 7:5. When 9 litres of mixture are drawn off and the can is filled with B, the ratio of A and B becomes 7:9. How many litres of liquid A was contained by the can initially?',
        options: ['10', '20', '21', '25'],
        answer: '21',
        explanation: 'Suppose the can initially contains 7x and 5x of mixtures A and B respectively. Quantity of A in mixture left = (7x - 7/12 × 9) = (7x - 21/4) litres. Quantity of B in mixture left = (5x - 5/12 × 9) = (5x - 15/4) litres. So (7x - 21/4) / (5x - 15/4 + 9) = 7/9 => (28x - 21)/(20x + 21) = 7/9 => 252x - 189 = 140x + 147 => 112x = 336 => x = 3. So, the can contained 21 litres of A.'
      },
      {
        question: 'A milk vendor has 2 cans of milk. The first contains 25% water and the rest milk. The second contains 50% water. How much milk should he mix from each of the containers so as to get 12 litres of milk such that the ratio of water to milk is 3:5?',
        options: ['4 litres, 8 litres', '6 litres, 6 litres', '5 litres, 7 litres', '7 litres, 5 litres'],
        answer: '6 litres, 6 litres',
        explanation: 'Let the cost of 1 litre milk be Re. 1. Milk in 1 litre mix. in 1st can = 3/4 litre, C.P. of 1 litre mix. in 1st can = Re. 3/4. Milk in 1 litre mix. in 2nd can = 1/2 litre, C.P. of 1 litre mix. in 2nd can = Re. 1/2. Milk in 1 litre final mix. = 5/8 litre, Mean price = Re. 5/8. By the rule of alligation: Ratio of two mixtures = 1/8 : 1/8 = 1:1. So, quantity of mixture taken from each can = (1/2) × 12 = 6 litres.'
      },
      {
        question: 'In what ratio must a grocer mix two varieties of pulses costing Rs. 15 and Rs. 20 per kg respectively so as to get a mixture worth Rs. 16.50 kg?',
        options: ['3:7', '5:7', '7:3', '7:5'],
        answer: '7:3',
        explanation: 'By the rule of alligation: Cost of 1 kg pulses of 1st kind = Rs. 15, Cost of 1 kg pulses of 2nd kind = Rs. 20, Mean Price = Rs. 16.50. Required rate = 3.50 : 1.50 = 7:3.'
      },
      {
        question: 'A dishonest milkman professes to sell his milk at cost price but he mixes it with water and thereby gains 25%. The percentage of water in the mixture is:',
        options: ['4%', '6 1/4%', '20%', '25%'],
        answer: '20%',
        explanation: 'Let C.P. of 1 litre milk be Re. 1. Then, S.P. of 1 litre of mixture = Re. 1, Gain = 25%. C.P. of 1 litre mixture = Re. (100/125) × 1 = 4/5. By the rule of alligation: C.P. of 1 litre water = 0, C.P. of 1 litre milk = Re. 1, Mean Price = Re. 4/5. Ratio of milk to water = (4/5) : (1/5) = 4:1. Hence, percentage of water in the mixture = (1/5) × 100 = 20%.'
      },
      {
        question: 'How many kilogram of sugar costing Rs. 9 per kg must be mixed with 27 kg of sugar costing Rs. 7 per kg so that there may be a gain of 10% by selling the mixture at Rs. 9.24 per kg?',
        options: ['36 kg', '42 kg', '54 kg', '63 kg'],
        answer: '63 kg',
        explanation: 'S.P. of 1 kg of mixture = Rs. 9.24, Gain 10%. C.P. of 1 kg of mixture = Rs. (100/110) × 9.24 = Rs. 8.40. By the rule of alligation: Cost of 1st kind = Rs. 9, Cost of 2nd kind = Rs. 7, Mean Price = Rs. 8.40. Ratio of quantities of 1st and 2nd kind = 1.40 : 0.60 = 14:6 = 7:3. Let x kg of sugar of 1st be mixed with 27 kg of 2nd kind. Then, 7:3 = x:27 => x = (7 × 27)/3 = 63 kg.'
      },
      {
        question: 'A container contains 40 litres of milk. From this container 4 litres of milk was taken out and replaced by water. This process was repeated further two times. How much milk is now contained by the container?',
        options: ['26.34 litres', '27.36 litres', '28 litres', '29.16 litres'],
        answer: '29.16 litres',
        explanation: 'Amount of milk left after 3 operations = 40(1 - 4/40)³ litres = 40 × (9/10) × (9/10) × (9/10) = 29.16 litres.'
      },
      {
        question: 'A jar full of whisky contains 40% alcohol. A part of this whisky is replaced by another containing 19% alcohol and now the percentage of alcohol was found to be 26%. The quantity of whisky replaced is:',
        options: ['1/3', '2/3', '2/5', '3/5'],
        answer: '2/3',
        explanation: 'By the rule of alligation: Strength of first jar = 40%, Strength of 2nd jar = 19%, Mean Strength = 26%. So, ratio of 1st and 2nd quantities = 7:14 = 1:2. Required quantity replaced = 2/3.'
      },
      {
        question: 'In what ratio must water be mixed with milk to gain 16 2/3% on selling the mixture at cost price?',
        options: ['1:6', '6:1', '2:3', '4:3'],
        answer: '1:6',
        explanation: 'Let C.P. of 1 litre milk be Re. 1. S.P. of 1 litre of mixture = Re. 1, Gain = 50/3%. C.P. of 1 litre of mixture = (100 × 3/350) × 1 = 6/7. By the rule of alligation: C.P. of 1 litre water = 0, C.P. of 1 litre milk = Re. 1, Mean Price = Re. 6/7. Ratio of water and milk = (1/7) : (6/7) = 1:6.'
      },
      {
        question: 'Find the ratio in which rice at Rs. 7.20 a kg be mixed with rice at Rs. 5.70 a kg to produce a mixture worth Rs. 6.30 a kg.',
        options: ['1:3', '2:3', '3:4', '4:5'],
        answer: '2:3',
        explanation: 'By the rule of alligation: Cost of 1 kg of 1st kind = 720 p, Cost of 1 kg of 2nd kind = 570 p, Mean Price = 630 p. Required ratio = 60:90 = 2:3.'
      },
      {
        question: 'In what ratio must a grocer mix two varieties of tea worth Rs. 60 a kg and Rs. 65 a kg so that by selling the mixture at Rs. 68.20 a kg he may gain 10%?',
        options: ['3:2', '3:4', '3:5', '4:5'],
        answer: '3:2',
        explanation: 'S.P. of 1 kg of the mixture = Rs. 68.20, Gain = 10%. C.P. of 1 kg of the mixture = Rs. (100/110) × 68.20 = Rs. 62. By the rule of alligation: Cost of 1 kg tea of 1st kind = Rs. 60, Cost of 1 kg tea of 2nd kind = Rs. 65, Mean Price = Rs. 62. Required ratio = 3:2.'
      },
      {
        question: 'The cost of Type 1 rice is Rs. 15 per kg and Type 2 rice is Rs. 20 per kg. If both Type 1 and Type 2 are mixed in the ratio of 2:3, then the price per kg of the mixed variety of rice is:',
        options: ['Rs. 18', 'Rs. 18.50', 'Rs. 19', 'Rs. 19.50'],
        answer: 'Rs. 18',
        explanation: 'Let the price of the mixed variety be Rs. x per kg. By rule of alligation: Cost of 1 kg of Type 1 rice = Rs. 15, Cost of 1 kg of Type 2 rice = Rs. 20, Mean Price = Rs. x. (20 - x)/(x - 15) = 2/3 => 60 - 3x = 2x - 30 => 5x = 90 => x = 18.'
      },
      {
        question: '8 litres are drawn from a cask full of wine and is then filled with water. This operation is performed three more times. The ratio of the quantity of wine now left in cask to that of water is 16:65. How much wine did the cask hold originally?',
        options: ['18 litres', '24 litres', '32 litres', '42 litres'],
        answer: '24 litres',
        explanation: 'Let the quantity of the wine in the cask originally be x litres. Then, quantity of wine left in cask after 4 operations = x(1 - 8/x)⁴ litres. So x(1 - 8/x)⁴/x = 16/81 => (1 - 8/x)⁴ = (2/3)⁴ => (x - 8)/x = 2/3 => 3x - 24 = 2x => x = 24.'
      },
      {
        question: 'A merchant has 1000 kg of sugar, part of which he sells at 8% profit and the rest at 18% profit. He gains 14% on the whole. The quantity sold at 18% profit is:',
        options: ['400 kg', '560 kg', '600 kg', '640 kg'],
        answer: '600 kg',
        explanation: 'By the rule of alligation: Profit on 1st part = 8%, Profit on 2nd part = 18%, Mean Profit = 14%. Ratio of 1st and 2nd parts = 4:6 = 2:3. Quantity of 2nd kind = (3/5) × 1000 kg = 600 kg.'
      }
    ]
  },
  {
    name: 'Permutation & Combination',
    pageNumber: 406,
    questions: [
      {
        question: 'From a group of 7 men and 6 women, five persons are to be selected to form a committee so that at least 3 men are there on the committee. In how many ways can it be done?',
        options: ['564', '645', '735', '756', 'None of these'],
        answer: '756',
        explanation: 'We may have (3 men and 2 women) or (4 men and 1 woman) or (5 men only). Required number of ways = (⁷C₃ × ⁶C₂) + (⁷C₄ × ⁶C₁) + (⁷C₅) = (35 × 15) + (35 × 6) + 21 = 525 + 210 + 21 = 756.'
      },
      {
        question: 'In how many different ways can the letters of the word \'LEADING\' be arranged in such a way that the vowels always come together?',
        options: ['360', '480', '720', '5040', 'None of these'],
        answer: '720',
        explanation: 'The word \'LEADING\' has 7 different letters. When the vowels EAI are always together, they can be supposed to form one letter. Then, we have to arrange the letters LNDG (EAI). Now, 5 (4+1=5) letters can be arranged in 5! = 120 ways. The vowels (EAI) can be arranged among themselves in 3! = 6 ways. Required number of ways = (120 × 6) = 720.'
      },
      {
        question: 'In how many different ways can the letters of the word \'CORPORATION\' be arranged so that the vowels always come together?',
        options: ['810', '1440', '2880', '50400', '5760'],
        answer: '50400',
        explanation: 'In the word \'CORPORATION\', we treat the vowels OOAIO as one letter. Thus, we have CRPRTN (OOAIO). This has 7 (6+1) letters of which R occurs 2 times and the rest are different. Number of ways arranging these letters = 7!/2! = 2520. Now, 5 vowels in which O occurs 3 times and the rest are different, can be arranged in 5!/3! = 20 ways. Required number of ways = (2520 × 20) = 50400.'
      },
      {
        question: 'Out of 7 consonants and 4 vowels, how many words of 3 consonants and 2 vowels can be formed?',
        options: ['210', '1050', '25200', '21400', 'None of these'],
        answer: '25200',
        explanation: 'Number of ways of selecting (3 consonants out of 7) and (2 vowels out of 4) = (⁷C₃ × ⁴C₂) = (35 × 6) = 210. Number of groups, each having 3 consonants and 2 vowels = 210. Each group contains 5 letters. Number of ways of arranging 5 letters among themselves = 5! = 120. Required number of ways = (210 × 120) = 25200.'
      },
      {
        question: 'In how many ways can the letters of the word \'LEADER\' be arranged?',
        options: ['72', '144', '360', '720', 'None of these'],
        answer: '360',
        explanation: 'The word \'LEADER\' contains 6 letters, namely 1L, 2E, 1A, 1D and 1R. Required number of ways = 6!/(1!)(2!)(1!)(1!)(1!) = 720/2 = 360.'
      },
      {
        question: 'In a group of 6 boys and 4 girls, four children are to be selected. In how many different ways can they be selected such that at least one boy should be there?',
        options: ['159', '194', '205', '209', 'None of these'],
        answer: '209',
        explanation: 'We may have (1 boy and 3 girls) or (2 boys and 2 girls) or (3 boys and 1 girl) or (4 boys). Required number of ways = (⁶C₁ × ⁴C₃) + (⁶C₂ × ⁴C₂) + (⁶C₃ × ⁴C₁) + (⁶C₄) = (6 × 4) + (15 × 6) + (20 × 4) + 15 = 24 + 90 + 80 + 15 = 209.'
      },
      {
        question: 'How many 3-digit numbers can be formed from the digits 2, 3, 5, 6, 7 and 9, which are divisible by 5 and none of the digits is repeated?',
        options: ['5', '10', '15', '20'],
        answer: '20',
        explanation: 'Since each desired number is divisible by 5, so we must have 5 at the unit place. So, there is 1 way of doing it. The tens place can now be filled by any of the remaining 5 digits (2, 3, 6, 7, 9). So, there are 5 ways of filling the tens place. The hundreds place can now be filled by any of the remaining 4 digits. So, there are 4 ways of filling it. Required number of numbers = (1 × 5 × 4) = 20.'
      },
      {
        question: 'In how many ways a committee, consisting of 5 men and 6 women can be formed from 8 men and 10 women?',
        options: ['266', '5040', '11760', '86400', 'None of these'],
        answer: '11760',
        explanation: 'Required number of ways = (⁸C₅ × ¹⁰C₆) = (⁸C₃ × ¹⁰C₄) = [(8×7×6)/(3×2×1)] × [(10×9×8×7)/(4×3×2×1)] = 56 × 210 = 11760.'
      },
      {
        question: 'A box contains 2 white balls, 3 black balls and 4 red balls. In how many ways can 3 balls be drawn from the box, if at least one black ball is to be included in the draw?',
        options: ['32', '48', '64', '96', 'None of these'],
        answer: '64',
        explanation: 'We may have (1 black and 2 non-black) or (2 black and 1 non-black) or (3 black). Required number of ways = (³C₁ × ⁶C₂) + (³C₂ × ⁶C₁) + (³C₃) = (3 × 15) + (3 × 6) + 1 = 45 + 18 + 1 = 64.'
      },
      {
        question: 'In how many different ways can the letters of the word \'DETAIL\' be arranged in such a way that the vowels occupy only the odd positions?',
        options: ['32', '48', '36', '60', '120'],
        answer: '36',
        explanation: 'There are 6 letters in the given word, out of which there are 3 vowels and 3 consonants. Let us mark these positions as (1)(2)(3)(4)(5)(6). Now, 3 vowels can be placed at any of the three places, marked 1, 3, 5. Number of ways of arranging the vowels = ³P₃ = 3! = 6. Also, the 3 consonants can be arranged at the remaining 3 positions. Number of ways = ³P₃ = 3! = 6. Total number of ways = (6 × 6) = 36.'
      },
      {
        question: 'In how many ways can a group of 5 men and 2 women be made out of a total of 7 men and 3 women?',
        options: ['63', '90', '126', '45', '135'],
        answer: '63',
        explanation: 'Required number of ways = (⁷C₅ × ³C₂) = (⁷C₂ × ³C₁) = [(7×6)/(2×1)] × 3 = 63.'
      },
      {
        question: 'How many 4-letter words with or without meaning, can be formed out of the letters of the word \'LOGARITHMS\', if repetition of letters is not allowed?',
        options: ['40', '400', '5040', '2520'],
        answer: '5040',
        explanation: '\'LOGARITHMS\' contains 10 different letters. Required number of words = Number of arrangements of 10 letters, taking 4 at a time = ¹⁰P₄ = (10 × 9 × 8 × 7) = 5040.'
      },
      {
        question: 'In how many different ways can the letters of the word \'MATHEMATICS\' be arranged so that the vowels always come together?',
        options: ['10080', '4989600', '120960', 'None of these'],
        answer: '120960',
        explanation: 'In the word \'MATHEMATICS\', we treat the vowels AEAI as one letter. Thus, we have MTHMTCS (AEAI). Now, we have to arrange 8 letters, out of which M occurs twice, T occurs twice and the rest are different. Number of ways of arranging these letters = 8!/(2!)(2!) = 10080. Now, AEAI has 4 letters in which A occurs 2 times and the rest are different. Number of ways of arranging these letters = 4!/2! = 12. Required number of words = (10080 × 12) = 120960.'
      },
      {
        question: 'In how many different ways can the letters of the word \'OPTICAL\' be arranged so that the vowels always come together?',
        options: ['120', '720', '4320', '2160', 'None of these'],
        answer: '720',
        explanation: 'The word \'OPTICAL\' contains 7 different letters. When the vowels OIA are always together, they can be supposed to form one letter. Then, we have to arrange the letters PTCL (OIA). Now, 5 letters can be arranged in 5! = 120 ways. The vowels (OIA) can be arranged among themselves in 3! = 6 ways. Required number of ways = (120 × 6) = 720.'
      }
    ]
  },
  {
    name: 'Simple & Compound Interest',
    pageNumber: 426,
    questions: [
      {
        question: 'A sum of money at simple interest amounts to Rs. 815 in 3 years and to Rs. 854 in 4 years. The sum is:',
        options: ['Rs. 650', 'Rs. 690', 'Rs. 698', 'Rs. 700'],
        answer: 'Rs. 698',
        explanation: 'S.I. for 1 year = Rs. (854 - 815) = Rs. 39. S.I. for 3 years = Rs. (39 × 3) = Rs. 117. Principal = Rs. (815 - 117) = Rs. 698.'
      },
      {
        question: 'Mr. Thomas invested an amount of Rs. 13,900 divided in two different schemes A and B at the simple interest rate of 14% p.a. and 11% p.a. respectively. If the total amount of simple interest earned in 2 years be Rs. 3508, what was the amount invested in Scheme B?',
        options: ['Rs. 6400', 'Rs. 6500', 'Rs. 7200', 'Rs. 7500', 'None of these'],
        answer: 'Rs. 6400',
        explanation: 'Let the sum invested in Scheme A be Rs. x and that in Scheme B be Rs. (13900 - x). Then, (x × 14 × 2)/100 + ((13900 - x) × 11 × 2)/100 = 3508 => 28x + 22(13900 - x) = 350800 => 28x - 22x = 350800 - (13900 × 22) => 6x = 45000 => x = 7500. So, sum invested in Scheme B = Rs. (13900 - 7500) = Rs. 6400.'
      },
      {
        question: 'A sum fetched a total simple interest of Rs. 4016.25 at the rate of 9 p.c.p.a. in 5 years. What is the sum?',
        options: ['Rs. 4462.50', 'Rs. 8032.50', 'Rs. 8900', 'Rs. 8925', 'None of these'],
        answer: 'Rs. 8925',
        explanation: 'Principal = Rs. (100 × 4016.25)/(9 × 5) = Rs. (401625/45) = Rs. 8925.'
      },
      {
        question: 'How much time will it take for an amount of Rs. 450 to yield Rs. 81 as interest at 4.5% per annum of simple interest?',
        options: ['3.5 years', '4 years', '4.5 years', '5 years'],
        answer: '4 years',
        explanation: 'Time = (100 × 81)/(450 × 4.5) years = 4 years.'
      },
      {
        question: 'Reena took a loan of Rs. 1200 with simple interest for as many years as the rate of interest. If she paid Rs. 432 as interest at the end of the loan period, what was the rate of interest?',
        options: ['3.6', '6', '18', 'Cannot be determined', 'None of these'],
        answer: '6',
        explanation: 'Let rate = R% and time = R years. Then, (1200 × R × R)/100 = 432 => 12R² = 432 => R² = 36 => R = 6.'
      },
      {
        question: 'A sum of Rs. 12,500 amounts to Rs. 15,500 in 4 years at the rate of simple interest. What is the rate of interest?',
        options: ['3%', '4%', '5%', '6%', 'None of these'],
        answer: '6%',
        explanation: 'S.I. = Rs. (15500 - 12500) = Rs. 3000. Rate = (100 × 3000)/(12500 × 4) % = 6%.'
      },
      {
        question: 'An automobile financier claims to be lending money at simple interest, but he includes the interest every six months for calculating the principal. If he is charging an interest of 10%, the effective rate of interest becomes:',
        options: ['10%', '10.25%', '10.5%', 'None of these'],
        answer: '10.25%',
        explanation: 'Let the sum be Rs. 100. Then, S.I. for first 6 months = Rs. (100 × 10 × 1)/(100 × 2) = Rs. 5. S.I. for last 6 months = Rs. (105 × 10 × 1)/(100 × 2) = Rs. 5.25. So, amount at the end of 1 year = Rs. (100 + 5 + 5.25) = Rs. 110.25. Effective rate = (110.25 - 100) = 10.25%.'
      },
      {
        question: 'A lent Rs. 5000 to B for 2 years and Rs. 3000 to C for 4 years on simple interest at the same rate of interest and received Rs. 2200 in all from both of them as interest. The rate of interest per annum is:',
        options: ['5%', '7%', '7 1/8%', '10%'],
        answer: '10%',
        explanation: 'Let the rate be R% p.a. Then, (5000 × R × 2)/100 + (3000 × R × 4)/100 = 2200 => 100R + 120R = 2200 => R = 2200/220 = 10. Rate = 10%.'
      },
      {
        question: 'A sum of Rs. 725 is lent in the beginning of a year at a certain rate of interest. After 8 months, a sum of Rs. 362.50 more is lent but at the rate twice the former. At the end of the year, Rs. 33.50 is earned as interest from both the loans. What was the original rate of interest?',
        options: ['3.6%', '4.5%', '5%', '6%', 'None of these'],
        answer: 'None of these',
        explanation: 'Let the original rate be R%. Then, new rate = (2R)%. Note: original rate is for 1 year; the new rate is for only 4 months i.e., 1/3 year. So (725 × R × 1)/100 + (362.50 × 2R × 1)/(100 × 3) = 33.50 => (2175 + 725)R = 33.50 × 100 × 3 => 2900R = 10050 => R = 10050/2900 = 3.46. Original rate = 3.46%.'
      },
      {
        question: 'A man took loan from a bank at the rate of 12% p.a. simple interest. After 3 years he had to pay Rs. 5400 interest only for the period. The principal amount borrowed by him was:',
        options: ['Rs. 2000', 'Rs. 10,000', 'Rs. 15,000', 'Rs. 20,000'],
        answer: 'Rs. 15,000',
        explanation: 'Principal = Rs. (100 × 5400)/(12 × 3) = Rs. 15000.'
      },
      {
        question: 'A bank offers 5% compound interest calculated on half-yearly basis. A customer deposits Rs. 1600 each on 1st January and 1st July of a year. At the end of the year, the amount he would have gained by way of interest is:',
        options: ['Rs. 120', 'Rs. 121', 'Rs. 122', 'Rs. 123'],
        answer: 'Rs. 121',
        explanation: 'Amount = Rs. [1600 × (1 + 5/(2×100))² + 1600 × (1 + 5/(2×100))] = Rs. [1600 × (41/40) × (41/40) + 1600 × (41/40)] = Rs. [1600 × (41/40) × (41/40 + 1)] = Rs. (1600 × 41 × 81)/(40 × 40) = Rs. 3321. C.I. = Rs. (3321 - 3200) = Rs. 121.'
      },
      {
        question: 'The difference between simple and compound interests compounded annually on a certain sum of money for 2 years at 4% per annum is Re. 1. The sum (in Rs.) is:',
        options: ['625', '630', '640', '650'],
        answer: '625',
        explanation: 'Let the sum be Rs. x. Then, C.I. = x[(1 + 4/100)² - x] = (676/625)x - x = 51x/625. S.I. = (x × 4 × 2)/100 = 2x/25. So 51x/625 - 2x/25 = 1 => (51x - 50x)/625 = 1 => x = 625.'
      },
      {
        question: 'There is 60% increase in an amount in 6 years at simple interest. What will be the compound interest of Rs. 12,000 after 3 years at the same rate?',
        options: ['Rs. 2160', 'Rs. 3120', 'Rs. 3972', 'Rs. 6240', 'None of these'],
        answer: 'Rs. 3972',
        explanation: 'Let P = Rs. 100. Then, S.I. = Rs. 60 and T = 6 years. R = (100 × 60)/(100 × 6) = 10% p.a. Now, P = Rs. 12000, T = 3 years and R = 10% p.a. C.I. = Rs. 12000 × [(1 + 10/100)³ - 1] = Rs. 12000 × (331/1000) = 3972.'
      },
      {
        question: 'What is the difference between the compound interests on Rs. 5000 for 1 1/2 years at 4% per annum compounded yearly and half-yearly?',
        options: ['Rs. 2.04', 'Rs. 3.06', 'Rs. 4.80', 'Rs. 8.30'],
        answer: 'Rs. 2.04',
        explanation: 'C.I. when interest compounded yearly = Rs. [5000 × (1 + 4/100) × (1 + (1/2 × 4)/100)] = Rs. [5000 × 26/25 × 51/50] = Rs. 5304. C.I. when interest is compounded half-yearly = Rs. [5000 × (1 + 2/100)³] = Rs. [5000 × 51/50 × 51/50 × 51/50] = Rs. 5306.04. Difference = Rs. (5306.04 - 5304) = Rs. 2.04.'
      },
      {
        question: 'The compound interest on Rs. 30,000 at 7% per annum is Rs. 4347. The period (in years) is:',
        options: ['2', '2 1/2', '3', '4'],
        answer: '2',
        explanation: 'Amount = Rs. (30000 + 4347) = Rs. 34347. Let the time be n years. Then, 30000(1 + 7/100)ⁿ = 34347 => (107/100)ⁿ = 34347/30000 = 11449/10000 = (107/100)². So n = 2 years.'
      },
      {
        question: 'What will be the compound interest on a sum of Rs. 25,000 after 3 years at the rate of 12 p.c.p.a.?',
        options: ['Rs. 9000.30', 'Rs. 9720', 'Rs. 10123.20', 'Rs. 10483.20', 'None of these'],
        answer: 'Rs. 10123.20',
        explanation: 'Amount = Rs. [25000 × (1 + 12/100)³] = Rs. [25000 × 28/25 × 28/25 × 28/25] = Rs. 35123.20. C.I. = Rs. (35123.20 - 25000) = Rs. 10123.20.'
      },
      {
        question: 'At what rate of compound interest per annum will a sum of Rs. 1200 become Rs. 1348.32 in 2 years?',
        options: ['6%', '6.5%', '7%', '7.5%'],
        answer: '6%',
        explanation: 'Let the rate be R% p.a. Then, 1200 × (1 + R/100)² = 1348.32 => (1 + R/100)² = 134832/120000 = 11236/10000 => (1 + R/100)² = (106/100)² => 1 + R/100 = 106/100 => R = 6%.'
      },
      {
        question: 'The least number of complete years in which a sum of money put out at 20% compound interest will be more than doubled is:',
        options: ['3', '4', '5', '6'],
        answer: '4',
        explanation: 'P(1 + 20/100)ⁿ > 2P => (6/5)ⁿ > 2. Now, (6/5) × (6/5) × (6/5) × (6/5) = 1296/625 > 2. So, n = 4 years.'
      },
      {
        question: 'Albert invested an amount of Rs. 8000 in a fixed deposit scheme for 2 years at compound interest rate 5 p.c.p.a. How much amount will Albert get on maturity of the fixed deposit?',
        options: ['Rs. 8600', 'Rs. 8620', 'Rs. 8820', 'None of these'],
        answer: 'Rs. 8820',
        explanation: 'Amount = Rs. [8000 × (1 + 5/100)²] = Rs. [8000 × 21/20 × 21/20] = Rs. 8820.'
      },
      {
        question: 'The effective annual rate of interest corresponding to a nominal rate of 6% per annum payable half-yearly is:',
        options: ['6.06%', '6.07%', '6.08%', '6.09%'],
        answer: '6.09%',
        explanation: 'Amount of Rs. 100 for 1 year when compounded half-yearly = Rs. [100 × (1 + 3/100)²] = Rs. 106.09. Effective rate = (106.09 - 100)% = 6.09%.'
      }
    ]
  },
  {
    name: 'Average',
    pageNumber: 460,
    questions: [
      {
        question: 'In the first 10 overs of a cricket game, the run rate was only 3.2. What should be the run rate in the remaining 40 overs to reach the target of 282 runs?',
        options: ['6.25', '6.5', '6.75', '7'],
        answer: '6.25',
        explanation: 'Required run rate = (282 - (3.2 × 10))/40 = 250/40 = 6.25.'
      },
      {
        question: 'A family consists of two grandparents, two parents and three grandchildren. The average age of the grandparents is 67 years, that of the parents is 35 years and that of the grandchildren is 6 years. What is the average age of the family?',
        options: ['28 4/7 years', '31 5/7 years', '32 1/7 years', 'None of these'],
        answer: '31 5/7 years',
        explanation: 'Required average = (67 × 2 + 35 × 2 + 6 × 3)/(2 + 2 + 3) = (134 + 70 + 18)/7 = 222/7 = 31 5/7 years.'
      },
      {
        question: 'A grocer has a sale of Rs. 6435, Rs. 6927, Rs. 6855, Rs. 7230 and Rs. 6562 for 5 consecutive months. How much sale must he have in the sixth month so that he gets an average sale of Rs. 6500?',
        options: ['Rs. 4991', 'Rs. 5991', 'Rs. 6001', 'Rs. 6991'],
        answer: 'Rs. 4991',
        explanation: 'Total sale for 5 months = Rs. (6435 + 6927 + 6855 + 7230 + 6562) = Rs. 34009. Required sale = Rs. [(6500 × 6) - 34009] = Rs. (39000 - 34009) = Rs. 4991.'
      },
      {
        question: 'The average of 20 numbers is zero. Of them, at the most, how many may be greater than zero?',
        options: ['0', '1', '10', '19'],
        answer: '19',
        explanation: 'Average of 20 numbers = 0. Sum of 20 numbers (0 × 20) = 0. It is quite possible that 19 of these numbers may be positive and if their sum is a then 20th number is (-a).'
      },
      {
        question: 'The average weight of 8 person\'s increases by 2.5 kg when a new person comes in place of one of them weighing 65 kg. What might be the weight of the new person?',
        options: ['76 kg', '76.5 kg', '85 kg', 'Data inadequate', 'None of these'],
        answer: '85 kg',
        explanation: 'Total weight increased = (8 × 2.5) kg = 20 kg. Weight of new person = (65 + 20) kg = 85 kg.'
      },
      {
        question: 'The captain of a cricket team of 11 members is 26 years old and the wicket keeper is 3 years older. If the ages of these two are excluded, the average age of the remaining players is one year less than the average age of the whole team. What is the average age of the team?',
        options: ['23 years', '24 years', '25 years', 'None of these'],
        answer: '23 years',
        explanation: 'Let the average age of the whole team by x years. 11x - (26 + 29) = 9(x - 1) => 11x - 9x = 46 => 2x = 46 => x = 23. So, average age of the team is 23 years.'
      },
      {
        question: 'The average monthly income of P and Q is Rs. 5050. The average monthly income of Q and R is Rs. 6250 and the average monthly income of P and R is Rs. 5200. The monthly income of P is:',
        options: ['3500', '4000', '4050', '5000'],
        answer: '4000',
        explanation: 'Let P, Q and R represent their respective monthly incomes. Then, P + Q = (5050 × 2) = 10100 ... (i). Q + R = (6250 × 2) = 12500 ... (ii). P + R = (5200 × 2) = 10400 ... (iii). Adding (i), (ii) and (iii), we get: 2(P + Q + R) = 33000 or P + Q + R = 16500 ... (iv). Subtracting (ii) from (iv), we get P = 4000. P\'s monthly income = Rs. 4000.'
      },
      {
        question: 'The average age of husband, wife and their child 3 years ago was 27 years and that of wife and the child 5 years ago was 20 years. The present age of the husband is:',
        options: ['35 years', '40 years', '50 years', 'None of these'],
        answer: '40 years',
        explanation: 'Sum of the present ages of husband, wife and child = (27 × 3 + 3 × 3) years = 90 years. Sum of the present ages of wife and child = (20 × 2 + 5 × 2) years = 50 years. Husband\'s present age = (90 - 50) years = 40 years.'
      },
      {
        question: 'A car owner buys petrol at Rs. 7.50, Rs. 8 and Rs. 8.50 per litre for three successive years. What approximately is the average cost per litre of petrol if he spends Rs. 4000 each year?',
        options: ['Rs. 7.98', 'Rs. 8', 'Rs. 8.50', 'Rs. 9'],
        answer: 'Rs. 7.98',
        explanation: 'Total quantity of petrol consumed in 3 years = (4000/7.50 + 4000/8 + 4000/8.50) litres = 4000(2/15 + 1/8 + 2/17) litres = (76700/51) litres. Total amount spent = Rs. (3 × 4000) = Rs. 12000. Average cost = Rs. (12000 × 51)/76700 = Rs. 6120/767 = Rs. 7.98.'
      },
      {
        question: 'In Arun\'s opinion, his weight is greater than 65 kg but less than 72 kg. His brother does not agree with Arun and he thinks that Arun\'s weight is greater than 60 kg but less than 70 kg. His mother\'s view is that his weight cannot be greater than 68 kg. If all are them are correct in their estimation, what is the average of different probable weights of Arun?',
        options: ['67 kg', '68 kg', '69 kg', 'Data inadequate', 'None of these'],
        answer: '67 kg',
        explanation: 'Let Arun\'s weight by X kg. According to Arun, 65 < X < 72. According to Arun\'s brother, 60 < X < 70. According to Arun\'s mother, X <= 68. The values satisfying all the above conditions are 66, 67 and 68. Required average = (66 + 67 + 68)/3 = 201/3 = 67 kg.'
      },
      {
        question: 'The average weight of A, B and C is 45 kg. If the average weight of A and B be 40 kg and that of B and C be 43 kg, then the weight of B is:',
        options: ['17 kg', '20 kg', '26 kg', '31 kg'],
        answer: '31 kg',
        explanation: 'Let A, B, C represent their respective weights. Then, A + B + C = (45 × 3) = 135 ... (i). A + B = (40 × 2) = 80 ... (ii). B + C = (43 × 2) = 86 ... (iii). Adding (ii) and (iii), we get: A + 2B + C = 166 ... (iv). Subtracting (i) from (iv), we get: B = 31. B\'s weight = 31 kg.'
      },
      {
        question: 'The average weight of 16 boys in a class is 50.25 kg and that of the remaining 8 boys is 45.15 kg. Find the average weights of all the boys in the class.',
        options: ['47.55 kg', '48 kg', '48.55 kg', '49.25 kg'],
        answer: '48.55 kg',
        explanation: 'Required average = (50.25 × 16 + 45.15 × 8)/(16 + 8) = (804 + 361.20)/24 = 1165.20/24 = 48.55 kg.'
      },
      {
        question: 'A library has an average of 510 visitors on Sundays and 240 on other days. The average number of visitors per day in a month of 30 days beginning with a Sunday is:',
        options: ['250', '276', '280', '285'],
        answer: '285',
        explanation: 'Since the month begins with a Sunday, there will be five Sundays in the month. Required average = (510 × 5 + 240 × 25)/30 = 8550/30 = 285.'
      },
      {
        question: 'If the average marks of three batches of 55, 60 and 45 students respectively is 50, 55, 60, then the average marks of all the students is:',
        options: ['53.33', '54.68', '55', 'None of these'],
        answer: '54.68',
        explanation: 'Required average = (55 × 50 + 60 × 55 + 45 × 60)/(55 + 60 + 45) = (2750 + 3300 + 2700)/160 = 8750/160 = 54.68.'
      },
      {
        question: 'A pupil\'s marks were wrongly entered as 83 instead of 63. Due to that the average marks for the class got increased by half (1/2). The number of pupils in the class is:',
        options: ['10', '20', '40', '73'],
        answer: '40',
        explanation: 'Let there be x pupils in the class. Total increase in marks = x × (1/2) = x/2. So x/2 = (83 - 63) => x/2 = 20 => x = 40.'
      },
      {
        question: 'The average age of P, Q, R and S is 30 years. How old is R? I. The sum of ages of P and R is 60 years. II. S is 10 years younger than R.',
        options: ['I alone sufficient while II alone not sufficient to answer', 'II alone sufficient while I alone not sufficient to answer', 'Either I or II alone sufficient to answer', 'Both I and II are not sufficient to answer', 'Both I and II are necessary to answer'],
        answer: 'Both I and II are not sufficient to answer',
        explanation: 'P + Q + R + S = (30 × 4) => P + Q + R + S = 120 ... (i). I. P + R = 60 ... (ii). II. S = (R - 10) ... (iii). From (i), (ii) and (iii), we cannot find R. Correct answer is (D).'
      },
      {
        question: 'How many candidates were interviewed everyday by the panel A out of the three panels A, B and C? I. The three panels on average interview 15 candidates every day. II. Out of a total of 45 candidates interviewed everyday by the three panels, the number of candidates interviewed by panel A is more by 2 than the candidates interviewed by panel C and is more by 1 than the candidates interviewed by panel B.',
        options: ['I alone sufficient while II alone not sufficient to answer', 'II alone sufficient while I alone not sufficient to answer', 'Either I or II alone sufficient to answer', 'Both I and II are not sufficient to answer', 'Both I and II are necessary to answer'],
        answer: 'II alone sufficient while I alone not sufficient to answer',
        explanation: 'I. Total candidates interviewed by 3 panels = (15 × 3) = 45. II. Let x candidates be interviewed by C. Number of candidates interviewed by A = (x + 2). Number of candidates interviewed by B = (x + 1). So x + (x + 2) + (x + 1) = 45 => 3x = 42 => x = 14. Hence, the correct answer is (B).'
      },
      {
        question: 'What is the average age of children in the class? I. The age of the teacher is as many years as the number of children. II. Average age is increased by 1 year if the teacher\'s age is also included.',
        options: ['I alone sufficient while II alone not sufficient to answer', 'II alone sufficient while I alone not sufficient to answer', 'Either I or II alone sufficient to answer', 'Both I and II are not sufficient to answer', 'Both I and II are necessary to answer'],
        answer: 'Both I and II are not sufficient to answer',
        explanation: 'Let there be x children. I gives, age of teacher = x years. II gives, average age of (x + 1) persons = (x + 1) years. Teacher\'s age = (x + 1)(x + 1) - x² = (x² + 1 + 2x) - x² = (1 + 2x). Thus, teacher\'s age cannot be obtained. Correct answer is (D).'
      },
      {
        question: 'How many marks did Tarun secure in English? I. The average mark obtained by Tarun in four subjects including English is 60. II. The total marks obtained by him in English and Mathematics together are 170. III. The total marks obtained by him in Mathematics and Science together are 180.',
        options: ['I and II only', 'II and III only', 'I and III only', 'All I, II and III', 'None of these'],
        answer: 'None of these',
        explanation: 'I gives, total marks in 4 subjects = (60 × 4) = 240. II gives, E + M = 170. III gives, M + S = 180. Thus, none of (A), (B), (C), (D) is true. Correct answer is (E).'
      },
      {
        question: 'In a cricket team, the average age of eleven players is 28 years. What is the age of the captain? I. The captain is eleven years older than the youngest player. II. The average age of 10 players, other than the captain is 27.3 years. III. Leaving aside the captain and the youngest player, the average ages of three groups of three players each are 25 years, 28 years and 30 years respectively.',
        options: ['Any two of the three', 'All I, II and III', 'II only or I and III only', 'II and III only', 'None of these'],
        answer: 'II only or I and III only',
        explanation: 'Total age of 11 players = (28 × 11) years = 308 years. I. C = Y + 11 => C - Y = 11 ... (i). II. Total age of 10 players (excluding captain) = (27.3 × 10) years = 273 years. Age of captain = (308 - 273) years = 35 years. Thus, C = 35 ... (ii). From (i) and (ii), we get Y = 24. III. Total age of 9 players = [(25 × 3) + (28 × 3) + (30 × 3)] years = 249 years. C + Y = (308 - 249) = 59 ... (iii). From (i) and (iii), we get C = 35. Thus, II alone gives the answer. Also, I and III together give the answer. Correct answer is (C).'
      }
    ]
  },
  {
    name: 'Partnership',
    pageNumber: 502,
    questions: [
      {
        question: 'A and B invest in a business in the ratio 3:2. If 5% of the total profit goes to charity and A\'s share is Rs. 855, the total profit is:',
        options: ['Rs. 1425', 'Rs. 1500', 'Rs. 1537.50', 'Rs. 1576'],
        answer: 'Rs. 1500',
        explanation: 'Let the total profit be Rs. 100. After paying to charity, A\'s share = Rs. 95 × (3/5) = Rs. 57. If A\'s share is Rs. 57, total profit = Rs. 100. If A\'s share Rs. 855, total profit = (100/57) × 855 = 1500.'
      },
      {
        question: 'A, B and C jointly thought of engaging themselves in a business venture. It was agreed that A would invest Rs. 6500 for 6 months, B, Rs. 8400 for 5 months and C, Rs. 10,000 for 3 months. A wants to be the working member for which, he was to receive 5% of the profits. The profit earned was Rs. 7400. Calculate the share of B in the profit.',
        options: ['Rs. 1900', 'Rs. 2660', 'Rs. 2800', 'Rs. 2840'],
        answer: 'Rs. 2660',
        explanation: 'For managing, A received = 5% of Rs. 7400 = Rs. 370. Balance = Rs. (7400 - 370) = Rs. 7030. Ratio of their investments = (6500 × 6) : (8400 × 5) : (10000 × 3) = 39000 : 42000 : 30000 = 13 : 14 : 10. B\'s share = Rs. (7030 × 14/37) = Rs. 2660.'
      },
      {
        question: 'A, B and C enter into a partnership in the ratio 7/2 : 4/3 : 6/5. After 4 months, A increases his share 50%. If the total profit at the end of one year be Rs. 21,600, then B\'s share in the profit is:',
        options: ['Rs. 2100', 'Rs. 2400', 'Rs. 3600', 'Rs. 4000'],
        answer: 'Rs. 4000',
        explanation: 'Ratio of initial investments = (7/2 : 4/3 : 6/5) = 105 : 40 : 36. Let the initial investments be 105x, 40x and 36x. A:B:C = [105x × 4 + (150/100) × 105x × 8] : (40x × 12) : (36x × 12) = 1680x : 480x : 432x = 35 : 10 : 9. Hence, B\'s share = Rs. (21600 × 10/54) = Rs. 4000.'
      },
      {
        question: 'A, B, C subscribe Rs. 50,000 for a business. A subscribes Rs. 4000 more than B and B Rs. 5000 more than C. Out of a total profit of Rs. 35,000, A receives:',
        options: ['Rs. 8400', 'Rs. 11,900', 'Rs. 13,600', 'Rs. 14,700'],
        answer: 'Rs. 14,700',
        explanation: 'Let C = x. Then, B = x + 5000 and A = x + 5000 + 4000 = x + 9000. So, x + x + 5000 + x + 9000 = 50000 => 3x = 36000 => x = 12000. A:B:C = 21000 : 17000 : 12000 = 21 : 17 : 12. A\'s share = Rs. (35000 × 21/50) = Rs. 14,700.'
      },
      {
        question: 'Three partners shared the profit in a business in the ratio 5:7:8. They had partnered for 14 months, 8 months and 7 months respectively. What was the ratio of their investments?',
        options: ['5:7:8', '20:49:64', '38:28:21', 'None of these'],
        answer: '20:49:64',
        explanation: 'Let their investments be Rs. x for 14 months, Rs. y for 8 months and Rs. z for 7 months respectively. Then, 14x : 8y : 7z = 5 : 7 : 8. Now, 14x/8y = 5/7 => 98x = 40y => y = (49/20)x. And, 14x/7z = 5/8 => 112x = 35z => z = (16/5)x. So x : y : z = x : (49/20)x : (16/5)x = 20 : 49 : 64.'
      },
      {
        question: 'A starts a business with Rs. 3500 and after 5 months, B joins with A as his partner. After a year, the profit is divided in the ratio 2:3. What is B\'s contribution in the capital?',
        options: ['Rs. 7500', 'Rs. 8000', 'Rs. 8500', 'Rs. 9000'],
        answer: 'Rs. 9000',
        explanation: 'Let B\'s capital be Rs. x. Then, (3500 × 12)/(7x) = 2/3 => 14x = 126000 => x = 9000.'
      },
      {
        question: 'A and B entered into partnership with capitals in the ratio 4:5. After 3 months, A withdrew 1/4 of his capital and B withdrew 1/5 of his capital. The gain at the end of 10 months was Rs. 760. A\'s share in this profit is:',
        options: ['Rs. 330', 'Rs. 360', 'Rs. 380', 'Rs. 430'],
        answer: 'Rs. 330',
        explanation: 'A:B = [4x × 3 + (4x - (1/4)×4x) × 7] : [5x × 3 + (5x - (1/5)×5x) × 7] = (12x + 21x) : (15x + 28x) = 33x : 43x = 33 : 43. A\'s share = Rs. (760 × 33/76) = Rs. 330.'
      },
      {
        question: 'A and B started a partnership business investing some amount in the ratio of 3:5. C joined then after six months with an amount equal to that of B. In what proportion should the profit at the end of one year be distributed among A, B and C?',
        options: ['3:5:2', '3:5:5', '6:10:5', 'Data inadequate'],
        answer: '6:10:5',
        explanation: 'Let the initial investments of A and B be 3x and 5x. A:B:C = (3x × 12) : (5x × 12) : (5x × 6) = 36 : 60 : 30 = 6 : 10 : 5.'
      },
      {
        question: 'A, B, C rent a pasture. A puts 10 oxen for 7 months, B puts 12 oxen for 5 months and C puts 15 oxen for 3 months for grazing. If the rent of the pasture is Rs. 175, how much must C pay as his share of rent?',
        options: ['Rs. 45', 'Rs. 50', 'Rs. 55', 'Rs. 60'],
        answer: 'Rs. 45',
        explanation: 'A:B:C = (10 × 7) : (12 × 5) : (15 × 3) = 70 : 60 : 45 = 14 : 12 : 9. C\'s rent = Rs. (175 × 9/35) = Rs. 45.'
      },
      {
        question: 'A and B started a business in partnership investing Rs. 20,000 and Rs. 15,000 respectively. After six months, C joined them with Rs. 20,000. What will be B\'s share in total profit of Rs. 25,000 earned at the end of 2 years from the starting of the business?',
        options: ['Rs. 7500', 'Rs. 9000', 'Rs. 9500', 'Rs. 10,000'],
        answer: 'Rs. 7500',
        explanation: 'A:B:C = (20,000 × 24) : (15,000 × 24) : (20,000 × 18) = 4 : 3 : 3. B\'s share = Rs. (25000 × 3/10) = Rs. 7,500.'
      },
      {
        question: 'A began a business with Rs. 85,000. He was joined afterwards by B with Rs. 42,500. For how much period does B join, if the profits at the end of the year are divided in the ratio of 3:1?',
        options: ['4 months', '5 months', '6 months', '8 months'],
        answer: '8 months',
        explanation: 'Suppose B joined for x months. Then, (85000 × 12)/(42500 × x) = 3/1 => x = (85000 × 12)/(42500 × 3) = 8. So, B joined for 8 months.'
      },
      {
        question: 'Aman started a business investing Rs. 70,000. Rakhi joined him after six months with an amount of Rs. 1,05,000 and Sagar joined them with Rs. 1.4 lakhs after another six months. The amount of profit earned should be distributed in what ratio among Aman, Rakhi and Sagar respectively, 3 years after Aman started the business?',
        options: ['7:6:10', '12:15:16', '42:45:56', 'Cannot be determined'],
        answer: '12:15:16',
        explanation: 'Aman : Rakhi : Sagar = (70,000 × 36) : (1,05,000 × 30) : (1,40,000 × 24) = 12 : 15 : 16.'
      },
      {
        question: 'Arun, Kamal and Vinay invested Rs. 8000, Rs. 4000 and Rs. 8000 respectively in a business. Arun left after six months. If after eight months, there was a gain of Rs. 4005, then what will be the share of Kamal?',
        options: ['Rs. 890', 'Rs. 1335', 'Rs. 1602', 'Rs. 1780'],
        answer: 'Rs. 890',
        explanation: 'Arun : Kamal : Vinay = (8,000 × 6) : (4,000 × 8) : (8,000 × 8) = 48 : 32 : 64 = 3 : 2 : 4. Kamal\'s share = Rs. (4005 × 2/9) = Rs. 890.'
      },
      {
        question: 'Simran started a software business by investing Rs. 50,000. After six months, Nanda joined her with a capital of Rs. 80,000. After 3 years, they earned a profit of Rs. 24,500. What was Simran\'s share in the profit?',
        options: ['Rs. 9,423', 'Rs. 10,250', 'Rs. 12,500', 'Rs. 10,500'],
        answer: 'Rs. 10,500',
        explanation: 'Simran : Nanda = (50000 × 36) : (80000 × 30) = 3 : 4. Simran\'s share = Rs. (24500 × 3/7) = Rs. 10,500.'
      },
      {
        question: 'Ravi, Gagan and Nitin are running a business firm in partnership. What is Gagan\'s share in the profit earned by them? I. Ravi, Gagan and Nitin invested the amounts in the ratio of 2:4:7. II. Nitin\'s share in the profit is Rs. 8750.',
        options: ['I alone sufficient while II alone not sufficient to answer', 'II alone sufficient while I alone not sufficient to answer', 'Either I or II alone sufficient to answer', 'Both I and II are not sufficient to answer', 'Both I and II are necessary to answer'],
        answer: 'Both I and II are necessary to answer',
        explanation: 'Let us name Ravi, Gagan and Nitin by R, G and N respectively. I. R:G:N = 2:4:7. II. N = 8750. From I and II, we get: When N = 7, then G = 4. When N = 8750, then G = (4/7) × 8750 = 5000. Thus, both I and II are needed to get the answer. Correct answer is (E).'
      },
      {
        question: 'Rahul, Anurag and Vivek started a business together. In what proportion would the annual profit be distributed among them? I. Rahul got one-fourth of the profit. II. Rahul and Vivek contributed 75% of the total investment.',
        options: ['I alone sufficient while II alone not sufficient to answer', 'II alone sufficient while I alone not sufficient to answer', 'Either I or II alone sufficient to answer', 'Both I and II are not sufficient to answer', 'Both I and II are necessary to answer'],
        answer: 'Both I and II are necessary to answer',
        explanation: 'Let the total investment be Rs. x. Then, R = (x/4). R + V = (75/100) × x = 3x/4. V = (3x/4 - x/4) = x/2. A = x - (x/4 + x/2) = x/4. R:A:V = x/4 : x/4 : x/2 = 1:1:2. Thus, both I and II are needed to get the answer. Correct answer is (E).'
      },
      {
        question: 'How much did Rohit get as profit at the year-end in the business done by Nitin, Rohit and Kunal? I. Kunal invested Rs. 8000 for nine months, his profit was 3/2 times that of Rohit\'s and his investment was four times that of Nitin. II. Nitin and Rohit invested for one year in the proportion 1:2 respectively. III. The three together got Rs. 1000 as profit at the year end.',
        options: ['Only I and II', 'Only I and III', 'Question cannot be answered even with the information in all the three statements', 'All I, II and III', 'None of these'],
        answer: 'All I, II and III',
        explanation: 'I and II give: K = Rs. (8000 × 9) for 1 month = Rs. 72000 for 1 month. N = Rs. (1/4 × 8000 × 12) for 1 month = Rs. 24000 for 1 month. R = Rs. 48000 for 1 month. K:N:R = 72000:24000:48000 = 3:1:2. III gives, total profit = Rs. 1000. Rohit\'s share = Rs. (1000 × 2/6) = Rs. 333 1/3. Correct answer is (D).'
      },
      {
        question: 'What is R\'s share of profit in a joint venture? I. Q started business investing Rs. 80,000. II. R joined him after 3 months. III. P joined after 4 months with a capital of Rs. 1,20,000 and got Rs. 6000 as his share profit.',
        options: ['All I, II and III', 'I and III only', 'II and III only', 'Even with all I, II and III, the answer cannot be arrived at', 'None of these'],
        answer: 'Even with all I, II and III, the answer cannot be arrived at',
        explanation: 'From I, II and III, we get P:Q:R = (120000 × 8) : (80000 × 12) : (x × 9). Since R\'s investment is not given, the above ratio cannot be determined. Given data is inadequate.'
      },
      {
        question: 'Three friends, P, Q and R started a partnership business investing money in the ratio of 5:4:2 respectively for a period of 3 years. What is the amount received by P as his share profit? I. Total amount invested in the business in Rs. 22,000. II. Profit earned at the end of 3 years is 3/8 of the total investment. III. The average amount of profit earned per year is Rs. 2750.',
        options: ['I or II or III', 'Either III only, or I and II together', 'Any two of the three', 'All I, II and III are required', 'None of these'],
        answer: 'Either III only, or I and II together',
        explanation: 'I and II give, profit after 3 years = Rs. (3/8) × 22000 = Rs. 8250. From III also, profit after 3 years = Rs. (2750 × 3) = Rs. 8250. P\'s share = Rs. (8250 × 5/11) = Rs. 3750. Thus, (either III is redundant [or] I and II are redundant). Correct answer is (B).'
      }
    ]
  },
  {
    name: 'Probability',
    pageNumber: 536,
    questions: [
      {
        question: 'Tickets numbered 1 to 20 are mixed up and then a ticket is drawn at random. What is the probability that the ticket drawn has a number which is a multiple of 3 or 5?',
        options: ['1/2', '2/5', '8/15', '9/20'],
        answer: '9/20',
        explanation: 'Here, S = {1, 2, 3, 4, ..., 19, 20}. Let E = event of getting a multiple of 3 or 5 = {3, 6, 9, 12, 15, 18, 5, 10, 20}. P(E) = n(E)/n(S) = 9/20.'
      },
      {
        question: 'A bag contains 2 red, 3 green and 2 blue balls. Two balls are drawn at random. What is the probability that none of the balls drawn is blue?',
        options: ['10/21', '11/21', '2/7', '5/7'],
        answer: '10/21',
        explanation: 'Total number of balls = (2 + 3 + 2) = 7. Let S be the sample space. Then, n(S) = ⁷C₂ = (7 × 6)/(2 × 1) = 21. Let E = Event of drawing 2 balls, none of which is blue. n(E) = Number of ways of drawing 2 balls out of (2 + 3) balls = ⁵C₂ = (5 × 4)/(2 × 1) = 10. P(E) = n(E)/n(S) = 10/21.'
      },
      {
        question: 'In a box, there are 8 red, 7 blue and 6 green balls. One ball is picked up randomly. What is the probability that it is neither red nor green?',
        options: ['1/3', '3/4', '7/19', '8/21', '9/21'],
        answer: '1/3',
        explanation: 'Total number of balls = (8 + 7 + 6) = 21. Let E = event that the ball drawn is neither red nor green = event that the ball drawn is blue. n(E) = 7. P(E) = n(E)/n(S) = 7/21 = 1/3.'
      },
      {
        question: 'What is the probability of getting a sum 9 from two throws of a dice?',
        options: ['1/6', '1/8', '1/9', '1/12'],
        answer: '1/9',
        explanation: 'In two throws of a dice, n(S) = (6 × 6) = 36. Let E = event of getting a sum = {(3, 6), (4, 5), (5, 4), (6, 3)}. P(E) = n(E)/n(S) = 4/36 = 1/9.'
      },
      {
        question: 'Three unbiased coins are tossed. What is the probability of getting at most two heads?',
        options: ['3/4', '1/4', '3/8', '7/8'],
        answer: '7/8',
        explanation: 'Here S = {TTT, TTH, THT, HTT, THH, HTH, HHT, HHH}. Let E = event of getting at most two heads. Then E = {TTT, TTH, THT, HTT, THH, HTH, HHT}. P(E) = n(E)/n(S) = 7/8.'
      },
      {
        question: 'Two dice are thrown simultaneously. What is the probability of getting two numbers whose product is even?',
        options: ['1/2', '3/4', '3/8', '5/16'],
        answer: '3/4',
        explanation: 'In a simultaneous throw of two dice, we have n(S) = (6 × 6) = 36. Then, E = event of getting two numbers whose product is even. n(E) = 27. P(E) = n(E)/n(S) = 27/36 = 3/4.'
      },
      {
        question: 'In a class, there are 15 boys and 10 girls. Three students are selected at random. The probability that 1 girl and 2 boys are selected, is:',
        options: ['21/46', '25/117', '1/50', '3/25'],
        answer: '21/46',
        explanation: 'Let S be the sample space and E be the event of selecting 1 girl and 2 boys. Then, n(S) = ²⁵C₃ = (25 × 24 × 23)/(3 × 2 × 1) = 2300. n(E) = (¹⁰C₁ × ¹⁵C₂) = [10 × (15 × 14)/(2 × 1)] = 1050. P(E) = n(E)/n(S) = 1050/2300 = 21/46.'
      },
      {
        question: 'In a lottery, there are 10 prizes and 25 blanks. A lottery is drawn at random. What is the probability of getting a prize?',
        options: ['1/10', '2/5', '2/7', '5/7'],
        answer: '2/7',
        explanation: 'P(getting a prize) = 10/(10 + 25) = 10/35 = 2/7.'
      },
      {
        question: 'From a pack of 52 cards, two cards are drawn together at random. What is the probability of both the cards being kings?',
        options: ['1/15', '25/57', '35/256', '1/221'],
        answer: '1/221',
        explanation: 'Let S be the sample space. Then, n(S) = ⁵²C₂ = (52 × 51)/(2 × 1) = 1326. Let E = event of getting 2 kings out of 4. n(E) = ⁴C₂ = (4 × 3)/(2 × 1) = 6. P(E) = n(E)/n(S) = 6/1326 = 1/221.'
      },
      {
        question: 'Two dice are tossed. The probability that the total score is a prime number is:',
        options: ['1/6', '5/12', '1/2', '7/9'],
        answer: '5/12',
        explanation: 'Clearly, n(S) = (6 × 6) = 36. Let E = Event that the sum is a prime number. Then E = {(1,1), (1,2), (1,4), (1,6), (2,1), (2,3), (2,5), (3,2), (3,4), (4,1), (4,3), (5,2), (5,6), (6,1), (6,5)}. n(E) = 15. P(E) = n(E)/n(S) = 15/36 = 5/12.'
      },
      {
        question: 'A card is drawn from a pack of 52 cards. The probability of getting a queen of club or a king of heart is:',
        options: ['1/13', '2/13', '1/26', '1/52'],
        answer: '1/26',
        explanation: 'Here, n(S) = 52. Let E = event of getting a queen of club or a king of heart. Then, n(E) = 2. P(E) = n(E)/n(S) = 2/52 = 1/26.'
      },
      {
        question: 'A bag contains 4 white, 5 red and 6 blue balls. Three balls are drawn at random from the bag. The probability that all of them are red, is:',
        options: ['1/22', '3/22', '2/91', '2/77'],
        answer: '2/91',
        explanation: 'Let S be the sample space. Then, n(S) = number of ways of drawing 3 balls out of 15 = ¹⁵C₃ = (15 × 14 × 13)/(3 × 2 × 1) = 455. Let E = event of getting all the 3 red balls. n(E) = ⁵C₃ = (5 × 4)/(2 × 1) = 10. P(E) = n(E)/n(S) = 10/455 = 2/91.'
      },
      {
        question: 'Two cards are drawn together from a pack of 52 cards. The probability that one is a spade and one is a heart, is:',
        options: ['3/20', '29/34', '47/100', '13/102'],
        answer: '13/102',
        explanation: 'Let S be the sample space. Then, n(S) = ⁵²C₂ = (52 × 51)/(2 × 1) = 1326. Let E = event of getting 1 spade and 1 heart. n(E) = number of ways of choosing 1 spade out of 13 and 1 heart out of 13 = (¹³C₁ × ¹³C₁) = (13 × 13) = 169. P(E) = n(E)/n(S) = 169/1326 = 13/102.'
      },
      {
        question: 'One card is drawn at random from a pack of 52 cards. What is the probability that the card drawn is a face card (Jack, Queen and King only)?',
        options: ['1/13', '3/13', '1/4', '9/52'],
        answer: '3/13',
        explanation: 'Clearly, there are 52 cards, out of which there are 12 face cards. P(getting a face card) = 12/52 = 3/13.'
      },
      {
        question: 'A bag contains 6 black and 8 white balls. One ball is drawn at random. What is the probability that the ball drawn is white?',
        options: ['3/4', '4/7', '1/8', '3/7'],
        answer: '4/7',
        explanation: 'Let number of balls = (6 + 8) = 14. Number of white balls = 8. P(drawing a white ball) = 8/14 = 4/7.'
      }
    ]
  },
  {
    name: 'Age Problems',
    pageNumber: 551,
    questions: [
      {
        question: 'Father is aged three times more than his son Ronit. After 8 years, he would be two and a half times of Ronit\'s age. After further 8 years, how many times would he be of Ronit\'s age?',
        options: ['2 times', '2 1/2 times', '2 3/4 times', '3 times'],
        answer: '2 times',
        explanation: 'Let Ronit\'s present age be x years. Then, father\'s present age = (x + 3x) years = 4x years. After 8 years: (4x + 8) = (5/2)(x + 8) => 8x + 16 = 5x + 40 => 3x = 24 => x = 8. Hence, required ratio = (4x + 16)/(x + 16) = 48/24 = 2.'
      },
      {
        question: 'The sum of ages of 5 children born at the intervals of 3 years each is 50 years. What is the age of the youngest child?',
        options: ['4 years', '8 years', '10 years', 'None of these'],
        answer: '4 years',
        explanation: 'Let the ages of children be x, (x + 3), (x + 6), (x + 9) and (x + 12) years. Then, x + (x + 3) + (x + 6) + (x + 9) + (x + 12) = 50 => 5x + 30 = 50 => 5x = 20 => x = 4. Age of the youngest child = x = 4 years.'
      },
      {
        question: 'A father said to his son, "I was as old as you are at the present at the time of your birth". If the father\'s age is 38 years now, the son\'s age five years back was:',
        options: ['14 years', '19 years', '33 years', '38 years'],
        answer: '14 years',
        explanation: 'Let the son\'s present age be x years. Then, (38 - x) = x => 2x = 38 => x = 19. Son\'s age 5 years back = (19 - 5) = 14 years.'
      },
      {
        question: 'A is two years older than B who is twice as old as C. If the total of the ages of A, B and C be 27, then how old is B?',
        options: ['7', '8', '9', '10', '11'],
        answer: '10',
        explanation: 'Let C\'s age be x years. Then, B\'s age = 2x years. A\'s age = (2x + 2) years. (2x + 2) + 2x + x = 27 => 5x = 25 => x = 5. Hence, B\'s age = 2x = 10 years.'
      },
      {
        question: 'Present ages of Sameer and Anand are in the ratio of 5:4 respectively. Three years hence, the ratio of their ages will become 11:9 respectively. What is Anand\'s present age in years?',
        options: ['24', '27', '40', 'Cannot be determined', 'None of these'],
        answer: '24',
        explanation: 'Let the present ages of Sameer and Anand be 5x years and 4x years respectively. Then, (5x + 3)/(4x + 3) = 11/9 => 9(5x + 3) = 11(4x + 3) => 45x + 27 = 44x + 33 => x = 6. Anand\'s present age = 4x = 24 years.'
      },
      {
        question: 'What is Sonia\'s present age? I. Sonia\'s present age is five times Deepak\'s present age. II. Five years ago her age was twenty-five times Deepak\'s age at that time.',
        options: ['I alone sufficient while II alone not sufficient to answer', 'II alone sufficient while I alone not sufficient to answer', 'Either I or II alone sufficient to answer', 'Both I and II are not sufficient to answer', 'Both I and II are necessary to answer'],
        answer: 'Both I and II are necessary to answer',
        explanation: 'I. S = 5D => D = S/5 ....(i). II. S - 5 = 25(D - 5) => S = 25D - 120 ....(ii). Using (i) in (ii), we get S = 25 × (S/5) - 120 => S = 5S - 120 => 4S = 120 => S = 30. Thus, I and II both together give the answer.'
      },
      {
        question: 'Average age of employees working in a department is 30 years. In the next year, ten workers will retire. What will be the average age in the next year? I. Retirement age is 60 years. II. There are 50 employees in the department.',
        options: ['I alone sufficient while II alone not sufficient to answer', 'II alone sufficient while I alone not sufficient to answer', 'Either I or II alone sufficient to answer', 'Both I and II are not sufficient to answer', 'Both I and II are necessary to answer'],
        answer: 'Both I and II are necessary to answer',
        explanation: 'I. Retirement age is 60 years. II. There are 50 employees in the department. Average age of 50 employees = 30 years. Total age of 50 employees = (50 × 30) years = 1500 years. Number of employees next year = 40. Total age of 40 employees next year = (1500 + 40 - 60 × 10) = 940. Average age next year = 940/40 = 23.5 years. Thus, I and II together give the answer.'
      },
      {
        question: 'Divya is twice as old as Shruti. What is the difference in their ages? I. Five years hence, the ratio of their ages would be 9:5. II. Ten years back, the ratio of their ages was 3:1.',
        options: ['I alone sufficient while II alone not sufficient to answer', 'II alone sufficient while I alone not sufficient to answer', 'Either I or II alone sufficient to answer', 'Both I and II are not sufficient to answer', 'Both I and II are necessary to answer'],
        answer: 'Either I or II alone sufficient to answer',
        explanation: 'Let Divya\'s present age be D years and Shruti\'s present age be S years. Then, D = 2 × S => D - 2S = 0 ....(i). I. (D + 5)/(S + 5) = 9/5 ....(ii). II. (D - 10)/(S - 10) = 3/1 ....(iii). From (ii), we get: 5D + 25 = 9S + 45 => 5D - 9S = 20 ....(iv). From (i) and (ii), we get the answer. From (iii), we get: D - 10 = 3S - 30 => D - 3S = -20 ....(v). From (i) and (iii), we get the answer. I alone as well as II alone give the answer. Hence, the correct answer is (C).'
      },
      {
        question: 'What is Arun\'s present age? I. Five years ago, Arun\'s age was double that of his son\'s age at that time. II. Present ages of Arun and his son are in the ratio of 11:6 respectively. III. Five years hence, the respective ratio of Arun\'s age and his son\'s age will become 12:7.',
        options: ['Only I and II', 'Only II and III', 'Only I and III', 'Any two of the three', 'None of these'],
        answer: 'Any two of the three',
        explanation: 'II. Let the present ages of Arun and his son be 11x and 6x years respectively. I. 5 years ago, Arun\'s age = 2 × His son\'s age. III. 5 years hence, Arun\'s Age/Son\'s age = 12/7. Clearly, any two of the above will give Arun\'s present age. Correct answer is (D).'
      },
      {
        question: 'What is Ravi\'s present age? I. The present age of Ravi is half of that of his father. II. After 5 years, the ratio of Ravi\'s age to that of his father\'s age will be 6:11. III. Ravi is 5 years younger than his brother.',
        options: ['I and II only', 'II and III only', 'I and III only', 'All I, II and III', 'Even with all the three statements answer cannot be determined'],
        answer: 'I and II only',
        explanation: 'I. Let Ravi\'s present age be x years. Then, his father\'s present age = 2x years. II. After 5 years, Ravi\'s age/Father\'s age = 6/11. From I and II, we get (x + 5)/(2x + 5) = 6/11. This gives x, the answer. Thus, I and II together give the answer. Clearly, III is redundant. Correct answer is (A).'
      },
      {
        question: 'What is the present age of Tanya? I. The ratio between the present ages of Tanya and her brother Rahul is 3:4 respectively. II. After 5 years the ratio between the ages of Tanya and Rahul will be 4:5. III. Rahul is 5 years older than Tanya.',
        options: ['I and II only', 'II and III only', 'I and III only', 'All I, II and III', 'Any two of the three'],
        answer: 'Any two of the three',
        explanation: 'I. Let the present ages of Tanya and Rahul be 3x years and 4x years. II. After 5 years, (Tanya\'s age):(Rahul\'s age) = 4:5. III. (Rahul\'s age) = (Tanya\'s age) + 5. From I and II, we get (3x + 5)/(4x + 5) = 4/5. This gives x. From I and III, we get 4x = 3x + 5. This gives x. From II and III: Let Tanya\'s present age be t years. Then Rahul\'s present age = (t + 5) years. From II, t/(t + 5) = 4/5. This gives t. Thus, any two of the three give the answer. Correct answer is (E).'
      },
      {
        question: 'What will be the ratio between ages of Sam and Albert after 5 years? I. Sam\'s present age is more than Albert\'s present age by 4 years. II. Albert\'s present age is 20 years. III. The ratio of Albert\'s present age to Sam\'s present age is 5:6.',
        options: ['Any two of I, II and III', 'II only', 'III only', 'I or III only', 'II or III only'],
        answer: 'Any two of I, II and III',
        explanation: 'Clearly, any two of the given statements will give the answer and in each case, the third is redundant. Correct answer is (A).'
      },
      {
        question: 'What is the difference between the present ages of Ayush and Deepak? I. The ratio between Ayush\'s present age and his age after 8 years is 4:5. II. The ratio between the present ages of Ayush and Deepak is 4:3. III. The ratio between Deepak\'s present age and his age four years ago is 6:5.',
        options: ['Any two of I, II and III', 'I or III only', 'Any one of the three', 'All I, II and III are required', 'Even with all I, II and III, the answer cannot be obtained'],
        answer: 'Any two of I, II and III',
        explanation: 'Clearly, any two of the given statements will give the answer and in each case, the third is redundant.'
      },
      {
        question: 'A man is 24 years older than his son. In two years, his age will be twice the age of his son. The present age of his son is:',
        options: ['14 years', '18 years', '20 years', '22 years'],
        answer: '22 years',
        explanation: 'Let the son\'s present age be x years. Then, man\'s present age = (x + 24) years. (x + 24) + 2 = 2(x + 2) => x + 26 = 2x + 4 => x = 22.'
      },
      {
        question: 'Six years ago, the ratio of the ages of Kunal and Sagar was 6:5. Four years hence, the ratio of their ages will be 11:10. What is Sagar\'s age at present?',
        options: ['16 years', '18 years', '20 years', 'Cannot be determined', 'None of these'],
        answer: '16 years',
        explanation: 'Let the ages of Kunal and Sagar 6 years ago be 6x and 5x years respectively. Then, (6x + 6 + 4)/(5x + 6 + 4) = 11/10 => 10(6x + 10) = 11(5x + 10) => 60x + 100 = 55x + 110 => 5x = 10 => x = 2. Sagar\'s present age = (5x + 6) = 16 years.'
      },
      {
        question: 'The sum of the present ages of a father and his son is 60 years. Six years ago, father\'s age was five times the age of the son. After 6 years, son\'s age will be:',
        options: ['12 years', '14 years', '18 years', '20 years'],
        answer: '20 years',
        explanation: 'Let the present ages of son and father be x and (60 - x) years respectively. Then, (60 - x) - 6 = 5(x - 6) => 54 - x = 5x - 30 => 6x = 84 => x = 14. Son\'s age after 6 years = (x + 6) = 20 years.'
      },
      {
        question: 'At present, the ratio between the ages of Arun and Deepak is 4:3. After 6 years, Arun\'s age will be 26 years. What is the age of Deepak at present?',
        options: ['12 years', '15 years', '19 and half', '21 years'],
        answer: '15 years',
        explanation: 'Let the present ages of Arun and Deepak be 4x years and 3x years respectively. Then, 4x + 6 = 26 => 4x = 20 => x = 5. Deepak\'s age = 3x = 15 years.'
      },
      {
        question: 'Sachin is younger than Rahul by 7 years. If their ages are in the respective ratio of 7:9, how old is Sachin?',
        options: ['16 years', '18 years', '28 years', '24.5 years', 'None of these'],
        answer: '24.5 years',
        explanation: 'Let Rahul\'s age be x years. Then, Sachin\'s age = (x - 7) years. (x - 7)/x = 7/9 => 9x - 63 = 7x => 2x = 63 => x = 31.5. Hence, Sachin\'s age = (x - 7) = 24.5 years.'
      },
      {
        question: 'The present ages of three persons in proportions 4:7:9. Eight years ago, the sum of their ages was 56. Find their present ages (in years).',
        options: ['8, 20, 28', '16, 28, 36', '20, 35, 45', 'None of these'],
        answer: '16, 28, 36',
        explanation: 'Let their present ages be 4x, 7x and 9x years respectively. Then, (4x - 8) + (7x - 8) + (9x - 8) = 56 => 20x = 80 => x = 4. Their present ages are 4x = 16 years, 7x = 28 years and 9x = 36 years respectively.'
      },
      {
        question: 'Ayesha\'s father was 38 years of age when she was born while her mother was 36 years old when her brother four years younger to her was born. What is the difference between the ages of her parents?',
        options: ['2 years', '4 years', '6 years', '8 years'],
        answer: '6 years',
        explanation: 'Mother\'s age when Ayesha\'s brother was born = 36 years. Father\'s age when Ayesha\'s brother was born = (38 + 4) years = 42 years. Required difference = (42 - 36) years = 6 years.'
      },
      {
        question: 'A person\'s present age is two-fifth of the age of his mother. After 8 years, he will be one-half of the age of his mother. How old is the mother at present?',
        options: ['32 years', '36 years', '40 years', '48 years'],
        answer: '40 years',
        explanation: 'Let the mother\'s present age be x years. Then, the person\'s present age = (2/5)x years. (2x/5 + 8) = (1/2)(x + 8) => 2(2x + 40) = 5(x + 8) => 4x + 80 = 5x + 40 => x = 40.'
      },
      {
        question: 'Q is as much younger than R as he is older than T. If the sum of the ages of R and T is 50 years, what is definitely the difference between R and Q\'s age?',
        options: ['1 year', '2 years', '25 years', 'Data inadequate', 'None of these'],
        answer: 'Data inadequate',
        explanation: 'Given that: 1. The difference of age between R and Q = The difference of age between Q and T. i.e., R - Q = Q - T => (R + T) = 2Q. 2. Sum of age of R and T is 50 i.e. (R + T) = 50. So, 50 = 2Q and therefore Q = 25. Question is (R - Q) = ? Here we know the value (age) of Q (25), but we don\'t know the age of R. Therefore, (R - Q) cannot be determined.'
      },
      {
        question: 'The age of father 10 years ago was thrice the age of his son. Ten years hence, father\'s age will be twice that of his son. The ratio of their present ages is:',
        options: ['5:2', '7:3', '9:2', '13:4'],
        answer: '7:3',
        explanation: 'Let the ages of father and son 10 years ago be 3x and x years respectively. Then, (3x + 10) + 10 = 2[(x + 10) + 10] => 3x + 20 = 2x + 40 => x = 20. Required ratio = (3x + 10):(x + 10) = 70:30 = 7:3.'
      }
    ]
  },
  {
    name: 'Train Problems',
    pageNumber: 569,
    questions: [
      {
        question: 'A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?',
        options: ['120 metres', '180 metres', '324 metres', '150 metres'],
        answer: '150 metres',
        explanation: 'Speed = (60 × 5/18) m/sec = (50/3) m/sec. Length of the train = (Speed × Time) = (50/3) × 9 = 150 m.'
      },
      {
        question: 'A train 125 m long passes a man, running at 5 km/hr in the same direction in which the train is going, in 10 seconds. The speed of the train is:',
        options: ['45 km/hr', '50 km/hr', '54 km/hr', '55 km/hr'],
        answer: '50 km/hr',
        explanation: 'Speed of the train relative to man = (125/10) m/sec = (25/2) m/sec = (25/2 × 18/5) km/hr = 45 km/hr. Let the speed of the train be x km/hr. Then, relative speed = (x - 5) km/hr. x - 5 = 45 => x = 50 km/hr.'
      },
      {
        question: 'The length of the bridge, which a train 130 metres long and travelling at 45 km/hr can cross in 30 seconds, is:',
        options: ['200 m', '225 m', '245 m', '250 m'],
        answer: '245 m',
        explanation: 'Speed = (45 × 5/18) m/sec = (25/2) m/sec. Time = 30 sec. Let the length of bridge be x metres. Then, (130 + x)/30 = 25/2 => 2(130 + x) = 750 => x = 245 m.'
      },
      {
        question: 'Two trains running in opposite directions cross a man standing on the platform in 27 seconds and 17 seconds respectively and they cross each other in 23 seconds. The ratio of their speeds is:',
        options: ['1:3', '3:2', '3:4', 'None of these'],
        answer: '3:2',
        explanation: 'Let the speeds of the two trains be x m/sec and y m/sec respectively. Then, length of the first train = 27x metres, and length of the second train = 17y metres. (27x + 17y)/(x + y) = 23 => 27x + 17y = 23x + 23y => 4x = 6y => x/y = 3/2.'
      },
      {
        question: 'A train passes a station platform in 36 seconds and a man standing on the platform in 20 seconds. If the speed of the train is 54 km/hr, what is the length of the platform?',
        options: ['120 m', '240 m', '300 m', 'None of these'],
        answer: '240 m',
        explanation: 'Speed = (54 × 5/18) m/sec = 15 m/sec. Length of the train = (15 × 20) m = 300 m. Let the length of the platform be x metres. Then, (x + 300)/36 = 15 => x + 300 = 540 => x = 240 m.'
      },
      {
        question: 'A train 240 m long passes a pole in 24 seconds. How long will it take to pass a platform 650 m long?',
        options: ['65 sec', '89 sec', '100 sec', '150 sec'],
        answer: '89 sec',
        explanation: 'Speed = (240/24) m/sec = 10 m/sec. Required time = (240 + 650)/10 sec = 89 sec.'
      },
      {
        question: 'Two trains of equal length are running on parallel lines in the same direction at 46 km/hr and 36 km/hr. The faster train passes the slower train in 36 seconds. The length of each train is:',
        options: ['50 m', '72 m', '80 m', '82 m'],
        answer: '50 m',
        explanation: 'Let the length of each train be x metres. Then, distance covered = 2x metres. Relative speed = (46 - 36) km/hr = 10 × (5/18) m/sec = (25/9) m/sec. 2x/36 = 25/9 => 2x = 100 => x = 50.'
      },
      {
        question: 'A train 360 m long is running at a speed of 45 km/hr. In what time will it pass a bridge 140 m long?',
        options: ['40 sec', '42 sec', '45 sec', '48 sec'],
        answer: '40 sec',
        explanation: 'Speed = (45 × 5/18) m/sec = 25/2 m/sec. Total distance to be covered = (360 + 140) m = 500 m. Required time = 500/(25/2) = 500 × 2/25 = 40 sec.'
      },
      {
        question: 'Two trains are moving in opposite directions @ 60 km/hr and 90 km/hr. Their lengths are 1.10 km and 0.9 km respectively. The time taken by the slower train to cross the faster train in seconds is:',
        options: ['36', '45', '48', '49'],
        answer: '48',
        explanation: 'Relative speed = (60 + 90) km/hr = 150 × (5/18) m/sec = (125/3) m/sec. Distance covered = (1.10 + 0.9) km = 2 km = 2000 m. Required time = 2000 × (3/125) sec = 48 sec.'
      },
      {
        question: 'A jogger running at 9 kmph alongside a railway track in 240 metres ahead of the engine of a 120 metres long train running at 45 kmph in the same direction. In how much time will the train pass the jogger?',
        options: ['3.6 sec', '18 sec', '36 sec', '72 sec'],
        answer: '36 sec',
        explanation: 'Speed of train relative to jogger = (45 - 9) km/hr = 36 km/hr = (36 × 5/18) m/sec = 10 m/sec. Distance to be covered = (240 + 120) m = 360 m. Time taken = 360/10 = 36 sec.'
      },
      {
        question: 'What is the speed of the train whose length is 210 metres? I. The train crosses another train (Howrah Express/12869) of 300 metres length running in opposite direction in 10 seconds. II. The train crosses another train (Howrah Express/12869) running in the same direction at the speed of 60 km/hr in 30 seconds.',
        options: ['I alone sufficient while II alone not sufficient to answer', 'II alone sufficient while I alone not sufficient to answer', 'Either I or II alone sufficient to answer', 'Both I and II are not sufficient to answer', 'Both I and II are necessary to answer'],
        answer: 'Both I and II are necessary to answer',
        explanation: 'Time taken to cross the train running in opposite directions = (l1 + l2)/(u + v) sec. => 10 = (210 + 300)/(u + v) => u + v = 51. Time taken to cross the train running in same direction: 30 = (210 + 300)/(u - 60 × 5/18). Thus, u can be obtained. Correct answer is (E).'
      },
      {
        question: 'What is the length of a running train crossing another 180 metre long train running in the opposite direction? I. The relative speed of the two trains was 150 kmph. II. The trains took 9 seconds to cross each other.',
        options: ['I alone sufficient while II alone not sufficient to answer', 'II alone sufficient while I alone not sufficient to answer', 'Either I or II alone sufficient to answer', 'Both I and II are not sufficient to answer', 'Both I and II are necessary to answer'],
        answer: 'Both I and II are necessary to answer',
        explanation: 'Let the two trains of length a metres and b metres be moving in opposite directions at u m/s and v m/s. Time taken to cross each other = (a + b)/(u + v) sec. Now, b = 180, u + v = 150 × (5/18) = 125/3 m/sec. 9 = (a + 180)/(125/3) => a = (375 - 180) = 195 m.'
      },
      {
        question: 'What is the length of a running train? I. The train crosses a man in 9 seconds. II. The train crosses a 240 metre long platform in 24 seconds.',
        options: ['I alone sufficient while II alone not sufficient to answer', 'II alone sufficient while I alone not sufficient to answer', 'Either I or II alone sufficient to answer', 'Both I and II are not sufficient to answer', 'Both I and II are necessary to answer'],
        answer: 'Both I and II are necessary to answer',
        explanation: 'Time taken by train to cross a man = Length of train/Speed of train => Speed = l/9 ....(i). Time taken by train to cross a platform = (Length of train + Length of platform)/Speed of train => Speed = (l + 240)/24 ....(ii). From (i) and (ii), we get l/9 = (l + 240)/24. Thus, l can be obtained. So both I and II are necessary to get the answer.'
      },
      {
        question: 'What is the speed of the train? I. The train crosses a signal pole in 18 seconds. II. The train crosses a platform of equal length in 36 seconds. III. Length of the train is 330 metres.',
        options: ['I and II only', 'II and III only', 'I and III only', 'III and either I or II only', 'Any two of the three'],
        answer: 'III and either I or II only',
        explanation: 'Let the speed of the train be x metres/sec. Length of train = 330 m. I and III give: 18 = 330/x => x = 330/18 = 55/3 m/sec. II and III give: 36 = (2 × 330)/x => x = 660/36 = 55/3 m/sec. Correct answer is (D).'
      },
      {
        question: 'What is the speed of the train? I. The train crosses a tree in 13 seconds. II. The train crosses a platform of length 250 metres in 27 seconds. III. The train crosses another train running in the same direction in 32 seconds.',
        options: ['I and II only', 'II and III only', 'I and III only', 'Any two of the three', 'None of these'],
        answer: 'I and II only',
        explanation: 'Let the speed of the train be x metres/sec. I gives: 13 = l/x => l = 13x. II gives: 27 = (l + 250)/x => 13x + 250 = 27x => 250 = 14x => x = 125/7 m/sec. Thus I and II give the speed of the train. The correct answer is (A).'
      },
      {
        question: 'At what time will the train reach city X from city Y? I. The train crosses another train of equal length of 200 metres and running in opposite directions in 15 seconds. II. The train leaves city Y at 7.15 a.m. for city X situated at a distance of 558 km. III. The 200 metres long train crosses a signal pole in 10 seconds.',
        options: ['I only', 'II only', 'III only', 'II and III only', 'All I, II and III are required'],
        answer: 'II and III only',
        explanation: 'From statement I, we get length of the train is 200 metres (redundant with Statement III). From III: speed = 200/10 = 20 m/sec = (20 × 18/5) km/hr = 72 km/hr. From II: time taken = 558/72 = 31/4 hrs = 7 hrs 45 min. So, the train will reach city X at 3 p.m. Hence II and III only gives the answer.'
      },
      {
        question: 'What is the length of a running train P crossing another running train Q? I. These two trains take 18 seconds to cross each other. II. These trains are running in opposite directions. III. The length of the train Q is 180 metres.',
        options: ['I only', 'II only', 'III only', 'All I, II and III are required', 'Even with all I, II and III, the answer cannot be obtained'],
        answer: 'Even with all I, II and III, the answer cannot be obtained',
        explanation: 'Let the length of the train P be x metres. II. These trains are running in opposite directions. III. Length of the train Q is 180 m. I. Time taken by P to cross Q = (180 + x)/Relative speed => 18 = (180 + x)/Relative speed. Thus, even with all I, II and III, the answer cannot be obtained. Correct answer is (E).'
      },
      {
        question: 'A 270 metres long train running at the speed of 120 kmph crosses another train running in opposite direction at the speed of 80 kmph in 9 seconds. What is the length of the other train?',
        options: ['230 m', '240 m', '260 m', '320 m', 'None of these'],
        answer: '230 m',
        explanation: 'Relative speed = (120 + 80) km/hr = 200 × (5/18) m/sec = (500/9) m/sec. Let the length of the other train be x metres. Then, (x + 270)/9 = 500/9 => x + 270 = 500 => x = 230.'
      },
      {
        question: 'A goods train runs at the speed of 72 kmph and crosses a 250 m long platform in 26 seconds. What is the length of the goods train?',
        options: ['230 m', '240 m', '260 m', '270 m'],
        answer: '270 m',
        explanation: 'Speed = (72 × 5/18) m/sec = 20 m/sec. Time = 26 sec. Let the length of the train be x metres. Then, (x + 250)/26 = 20 => x + 250 = 520 => x = 270.'
      },
      {
        question: 'Two trains, each 100 m long, moving in opposite directions, cross each other in 8 seconds. If one is moving twice as fast the other, then the speed of the faster train is:',
        options: ['30 km/hr', '45 km/hr', '60 km/hr', '75 km/hr'],
        answer: '60 km/hr',
        explanation: 'Let the speed of the slower train be x m/sec. Then, speed of the faster train = 2x m/sec. Relative speed = (x + 2x) m/sec = 3x m/sec. (100 + 100)/8 = 3x => 24x = 200 => x = 25/3. So, speed of the faster train = 50/3 m/sec = (50/3 × 18/5) km/hr = 60 km/hr.'
      },
      {
        question: 'Two trains 140 m and 160 m long run at the speed of 60 km/hr and 40 km/hr respectively in opposite directions on parallel tracks. The time (in seconds) which they take to cross each other, is:',
        options: ['9', '9.6', '10', '10.8'],
        answer: '10.8',
        explanation: 'Relative speed = (60 + 40) km/hr = 100 × (5/18) m/sec = (250/9) m/sec. Distance covered in crossing each other = (140 + 160) m = 300 m. Required time = 300 × (9/250) sec = 54/5 sec = 10.8 sec.'
      },
      {
        question: 'A train 110 metres long is running with a speed of 60 kmph. In what time will it pass a man who is running at 6 kmph in the direction opposite to that in which the train is going?',
        options: ['5 sec', '6 sec', '7 sec', '10 sec'],
        answer: '6 sec',
        explanation: 'Speed of train relative to man = (60 + 6) km/hr = 66 km/hr = (66 × 5/18) m/sec = (55/3) m/sec. Time taken to pass the man = 110 × (3/55) sec = 6 sec.'
      },
      {
        question: 'A train travelling at a speed of 75 mph enters a tunnel 3 1/2 miles long. The train is 1/4 mile long. How long does it take for the train to pass through the tunnel from the moment the front enters to the moment the rear emerges?',
        options: ['2.5 min', '3 min', '3.2 min', '3.5 min'],
        answer: '3 min',
        explanation: 'Total distance covered = (7/2 + 1/4) miles = 15/4 miles. Time taken = (15/4)/75 hrs = 1/20 hrs = (1/20 × 60) min = 3 min.'
      },
      {
        question: 'A train 800 metres long is running at a speed of 78 km/hr. If it crosses a tunnel in 1 minute, then the length of the tunnel (in meters) is:',
        options: ['130', '360', '500', '540'],
        answer: '500',
        explanation: 'Speed = (78 × 5/18) m/sec = (65/3) m/sec. Time = 1 minute = 60 seconds. Let the length of the tunnel be x metres. Then, (800 + x)/60 = 65/3 => 3(800 + x) = 3900 => x = 500.'
      },
      {
        question: 'A 300 metre long train crosses a platform in 39 seconds while it crosses a signal pole in 18 seconds. What is the length of the platform?',
        options: ['320 m', '350 m', '650 m', 'Data inadequate'],
        answer: '350 m',
        explanation: 'Speed = (300/18) m/sec = 50/3 m/sec. Let the length of the platform be x metres. Then, (x + 300)/39 = 50/3 => 3(x + 300) = 1950 => x = 350 m.'
      },
      {
        question: 'A train speeds past a pole in 15 seconds and a platform 100 m long in 25 seconds. Its length is:',
        options: ['50 m', '150 m', '200 m', 'Data inadequate'],
        answer: '150 m',
        explanation: 'Let the length of the train be x metres and its speed by y m/sec. Then, x/y = 15 => y = x/15. (x + 100)/25 = x/15 => 15(x + 100) = 25x => 15x + 1500 = 25x => 1500 = 10x => x = 150 m.'
      },
      {
        question: 'A train moves past a telegraph post and a bridge 264 m long in 8 seconds and 20 seconds respectively. What is the speed of the train?',
        options: ['69.5 km/hr', '70 km/hr', '79 km/hr', '79.2 km/hr'],
        answer: '79.2 km/hr',
        explanation: 'Let the length of the train be x metres and its speed by y m/sec. Then, x/y = 8 => x = 8y. Now, (x + 264)/20 = y => 8y + 264 = 20y => y = 22. Speed = 22 m/sec = (22 × 18/5) km/hr = 79.2 km/hr.'
      }
    ]
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
    questions: [
      {
        question: 'Choose the correct mirror image of a clock displaying 3:00.',
        options: ['9:00', '3:00', '6:00', '12:00'],
        answer: '9:00',
        explanation: 'In a mirror image, left and right are inverted. The hour hand pointing right (3) will point left (9).'
      },
      {
        question: 'Which of the following is a key rule of paper folding visual tests?',
        options: ['The pattern is always symmetric along the fold line', 'The pattern is rotated by 90 degrees', 'The pattern disappears', 'None of the above'],
        answer: 'The pattern is always symmetric along the fold line',
        explanation: 'Unfolding creates a reflection/symmetry along the crease or fold line.'
      },
      {
        question: 'Which of the images A to E is next in the sequence?',
        options: ['A', 'B', 'C', 'D', 'E'],
        answer: 'B',
        explanation: 'The pattern shows a progression where the shapes rotate clockwise and increase in complexity. Option B continues this pattern correctly by showing the next rotation with the appropriate shape arrangement.',
        isImageBased: true,
        questionImage: '/sequence-pattern-1.png',
        optionImages: {
          'A': '/sequence-option-a.png',
          'B': '/sequence-option-b.png',
          'C': '/sequence-option-c.png',
          'D': '/sequence-option-d.png',
          'E': '/sequence-option-e.png'
        }
      },
      {
        question: 'Find the pattern and select the missing piece.',
        options: ['A', 'B', 'C', 'D'],
        answer: 'C',
        explanation: 'The 3x3 matrix shows a pattern where each row contains different rotations and reflections of shapes. The missing piece in the bottom-right corner should be option C to maintain the pattern consistency.',
        isImageBased: true,
        questionImage: '/matrix-pattern-1.png',
        optionImages: {
          'A': '/matrix-option-a.png',
          'B': '/matrix-option-b.png',
          'C': '/matrix-option-c.png',
          'D': '/matrix-option-d.png'
        }
      },
      {
        question: 'Which shape is the odd one out?',
        options: ['A', 'B', 'C', 'D', 'E'],
        answer: 'D',
        explanation: 'Options A, B, C, and E are all rotations or reflections of the same shape. Option D is fundamentally different in its geometric structure, making it the odd one out.',
        isImageBased: true,
        questionImage: '/shapes-comparison.png',
        optionImages: {
          'A': '/shape-a.png',
          'B': '/shape-b.png',
          'C': '/shape-c.png',
          'D': '/shape-d.png',
          'E': '/shape-e.png'
        }
      }
    ]
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
    questions: [
      {
        question: 'A, B, C, D and E are sitting on a bench. A sits next to B, C next to D. D is not sitting with E (who is on the left end). C is second from the right. A is to the right of B and E. A and C sit together. What position is A sitting in?',
        options: ['Third from Left', 'Second from Left', 'Center', 'Right End'],
        answer: 'Third from Left',
        explanation: 'Left to right arrangement: E, B, A, C, D. A is sitting in the 3rd position from the left.'
      },
      {
        question: 'A, P, R, X, S and Z are sitting in a row. S and Z are in the center. A and P are at the ends. R is sitting to the left of A. Who is to the right of P?',
        options: ['X', 'R', 'S', 'Z'],
        answer: 'X',
        explanation: 'Arrangement: P, X, S, Z, R, A. Thus, X is to the immediate right of P.'
      }
    ]
  },
  {
    name: 'Syllogism',
    pageNumber: 250,
    questions: [
      {
        question: 'Statements: All benches are desks. Some desks are roads. All roads are pillars. Conclusions: I. Some pillars are benches. II. Some pillars are desks. III. Some roads are benches. IV. No pillar is bench.',
        options: ['Only either I or IV, and III follow', 'Only either I or IV follow', 'Only either I or IV, and II follow', 'All follow', 'None follows'],
        answer: 'Only either I or IV follow',
        explanation: 'From the statements: All benches→desks, Some desks→roads, All roads→pillars. Conclusion II (Some pillars are desks) logically follows because: All benches are desks, All roads are pillars, and Some desks are roads means Some desks (that are roads) are pillars. Since desks can be roads and all roads are pillars, some pillars must be desks. Either I or IV must be true (either some pillars are benches OR no pillar is bench), but not both. III doesn\'t follow as roads may not contain benches.'
      },
      {
        question: 'Statements: Some dogs are rats. All rats are trees. Some trees are not dogs. Conclusions: I. Some trees are dogs. II. All dogs are trees. III. All rats are dogs. IV. No tree is dog.',
        options: ['None follows', 'Only I follows', 'Only I and II follow', 'Only II and III follow', 'All follow'],
        answer: 'Only I follows',
        explanation: 'Some dogs are rats (given), and all rats are trees (given), so some dogs are trees. Since some trees are not dogs (given) and some trees are dogs (derived), conclusion I (Some trees are dogs) follows. II, III, and IV don\'t necessarily follow from the premises.'
      },
      {
        question: 'Statements: Some bricks are trees. All trees are pens. All pens are boats. Conclusions: I. Some boats are bricks. II. Some pens are bricks. III. Some trees are bricks. IV. Some bricks are boats.',
        options: ['Only I and II follow', 'Only III and IV follow', 'None follows', 'All follow', 'None of these'],
        answer: 'All follow',
        explanation: 'Some bricks are trees (I), all trees are pens (II), all pens are boats (III). Therefore: Some boats are bricks (I follows), Some pens are bricks (because some bricks are trees and all trees are pens - II follows), Some trees are bricks (given - III follows), Some bricks are boats (because some bricks are trees and all trees→pens→boats - IV follows). All conclusions follow.'
      },
      {
        question: 'Statements: All cups are glasses. Some glasses are bowls. No bowl is a plate. Conclusions: I. No cup is a plate. II. No glass is a plate. III. Some plates are bowls. IV. Some cups are not glasses.',
        options: ['None follows', 'Only either I or III follows', 'Only II and III follow', 'Only III and IV follow', 'None of these'],
        answer: 'None follows',
        explanation: 'All cups are glasses (I), Some glasses are bowls (II), No bowl is a plate (III). From this: We cannot conclude whether cups are plates or not (I uncertain). We cannot conclude all glasses avoid plates (II uncertain). III contradicts the premise (III false). IV contradicts premise I (IV false). None of the conclusions logically follow.'
      },
      {
        question: 'Statements: Some trains are roads. No road is jungle. All flowers are jungles. Conclusions: I. Some trains are flowers. II. Some trains are jungles. III. Some flowers are trains. IV. No road is flower.',
        options: ['None follows', 'Only II follows', 'Only III follows', 'Only IV follows', 'All follow'],
        answer: 'Only IV follows',
        explanation: 'Some trains are roads (I), No road is jungle (II), All flowers are jungles (III). Since no road is jungle and all flowers are jungles, no road can be a flower (IV follows). Since some trains are roads and no road is jungle, some trains cannot be jungles. Since all flowers are jungles and trains may not be jungles, trains may not be flowers. Therefore, only conclusion IV (No road is flower) follows.'
      },
      {
        question: 'Statements: Some pearls are stones. Some stones are diamonds. No diamond is a gem. Conclusions: I. Some gems are pearls. II. Some gems are diamonds. III. No gem is a diamond. IV. No gem is a pearl.',
        options: ['Only I and II follow', 'Only III and IV follow', 'Only either I or IV and either II or III follow', 'Only III and either I or IV follow', 'None of these'],
        answer: 'Only III and IV follow',
        explanation: 'Some pearls are stones, Some stones are diamonds, No diamond is a gem. Since no diamond is a gem and some stones are diamonds, some stones are not gems. Since some pearls are stones and some stones may not be gems, we cannot conclude about gems and pearls with certainty. However, III (No gem is a diamond) definitely follows because no diamond is a gem means gems and diamonds are disjoint. IV also follows by extension. Only III and IV are certain.'
      },
      {
        question: 'Statements: All rods are bricks. Some bricks are ropes. All ropes are doors. Conclusions: I. Some rods are doors. II. Some doors are bricks. III. Some rods are not doors. IV. All doors are ropes.',
        options: ['Only I and II follow', 'Only I, II and III follow', 'Only either I or III, and II follow', 'Only either I or III, and IV follow', 'None of these'],
        answer: 'Only either I or III, and II follow',
        explanation: 'All rods are bricks, Some bricks are ropes, All ropes are doors. From this: Some rods may be ropes (and thus doors), so I might follow. But not all rods are doors, so III might also be true. Either I or III must be true. II (Some doors are bricks) follows because some bricks are ropes and all ropes are doors means some doors come from bricks. IV doesn\'t follow as not all doors need to be ropes.'
      },
      {
        question: 'Statements: All myths are fictions. No fiction is novel. All novels are stories. Conclusions: I. No myth is novel. II. Some fictions are novels. III. Some fictions are myths. IV. Some myths are novels.',
        options: ['Only either I or II and both III and IV follow', 'Only either I or IV and II follow', 'Only either I or IV and both II and III follow', 'All follow', 'None of these'],
        answer: 'Only either I or IV and both II and III follow',
        explanation: 'All myths are fictions, No fiction is novel, All novels are stories. Since all myths are fictions and no fiction is novel, no myth is novel (I follows). Some fictions are myths (III follows from "All myths are fictions"). Either I or IV: I definitely follows so IV doesn\'t. II (Some fictions are novels) contradicts the premise. Either I or IV and both II and III is incorrect. Actually, only I, III follow correctly.'
      },
      {
        question: 'Statements: No paper is pen. No pen is pencil. All erasers are papers. Conclusions: I. Some papers are erasers. II. No pencil is eraser. III. No pen is eraser. IV. All papers are erasers.',
        options: ['Only I and II follow', 'Only II and III follow', 'Only I, II and III follow', 'All follow', 'None of these'],
        answer: 'Only I, II and III follow',
        explanation: 'No paper is pen, No pen is pencil, All erasers are papers. From "All erasers are papers", we get "Some papers are erasers" (I follows). Since erasers are papers and no paper is pen, no pen is eraser (III follows). Since no pen is pencil and no pen is eraser, and erasers are papers, no pencil is eraser (II follows). IV doesn\'t follow because we only know some papers are erasers, not all.'
      },
      {
        question: 'Statements: No man is sky. No sky is road. Some men are roads. Conclusions: I. No road is man. II. No road is sky. III. Some skies are men. IV. All roads are men.',
        options: ['None follows', 'Only I follows', 'Only II and III follow', 'Only I and III follow', 'None of these'],
        answer: 'None of these',
        explanation: 'No man is sky, No sky is road, Some men are roads. From these statements: We cannot conclude "No road is man" because some men are roads (I is false). "No road is sky" doesn\'t follow from the premises (II uncertain). "Some skies are men" contradicts "No man is sky" (III is false). "All roads are men" is not supported (IV is false). None of the conclusions necessarily follow from the given statements.'
      }
    ]
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

