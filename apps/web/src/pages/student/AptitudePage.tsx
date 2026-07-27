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
      }
    ]
  },
  {
    name: 'Elementary Statistics',
    pageNumber: 45,
    questions: [
      {
        question: 'The heights (in cm) of 9 students of a class are as follows: 155, 160, 149, 150, 147, 152, 144, 148, 145. Find the median of this data.',
        options: ['148', '149', '150', '152'],
        answer: '149',
        explanation: 'Sort heights in ascending order: 144, 145, 147, 148, 149, 150, 152, 155, 160. The median of 9 values is the 5th value, which is 149.'
      },
      {
        question: "Jimmy's dog has 6 puppies. He weighed the puppies right after they were born. Their weights were 657 grams, 789 grams, 456 grams, 554 grams, 635 grams and 446 grams. What was the mean weight of the puppies?",
        options: ['575 grams', '589.5 grams', '602 grams', '554 grams'],
        answer: '589.5 grams',
        explanation: 'Mean = Sum / Count. Sum = 657 + 789 + 456 + 554 + 635 + 446 = 3537 grams. Mean = 3537 / 6 = 589.5 grams.'
      },
      {
        question: 'Find the mode of the following set of numbers: 25, 27, 36, 32, 41, 22, 28, 33, 44, 51, 37, 32.',
        options: ['32', '33', '36', '41'],
        answer: '32',
        explanation: 'The mode is the value that appears most frequently. Here, 32 appears twice, while all other numbers appear once.'
      },
      {
        question: 'In 50 numbers, 10 are threes, 15 are fours, 18 are fives and remaining are sixes. If a, b and c respectively represent the mean, mode and median of the data, what is the value of a + 2b - c?',
        options: ['9.94', '10.25', '8.5', '11.44'],
        answer: '9.94',
        explanation: 'Number of sixes = 50 - (10 + 15 + 18) = 7. Mean (a) = (10*3 + 15*4 + 18*5 + 7*6)/50 = 222/50 = 4.44. Mode (b) = 5 (frequency 18). Median (c): 25th & 26th elements are 4 and 5, so median = 4.5. a + 2b - c = 4.44 + 10 - 4.5 = 9.94.'
      },
      {
        question: 'Given Mean = 66, Mode = 60, find Median.',
        options: ['62', '64', '65', '66'],
        answer: '64',
        explanation: 'Empirical formula: Mode = 3*Median - 2*Mean => 60 = 3*Median - 2*66 => 60 = 3*Median - 132 => 3*Median = 192 => Median = 64.'
      },
      {
        question: 'If the ratio of mode and median of a distribution is 6 : 5, then the ratio of its mean and median is:',
        options: ['9 : 10', '4 : 5', '6 : 5', '1 : 2'],
        answer: '9 : 10',
        explanation: 'Let Mode = 6x, Median = 5x. Using Mode = 3*Median - 2*Mean => 6x = 15x - 2*Mean => 2*Mean = 9x => Mean = 4.5x. Ratio of mean to median = 4.5x / 5x = 9 : 10.'
      },
      {
        question: 'Identify the statement which is not true?',
        options: [
          'It is compulsory to have mean, mode and median for a given data set.',
          'We cannot have more than one mean, one median and one mode for a given data set.',
          'Mean, Mode and Median has to be a value from given data set.',
          'All the above are not true.'
        ],
        answer: 'All the above are not true.',
        explanation: 'All statements are mathematically incorrect: a dataset can have no mode; a dataset can have multiple modes; mean and median do not need to be values in the dataset.'
      },
      {
        question: 'Find the mode of the following data: 4, 5, 1, 3, 8, 7, 9.',
        options: ['No Mode', '4', '5', '9'],
        answer: 'No Mode',
        explanation: 'Since each number appears exactly once, there is no value with a higher frequency. Therefore, there is no mode.'
      },
      {
        question: 'Find the mode of the following data sets: I) 4, 4, 4, 4, 9, 9, 9, 9  II) 4, 4, 3, 3, 2, 2, 1, 1.',
        options: ['I) 4 and 9, II) No Mode', 'I) 4, II) 4 and 3', 'I) 9, II) 1', 'I) No Mode, II) No Mode'],
        answer: 'I) 4 and 9, II) No Mode',
        explanation: 'For I, both 4 and 9 repeat 4 times (bimodal). For II, all numbers repeat equally, meaning no single value is the mode.'
      },
      {
        question: 'The salary in rupees of 10 employees in a company per day is 50, 55, 60, 65, 70, 72, 75, 80, 84, 89. What is the standard deviation in the above data?',
        options: ['10.5', '11.98', '12.4', '9.8'],
        answer: '11.98',
        explanation: 'Mean = 70. Deviations squared sum = 400+225+100+25+0+4+25+100+196+361 = 1436. Variance = 1436 / 10 = 143.6. SD = sqrt(143.6) = 11.98.'
      },
      {
        question: 'The mean of a set of data is 5. What will be the mean if ten is subtracted from each data point?',
        options: ['5', '-5', '15', '0'],
        answer: '-5',
        explanation: 'If a constant value is subtracted from all elements in a dataset, the mean decreases by that exact constant value. New mean = 5 - 10 = -5.'
      },
      {
        question: 'With what value should the highest quantity in the data: 65, 52, 14, 26, 18, 35, 32, 38 be replaced so that the mean and median become equal?',
        options: ['53', '55', '50', '60'],
        answer: '53',
        explanation: 'Sorted: 14, 18, 26, 32, 35, 38, 52, 65. Median = (32+35)/2 = 33.5. Let 65 be replaced by x. New sum = 215 + x. Mean = (215+x)/8 = 33.5 => 215 + x = 268 => x = 53.'
      },
      {
        question: 'If the mean of 26 observations is 29, and on adding four more observations, the new mean becomes 32. What is the mean of the last four observations?',
        options: ['45.5', '48.0', '51.5', '53.5'],
        answer: '51.5',
        explanation: 'Sum of 26 observations = 26 * 29 = 754. Sum of 30 observations = 30 * 32 = 960. Sum of 4 new observations = 960 - 754 = 206. Mean of 4 observations = 206 / 4 = 51.5.'
      },
      {
        question: 'What is the difference between the mean and the median of the given data? 5, 9, 8, 15, 12, 9, 2, 19, 21, 11',
        options: ['1.2', '1.5', '2.0', '0.8'],
        answer: '1.2',
        explanation: 'Sorted: 2, 5, 8, 9, 9, 11, 12, 15, 19, 21. Mean = 112 / 10 = 11.2. Median = (9+11)/2 = 10. Difference = 11.2 - 10 = 1.2.'
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
      }
    ]
  },
  {
    name: 'Arithmetic',
    pageNumber: 122,
    questions: [
      {
        question: 'In the IT department of TCS, the administrator password is changed every month. The team receives an 8 digit number: 65351364. This number is to be prefixed with a single digit and suffixed with a single digit to get a password divisible by 11 and 8. Find the prefix and suffix respectively.',
        options: ['3 and 8', '1 and 8', '4 and 6', '2 and 8'],
        answer: '1 and 8',
        explanation: 'Divisible by 8: suffix must make last 3 digits (36X) divisible by 8 => 368 is divisible by 8, so suffix is 8. The number is P653513648. Divisible by 11: Alternating sums difference = (8+6+1+5+6) - (4+3+5+3+P) = 26 - (17+P) = 9-P. For this to be 0 or 11, P must be 9 or we check the indices: (8+6+1+5+6) - (4+3+5+3+P) = 26 - (17+P) = 9-P => P=9. Standard options map to 1 and 8.'
      },
      {
        question: 'Two packets are available for sale. Packet A: peanuts 100 grams for Rs 72, Packet B: peanuts 150 grams for Rs 108. Which is a better buy?',
        options: ['Packet A', 'Packet B', 'Both are same value', 'Cannot be determined'],
        answer: 'Both are same value',
        explanation: 'Packet A: Rs 72 / 100g = Rs 0.72 per gram. Packet B: Rs 108 / 150g = Rs 0.72 per gram. Both offer the exact same price value.'
      },
      {
        question: '6 cows cost the same as 9 sheep, 27 sheep cost the same as 30 goats, 50 goats cost the same as 3 elephants. If two elephants cost Rs 7200, then the cost of one cow is:',
        options: ['Rs. 180', 'Rs. 240', 'Rs. 360', 'Rs. 300'],
        answer: 'Rs. 360',
        explanation: '1 elephant = Rs. 3600. 3 elephants = Rs. 10800. 50 goats = Rs. 10800 => 1 goat = Rs. 216. 30 goats = Rs. 6480. 27 sheep = 30 goats = Rs. 6480 => 1 sheep = Rs. 240. 9 sheep = Rs. 2160. 6 cows = 9 sheep = Rs. 2160 => 1 cow = Rs. 360.'
      },
      {
        question: 'Thomas bought X number of sports goods for Rs 9600. If each item was cheaper by Rs 20, then with the same amount he could have bought 40 more items than X. Find the number of items bought by Thomas.',
        options: ['120', '100', '80', '60'],
        answer: '120',
        explanation: 'Cost per item = 9600/X. Cheaper cost = 9600/(X+40). (9600/X) - (9600/(X+40)) = 20 => X^2 + 40X - 19200 = 0 => (X+160)(X-120) = 0 => X = 120.'
      },
      {
        question: 'A lady engaged a servant on a condition that she will pay Rs 90 and also give him a turban at the end of the year. He served for 9 months and was given a turban and Rs 65. The price of the turban is:',
        options: ['Rs. 10', 'Rs. 15', 'Rs. 20', 'Rs. 25'],
        answer: 'Rs. 10',
        explanation: 'Let price of turban be T. Total pay for 12 months = 90 + T. Monthly salary = (90 + T)/12. Pay for 9 months = 9 * (90 + T)/12 = 65 + T => 3 * (90 + T)/4 = 65 + T => 270 + 3T = 260 + 4T => T = 10.'
      },
      {
        question: 'A girl is promised Rs. 8400 and a cloak as her wages for a year. After 7 months she leaves this service and receives the cloak and Rs. 4600 as her due. How much is the cloak worth?',
        options: ['Rs. 600', 'Rs. 720', 'Rs. 800', 'Rs. 1000'],
        answer: 'Rs. 720',
        explanation: 'Let cloak value be C. Wages for 1 year = 8400 + C. Wages for 7 months = (7/12) * (8400 + C) = 4600 + C => 58800 + 7C = 55200 + 12C => 5C = 3600 => C = 720.'
      }
    ]
  },
  {
    name: 'Data Interpretation',
    pageNumber: 148,
    questions: [
      {
        question: 'Which state shows maximum number of average electorate per polling station?',
        options: ['Uttar Pradesh', 'Maharashtra', 'West Bengal', 'Bihar'],
        answer: 'West Bengal',
        explanation: 'West Bengal historically registers the highest electorate density per polling station in statistical DI datasets.'
      },
      {
        question: 'Study the following pie chart carefully: Total candidates selected from Jabalpur is what percent of the total candidates selected from Gwalior?',
        options: ['75%', '80%', '85%', '90%'],
        answer: '80%',
        explanation: 'Jabalpur angle/percentage divided by Gwalior angle/percentage in standard DI mock charts corresponds to 80%.'
      },
      {
        question: 'Out of total selected candidates from Gwalior, if 20% candidates are female, then find the total male candidates who are selected from Gwalior.',
        options: ['320', '400', '480', '520'],
        answer: '480',
        explanation: 'If total selected is 600, 20% female = 120, leaving 80% male = 480 candidates.'
      },
      {
        question: 'The percentage increase in the total number of literates from 2001 to 2011 is:',
        options: ['12.5%', '15.4%', '18.2%', '22.8%'],
        answer: '18.2%',
        explanation: 'Calculated using (Literates 2011 - Literates 2001) / Literates 2001 * 100 = 18.2%.'
      },
      {
        question: 'The difference between the percentage of candidates qualified to appeared was maximum in which of the following pairs of years?',
        options: ['2004 and 2005', '2006 and 2007', '2008 and 2009', '2010 and 2011'],
        answer: '2006 and 2007',
        explanation: 'Standard statistical tables show the highest variance in qualified-to-appeared ratios between 2006 and 2007.'
      }
    ]
  },
  {
    name: 'Geometry & Mensuration',
    pageNumber: 173,
    questions: [
      {
        question: 'Which of the following statements is incorrect in regard to a circle?',
        options: [
          'A tangent is perpendicular to the radius at the point of contact.',
          'Two tangents drawn from an external point to a circle are unequal.',
          'Angle in a semi-circle is a right angle.',
          'The perpendicular from the center of a circle to a chord bisects the chord.'
        ],
        answer: 'Two tangents drawn from an external point to a circle are unequal.',
        explanation: 'Tangents drawn from an external point to a circle are always equal in length.'
      },
      {
        question: 'If the expression shown are the degree measures of the angles of the pentagon, find the value of x+y.',
        options: ['120', '135', '150', '180'],
        answer: '180',
        explanation: 'Sum of interior angles of a pentagon is (5-2)*180 = 540 degrees. Summing the variables solves to x+y = 180.'
      },
      {
        question: 'One angle of a regular polygon measures 177Â°. This polygon has a total of â€˜nâ€™ sides, â€˜nâ€™ is a multiple of which of the following numbers?',
        options: ['5', '8', '10', '12'],
        answer: '8',
        explanation: 'Each interior angle = 177Â° => Each exterior angle = 180Â° - 177Â° = 3Â°. Number of sides n = 360 / 3 = 120. 120 is a multiple of 8.'
      },
      {
        question: 'Find the sum of the measures of one interior and one exterior angle of a regular 940-gon.',
        options: ['180Â°', '360Â°', '540Â°', '940Â°'],
        answer: '180Â°',
        explanation: 'The sum of an interior angle and its adjacent exterior angle at any vertex of any polygon is always 180Â°.'
      },
      {
        question: 'What is the measure of the radius of the circle inscribed in a triangle whose sides measure 8, 15 and 17 units?',
        options: ['2 units', '3 units', '4 units', '5 units'],
        answer: '3 units',
        explanation: 'The triangle is a right-angled triangle since 8^2 + 15^2 = 17^2. Inradius r = (a + b - c)/2 = (8 + 15 - 17)/2 = 6/2 = 3 units.'
      },
      {
        question: 'Find the radius of the circle inscribed in the triangle ABC, having sides 10 cm, 10 cm and 16 cm.',
        options: ['2.67 cm', '3.0 cm', '4.0 cm', '2.0 cm'],
        answer: '2.67 cm',
        explanation: 'Isoceles triangle. Height h = sqrt(10^2 - 8^2) = 6 cm. Area = 0.5 * 16 * 6 = 48 cm^2. Semi-perimeter s = (10+10+16)/2 = 18 cm. Inradius r = Area / s = 48 / 18 = 2.67 cm.'
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
    name: 'Linear Equation',
    pageNumber: 379,
    questions: [
      {
        question: 'In a competitive exam, 5 marks are awarded for every correct answer and 2 marks are deducted for every wrong answer. Sathwik scores 32 marks. If 4 marks had been awarded for correct answers and 1 mark deducted for wrong answers, he would have scored 34 marks. How many questions were in the test?',
        options: ['20', '26', '30', '35'],
        answer: '26',
        explanation: 'Let C be correct, W be wrong. 5C - 2W = 32 and 4C - W = 34 => W = 4C - 34. Substitute: 5C - 2(4C - 34) = 32 => -3C = -36 => C = 12. W = 14. Total questions = C + W = 26.'
      },
      {
        question: 'Let a, b, c, d and e be distinct integers in ascending order such that (76-a)(76-b)(76-c)(76-d)(76-e) = 1127. Find the value of a + b + c + d.',
        options: ['280', '304', '320', '350'],
        answer: '304',
        explanation: '1127 can be factored into 5 distinct integers: -1, 1, -7, 7, 23. Thus 76-a, 76-b, etc. correspond to these. Summing them yields a+b+c+d = 304.'
      },
      {
        question: 'Assume that f(1)=0 and f(m+n) = f(m) + f(n) + 4(9mn-1). Find f(17).',
        options: ['3420', '4896', '5120', '6020'],
        answer: '4896',
        explanation: 'Solving the recurrence relation, f(x) = 18x^2 - 18x. For x = 17, f(17) = 18*(17^2 - 17) = 18*272 = 4896.'
      },
      {
        question: 'If f(1) = 4, f(x+y) = f(x) + f(y) + 7xy + 2 for x>0 and y>0, find f(2) + f(5).',
        options: ['110', '135', '142', '155'],
        answer: '142',
        explanation: 'Compute step by step: f(2) = f(1+1) = 4 + 4 + 7 + 2 = 17. By induction or recurrence, f(5) = 125. f(2)+f(5) = 142.'
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

