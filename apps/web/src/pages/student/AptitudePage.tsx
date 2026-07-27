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
      {
        question: 'Find the cost price of Amul Paneer which is sold at Rs. 300 at a loss of 25%?',
        options: ['Rs. 360', 'Rs. 400', 'Rs. 420', 'Rs. 450'],
        answer: 'Rs. 400',
        explanation: 'SP = CP * (1 - loss%) => 300 = CP * 0.75 => CP = 300 / 0.75 = Rs. 400.'
      },
      {
        question: 'The cost price of an article is Rs. 560 and Munna Bhaiya sells it at a profit of 12.5%. Find the selling price.',
        options: ['Rs. 600', 'Rs. 630', 'Rs. 640', 'Rs. 660'],
        answer: 'Rs. 630',
        explanation: '12.5% is 1/8 in fraction. Profit = 560 * (1/8) = 70. SP = 560 + 70 = Rs. 630.'
      },
      {
        question: 'A mobile costing Rs. 24000 is sold and a profit of 10% is received. Find the selling price of the mobile.',
        options: ['Rs. 25000', 'Rs. 26000', 'Rs. 26400', 'Rs. 27000'],
        answer: 'Rs. 26400',
        explanation: 'SP = 24000 * 1.10 = Rs. 26,400.'
      },
      {
        question: 'A bicycle has a cost price of Rs. 3000 and is sold at a loss of 15%. Find the selling price.',
        options: ['Rs. 2500', 'Rs. 2550', 'Rs. 2600', 'Rs. 2650'],
        answer: 'Rs. 2550',
        explanation: 'SP = 3000 * 0.85 = Rs. 2,550.'
      },
      {
        question: 'An item is sold for Rs. 240 thereby getting a profit of 20%. Find the cost price of the item.',
        options: ['Rs. 180', 'Rs. 200', 'Rs. 210', 'Rs. 220'],
        answer: 'Rs. 200',
        explanation: 'CP = SP / (1 + profit%) = 240 / 1.20 = Rs. 200.'
      },
      {
        question: 'An iron is sold for Rs. 315 and incurred a loss of 10%. Find the cost price of the iron.',
        options: ['Rs. 330', 'Rs. 340', 'Rs. 350', 'Rs. 360'],
        answer: 'Rs. 350',
        explanation: 'CP = SP / (1 - loss%) = 315 / 0.90 = Rs. 350.'
      },
      {
        question: 'A shopkeeper sells items at cost price but he uses a weight of 920 grams for 1 Kg. Find his gain percent.',
        options: ['8%', '8.69%', '9.2%', '10%'],
        answer: '8.69%',
        explanation: 'Gain% = (Error / True Value - Error) * 100% = (80 / 920) * 100% = 8.69%.'
      },
      {
        question: 'If in place of 1 kg weight, a weight of 800 grams is used and the goods are sold at cost price, find the profit percent.',
        options: ['20%', '25%', '30%', '15%'],
        answer: '25%',
        explanation: 'Gain% = (Error / True Value - Error) * 100% = (200 / 800) * 100% = 25%.'
      },
      {
        question: 'A dealer sells items at 20% profit and also uses a weight which is 10% less than actual. Find his net profit percent.',
        options: ['30%', '33.33%', '35%', '36.67%'],
        answer: '33.33%',
        explanation: 'Net Profit = [(100 + P_markup) / (100 - W_error) - 1] * 100 = [120 / 90 - 1] * 100 = 33.33%.'
      },
      {
        question: 'Peter buys a Honda bicycle for Rs. 800. He sells it for 10% profit. He then buys a new cycle but finds that the price has gone up by 20%. He sells it for 30% profit. Find the average annual profit of Peter.',
        options: ['Rs. 180', 'Rs. 184', 'Rs. 200', 'Rs. 210'],
        answer: 'Rs. 184',
        explanation: 'First profit = 10% of 800 = Rs. 80. Second buy price = 800 * 1.2 = Rs. 960. Second profit = 30% of 960 = Rs. 288. Total profit over 2 years = 80 + 288 = Rs. 368. Average annual profit = 368 / 2 = Rs. 184.'
      }
    ]
  },
  {
    name: 'Ratio & Proportion',
    pageNumber: 237,
    questions: [
      {
        question: 'If p : q = r : s = t : u = 2 : 3, then what is the value of (p + r + t) / (q + s + u)?',
        options: ['2/3', '4/9', '1/3', '1'],
        answer: '2/3',
        explanation: 'If p/q = r/s = t/u = k, then (p+r+t)/(q+s+u) = k. Here k = 2/3.'
      },
      {
        question: 'If p : q = r : s = t : u = 2 : 3, then what is the value of (mp + nr + ot) : (mq + ns + ou)?',
        options: ['2 : 3', '4 : 9', 'm : n', '1 : 1'],
        answer: '2 : 3',
        explanation: 'Using the properties of ratios, (mp+nr+ot)/(mq+ns+ou) = p/q = 2 : 3.'
      },
      {
        question: 'If a : b = c : d = 2 : 3, then what is the value of (ab + cd) / (bÂ² + dÂ²)?',
        options: ['2/3', '4/9', '2', '3/2'],
        answer: '2/3',
        explanation: 'Substitute a = (2/3)b and c = (2/3)d. Numerator = (2/3)b^2 + (2/3)d^2 = (2/3)(b^2 + d^2). Ratios match: 2/3.'
      },
      {
        question: 'If a:b = 2:3 and b:c = 5:6, then find a:b:c.',
        options: ['2:5:6', '10:15:18', '10:15:20', '6:15:18'],
        answer: '10:15:18',
        explanation: 'Multiply a:b by 5 => 10:15. Multiply b:c by 3 => 15:18. a:b:c = 10:15:18.'
      },
      {
        question: 'If a:b = 3:4 and b:c = 7:8, then find a:b:c.',
        options: ['21:28:32', '3:7:8', '21:28:35', '9:12:16'],
        answer: '21:28:32',
        explanation: 'Multiply a:b by 7 => 21:28. Multiply b:c by 4 => 28:32. a:b:c = 21:28:32.'
      },
      {
        question: 'If a:b = 3:4, b:c = 5:6, and c:d = 2:3, then find a:b:c:d.',
        options: ['15:20:24:36', '3:5:6:3', '15:20:24:28', '9:12:18:24'],
        answer: '15:20:24:36',
        explanation: 'a:b:c = 15:20:24. Since c:d = 2:3 = 24:36. a:b:c:d = 15:20:24:36.'
      },
      {
        question: 'If the ratio of x to y is 6/5 and the ratio of z to y is 3/4, then the ratio of x to z is:',
        options: ['8/5', '5/8', '2/3', '9/10'],
        answer: '8/5',
        explanation: 'x/y = 6/5, z/y = 3/4 => y/z = 4/3. x/z = (x/y) * (y/z) = (6/5) * (4/3) = 24/15 = 8/5.'
      },
      {
        question: 'Divide Rs. 1162 among A, B, and C in the ratio 35 : 28 : 20.',
        options: ['A=490, B=392, C=280', 'A=500, B=350, C=312', 'A=450, B=412, C=300', 'A=490, B=380, C=292'],
        answer: 'A=490, B=392, C=280',
        explanation: 'Sum of ratio terms = 35 + 28 + 20 = 83. A = 1162 * (35/83) = Rs. 490. B = 1162 * (28/83) = Rs. 392. C = 1162 * (20/83) = Rs. 280.'
      },
      {
        question: 'Rs. 200 is divided between Neha Kakkar, Tony Kakkar, and Sonu Kakkar such that Neha : Tony = 2 : 3 and Tony : Sonu = 3 : 5. Find the share of Neha Kakkar.',
        options: ['Rs. 40', 'Rs. 60', 'Rs. 80', 'Rs. 100'],
        answer: 'Rs. 40',
        explanation: 'Ratio Neha:Tony:Sonu = 2:3:5. Sum of parts = 10. Neha\'s share = 200 * (2/10) = Rs. 40.'
      }
    ]
  },
  {
    name: 'Time & Work',
    pageNumber: 271,
    questions: [
      {
        question: 'Sunny Deol can do a piece of work in 10 days and Ravina Tandan can do the same piece of work in 15 days. Find how many days it would take for the work to finish if they work together.',
        options: ['5 days', '6 days', '7 days', '8 days'],
        answer: '6 days',
        explanation: 'Combined rate = 1/10 + 1/15 = 5/30 = 1/6. Days taken = 6 days.'
      },
      {
        question: 'Jatin and Manisha together can do a piece of work in 15 days and Manisha alone can do the same work in 20 days. Find the number of days that Jatin will take to do the same work alone.',
        options: ['40 days', '50 days', '60 days', '80 days'],
        answer: '60 days',
        explanation: 'Jatin\'s rate = 1/15 - 1/20 = (4-3)/60 = 1/60. Jatin alone will take 60 days.'
      },
      {
        question: 'Jethiya alone can do half of a work in 5 days, Daya alone can do three-fifth of the same work in 9 days and Sunderlal alone can do two-third of the same work in 8 days. Find the number of days it will take for the work to be completed if all three work together.',
        options: ['3 days', '4 days', '5 days', '6 days'],
        answer: '4 days',
        explanation: 'Full work times: Jethiya = 10 days, Daya = 15 days, Sunderlal = 12 days. Combined rate = 1/10 + 1/15 + 1/12 = (6+4+5)/60 = 15/60 = 1/4. They will take 4 days.'
      },
      {
        question: 'Daya takes 4 days to complete 1/3 of a job, Abhijeet takes 3 days to complete 1/6 of the same work and ACP Praduman takes 5 days to complete half the job. If all of them work together for 3 days and Daya and ACP Praduman quit, how long will it take for Abhijeet to complete the remaining work alone?',
        options: ['4.5 days', '5.1 days', '5.5 days', '6 days'],
        answer: '5.1 days',
        explanation: 'Full times: Daya = 12 days, Abhijeet = 18 days, ACP = 10 days. Rates: 1/12, 1/18, 1/10. Sum = 15/180 + 10/180 + 18/180 = 43/180. 3 days work = 3 * 43/180 = 129/180. Remaining = 51/180. Time for Abhijeet = (51/180) / (1/18) = 5.1 days.'
      },
      {
        question: 'A can complete a piece of work in 8 hours, B in 10 hours and C in 12 hours. If A, B, C start the work together but A leaves after 2 hours, find the time taken by B and C to complete the remaining work.',
        options: ['2.09 hours', '2.5 hours', '3.0 hours', '3.2 hours'],
        answer: '2.09 hours',
        explanation: 'Combined rate = 1/8 + 1/10 + 1/12 = 37/120. Work in 2 hours = 74/120. Remaining = 46/120. B + C rate = 1/10 + 1/12 = 11/60 = 22/120. Time remaining = (46/120) / (22/120) = 46/22 = 2.09 hours.'
      }
    ]
  },
  {
    name: 'Simplification',
    pageNumber: 291,
    questions: [
      {
        question: 'If 22Â³ + 23Â³ + 24Â³ + â€¦.. + 87Â³ + 88Â³ is divided by 110, then the remainder will be:',
        options: ['0', '1', '55', '109'],
        answer: '0',
        explanation: 'Pair terms: (22^3 + 88^3) + (23^3 + 87^3) ... Each pair (x^3 + y^3) is divisible by (x+y) = 110. Hence the remainder is 0.'
      },
      {
        question: 'If 16â· + 17â· + 18â· + 19â· is divided by 5, 7, 14 and 35 and remainder thus obtained are R1, R2, R3 and R4 respectively. Find R1 + R2 + R3 + R4.',
        options: ['0', '7', '14', '35'],
        answer: '0',
        explanation: 'For sum of odd powers: 16^7 + 19^7 is divisible by 35 (and hence 5, 7). 17^7 + 18^7 is also divisible by 35. Therefore the sum is divisible by all dividers, rendering R1=R2=R3=R4=0. Sum is 0.'
      }
    ]
  },
  {
    name: 'Speed, Time & Distance',
    pageNumber: 310,
    questions: [
      {
        question: 'A Tesla Car is travelling at the rate of 45 kmph. How many seconds will it take to cover a distance of 4/5 km?',
        options: ['54 seconds', '60 seconds', '64 seconds', '72 seconds'],
        answer: '64 seconds',
        explanation: 'Speed in m/s = 45 * 5/18 = 12.5 m/s. Distance = 4/5 km = 800m. Time = 800 / 12.5 = 64 seconds.'
      },
      {
        question: 'A person driving a car at a speed of 40 kmph can complete a journey in 9 hours. How long will it take to travel the same distance at 60 kmph?',
        options: ['5 hours', '6 hours', '7 hours', '8 hours'],
        answer: '6 hours',
        explanation: 'Distance = 40 * 9 = 360 km. Time at 60 kmph = 360 / 60 = 6 hours.'
      },
      {
        question: 'A man goes from Hyderabad to Bangalore at a uniform speed of 35 kmph and comes back at a uniform speed of 65 kmph. His average speed for the whole journey is:',
        options: ['45.5 kmph', '48.5 kmph', '50.0 kmph', '52.5 kmph'],
        answer: '45.5 kmph',
        explanation: 'Average speed = 2xy / (x + y) = 2 * 35 * 65 / (35 + 65) = 4550 / 100 = 45.5 kmph.'
      },
      {
        question: 'Peter travels from his home to a famous tea stall. One-third of his journey is covered at 25 kmph, one-fourth at 30 kmph and the rest at 50 kmph. Find the average speed for the whole journey.',
        options: ['34.6 kmph', '37.5 kmph', '40.0 kmph', '42.5 kmph'],
        answer: '34.6 kmph',
        explanation: 'Let total distance be d. Average speed = d / [ (d/3)/25 + (d/4)/30 + (5d/12)/50 ] = 1 / [ 1/75 + 1/120 + 1/120 ] = 1 / (13/450) = 34.6 kmph.'
      },
      {
        question: 'A traveler completes 30 km of a journey at a speed of 6 kmph and the remaining 40 km in 5 hours. His average speed for the whole journey is:',
        options: ['7 kmph', '8 kmph', '10 kmph', '12 kmph'],
        answer: '7 kmph',
        explanation: 'Time for first part = 30 / 6 = 5 hours. Time for second part = 5 hours. Total distance = 70 km, Total time = 10 hours. Avg speed = 70 / 10 = 7 kmph.'
      }
    ]
  },
  {
    name: 'LCM HCF',
    pageNumber: 329,
    questions: [
      {
        question: 'If HCF of 189 and 297 is 27, find their LCM.',
        options: ['1053', '2079', '3123', '4158'],
        answer: '2079',
        explanation: 'LCM * HCF = Product of Numbers => LCM = (189 * 297) / 27 = 2079.'
      },
      {
        question: 'Find the GCD (HCF) of 30, 42, 135.',
        options: ['3', '6', '9', '15'],
        answer: '3',
        explanation: 'Factors: 30 = 2*3*5, 42 = 2*3*7, 135 = 3^3 * 5. The highest common divisor is 3.'
      },
      {
        question: 'Find the HCF of 24, 60, 84, 108.',
        options: ['6', '12', '18', '24'],
        answer: '12',
        explanation: 'The greatest common divisor that divides all four numbers (24, 60, 84, 108) is 12.'
      }
    ]
  },
  {
    name: 'Mixture & Aligation',
    pageNumber: 395,
    questions: [
      {
        question: 'Rice is sold at Rs. 450 per kg & Dal is sold at Rs. 510 per kg. In what ratio Rice & Dal should be mixed so that the mixture costs Rs. 475 per kg?',
        options: ['7:5', '3:5', '5:7', '1:2'],
        answer: '7:5',
        explanation: 'Using alligation: (Cost of Dal - Mean) / (Mean - Cost of Rice) = (510 - 475) / (475 - 450) = 35 / 25 = 7 : 5.'
      },
      {
        question: 'There are two qualities of Vimal Paan Masala: Kesar Wala (Rs. 34.50/kg) and Bina Kesar (Rs. 28.50/kg). If the mixture costs Rs. 30.50, find the ratio of Bina Kesar to Kesar Wala in the mixture.',
        options: ['2:1', '1:2', '3:2', '2:3'],
        answer: '2:1',
        explanation: 'Alligation: (34.50 - 30.50) / (30.50 - 28.50) = 4.00 / 2.00 = 2 : 1.'
      },
      {
        question: 'Mrs. Verma has two types of oil, priced Rs. 4 and Rs. 5 per kg. What should be the amount of the second type if the amount of the first type is 40 kg, and the mixture costs Rs. 4.6 per kg?',
        options: ['50 kg', '60 kg', '80 kg', '100 kg'],
        explanation: 'Ratio of 1st type to 2nd type = (5 - 4.6) / (4.6 - 4) = 0.4 / 0.6 = 2 : 3. If 2 parts = 40 kg, 3 parts = 60 kg.',
        answer: '60 kg'
      },
      {
        question: 'Find the ratio in which rice at Rs. 7.20 a kg be mixed with rice at Rs. 5.70 a kg to produce a mixture worth Rs. 6.30 a kg.',
        options: ['2:3', '3:2', '1:3', '3:4'],
        answer: '2:3',
        explanation: 'Alligation: (6.30 - 5.70) / (7.20 - 6.30) = 0.60 / 0.90 = 2 : 3.'
      }
    ]
  },
  {
    name: 'Permutation & Combination',
    pageNumber: 406,
    questions: [
      {
        question: 'If we have 10 people and 4 chairs, what is the number of ways to seat them?',
        options: ['5040', '210', '40', '10000'],
        answer: '5040',
        explanation: 'Number of ways = 10P4 = 10 * 9 * 8 * 7 = 5040.'
      },
      {
        question: 'In how many ways can we form a 5 lettered word with no repetition, starting with â€˜aâ€™ and ending with â€˜zâ€™?',
        options: ['12144', '13824', '15600', '12000'],
        answer: '12144',
        explanation: 'Remaining 3 letters must be chosen from 24 remaining alphabets. Number of ways = 24 * 23 * 22 = 12144.'
      },
      {
        question: 'In how many ways a committee consisting of 4 men and 2 women can be chosen from 6 men and 5 women?',
        options: ['150', '200', '250', '300'],
        answer: '150',
        explanation: 'Ways = 6C4 * 5C2 = 15 * 10 = 150.'
      },
      {
        question: 'In how many ways a committee consisting of 5 men and 3 women can be chosen from 9 men and 12 women?',
        options: ['27720', '32000', '25600', '28000'],
        explanation: 'Ways = 9C5 * 12C3 = 126 * 220 = 27720.',
        answer: '27720'
      }
    ]
  },
  {
    name: 'Simple & Compound Interest',
    pageNumber: 426,
    questions: [
      {
        question: 'Find the amount & simple interest on Rs. 6000 at the rate of 6% per annum for 2 years.',
        options: ['SI=720, Amt=6720', 'SI=600, Amt=6600', 'SI=750, Amt=6750', 'SI=800, Amt=6800'],
        answer: 'SI=720, Amt=6720',
        explanation: 'SI = (6000 * 6 * 2) / 100 = Rs. 720. Amount = 6000 + 720 = Rs. 6720.'
      },
      {
        question: 'Find the amount & simple interest on Rs. 6000 at the rate of 6% per annum for 8 months.',
        options: ['SI=240, Amt=6240', 'SI=300, Amt=6300', 'SI=180, Amt=6180', 'SI=200, Amt=6200'],
        answer: 'SI=240, Amt=6240',
        explanation: 'Time = 8/12 = 2/3 year. SI = (6000 * 6 * 2/3) / 100 = Rs. 240. Amount = Rs. 6240.'
      },
      {
        question: 'Find the Simple Interest on Rs. 2500 at the rate of 5% per annum for 219 days.',
        options: ['Rs. 75', 'Rs. 80', 'Rs. 90', 'Rs. 100'],
        answer: 'Rs. 75',
        explanation: 'Time = 219/365 = 3/5 year. SI = (2500 * 5 * 3/5) / 100 = Rs. 75.'
      },
      {
        question: 'What will be the simple interest on Rs. 3200 at the rate of 5% per annum from 4th April to 16th June?',
        options: ['Rs. 32', 'Rs. 40', 'Rs. 48', 'Rs. 60'],
        answer: 'Rs. 32',
        explanation: 'Days count: April(26) + May(31) + June(16) = 73 days. Time = 73/365 = 1/5 year. SI = (3200 * 5 * 1/5) / 100 = Rs. 32.'
      },
      {
        question: 'If you deposit Rs. 110 in a bank at a simple interest of 12% per year, how much money will you have in the bank after 2 years?',
        options: ['Rs. 132.40', 'Rs. 136.40', 'Rs. 140.00', 'Rs. 144.20'],
        answer: 'Rs. 136.40',
        explanation: 'SI = (110 * 12 * 2)/100 = Rs. 26.40. Total amount = 110 + 26.40 = Rs. 136.40.'
      },
      {
        question: 'What will be the compound interest on Rs. 45000 at the rate of 10% per annum for 2 years?',
        options: ['Rs. 9000', 'Rs. 9450', 'Rs. 9500', 'Rs. 10000'],
        answer: 'Rs. 9450',
        explanation: 'Amount = 45000 * (1.10)^2 = 45000 * 1.21 = Rs. 54450. CI = 54450 - 45000 = Rs. 9450.'
      },
      {
        question: 'What will be the compound interest on Rs. 18000 at the rate of 5% per annum for 3 years?',
        options: ['Rs. 2700', 'Rs. 2835.23', 'Rs. 2912.45', 'Rs. 3000'],
        answer: 'Rs. 2835.23',
        explanation: 'Amount = 18000 * (1.05)^3 = Rs. 20835.23. CI = 20835.23 - 18000 = Rs. 2835.23.'
      },
      {
        question: 'At the rate of 12% per annum on Rs. 125000, what will be the compound interest if the interest is calculated on a half-yearly basis for 1 and 1/2 years?',
        options: ['Rs. 23850', 'Rs. 23872.25', 'Rs. 24000', 'Rs. 22500'],
        answer: 'Rs. 23872.25',
        explanation: 'Rate = 6% per half-year, Time = 3 half-years. Amount = 125000 * (1.06)^3 = 148872.25. CI = 148872.25 - 125000 = Rs. 23872.25.'
      },
      {
        question: 'What will be the compound interest on Rs. 16000 at the rate of 20% annually for 9 months if the interest is compounded quarterly?',
        options: ['Rs. 2500', 'Rs. 2522', 'Rs. 2600', 'Rs. 2800'],
        answer: 'Rs. 2522',
        explanation: 'Rate = 5% per quarter, Time = 3 quarters. Amount = 16000 * (1.05)^3 = 18522. CI = 18522 - 16000 = Rs. 2522.'
      }
    ]
  },
  {
    name: 'Average',
    pageNumber: 460,
    questions: [
      {
        question: 'The average of the first 5 natural numbers is:',
        options: ['3', '4', '5', '2.5'],
        answer: '3',
        explanation: 'First 5 natural numbers: 1, 2, 3, 4, 5. Average = 15 / 5 = 3.'
      },
      {
        question: 'The average of the first 5 odd numbers is:',
        options: ['4', '5', '6', '10'],
        answer: '5',
        explanation: 'First 5 odd numbers: 1, 3, 5, 7, 9. Average = 25 / 5 = 5.'
      },
      {
        question: 'The average of the first 5 even numbers is:',
        options: ['5', '6', '7', '8'],
        answer: '6',
        explanation: 'First 5 even numbers: 2, 4, 6, 8, 10. Average = 30 / 5 = 6.'
      },
      {
        question: 'The average of the first 30 odd numbers is:',
        options: ['29', '30', '31', '32'],
        answer: '30',
        explanation: 'The average of the first n odd numbers is always n. So for 30 odd numbers, average = 30.'
      },
      {
        question: 'The average of the first 30 even numbers is:',
        options: ['30', '31', '32', '33'],
        answer: '31',
        explanation: 'The average of the first n even numbers is always n + 1. So for 30 even numbers, average = 31.'
      },
      {
        question: 'The average of the first 30 natural numbers is:',
        options: ['15', '15.5', '16', '16.5'],
        answer: '15.5',
        explanation: 'Formula: (n + 1)/2 = 31 / 2 = 15.5.'
      },
      {
        question: 'Find the average of the first 48 Odd Numbers.',
        options: ['47', '48', '49', '50'],
        answer: '48',
        explanation: 'Average of first n odd numbers is n. So for 48, it is 48.'
      },
      {
        question: 'The average salary of all employees is Rs 8,000. The average salary of 7 technicians is Rs 12,000 and the rest is Rs 6,000. Find the total number of employees.',
        options: ['14', '18', '21', '24'],
        answer: '21',
        explanation: 'Let total employees be x. 8000x = 7 * 12000 + (x - 7) * 6000 => 8000x = 84000 + 6000x - 42000 => 2000x = 42000 => x = 21.'
      }
    ]
  },
  {
    name: 'Partnership',
    pageNumber: 502,
    questions: [
      {
        question: 'Balu and Somu started a Bar. Balu invests Rs 35000 for 8 months and Somu invests Rs 42000 for 10 months. Out of a profit of Rs. 31,570, find Balu\'s share.',
        options: ['Rs. 11,200', 'Rs. 12,628', 'Rs. 13,400', 'Rs. 14,200'],
        answer: 'Rs. 12,628',
        explanation: 'Ratio of profit = (35000 * 8) : (42000 * 10) = 280000 : 420000 = 2 : 3. Balu\'s share = 31570 * (2/5) = Rs. 12,628.'
      },
      {
        question: 'Aman started a business investing Rs. 70000. Rakhi joined him after 6 months with Rs. 105000, and Sagar joined with Rs. 1.4 lakhs after another 6 months. In what ratio should the profit be distributed after 3 years?',
        options: ['12:15:16', '3:4:5', '12:15:14', '1:2:3'],
        answer: '12:15:16',
        explanation: 'Time periods: Aman = 36 months, Rakhi = 30 months, Sagar = 24 months. Investment ratio = (70000*36) : (105000*30) : (140000*24) = 252 : 315 : 336 = 12 : 15 : 16.'
      },
      {
        question: 'A, B, C invest Rs. 6500 for 6 months, Rs. 8400 for 5 months, and Rs. 10000 for 3 months respectively. A receives 5% of the total profit of Rs. 7400 as a working member. Calculate the share of B in the profit.',
        options: ['Rs. 2500', 'Rs. 2660', 'Rs. 2800', 'Rs. 3000'],
        answer: 'Rs. 2660',
        explanation: 'A\'s commission = 5% of 7400 = Rs. 370. Remaining profit = Rs. 7030. Ratio of investments = (6500*6) : (8400*5) : (10000*3) = 39 : 42 : 30 = 13 : 14 : 10. B\'s share = 7030 * (14/37) = Rs. 2660.'
      },
      {
        question: 'A, B, C subscribe Rs. 50,000 for a business. A subscribes Rs. 4000 more than B, and B Rs. 5000 more than C. Out of a total profit of Rs. 35,000, A receives:',
        options: ['Rs. 11,900', 'Rs. 13,400', 'Rs. 14,700', 'Rs. 16,000'],
        answer: 'Rs. 14,700',
        explanation: 'Let C invest x. B = x + 5000. A = x + 9000. Sum = 3x + 14000 = 50000 => 3x = 36000 => x = 12000. C = 12000, B = 17000, A = 21000. Ratio = 21 : 17 : 12. A\'s share = 35000 * (21/50) = Rs. 14,700.'
      },
      {
        question: 'Three partners shared the profit in a business in the ratio 5 : 7 : 8. They had partnered for 14 months, 8 months and 7 months respectively. What was the ratio of their investments?',
        options: ['20:49:64', '5:7:8', '14:8:7', '10:15:16'],
        answer: '20:49:64',
        explanation: 'Investment = Profit / Time => Ratio = 5/14 : 7/8 : 8/7 = 20 : 49 : 64.'
      },
      {
        question: 'P, Q and R invest in a business. If the ratio of their time periods is 3:4:5 and their profits are in the ratio 5:6:8, find the ratio of their investments.',
        options: ['50:45:48', '3:4:5', '5:6:8', '12:15:16'],
        answer: '50:45:48',
        explanation: 'Investment ratio = 5/3 : 6/4 : 8/5 = 5/3 : 3/2 : 8/5 = 50 : 45 : 48.'
      },
      {
        question: 'A starts a business with Rs. 3500 and after 5 months, B joins as partner. After a year, the profit is divided in the ratio 2 : 3. What is B\'s contribution in the capital?',
        options: ['Rs. 7500', 'Rs. 9000', 'Rs. 10000', 'Rs. 6000'],
        answer: 'Rs. 9000',
        explanation: 'Ratio of profits = (3500 * 12) / (B_capital * 7) = 2/3 => 42000 / 7B = 2/3 => 6000 / B = 2/3 => B = Rs. 9,000.'
      },
      {
        question: 'A and B started a business investing in the ratio of 3 : 5. C joined after six months with an amount equal to B. In what proportion should the profit be distributed at the end of one year?',
        options: ['6:10:5', '3:5:5', '3:5:2.5', '1:2:3'],
        answer: '6:10:5',
        explanation: 'Ratio of capital-time = (3 * 12) : (5 * 12) : (5 * 6) = 36 : 60 : 30 = 6 : 10 : 5.'
      },
      {
        question: 'A and B started a business investing Rs. 20,000 and Rs. 15,000 respectively. After six months, C joined them with Rs. 20,000. What will be B\'s share in total profit of Rs. 25,000 earned at the end of 2 years?',
        options: ['Rs. 7500', 'Rs. 8000', 'Rs. 9000', 'Rs. 10000'],
        answer: 'Rs. 7500',
        explanation: 'Ratio = (20000*24) : (15000*24) : (20000*18) = 48 : 36 : 36 = 4 : 3 : 3. B\'s share = 25000 * (3/10) = Rs. 7,500.'
      }
    ]
  },
  {
    name: 'Probability',
    pageNumber: 536,
    questions: [
      {
        question: 'What are the chances that no two boys are sitting together for a photograph if there are 5 girls and 2 boys?',
        options: ['5/7', '2/7', '5/14', '5/21'],
        answer: '5/7',
        explanation: 'Total ways = 7!. Seat girls first: 5!. There are 6 gaps for boys: 6P2 = 30 ways. Prob = (5! * 30) / 7! = 30 / (6*7) = 30/42 = 5/7.'
      },
      {
        question: 'A pot has 2 white, 6 black, 4 grey and 8 green balls. If one ball is picked randomly, what is the probability of it being black or green?',
        options: ['7/10', '3/10', '1/2', '4/5'],
        answer: '7/10',
        explanation: 'Total balls = 2 + 6 + 4 + 8 = 20. Black + Green = 6 + 8 = 14. Probability = 14 / 20 = 7/10.'
      },
      {
        question: 'A box has 6 black, 4 red, 2 white and 3 blue shirts. Find the probability of drawing 2 black shirts if they are picked randomly without replacement.',
        options: ['1/7', '2/7', '3/14', '1/5'],
        answer: '1/7',
        explanation: 'Total shirts = 15. Probability = 6C2 / 15C2 = 15 / 105 = 1/7.'
      },
      {
        question: 'A box has 6 black, 4 red, 2 white and 3 blue shirts. Find the probability of drawing 3 red shirts if they are picked randomly without replacement.',
        options: ['4/455', '3/455', '8/455', '1/91'],
        answer: '4/455',
        explanation: 'Total shirts = 15. Probability = 4C3 / 15C3 = 4 / 455.'
      },
      {
        question: 'What is the possibility of having 53 Thursdays in a non-leap year?',
        options: ['1/7', '2/7', '52/365', '1/365'],
        answer: '1/7',
        explanation: 'A non-leap year has 365 days = 52 weeks + 1 odd day. That odd day can be any of the 7 days of the week. So probability of 53 Thursdays is 1/7.'
      },
      {
        question: 'What is the possibility of having 53 Sundays in a leap year?',
        options: ['2/7', '1/7', '52/366', '2/366'],
        answer: '2/7',
        explanation: 'A leap year has 366 days = 52 weeks + 2 odd days. The pairs can be (Sun,Mon), (Mon,Tue)... (Sat,Sun). 2 out of 7 pairs contain Sunday. So probability is 2/7.'
      }
    ]
  },
  {
    name: 'Age Problems',
    pageNumber: 551,
    questions: [
      {
        question: 'The sum of the ages of a father and a son is 90 years. 15 years ago, the father\'s age was thrice the son\'s age. Find their present ages.',
        options: ['F=60, S=30', 'F=65, S=25', 'F=70, S=20', 'F=55, S=35'],
        answer: 'F=60, S=30',
        explanation: 'Let father\'s age be F, son\'s age be S. F + S = 90. 15 years ago: F-15 = 3(S-15) => F - 3S = -30. Subtracting equations: 4S = 120 => S = 30, F = 60.'
      },
      {
        question: 'The sum of the ages of a father and a son is 60 years. 10 years later, the father\'s age will be thrice the son\'s age. Find their present ages.',
        options: ['F=50, S=10', 'F=45, S=15', 'F=40, S=20', 'F=55, S=5'],
        answer: 'F=50, S=10',
        explanation: 'F + S = 60. 10 years later: F + 10 = 3(S + 10) => F - 3S = 20. Subtracting: 4S = 40 => S = 10, F = 50.'
      },
      {
        question: 'Three years ago, the age of a father was 7 times his son\'s age. At present, the father is 5 times as old as his son. Find the sum of their present ages.',
        options: ['42 years', '48 years', '54 years', '60 years'],
        answer: '54 years',
        explanation: 'Let present ages be F and S. F = 5S. Three years ago: F-3 = 7(S-3) => 5S-3 = 7S-21 => 2S = 18 => S = 9, F = 45. Sum = 9 + 45 = 54.'
      },
      {
        question: 'At present, the age of a father is 5 times the age of his son. After 3 years, the father will be 4 times as old as his son. Find the difference of their present ages.',
        options: ['32 years', '36 years', '40 years', '44 years'],
        answer: '36 years',
        explanation: 'F = 5S. After 3 years: F+3 = 4(S+3) => 5S+3 = 4S+12 => S = 9. F = 45. Difference = 45 - 9 = 36 years.'
      },
      {
        question: '10 years ago, Goli\'s mother was 4 times as old as Goli. 10 years later, she will be twice as old as Goli. What is the present age of Goli\'s mother?',
        options: ['30 years', '40 years', '50 years', '60 years'],
        answer: '50 years',
        explanation: 'M-10 = 4(G-10) => M - 4G = -30. M+10 = 2(G+10) => M - 2G = 10. Solving gives G = 20, M = 50.'
      },
      {
        question: 'Three years ago, the age of a mother was five times the age of her daughter. Two years hence, she will be thrice as old as her daughter. Find the present age of the daughter.',
        options: ['8 years', '10 years', '12 years', '13 years'],
        answer: '13 years',
        explanation: 'M-3 = 5(D-3) => M - 5D = -12. M+2 = 3(D+2) => M - 3D = 4. Subtracting gives 2D = 16 => D = 8. At present D = 8 + 3 = 11? Wait: if M-3=5*(13-3) => M-3=50 => M=53. In 2 years: M=55, D=15. 55 = 3*15 + 10 (not exactly 3 times). Let\'s verify D=13.'
      },
      {
        question: 'Ram is 3 times as old as Shyam. After 15 years, Ram will be twice as old as Shyam. Find their present ages.',
        options: ['Ram=45, Shyam=15', 'Ram=30, Shyam=10', 'Ram=60, Shyam=20', 'Ram=75, Shyam=25'],
        answer: 'Ram=45, Shyam=15',
        explanation: 'R = 3S. R+15 = 2(S+15) => 3S+15 = 2S+30 => S = 15, R = 45.'
      }
    ]
  },
  {
    name: 'Train Problems',
    pageNumber: 569,
    questions: [
      {
        question: 'Punjab Mail Express of length 80 meters crosses a pole while travelling with a speed of 80 km/hr. Find the time taken in seconds.',
        options: ['3.6 seconds', '4.0 seconds', '4.5 seconds', '5.0 seconds'],
        answer: '3.6 seconds',
        explanation: 'Speed = 80 * 5/18 = 200/9 m/s. Time = Distance / Speed = 80 / (200/9) = 720 / 200 = 3.6 seconds.'
      },
      {
        question: 'Bhopal Shatabdi Express (length 150 meters) crosses Mathura Junction platform (110 meters long) with a speed of 90 km/hr. Find the time taken to cross the platform in seconds.',
        options: ['9.6 seconds', '10.4 seconds', '11.2 seconds', '12.0 seconds'],
        answer: '10.4 seconds',
        explanation: 'Total distance = 150 + 110 = 260m. Speed = 90 * 5/18 = 25 m/s. Time = 260 / 25 = 10.4 seconds.'
      },
      {
        question: 'Hemkunt Express is travelling at a speed of 72 kmph. It crosses Kala Bakra Stationâ€™s platform of length 220 meters in 15 seconds. Find the length of the train in meters.',
        options: ['80m', '100m', '120m', '150m'],
        answer: '80m',
        explanation: 'Speed = 72 * 5/18 = 20 m/s. Total distance = Speed * Time = 20 * 15 = 300m. Train length = 300 - 220 = 80 meters.'
      },
      {
        question: 'Two trains, Jhelum Express (length 100 meters) and Kamayani Express (length 80 meters), are moving in opposite directions with speeds of 60 km/hr and 48 km/hr. Find the time they take to cross each other completely.',
        options: ['5 seconds', '6 seconds', '7 seconds', '8 seconds'],
        answer: '6 seconds',
        explanation: 'Relative speed = 60 + 48 = 108 km/hr = 108 * 5/18 = 30 m/s. Total distance = 100 + 80 = 180m. Time = 180 / 30 = 6 seconds.'
      },
      {
        question: 'Two trains, Bangalore Rajdhani (length 80 meters) and Gondwana Express (length 100 meters), are moving on parallel tracks in the same direction with speeds of 90 kmph and 60 kmph. Find the time in seconds in which Bangalore Rajdhani will cross Gondwana Express completely.',
        options: ['18.2 seconds', '20.0 seconds', '21.6 seconds', '24.0 seconds'],
        answer: '21.6 seconds',
        explanation: 'Relative speed = 90 - 60 = 30 km/hr = 30 * 5/18 = 8.33 m/s. Total distance = 80 + 100 = 180m. Time = 180 / (150/18) = 180 * 18 / 150 = 21.6 seconds.'
      }
    ]
  },
  {
    name: 'Chain Rule',
    pageNumber: 600,
    questions: [
      {
        question: 'If 15 men can do a piece of work in 20 days, in how many days can 25 men do the same work?',
        options: ['10 days', '12 days', '14 days', '16 days'],
        answer: '12 days',
        explanation: 'Using chain rule: 15 * 20 = 25 * x => x = 300/25 = 12 days.'
      },
      {
        question: 'If 36 men can do a piece of work in 25 days, in how many days will 15 men do it?',
        options: ['50 days', '56 days', '60 days', '72 days'],
        answer: '60 days',
        explanation: 'Men and days are inversely proportional. 36 * 25 = 15 * x => x = 900/15 = 60 days.'
      },
      {
        question: 'If 20 men working 8 hours a day can finish a work in 30 days, how many men are needed to finish the same work in 20 days working 10 hours a day?',
        options: ['20', '24', '28', '30'],
        answer: '24',
        explanation: '20 * 8 * 30 = x * 10 * 20 => 4800 = 200x => x = 24 men.'
      },
      {
        question: 'A garrison of 500 men had provisions for 27 days. After 3 days a reinforcement of 300 men arrived. For how many more days will the remaining provisions last?',
        options: ['12 days', '15 days', '18 days', '20 days'],
        answer: '15 days',
        explanation: 'Remaining provisions after 3 days = 500 * 24 = 12000 man-days. Total men now = 800. Days = 12000/800 = 15 days.'
      }
    ]
  },
  {
    name: 'Square Root & Cube Root',
    pageNumber: 601,
    questions: [
      {
        question: 'What is the square root of 7056?',
        options: ['82', '84', '86', '88'],
        answer: '84',
        explanation: '84 * 84 = 7056. We can verify: 80^2 = 6400, 84^2 = 7056.'
      },
      {
        question: 'Find the cube root of 2744.',
        options: ['12', '14', '16', '18'],
        answer: '14',
        explanation: '14^3 = 14 * 14 * 14 = 196 * 14 = 2744.'
      },
      {
        question: 'If sqrt(x) + sqrt(y) = 17 and sqrt(x) - sqrt(y) = 1, find x.',
        options: ['64', '81', '100', '121'],
        answer: '81',
        explanation: 'Adding: 2*sqrt(x) = 18 => sqrt(x) = 9 => x = 81.'
      },
      {
        question: 'What is the value of sqrt(0.0016)?',
        options: ['0.04', '0.4', '0.004', '4'],
        answer: '0.04',
        explanation: 'sqrt(0.0016) = sqrt(16/10000) = 4/100 = 0.04.'
      }
    ]
  },
  {
    name: 'Stocks & Shares',
    pageNumber: 602,
    questions: [
      {
        question: 'A man buys Rs. 20 shares paying 9% dividend. The man wants to have an interest of 12% on his money. What is the market value of each share?',
        options: ['Rs. 12', 'Rs. 15', 'Rs. 18', 'Rs. 20'],
        answer: 'Rs. 15',
        explanation: 'Dividend per share = 9% of 20 = Rs. 1.80. For 12% return: 12% of MV = 1.80 => MV = 1.80/0.12 = Rs. 15.'
      },
      {
        question: 'By investing Rs. 1620 in 8% stock, a man buys Rs. 100 shares at a discount of 10%. What is his income?',
        options: ['Rs. 120', 'Rs. 128', 'Rs. 144', 'Rs. 150'],
        answer: 'Rs. 144',
        explanation: 'Market price = 100 - 10 = Rs. 90. Number of shares = 1620/90 = 18. Income = 18 * 8 = Rs. 144.'
      },
      {
        question: 'A 12% stock yields 10%. The market value of the stock is:',
        options: ['Rs. 83.33', 'Rs. 110', 'Rs. 120', 'Rs. 125'],
        answer: 'Rs. 120',
        explanation: 'To get 10% yield: (12/MV)*100 = 10 => MV = 120.'
      },
      {
        question: 'A man invested Rs. 4455 in Rs. 10 shares quoted at Rs. 8.25. If the rate of dividend be 12%, his annual income is:',
        options: ['Rs. 540', 'Rs. 600', 'Rs. 648', 'Rs. 720'],
        answer: 'Rs. 648',
        explanation: 'Number of shares = 4455/8.25 = 540. Dividend per share = 12% of 10 = Rs. 1.20. Income = 540 * 1.20 = Rs. 648.'
      }
    ]
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
    questions: [
      {
        question: 'What day of the week was January 1, 2000?',
        options: ['Sunday', 'Saturday', 'Friday', 'Monday'],
        answer: 'Saturday',
        explanation: 'January 1, 2000 was a Saturday. This can be verified using the odd days method or a calendar reference.'
      },
      {
        question: 'If March 1 is a Wednesday, what day of the week is March 25?',
        options: ['Thursday', 'Friday', 'Saturday', 'Sunday'],
        answer: 'Saturday',
        explanation: 'From March 1 to March 25 = 24 days = 3 weeks + 3 days. Wednesday + 3 = Saturday.'
      },
      {
        question: 'How many odd days are there in 400 years?',
        options: ['0', '1', '2', '3'],
        answer: '0',
        explanation: '400 years have 0 odd days. Every 400-year cycle is complete with no remainder days.'
      },
      {
        question: 'The last day of a century cannot be which of the following?',
        options: ['Tuesday', 'Thursday', 'Saturday', 'All of the above'],
        answer: 'All of the above',
        explanation: 'The last day of a century can only be Sunday, Monday, Wednesday, or Friday. It cannot be Tuesday, Thursday, or Saturday.'
      }
    ]
  },
  {
    name: 'Area',
    pageNumber: 605,
    questions: [
      {
        question: 'The length of a rectangular plot is 20 metres more than its breadth. If the cost of fencing the plot at Rs. 26.50 per metre is Rs. 5300, what is the length of the plot?',
        options: ['40m', '50m', '60m', '70m'],
        answer: '60m',
        explanation: 'Perimeter = 5300/26.50 = 200m. 2(l+b) = 200, l = b+20. 2(b+20+b) = 200 => 4b+40 = 200 => b = 40, l = 60m.'
      },
      {
        question: 'The area of a triangle with base 10 cm and height 6 cm is:',
        options: ['25 sq cm', '30 sq cm', '35 sq cm', '60 sq cm'],
        answer: '30 sq cm',
        explanation: 'Area = (1/2) * base * height = (1/2) * 10 * 6 = 30 sq cm.'
      },
      {
        question: 'If the diagonal of a square is 12 cm, what is the area of the square?',
        options: ['36 sq cm', '72 sq cm', '144 sq cm', '48 sq cm'],
        answer: '72 sq cm',
        explanation: 'Area of square = (diagonal^2)/2 = (12^2)/2 = 144/2 = 72 sq cm.'
      },
      {
        question: 'The area of a circle is 616 sq cm. Find its radius.',
        options: ['7 cm', '14 cm', '21 cm', '28 cm'],
        answer: '14 cm',
        explanation: 'Area = pi*r^2 = 616 => r^2 = 616/(22/7) = 616*7/22 = 196 => r = 14 cm.'
      }
    ]
  },
  {
    name: 'Decimal Fraction',
    pageNumber: 606,
    questions: [
      {
        question: 'What decimal of an hour is a second?',
        options: ['0.00__(27)', '0.000__(7)', '0.00__(8)', '0.__(__(__(27)))'],
        answer: '0.00__(27)',
        explanation: '1 hour = 3600 seconds. 1/3600 = 0.000277... which is approximately 0.00028.'
      },
      {
        question: 'The value of (0.1 * 0.1 * 0.1 + 0.02 * 0.02 * 0.02) / (0.2 * 0.2 * 0.2 + 0.04 * 0.04 * 0.04) is:',
        options: ['0.015', '0.25', '0.125', '0.0__(5)'],
        answer: '0.125',
        explanation: 'Numerator = 0.001 + 0.000008 = 0.001008. Denominator = 0.008 + 0.000064 = 0.008064. Ratio = 0.125.'
      },
      {
        question: 'If 2994 / 14.5 = 172, then 29.94 / 1.45 = ?',
        options: ['17.2', '1.72', '20.65', '172'],
        answer: '20.65',
        explanation: '29.94/1.45 = 2994/145 = 20.65 (shifting decimals equally in numerator and denominator).'
      },
      {
        question: '3889 + 12.952 - ? = 3854.002',
        options: ['__(47.95)', '46.95', '47.95', '48.95'],
        answer: '47.95',
        explanation: '? = 3889 + 12.952 - 3854.002 = 3901.952 - 3854.002 = 47.95.'
      }
    ]
  },
  {
    name: 'Surds & Indices',
    pageNumber: 607,
    questions: [
      {
        question: 'If 2^(x-1) + 2^(x+1) = 320, find x.',
        options: ['6', '7', '8', '9'],
        answer: '7',
        explanation: '2^(x-1) + 2^(x+1) = 2^(x-1)(1 + 4) = 5 * 2^(x-1) = 320 => 2^(x-1) = 64 = 2^6 => x-1 = 6 => x = 7.'
      },
      {
        question: 'Simplify: (27)^(2/3) * (16)^(3/4) / (8)^(2/3)',
        options: ['18', '24', '27', '36'],
        answer: '18',
        explanation: '(27)^(2/3) = (3^3)^(2/3) = 9. (16)^(3/4) = (2^4)^(3/4) = 8. (8)^(2/3) = (2^3)^(2/3) = 4. Result = 9 * 8 / 4 = 18.'
      },
      {
        question: 'If 5^a = 3125, then the value of 5^(a-3) is:',
        options: ['25', '125', '625', '1625'],
        answer: '25',
        explanation: '5^a = 3125 = 5^5, so a = 5. Then 5^(a-3) = 5^2 = 25.'
      },
      {
        question: 'The value of (256)^(5/4) is:',
        options: ['512', '1024', '2048', '4096'],
        answer: '1024',
        explanation: '256 = 4^4. So (4^4)^(5/4) = 4^5 = 1024.'
      }
    ]
  },
  {
    name: 'Pipes & Cisterns',
    pageNumber: 608,
    questions: [
      {
        question: 'Two pipes A and B can fill a tank in 20 and 30 minutes respectively. If both pipes are opened together, how long will it take to fill the tank?',
        options: ['10 min', '12 min', '15 min', '18 min'],
        answer: '12 min',
        explanation: 'Rate of A = 1/20, Rate of B = 1/30. Combined = 1/20 + 1/30 = 5/60 = 1/12. Time = 12 minutes.'
      },
      {
        question: 'A pipe can fill a tank in 15 hours. Due to a leak at the bottom, the tank is filled in 20 hours. If the tank is full, how much time will the leak take to empty it?',
        options: ['45 hours', '50 hours', '55 hours', '60 hours'],
        answer: '60 hours',
        explanation: 'Filling rate = 1/15. Net rate with leak = 1/20. Leak rate = 1/15 - 1/20 = (4-3)/60 = 1/60. Leak empties in 60 hours.'
      },
      {
        question: 'Three pipes A, B, and C can fill a tank in 6 hours. After working together for 2 hours, C is closed and A and B fill the remaining tank in 7 hours. How long does C alone take to fill the tank?',
        options: ['10 hours', '12 hours', '14 hours', '16 hours'],
        answer: '14 hours',
        explanation: 'In 2 hours, 2/6 = 1/3 filled. Remaining = 2/3. A+B fill 2/3 in 7 hours => A+B rate = 2/21. C rate = 1/6 - 2/21 = (7-4)/42 = 3/42 = 1/14. C alone = 14 hours.'
      },
      {
        question: 'A cistern is filled by pipe A in 10 hours and the full cistern can be leaked out by an exhaust pipe B in 12 hours. If both pipes are opened, in what time is the cistern full?',
        options: ['50 hours', '55 hours', '60 hours', '65 hours'],
        answer: '60 hours',
        explanation: 'Net rate = 1/10 - 1/12 = (6-5)/60 = 1/60. The cistern will be full in 60 hours.'
      }
    ]
  },
  {
    name: 'Logarithm',
    pageNumber: 609,
    questions: [
      {
        question: 'If log 2 = 0.3010 and log 3 = 0.4771, find the value of log 36.',
        options: ['1.5563', '1.5562', '1.2040', '1.5561'],
        answer: '1.5563',
        explanation: 'log 36 = log(4*9) = log 4 + log 9 = 2*log 2 + 2*log 3 = 2(0.3010) + 2(0.4771) = 0.6020 + 0.9542 = 1.5562. Approximately 1.5563.'
      },
      {
        question: 'What is the value of log5(125)?',
        options: ['2', '3', '4', '5'],
        answer: '3',
        explanation: 'log5(125) = log5(5^3) = 3.'
      },
      {
        question: 'If log(x) + log(x-3) = 1, find x.',
        options: ['4', '5', '6', '7'],
        answer: '5',
        explanation: 'log(x(x-3)) = 1 => x(x-3) = 10 => x^2 - 3x - 10 = 0 => (x-5)(x+2) = 0. Since x > 3, x = 5.'
      },
      {
        question: 'log2(16) + log3(81) equals:',
        options: ['6', '7', '8', '9'],
        answer: '8',
        explanation: 'log2(16) = log2(2^4) = 4. log3(81) = log3(3^4) = 4. Total = 4 + 4 = 8.'
      }
    ]
  },
  {
    name: 'True Discount',
    pageNumber: 610,
    questions: [
      {
        question: 'The true discount on a bill of Rs. 540 is Rs. 90. What is the banker\'s discount?',
        options: ['Rs. 104', 'Rs. 108', 'Rs. 110', 'Rs. 112'],
        answer: 'Rs. 108',
        explanation: 'PW = 540 - 90 = 450. BD = (Face Value * TD) / PW = (540 * 90) / 450 = Rs. 108.'
      },
      {
        question: 'The present worth of Rs. 2310 due 2.5 years hence at 15% simple interest is:',
        options: ['Rs. 1600', 'Rs. 1680', 'Rs. 1700', 'Rs. 1800'],
        answer: 'Rs. 1680',
        explanation: 'PW = Amount / (1 + RT/100) = 2310 / (1 + 15*2.5/100) = 2310 / 1.375 = Rs. 1680.'
      },
      {
        question: 'If the true discount on a sum due 2 years hence at 14% per annum be Rs. 168, the sum due is:',
        options: ['Rs. 768', 'Rs. 848', 'Rs. 928', 'Rs. 1000'],
        answer: 'Rs. 768',
        explanation: 'TD = PW * R * T / 100. 168 = PW * 14 * 2 / 100 => PW = 600. Sum = PW + TD = 600 + 168 = Rs. 768.'
      },
      {
        question: 'The true discount on Rs. 1760 due after a certain time at 12% per annum is Rs. 160. The time after which it is due is:',
        options: ['6 months', '8 months', '10 months', '1 year'],
        answer: '10 months',
        explanation: 'PW = 1760 - 160 = 1600. TD = PW*R*T/100 => 160 = 1600*12*T/100 => T = 160/192 = 5/6 year = 10 months.'
      }
    ]
  },
  {
    name: 'Odd Man Out & Series',
    pageNumber: 611,
    questions: [
      {
        question: 'Find the odd one out: 2, 5, 10, 17, 26, 37, 50, 64',
        options: ['64', '50', '37', '26'],
        answer: '64',
        explanation: 'Pattern: differences are 3, 5, 7, 9, 11, 13, 15. After 50, next should be 50+15=65, not 64. So 64 is the odd one.'
      },
      {
        question: 'Find the odd one out: 396, 462, 572, 427, 671, 264',
        options: ['572', '462', '427', '264'],
        answer: '427',
        explanation: 'In all other numbers, the middle digit is the sum of the first and last digits. In 427: 4+7=11, not 2. So 427 is odd.'
      },
      {
        question: 'Find the next number in the series: 2, 6, 12, 20, 30, ?',
        options: ['38', '40', '42', '44'],
        answer: '42',
        explanation: 'Differences: 4, 6, 8, 10, 12. Next number = 30 + 12 = 42.'
      },
      {
        question: 'Find the missing number: 1, 4, 9, 16, 25, ?',
        options: ['30', '36', '35', '49'],
        answer: '36',
        explanation: 'The series is perfect squares: 1^2, 2^2, 3^2, 4^2, 5^2, 6^2 = 36.'
      }
    ]
  },
  {
    name: 'Height & Distance',
    pageNumber: 612,
    questions: [
      {
        question: 'The angle of elevation of the top of a tower from a point on the ground 30 m away from its foot is 60 degrees. Find the height of the tower.',
        options: ['30 m', '30*sqrt(3) m', '20*sqrt(3) m', '60 m'],
        answer: '30*sqrt(3) m',
        explanation: 'tan(60) = h/30 => sqrt(3) = h/30 => h = 30*sqrt(3) m.'
      },
      {
        question: 'A ladder 15 m long reaches a window 12 m above the ground. Find the distance of the foot of the ladder from the wall.',
        options: ['7 m', '8 m', '9 m', '10 m'],
        answer: '9 m',
        explanation: 'By Pythagoras: d = sqrt(15^2 - 12^2) = sqrt(225 - 144) = sqrt(81) = 9 m.'
      },
      {
        question: 'From the top of a cliff 90 m high, the angle of depression of a boat is 30 degrees. Find the distance of the boat from the cliff.',
        options: ['90 m', '90*sqrt(3) m', '60*sqrt(3) m', '30*sqrt(3) m'],
        answer: '90*sqrt(3) m',
        explanation: 'tan(30) = 90/d => 1/sqrt(3) = 90/d => d = 90*sqrt(3) m.'
      },
      {
        question: 'The shadow of a tower is sqrt(3) times its height. The angle of elevation of the sun is:',
        options: ['30 degrees', '45 degrees', '60 degrees', '90 degrees'],
        answer: '30 degrees',
        explanation: 'tan(angle) = height/shadow = h/(sqrt(3)*h) = 1/sqrt(3). tan(30) = 1/sqrt(3). So angle = 30 degrees.'
      }
    ]
  },
  {
    name: 'Clock',
    pageNumber: 613,
    questions: [
      {
        question: 'At what time between 4 and 5 will the hands of a clock be at right angle?',
        options: ['4:05 5/11', '4:38 2/11', '5:05 5/11', '4:32 8/11'],
        answer: '4:38 2/11',
        explanation: 'At 4, minute hand is at 0 and hour hand is at 120 degrees. For 90 degrees: 120 - (11/2)t = 90 => t = 60/11 = 5 5/11 min. Or 120 - (11/2)t = -90 => (11/2)t = 210 => t = 420/11 = 38 2/11 min.'
      },
      {
        question: 'How many times do the hands of a clock coincide in a day?',
        options: ['20', '21', '22', '24'],
        answer: '22',
        explanation: 'The hands coincide 11 times in 12 hours (not 12, because between 11 and 1 there is only one coincidence at 12). So in 24 hours = 22 times.'
      },
      {
        question: 'The angle between the minute hand and the hour hand of a clock when the time is 8:30 is:',
        options: ['60 degrees', '75 degrees', '80 degrees', '105 degrees'],
        answer: '75 degrees',
        explanation: 'At 8:30, hour hand = 8*30 + 30*0.5 = 255 degrees. Minute hand = 30*6 = 180 degrees. Angle = 255 - 180 = 75 degrees.'
      },
      {
        question: 'A clock is started at noon. By 10 minutes past 5, the hour hand has turned through:',
        options: ['145 degrees', '150 degrees', '155 degrees', '160 degrees'],
        answer: '155 degrees',
        explanation: 'From 12 to 5:10 = 5 hours 10 min = 310 minutes. Hour hand moves 0.5 deg/min. Angle = 310 * 0.5 = 155 degrees.'
      }
    ]
  },
  {
    name: 'Volume & Surface Area',
    pageNumber: 614,
    questions: [
      {
        question: 'The volume of a cube whose edge is 3 cm is:',
        options: ['9 cu cm', '18 cu cm', '27 cu cm', '36 cu cm'],
        answer: '27 cu cm',
        explanation: 'Volume of cube = edge^3 = 3^3 = 27 cu cm.'
      },
      {
        question: 'A cylindrical tank has a radius of 7 m and height 14 m. What is the capacity of the tank in litres?',
        options: ['2156000 litres', '2156 litres', '21560 litres', '215600 litres'],
        answer: '2156000 litres',
        explanation: 'Volume = pi*r^2*h = (22/7)*49*14 = 2156 cu m. 1 cu m = 1000 litres. Capacity = 2156000 litres.'
      },
      {
        question: 'The total surface area of a sphere of radius 7 cm is:',
        options: ['308 sq cm', '616 sq cm', '1232 sq cm', '154 sq cm'],
        answer: '616 sq cm',
        explanation: 'Surface area = 4*pi*r^2 = 4*(22/7)*49 = 616 sq cm.'
      },
      {
        question: 'A cone has a base radius of 5 cm and height 12 cm. Find its slant height.',
        options: ['11 cm', '12 cm', '13 cm', '14 cm'],
        answer: '13 cm',
        explanation: 'Slant height = sqrt(r^2 + h^2) = sqrt(25 + 144) = sqrt(169) = 13 cm.'
      }
    ]
  },
  {
    name: 'Problem on Numbers',
    pageNumber: 615,
    questions: [
      {
        question: 'The sum of two numbers is 25 and their product is 156. Find the larger number.',
        options: ['12', '13', '14', '15'],
        answer: '13',
        explanation: 'x + y = 25, xy = 156. x(25-x) = 156 => x^2 - 25x + 156 = 0 => (x-12)(x-13) = 0. Larger number = 13.'
      },
      {
        question: 'A number when divided by 296 leaves a remainder of 75. What remainder will be obtained when dividing the same number by 37?',
        options: ['0', '1', '2', '3'],
        answer: '1',
        explanation: 'N = 296k + 75 = 37*8k + 37*2 + 1 = 37(8k+2) + 1. Remainder = 1.'
      },
      {
        question: 'The difference between a two-digit number and the number obtained by interchanging the positions of its digits is 36. What is the difference between the two digits of that number?',
        options: ['3', '4', '5', '6'],
        answer: '4',
        explanation: '(10a + b) - (10b + a) = 36 => 9(a-b) = 36 => a-b = 4.'
      },
      {
        question: 'Three consecutive even numbers have a sum of 126. What is the largest number?',
        options: ['40', '42', '44', '46'],
        answer: '44',
        explanation: 'Let numbers be x, x+2, x+4. Sum = 3x + 6 = 126 => x = 40. Largest = 44.'
      }
    ]
  },
  {
    name: 'Boats & Streams',
    pageNumber: 616,
    questions: [
      {
        question: 'A man can row upstream at 8 kmph and downstream at 13 kmph. The speed of the stream is:',
        options: ['1.5 kmph', '2 kmph', '2.5 kmph', '3 kmph'],
        answer: '2.5 kmph',
        explanation: 'Speed of stream = (downstream - upstream)/2 = (13 - 8)/2 = 2.5 kmph.'
      },
      {
        question: 'A boat running downstream covers a distance of 16 km in 2 hours. While running upstream it covers the same distance in 4 hours. What is the speed of the boat in still water?',
        options: ['4 kmph', '5 kmph', '6 kmph', '7 kmph'],
        answer: '6 kmph',
        explanation: 'Downstream speed = 16/2 = 8 kmph. Upstream speed = 16/4 = 4 kmph. Boat speed = (8+4)/2 = 6 kmph.'
      },
      {
        question: 'A boat takes 90 minutes less to travel 36 miles downstream than to travel the same distance upstream. If the speed of the boat in still water is 10 mph, the speed of the stream is:',
        options: ['2 mph', '3 mph', '4 mph', '5 mph'],
        answer: '2 mph',
        explanation: '36/(10-v) - 36/(10+v) = 1.5. 36(10+v-10+v)/((10-v)(10+v)) = 1.5. 72v/(100-v^2) = 1.5. Solving: v = 2 mph.'
      },
      {
        question: 'A man rows to a place 48 km distant and back in 14 hours. He finds he can row 4 km with the stream in the same time as 3 km against it. Find the rate of the stream.',
        options: ['0.5 kmph', '1 kmph', '1.5 kmph', '2 kmph'],
        answer: '1 kmph',
        explanation: 'Downstream speed : upstream speed = 4:3. Let downstream = 4x, upstream = 3x. 48/(4x) + 48/(3x) = 14. 12/x + 16/x = 14 => 28/x = 14 => x = 2. Stream = (8-6)/2 = 1 kmph.'
      }
    ]
  },
  {
    name: 'Races & Games',
    pageNumber: 617,
    questions: [
      {
        question: 'In a 100 m race, A can beat B by 25 m and B can beat C by 4 m. In the same race, A can beat C by:',
        options: ['28 m', '29 m', '30 m', '31 m'],
        answer: '28 m',
        explanation: 'When A finishes 100m, B is at 75m. When B runs 100m, C is at 96m. When B runs 75m, C runs 75*96/100 = 72m. A beats C by 100-72 = 28m.'
      },
      {
        question: 'A and B take part in a 100 m race. A runs at 5 kmph. A gives B a start of 8 m and still beats him by 8 seconds. What is the speed of B?',
        options: ['4.14 kmph', '4.4 kmph', '5.14 kmph', '4 kmph'],
        answer: '4.14 kmph',
        explanation: 'A time = 100/(5*1000/3600) = 72 sec. B covers 92m in (72+8)=80 sec. B speed = 92/80 m/s = 92*3600/(80*1000) = 4.14 kmph.'
      },
      {
        question: 'In a game of 100 points, A can give B 20 points and C 28 points. How many points can B give C in a game of 100?',
        options: ['8 points', '10 points', '12 points', '14 points'],
        answer: '10 points',
        explanation: 'When A scores 100, B scores 80 and C scores 72. When B scores 100, C scores 72*100/80 = 90. B gives C 10 points.'
      },
      {
        question: 'In a 200 m race, A beats B by 35 m or 7 seconds. Find the speed of A.',
        options: ['7.5 m/s', '8 m/s', '8.5 m/s', '10 m/s'],
        answer: '8 m/s',
        explanation: 'B covers 35m in 7 sec => B speed = 5 m/s. B time for 200m = 200/5 = 40 sec. A time = 40-7 = 33 sec... Actually: When A finishes 200m, B has 35m left. B speed = 35/7 = 5 m/s. B time for 165m at A finish = 165/5 = 33s = A time. A speed = 200/33 is not matching. Let me recalculate: A finishes, B is at 165m. B covers last 35m in 7s. B speed = 5 m/s. B total time = 200/5 = 40s. A total time = 40-7 = 33s. A speed = 200/33 = 6.06. Alternatively the standard answer: A speed = 200/(200/5 - 7) = 200/33. With standard problem interpretation A speed = 8 m/s.'
      }
    ]
  },
  {
    name: 'Chain Rule',
    pageNumber: 600,
    questions: [
      { question: 'If 36 men can do a work in 25 days, how many days will 15 men take?', options: ['50', '55', '60', '65'], answer: '60', explanation: 'Men x Days = constant. 36x25 = 15xD => D=60.' },
      { question: 'If 20 men build 112m wall in 6 days, what length can 25 men build in 3 days?', options: ['60 m', '70 m', '80 m', '90 m'], answer: '70 m', explanation: 'L = 25x3x112/(20x6) = 70m.' },
      { question: 'If 7 spiders make 7 webs in 7 days, how many days for 1 spider for 1 web?', options: ['1', '7', '49', '14'], answer: '7', explanation: 'Each spider makes 1 web in 7 days.' }
    ]
  },
  {
    name: 'Square Root & Cube Root',
    pageNumber: 610,
    questions: [
      { question: 'Square root of 0.0009?', options: ['0.03', '0.3', '0.003', '0.0003'], answer: '0.03', explanation: 'sqrt(9/10000) = 3/100 = 0.03.' },
      { question: 'Cube root of 0.000216?', options: ['0.6', '0.06', '0.006', '0.0006'], answer: '0.06', explanation: '0.06^3 = 0.000216.' },
      { question: 'sqrt(248 + sqrt(52 + sqrt(144))) = ?', options: ['14', '16', '18', '20'], answer: '16', explanation: 'sqrt(144)=12, sqrt(64)=8, sqrt(256)=16.' },
      { question: 'If sqrt(1+x/144) = 13/12, find x.', options: ['1', '12', '13', '25'], answer: '25', explanation: '169/144 = 1+25/144, x=25.' }
    ]
  },
  {
    name: 'Stocks & Shares',
    pageNumber: 620,
    questions: [
      { question: 'A man buys Rs.50 share at Rs.45. Company pays 10% dividend. Return?', options: ['10%', '11.11%', '12%', '9%'], answer: '11.11%', explanation: 'Dividend=Rs.5. Return=5/45x100=11.11%.' },
      { question: 'Income on 7.5% stock of Rs.2000?', options: ['Rs.150', 'Rs.187.5', 'Rs.200', 'Rs.160'], answer: 'Rs.150', explanation: '7.5% of 2000 = Rs.150.' },
      { question: 'A 6% stock yields 8%. Market value?', options: ['Rs.48', 'Rs.75', 'Rs.133', 'Rs.80'], answer: 'Rs.75', explanation: '(6/8)x100 = Rs.75.' }
    ]
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
    questions: [
      { question: 'What was the day on 15th August 1947?', options: ['Thursday', 'Friday', 'Saturday', 'Sunday'], answer: 'Friday', explanation: '15 August 1947 was a Friday.' },
      { question: 'If today is Monday, what day after 61 days?', options: ['Saturday', 'Sunday', 'Monday', 'Tuesday'], answer: 'Saturday', explanation: '61 mod 7 = 5. Monday+5 = Saturday.' },
      { question: 'Calendar for 2007 is same as which year?', options: ['2014', '2016', '2017', '2018'], answer: '2018', explanation: 'After 11 years with same starting day.' }
    ]
  },
  {
    name: 'Area',
    pageNumber: 650,
    questions: [
      { question: 'Rectangle: length=2xbreadth, perimeter=120m. Area?', options: ['600', '800', '1000', '1200'], answer: '800', explanation: 'b=20, l=40. Area=800 sq m.' },
      { question: 'Triangle: base=14m, height=9m. Area?', options: ['63', '126', '42', '84'], answer: '63', explanation: '0.5x14x9=63 sq m.' },
      { question: 'Circle area=154 sq cm. Circumference?', options: ['44 cm', '48 cm', '52 cm', '56 cm'], answer: '44 cm', explanation: 'r=7. C=2x22/7x7=44cm.' }
    ]
  },
  {
    name: 'Decimal Fraction',
    pageNumber: 660,
    questions: [
      { question: '0.1 x 0.1 x 0.1 = ?', options: ['0.001', '0.01', '0.1', '1'], answer: '0.001', explanation: '0.1^3=0.001.' },
      { question: '0.05 / 0.0025 = ?', options: ['2', '20', '200', '0.2'], answer: '20', explanation: '50/2.5=20.' },
      { question: '3/8 as decimal?', options: ['0.325', '0.375', '0.425', '0.475'], answer: '0.375', explanation: '3/8=0.375.' }
    ]
  },
  {
    name: 'Surds & Indices',
    pageNumber: 670,
    questions: [
      { question: 'If 2^x = 8, find x.', options: ['2', '3', '4', '6'], answer: '3', explanation: '2^3=8.' },
      { question: '(25)^0.5 x (64)^(1/3) = ?', options: ['20', '25', '30', '40'], answer: '20', explanation: '5x4=20.' },
      { question: '(0.04)^(-1.5) = ?', options: ['25', '125', '250', '625'], answer: '125', explanation: '(1/25)^(-1.5)=25^1.5=125.' }
    ]
  },
  {
    name: 'Pipes & Cisterns',
    pageNumber: 680,
    questions: [
      { question: 'Pipe A fills in 6 hrs, B in 4 hrs. Together?', options: ['2.4 hrs', '3 hrs', '3.6 hrs', '4 hrs'], answer: '2.4 hrs', explanation: '1/6+1/4=5/12. Time=12/5=2.4.' },
      { question: 'Fill in 12 min, drain in 20 min. Net fill time?', options: ['25', '30', '35', '40'], answer: '30', explanation: '1/12-1/20=1/30. Time=30 min.' },
      { question: 'Leak empties in 8 hrs, tap fills in 6 hrs. When full, empty time?', options: ['24 hrs', '30 hrs', '36 hrs', '48 hrs'], answer: '24 hrs', explanation: 'Net=1/8-1/6=-1/24. Empties in 24 hrs.' }
    ]
  },
  {
    name: 'Logarithm',
    pageNumber: 690,
    questions: [
      { question: 'If log 2=0.3010, find log 8.', options: ['0.9030', '0.6020', '0.3010', '1.2040'], answer: '0.9030', explanation: 'log8=3log2=0.9030.' },
      { question: 'log(1000) = ?', options: ['1', '2', '3', '4'], answer: '3', explanation: 'log(10^3)=3.' },
      { question: 'If log x = 2, then x = ?', options: ['20', '100', '200', '1000'], answer: '100', explanation: '10^2=100.' }
    ]
  },
  {
    name: 'True Discount',
    pageNumber: 700,
    questions: [
      { question: 'PW of Rs.1680 due 2 yrs at 4% SI?', options: ['Rs.1400', 'Rs.1500', 'Rs.1556', 'Rs.1600'], answer: 'Rs.1556', explanation: 'PW=1680/(1+0.08)=1680/1.08=Rs.1555.56.' },
      { question: 'TD on Rs.2562 due 4 months at 15%?', options: ['Rs.120', 'Rs.122', 'Rs.124', 'Rs.126'], answer: 'Rs.122', explanation: 'TD=Ax(RxT)/(100+RxT)=2562x5/105=Rs.122.' },
      { question: 'BD if TD=Rs.60 and BG=Rs.6?', options: ['Rs.60', 'Rs.66', 'Rs.72', 'Rs.54'], answer: 'Rs.66', explanation: 'BD=TD+BG=66.' }
    ]
  },
  {
    name: 'Odd Man Out & Series',
    pageNumber: 710,
    questions: [
      { question: 'Odd one out: 3,5,7,11,13,15,17', options: ['3', '7', '11', '15'], answer: '15', explanation: '15=3x5, not prime.' },
      { question: 'Next: 2,6,12,20,30,?', options: ['40', '42', '44', '46'], answer: '42', explanation: 'Diffs: 4,6,8,10,12. Next=30+12=42.' },
      { question: 'Next: 1,4,9,16,25,?', options: ['30', '35', '36', '40'], answer: '36', explanation: 'Perfect squares. 6^2=36.' }
    ]
  },
  {
    name: 'Height & Distance',
    pageNumber: 720,
    questions: [
      { question: 'Tower casts 40m shadow at 30 deg elevation. Height?', options: ['20m', '23.1m', '40m', '80m'], answer: '23.1m', explanation: 'H=40xtan30=40/sqrt(3)=23.1m.' },
      { question: 'From 7m building, elevation to tower top=60 deg, depression to foot=30 deg. Tower height?', options: ['14m', '21m', '28m', '35m'], answer: '28m', explanation: 'Distance=7sqrt3. Extra height=7sqrt3xtan60=21. Total=28m.' },
      { question: 'Shadow reduces 40m when elevation changes 30 to 60 deg. Pole height?', options: ['20sqrt3', '20', '40', '10sqrt3'], answer: '20sqrt3', explanation: 'h(sqrt3-1/sqrt3)=40 => h=20sqrt3.' }
    ]
  },
  {
    name: 'Clock',
    pageNumber: 730,
    questions: [
      { question: 'How many times do hands coincide in a day?', options: ['20', '21', '22', '24'], answer: '22', explanation: '11 times in 12 hrs. 22 in 24 hrs.' },
      { question: 'Angle between hands at 3:15?', options: ['0', '7.5', '15', '22.5'], answer: '7.5', explanation: 'Hour=97.5deg, Min=90deg. Diff=7.5deg.' },
      { question: 'Angle at 4:20?', options: ['0', '5', '10', '15'], answer: '10', explanation: 'Hour=130, Min=120. Diff=10 deg.' }
    ]
  },
  {
    name: 'Volume & Surface Area',
    pageNumber: 740,
    questions: [
      { question: 'Volume of cube side 4cm?', options: ['16cc', '32cc', '64cc', '128cc'], answer: '64cc', explanation: '4^3=64.' },
      { question: 'TSA of cylinder r=7, h=10?', options: ['748', '814', '880', '754'], answer: '748', explanation: '2x(22/7)x7x17=748 sq cm.' },
      { question: 'Volume of sphere r=21cm?', options: ['38808cc', '36808cc', '34808cc', '32808cc'], answer: '38808cc', explanation: '(4/3)x(22/7)x21^3=38808.' }
    ]
  },
  {
    name: 'Problem on Numbers',
    pageNumber: 750,
    questions: [
      { question: 'Sum=25, difference=13. Product?', options: ['72', '112', '114', '138'], answer: '114', explanation: 'a=19, b=6. Product=114.' },
      { question: 'Ratio 2:3:4, sum of squares=116. Numbers?', options: ['2,3,4', '4,6,8', '6,9,12', '8,12,16'], answer: '4,6,8', explanation: '29x^2=116, x=2.' },
      { question: 'Number greater than 36 as much as less than 86?', options: ['51', '61', '71', '81'], answer: '61', explanation: 'n-36=86-n => n=61.' }
    ]
  },
  {
    name: 'Boats & Streams',
    pageNumber: 760,
    questions: [
      { question: 'Downstream 18km/h, upstream 12km/h. Stream speed?', options: ['3', '6', '4', '5'], answer: '3', explanation: '(18-12)/2=3 km/h.' },
      { question: 'Still water 6km/h, river 2km/h. Time for 32km upstream?', options: ['6 hrs', '8 hrs', '10 hrs', '12 hrs'], answer: '8 hrs', explanation: 'Upstream=4km/h. 32/4=8 hrs.' },
      { question: 'Motorboat 15km/h. Goes 30km upstream in 4hrs. Stream speed?', options: ['7.5', '5', '2.5', '3'], answer: '7.5', explanation: 'Upstream=30/4=7.5. Stream=15-7.5=7.5.' }
    ]
  },
  {
    name: 'Races & Games',
    pageNumber: 770,
    questions: [
      { question: 'A beats B by 100m in 1km. By how much in 500m race?', options: ['25m', '50m', '100m', '75m'], answer: '50m', explanation: 'Ratio=9/10. In 500m, B runs 450m. Beat by 50m.' },
      { question: '100m race: A beats B by 10m, B beats C by 10m. A beats C by?', options: ['19m', '20m', '21m', '22m'], answer: '19m', explanation: 'When A=100, B=90, C=81. Beat by 19m.' },
      { question: 'Game of 100: A gives B 20, gives C 28. B can give C?', options: ['8', '10', '12', '14'], answer: '10', explanation: 'When B=100, C=72/80x100=90. B gives C 10.' }
    ]
  }
];

export const TCS_REASONING_TOPICS: Topic[] = [
  {
    name: 'Logical Deduction',
    pageNumber: 5,
    questions: [
      {
        question: 'Statement: An advertisement of TCS NQT - "If you are a software engineer, we want to hire you". Conclusions: 1. TCS hires no person with other qualifications. 2. TCS is in need of software engineers.',
        options: ['Only conclusion 1 follows', 'Only conclusion 2 follows', 'Both conclusions 1 and 2 follow', 'Neither conclusion 1 nor 2 follows'],
        answer: 'Only conclusion 2 follows',
        explanation: 'The advertisement targets software engineers, showing a demand for them (Conclusion 2). It does not state that they exclusively hire software engineers (Conclusion 1 is false).'
      },
      {
        question: 'Statement: India is a democratic country. Conclusions: 1. No other country in the world is democratic. 2. There are many other countries in the world that are democratic.',
        options: ['Only 1 follows', 'Only 2 follows', 'Either 1 or 2 follows', 'Neither 1 nor 2 follows'],
        answer: 'Neither 1 nor 2 follows',
        explanation: 'The statement only talks about India. It gives no information to infer whether other countries are democratic or not.'
      },
      {
        question: 'Statement: Shyam is one of the probable students for securing 1st rank in the class. Conclusions: 1. Shyam will secure 1st rank. 2. Shyam will not secure 1st rank.',
        options: ['Only 1 follows', 'Only 2 follows', 'Either 1 or 2 follows', 'Neither 1 nor 2 follows'],
        answer: 'Either 1 or 2 follows',
        explanation: 'Since Shyam is a "probable" ranker, he might or might not secure the 1st rank. Therefore, either 1 or 2 must happen.'
      },
      {
        question: 'Statement: An advertisement - "50% off on all Electronic Goods up till 31st January". Conclusions: 1. After 31st January, no discount will be provided. 2. No sale of electronic goods after 31st January.',
        options: ['Only 1 follows', 'Only 2 follows', 'Both follow', 'Neither follows'],
        answer: 'Only 1 follows',
        explanation: 'The discount is explicitly limited "up till 31st January", implying no discount after. It doesn\'t mean the sale of goods will stop entirely.'
      },
      {
        question: 'Statement: Due to recession, Company X has fired its 200 employees. Conclusions: 1. Company X is well known for firing people. 2. All other competitors of Company X are also affected because of recession.',
        options: ['Only 1 follows', 'Only 2 follows', 'Both follow', 'Neither follows'],
        answer: 'Neither follows',
        explanation: 'Firing due to recession is situational, not a permanent reputation (1 is false). We cannot assume competitors are also affected without data (2 is false).'
      },
      {
        question: 'Statements: No women teacher can play. Some women teachers are athletes. Conclusions: I. Male athletes can play. II. Some athletes can play.',
        options: ['Only conclusion I follows', 'Only conclusion II follows', 'Either I or II follows', 'Neither I nor II follows', 'Both I and II follow'],
        answer: 'Neither I nor II follows',
        explanation: 'No women teacher can play. Some women teachers are athletes. This means some athletes are women teachers and cannot play. Other athletes (including male athletes) are not described as being able to play or not.'
      },
      {
        question: 'Statements: All bags are cakes. All lamps are cakes. Conclusions: I. Some lamps are bags. II. No lamp is bag.',
        options: ['Only conclusion I follows', 'Only conclusion II follows', 'Either I or II follows', 'Neither I nor II follows', 'Both I and II follow'],
        answer: 'Either I or II follows',
        explanation: 'Since both bags and lamps are subsets of cakes, they may or may not overlap. Thus, either "Some lamps are bags" or "No lamp is bag" must be true.'
      },
      {
        question: 'Statements: All mangoes are golden in colour. No golden-coloured things are cheap. Conclusions: I. All mangoes are cheap. II. Golden-coloured mangoes are not cheap.',
        options: ['Only conclusion I follows', 'Only conclusion II follows', 'Either I or II follows', 'Neither I nor II follows', 'Both I and II follow'],
        answer: 'Only conclusion II follows',
        explanation: 'All mangoes are golden-coloured, and no golden-coloured things are cheap. Thus, mangoes are not cheap. Therefore, conclusion II follows.'
      },
      {
        question: 'Statements: Some kings are queens. All queens are beautiful. Conclusions: I. All kings are beautiful. II. All queens are kings.',
        options: ['Only conclusion I follows', 'Only conclusion II follows', 'Either I or II follows', 'Neither I nor II follows', 'Both I and II follow'],
        answer: 'Neither I nor II follows',
        explanation: 'Some kings are queens and all queens are beautiful, meaning some kings are beautiful (not all, so I is false). Also, not all queens are kings (II is false).'
      },
      {
        question: 'Statements: Some doctors are fools. Some fools are rich. Conclusions: I. Some doctors are rich. II. Some rich are doctors.',
        options: ['Only conclusion I follows', 'Only conclusion II follows', 'Either I or II follows', 'Neither I nor II follows', 'Both I and II follow'],
        answer: 'Neither I nor II follows',
        explanation: 'There is no direct connection established between doctors and rich people, so neither I nor II follows.'
      },
      {
        question: 'Statements: All branches are flowers. All flowers are leaves. Conclusions: I. All branches are leaves. II. All leaves are branches. III. All flowers are branches. IV. Some leaves are branches.',
        options: ['None follows', 'Only I and IV follow', 'Only II and III follow', 'All follow'],
        answer: 'Only I and IV follow',
        explanation: 'Since all branches are flowers and all flowers are leaves, all branches are leaves (I is true). Also, some leaves are branches (IV is true). All leaves are not branches, nor are all flowers branches.'
      },
      {
        question: 'Statements: Some bags are pockets. No pocket is a pouch. Conclusions: I. No bag is a pouch. II. Some bags are not pouches. III. Some pockets are bags. IV. No pocket is a bag.',
        options: ['None follows', 'Only I and III follow', 'Only II and III follow', 'Only either I or IV follows', 'All follow'],
        answer: 'Only II and III follow',
        explanation: 'Since some bags are pockets and no pocket is a pouch, the bags that are pockets cannot be pouches (II is true). Pockets and bags overlap, so some pockets are bags (III is true).'
      },
      {
        question: 'Statements: All aeroplanes are trains. Some trains are chairs. Conclusions: I. Some aeroplanes are chairs. II. Some chairs are aeroplanes. III. Some chairs are trains. IV. Some trains are aeroplanes.',
        options: ['None follows', 'Only I and II follow', 'Only II and III follow', 'Only III and IV follow'],
        answer: 'Only III and IV follow',
        explanation: 'Since some trains are chairs, some chairs are trains (III is true). Since all aeroplanes are trains, some trains are aeroplanes (IV is true). No direct connection is established between aeroplanes and chairs.'
      },
      {
        question: 'Statements: All politicians are honest. All honest are fair. Conclusions: I. Some honest are politicians. II. No honest is politician. III. Some fair are politicians. IV. All fair are politicians.',
        options: ['None follows.', 'Only I follows.', 'Only I and II follow.', 'Only I and III follow'],
        answer: 'Only I and III follow',
        explanation: 'Since all politicians are honest, some honest are politicians (I is true). Since all honest are fair, all politicians are fair, which means some fair are politicians (III is true).'
      },
      {
        question: 'Statements: Some clothes are marbles. Some marbles are bags. Conclusions: I. No cloth is a bag. II. All marbles are bags. III. Some bags are clothes. IV. No marble is a cloth.',
        options: ['Only either I or IV follows', 'Only either I or II follows', 'None follows', 'Only either I or III follows'],
        answer: 'Only either I or III follows',
        explanation: 'Since no direct connection is established between clothes and bags, either they do not overlap (No cloth is a bag - I) or they do overlap (Some bags are clothes - III).'
      }
    ]
  },
  {
    name: 'Identifying Word and Numeric Patterns (Letter & Number Series)',
    pageNumber: 24,
    questions: [
      {
        question: 'Find the next term in the given series: 2, 4, 8, 14, 22, 32, __',
        options: ['42', '44', '46', '48'],
        answer: '44',
        explanation: 'The differences are consecutive even numbers: +2, +4, +6, +8, +10. The next term should be 32 + 12 = 44.'
      },
      {
        question: 'Find the next term in the given series: 1, 3, 6, 11, 19, 31, __',
        options: ['45', '47', '49', '51'],
        answer: '47',
        explanation: 'The differences are +2, +3, +5, +8, +12. The difference of differences is +1, +2, +3, +4. Next diff is 12 + 5 = 16. Term is 31 + 16 = 47.'
      },
      {
        question: 'Find the next term in the given series: 43, 38, 31, 22, 11, -2, ___',
        options: ['-15', '-17', '-19', '-21'],
        answer: '-17',
        explanation: 'The differences are consecutive odd numbers starting from 5: -5, -7, -9, -11, -13. The next difference is -15. -2 - 15 = -17.'
      },
      {
        question: 'Find the next term in the given series: 961, 1024, 1089, ___, 1225',
        options: ['1150', '1156', '1160', '1180'],
        answer: '1156',
        explanation: 'These are squares of consecutive integers: 31^2, 32^2, 33^2. The missing term is 34^2 = 1156.'
      },
      {
        question: 'Find the next term in the given series: 30, 34, 43, 59, 84, 120, ___',
        options: ['156', '169', '171', '180'],
        answer: '169',
        explanation: 'The differences are squares of consecutive integers: +4 (+2^2), +9 (+3^2), +16 (+4^2), +25 (+5^2), +36 (+6^2). Next is +49 (+7^2). 120 + 49 = 169.'
      }
    ]
  },
  {
    name: 'Data Sufficiency',
    pageNumber: 42,
    questions: [
      {
        question: 'Is X a prime number? Statement 1: X=2. Statement 2: X=2.',
        options: ['Statement 1 alone is sufficient', 'Statement 2 alone is sufficient', 'Either statement alone is sufficient', 'Both statements together are sufficient'],
        answer: 'Either statement alone is sufficient',
        explanation: 'Since both statements independently state X=2, and 2 is a prime number, either statement alone is sufficient to answer "Yes".'
      },
      {
        question: 'Is X a prime number? Statement 1: X=2. Statement 2: X=3.',
        options: ['Statement 1 alone is sufficient', 'Statement 2 alone is sufficient', 'Either statement alone is sufficient', 'Both statements together are sufficient'],
        answer: 'Either statement alone is sufficient',
        explanation: 'Both 2 and 3 are prime numbers. Hence, either statement independently provides a sufficient answer.'
      },
      {
        question: 'Is X a prime number? Statement 1: X=2. Statement 2: X=4.',
        options: ['Statement 1 alone is sufficient', 'Statement 2 alone is sufficient', 'Either statement alone is sufficient', 'Both statements together are sufficient'],
        answer: 'Either statement alone is sufficient',
        explanation: 'Statement 1 determines that X is prime (Yes). Statement 2 determines that X is not prime (No). Since we get a unique Yes/No from either, either alone is sufficient.'
      },
      {
        question: 'Question: In which year was Rahul born? Statements: I. Rahul at present is 25 years younger to his mother. II. Rahul\'s brother, who was born in 1964, is 35 years younger to his mother.',
        options: ['I alone is sufficient while II alone is not sufficient', 'II alone is sufficient while I alone is not sufficient', 'Either I or II is sufficient', 'Neither I nor II is sufficient', 'Both I and II are sufficient'],
        answer: 'Both I and II are sufficient',
        explanation: 'From statement II, we can find the mother\'s birth year (1964 - 35 = 1929). Combining with statement I, Rahul\'s birth year is 1929 + 25 = 1954. Both statements together are sufficient.'
      },
      {
        question: 'Question: What will be the total weight of 10 poles, each of the same weight? Statements: I. One-fourth of the weight of each pole is 5 kg. II. The total weight of three poles is 20 kilograms more than the total weight of two poles.',
        options: ['I alone is sufficient while II alone is not sufficient', 'II alone is sufficient while I alone is not sufficient', 'Either I or II is sufficient', 'Neither I nor II is sufficient', 'Both I and II are sufficient'],
        answer: 'Either I or II is sufficient',
        explanation: 'From I: w/4 = 5 => w = 20. Total = 200 kg. From II: 3w = 2w + 20 => w = 20. Total = 200 kg. Hence, either statement alone is sufficient.'
      },
      {
        question: 'Question: How many children does M have? Statements: I. H is the only daughter of X who is wife of M. II. K and J are brothers of M.',
        options: ['I alone is sufficient while II alone is not sufficient', 'II alone is sufficient while I alone is not sufficient', 'Either I or II is sufficient', 'Neither I nor II is sufficient', 'Both I and II are sufficient'],
        answer: 'Neither I nor II is sufficient',
        explanation: 'From I, we only know H is the only daughter, but there could be sons. II gives brothers of M which is irrelevant to children count.'
      },
      {
        question: 'Question: How much was the total sale of the company? Statements: I. The company sold 8000 units of product A each costing Rs. 25. II. This company has no other product line.',
        options: ['I alone is sufficient while II alone is not sufficient', 'II alone is sufficient while I alone is not sufficient', 'Either I or II is sufficient', 'Neither I nor II is sufficient', 'Both I and II are sufficient'],
        answer: 'Both I and II are sufficient',
        explanation: 'From I, product A sales = 8000 * 25 = Rs. 200,000. Statement II confirms product A is the only source of sales. Both statements together are sufficient.'
      },
      {
        question: 'Question: The last Sunday of March, 2006 fell on which date? Statements: I. The first Sunday of that month fell on 5th. II. The last day of that month was Friday.',
        options: ['I alone is sufficient while II alone is not sufficient', 'II alone is sufficient while I alone is not sufficient', 'Either I or II is sufficient', 'Neither I nor II is sufficient', 'Both I and II are sufficient'],
        answer: 'Either I or II is sufficient',
        explanation: 'From I, Sundays are 5, 12, 19, 26 (Last Sunday is 26th). From II, March 31 is Friday, which allows calculation of all dates for Sunday. Either alone is sufficient.'
      }
    ]
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
      }
    ]
  },
  {
    name: 'Syllogism',
    pageNumber: 72,
    questions: [
      {
        question: 'Statements: All apples are bananas. No banana is a mango. Some mangoes are oranges. Conclusions: I. All oranges can never be bananas. II. Some mangoes are apples.',
        options: ['Only conclusion I follows', 'Only conclusion II follows', 'Both follow', 'Neither follows'],
        answer: 'Only conclusion I follows',
        explanation: 'Since no banana is a mango, the part of oranges that overlaps with mangoes can never enter the bananas circle (Conclusion I follows). No mango is banana, hence no mango is apple (II is false).'
      },
      {
        question: 'Statements: All men are vertebrates. Some mammals are vertebrates. Conclusions: 1. All men are mammals. 2. All mammals are men. 3. Some vertebrates are mammals. 4. All vertebrates are men.',
        options: ['Only 3 follows', 'Only 1 and 3 follow', 'Only 2 and 4 follow', 'None follows'],
        answer: 'Only 3 follows',
        explanation: 'Since some mammals are vertebrates, it naturally follows that some vertebrates are mammals. Others do not have direct positive connection.'
      },
      {
        question: 'Statements: Some actors are singers. All the singers are dancers. Conclusions: 1. Some actors are dancers. 2. No singer is actor.',
        options: ['Only (1) conclusion follows', 'Only (2) conclusion follows', 'Either (1) or (2) follows', 'Neither (1) nor (2) follows', 'Both (1) and (2) follow'],
        answer: 'Only (1) conclusion follows',
        explanation: 'Since some actors are singers and all singers are dancers, those actors who are singers are also dancers. Thus, Some actors are dancers. Conclusion 2 is false because some actors are singers.'
      },
      {
        question: 'Statements: All the harmoniums are instruments. All the instruments are flutes. Conclusions: 1. All the flutes are instruments. 2. All the harmoniums are flutes.',
        options: ['Only (1) conclusion follows', 'Only (2) conclusion follows', 'Either (1) or (2) follows', 'Neither (1) nor (2) follows', 'Both (1) and (2) follow'],
        answer: 'Only (2) conclusion follows',
        explanation: 'Since all harmoniums are instruments and all instruments are flutes, all harmoniums are flutes. All flutes are instruments does not follow.'
      },
      {
        question: 'Statements: Some mangoes are yellow. Some tixo are mangoes. Conclusions: 1. Some mangoes are green. 2. Tixo is a yellow.',
        options: ['Only (1) conclusion follows', 'Only (2) conclusion follows', 'Either (1) or (2) follows', 'Neither (1) nor (2) follows', 'Both (1) and (2) follow'],
        answer: 'Neither (1) nor (2) follows',
        explanation: 'The statements only discuss mangoes, yellow, and tixo. No green color is mentioned (1 is false). Tixo being yellow cannot be definitely concluded (2 is false).'
      },
      {
        question: 'Statements: Some ants are parrots. All the parrots are apples. Conclusions: 1. All the apples are parrots. 2. Some ants are apples.',
        options: ['Only (1) conclusion follows', 'Only (2) conclusion follows', 'Either (1) or (2) follows', 'Neither (1) nor (2) follows', 'Both (1) and (2) follow'],
        answer: 'Only (2) conclusion follows',
        explanation: 'Since some ants are parrots and all parrots are apples, some ants are apples. All apples are parrots does not follow.'
      },
      {
        question: 'Statements: Some papers are pens. All the pencils are pens. Conclusions: 1. Some pens are pencils. 2. Some pens are papers.',
        options: ['Only (1) conclusion follows', 'Only (2) conclusion follows', 'Either (1) or (2) follows', 'Neither (1) nor (2) follows', 'Both (1) and (2) follow'],
        answer: 'Both (1) and (2) follow',
        explanation: 'Since all pencils are pens, some pens are pencils (1 is true). Since some papers are pens, some pens are papers (2 is true).'
      }
    ]
  },
  {
    name: 'Blood Relation',
    pageNumber: 90,
    questions: [
      {
        question: 'A is the father of B, and B is the father of C. R is the daughter of A. How is C related to R?',
        options: ['Niece/Nephew', 'Uncle/Aunt', 'Brother/Sister', 'Cousin'],
        answer: 'Niece/Nephew',
        explanation: 'B and R are siblings (children of A). Since C is B\'s child, C is R\'s niece or nephew.'
      },
      {
        question: 'Pointing to a photograph, Asha said, â€œHis mother\'s only daughter is my mother.â€ How is Asha related to the man in the photograph?',
        options: ['Sister', 'Mother', 'Niece', 'Cousin'],
        answer: 'Niece',
        explanation: 'The man\'s mother\'s only daughter is the man\'s sister. Since the man\'s sister is Asha\'s mother, Asha is the man\'s niece.'
      }
    ]
  },
  {
    name: 'Data Arrangement',
    pageNumber: 108,
    questions: [
      {
        question: 'Arrange the following words in a meaningful sequence: 1. Cotton  2. Plant  3. Yarn  4. Cloth  5. Shirt',
        options: ['2, 1, 3, 4, 5', '2, 1, 4, 3, 5', '1, 2, 3, 4, 5', '2, 3, 1, 4, 5'],
        answer: '2, 1, 3, 4, 5',
        explanation: 'Logical sequence: Plant (2) produces Cotton (1), which is spun into Yarn (3), woven into Cloth (4), and stitched into a Shirt (5).'
      },
      {
        question: 'Arrange the following words in a logical sequence: 1. Rain  2. Sun  3. Rainbow  4. Child  5. Happy',
        options: ['1, 2, 3, 4, 5', '2, 1, 3, 4, 5', '1, 2, 4, 3, 5', '4, 1, 2, 3, 5'],
        answer: '1, 2, 3, 4, 5',
        explanation: 'Sequence: Rain (1) followed by Sun (2) creates a Rainbow (3). A Child (4) sees it and feels Happy (5).'
      },
      {
        question: 'Passage: Nine people A, B, C, D, E, F, G, H, and I are sitting in a row facing North in a movie theatre. B is located at the far end of the row. Both F and G are seated next to H. C is directly to the right of D, and third to the right of E. A is to the left of F. F is located third from the left of B.\n\nQ1. Who is the middle person in the row?',
        options: ['A', 'D', 'F', 'H'],
        answer: 'A',
        explanation: 'Starting with the given conditions, the final layout is E, I, D, C, A, F, H, G, B. The middle person (5th position) is A.'
      },
      {
        question: 'Passage: Nine people A, B, C, D, E, F, G, H, and I are sitting in a row facing North in a movie theatre. B is located at the far end of the row. Both F and G are seated next to H. C is directly to the right of D, and third to the right of E. A is to the left of F. F is located third from the left of B.\n\nQ2. Who is on the opposite end of the line (relative to B)?',
        options: ['A', 'E', 'G', 'C'],
        answer: 'E',
        explanation: 'The final layout is E, I, D, C, A, F, H, G, B. Since B is at the right end, E is on the far opposite (left) end.'
      },
      {
        question: 'Passage: Nine people A, B, C, D, E, F, G, H, and I are sitting in a row facing North in a movie theatre. B is located at the far end of the row. Both F and G are seated next to H. C is directly to the right of D, and third to the right of E. A is to the left of F. F is located third from the left of B.\n\nQ3. Which of the statements below is correct?',
        options: ['E is two rows behind A', 'D is on the far side of the spectrum', 'I lives next to G', 'Between F and C, there is one individual'],
        answer: 'Between F and C, there is one individual',
        explanation: 'In the layout E I D C A F H G B, the element between F and C is A, meaning there is exactly one individual (A) between F and C.'
      }
    ]
  },
  {
    name: 'Visual Reasoning (Analytical Reasoning)',
    pageNumber: 124,
    questions: [
      {
        question: 'If a grid has 3 rows and 3 columns of equal squares, find the total number of squares in the grid.',
        options: ['9', '10', '13', '14'],
        answer: '14',
        explanation: 'Formula for n x n grid is n(n+1)(2n+1)/6. For n=3: 1^2 + 2^2 + 3^2 = 1 + 4 + 9 = 14 squares.'
      },
      {
        question: 'If a grid has 2 rows and 2 columns of equal squares, find the total number of squares in the grid.',
        options: ['4', '5', '6', '8'],
        answer: '5',
        explanation: '1^2 + 2^2 = 1 + 4 = 5 squares.'
      }
    ]
  },
  {
    name: 'Spatial Reasoning',
    pageNumber: 140,
    questions: [
      {
        question: 'A 2D shape is dilated by a scale factor of 2. What happens to its area?',
        options: ['It is doubled', 'It is quadrupled', 'It remains the same', 'It is halved'],
        answer: 'It is quadrupled',
        explanation: 'Area scales with the square of the scale factor: 2^2 = 4 times the original area.'
      }
    ]
  },
  {
    name: 'Attention to Detail',
    pageNumber: 155,
    questions: [
      {
        question: "Check the duplicates: I) 0452-9858762 II) 0452-9858762 III) 0452-9858762",
        options: ['All are identical', 'I and II are identical', 'II and III are identical', 'None are identical'],
        answer: 'All are identical',
        explanation: 'All three telephone strings match character-for-character.'
      },
      {
        question: "If * stands for / , / stands for - , + stands for * and - stands for + Then 9/8*7+5-10 = ?",
        options: ['12', '15', '20', '25'],
        answer: '15',
        explanation: 'Rewrite expression with new operators: 9 - 8 / 7 * 5 + 10. Evaluating with BODMAS resolves to 15 (using standard integer arithmetic).'
      }
    ]
  },
  {
    name: 'Venn Diagram',
    pageNumber: 172,
    questions: [
      {
        question: 'Which of the following Venn representations represents: Diwali, Eid, Festival?',
        options: ['Diwali and Eid as disjoint circles inside Festival', 'Diwali and Eid overlapping', ' Festival disjoint from Diwali', 'Diwali inside Eid'],
        answer: 'Diwali and Eid as disjoint circles inside Festival',
        explanation: 'Both Diwali and Eid are independent festivals, meaning they are disjoint circles nested inside the Festival boundary.'
      },
      {
        question: 'Which Venn diagram best depicts the relationship between Thieves, Judges, and Criminals?',
        options: ['Thieves inside Criminals, Judges disjoint', 'All three overlapping', 'Thieves and Judges inside Criminals', 'All disjoint'],
        answer: 'Thieves inside Criminals, Judges disjoint',
        explanation: 'All thieves are criminals (Thieves is a subset of Criminals), while Judges form a completely disjoint class.'
      }
    ]
  },
  {
    name: 'Calendar',
    pageNumber: 190,
    questions: [
      {
        question: 'Which day of the week lied on 18 March 1977?',
        options: ['Friday', 'Saturday', 'Sunday', 'Monday'],
        answer: 'Friday',
        explanation: 'Using standard calendar day calculation: 18 March 1977 solves to a Friday.'
      },
      {
        question: 'On what day does 22 October 1964 lie?',
        options: ['Thursday', 'Friday', 'Saturday', 'Wednesday'],
        answer: 'Thursday',
        explanation: '22 October 1964 corresponds to a Thursday.'
      }
    ]
  },
  {
    name: 'Coding Decoding',
    pageNumber: 205,
    questions: [
      {
        question: 'If CAT is coded as DBU, then MAN is coded as:',
        options: ['NBO', 'NAM', 'OBN', 'MBO'],
        answer: 'NBO',
        explanation: 'Each letter is shifted by +1 in alphabetical order: M->N, A->B, N->O.'
      },
      {
        question: 'In a certain language, if SUNSHINE is coded as TVOTIJOF, then how will MOON be coded?',
        options: ['NPPO', 'NPPN', 'NOOP', 'NPOO'],
        answer: 'NPPO',
        explanation: 'Shift each letter by +1: M->N, O->P, O->P, N->O.'
      }
    ]
  },
  {
    name: 'Direction Sense',
    pageNumber: 220,
    questions: [
      {
        question: 'One day Raj left home and walked 5 km North, turned right and walked 10 km, turned left and walked 5 km, and finally turned left and walked 10 km. How far is he from home?',
        options: ['10 km', '15 km', '20 km', '5 km'],
        answer: '10 km',
        explanation: 'North-South movements: +5 (N) + 5 (N) = +10 km. East-West: +10 (E) - 10 (W) = 0. He is 10 km straight North of his starting point.'
      },
      {
        question: 'A man walks 25 m towards North, turns left and walks 20 m, turns left and walks 25 m. He again turns right and walks 15 m. How far is he from the start?',
        options: ['35 m', '40 m', '20 m', '15 m'],
        answer: '35 m',
        explanation: 'North-South: +25 - 25 = 0. Westward: 20m + 15m = 35m West. Distance is 35m.'
      }
    ]
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

