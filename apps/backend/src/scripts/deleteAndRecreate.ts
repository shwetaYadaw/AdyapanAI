import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function deleteAndRecreate() {
  try {
    console.log('🔄 DELETE ALL SEATING TESTS AND RECREATE FRESH\n');

    // Delete ALL seating tests
    const deleted = await prisma.aptitudeTest.deleteMany({
      where: {
        title: { contains: 'Seating' },
        category: 'reasoning',
        company: 'TCS'
      }
    });

    console.log(`✅ Deleted ${deleted.count} old seating tests\n`);

    // Now create fresh with ALL 7 questions
    const newTest = await prisma.aptitudeTest.create({
      data: {
        title: 'TCS Reasoning: Seating Arrangement',
        category: 'reasoning',
        difficulty: 'medium',
        duration: 120,
        totalMarks: 200,
        company: 'TCS',
        isActive: true,
        questions: [
          {
            text: 'Problem 1: A, P, R, X, S and Z are sitting in a row.\n\nGiven conditions:\n- S and Z are in the centre\n- A and P are at the ends\n- R is sitting to the left of A\n\nQuestion: Who is to the right of P?',
            options: [
              { id: 'a', text: 'X' },
              { id: 'b', text: 'A' },
              { id: 'c', text: 'R' },
              { id: 'd', text: 'Z' }
            ],
            correctAnswer: 'a',
            explanation: 'Solution: X is to the right of P. The arrangement is P - R - S - Z - X - A. Therefore X is to the right of P.',
            marks: 20
          },
          {
            text: 'Problem 2: Seating Arrangement with 8 Houses\n\nThere are 8 houses in a line and in each house only one boy lives.\n\nGiven conditions:\n- Jack is not the neighbour of Simon\n- Harry is just next to the left of Larry\n- There is at least one person to the left of Larry\n- Paul lives in one of the two middle houses (4 or 5)\n- Mike lives in between Paul and Larry\n- At least one person lives to the right of Robert\n- Harry is not between Taud and Larry\n\nQuestion: Which statement is NOT correct?',
            options: [
              { id: 'a', text: 'Robert is not at the left end' },
              { id: 'b', text: 'Robert is in between Simon and Taud' },
              { id: 'c', text: 'Taud is in between Paul and Jack' },
              { id: 'd', text: 'There are three persons to the right of Paul' }
            ],
            correctAnswer: 'd',
            explanation: 'Solution: There are FOUR persons to the right of Paul, not three. Statement D is incorrect.',
            marks: 30
          },
          {
            text: 'Problem 3: Five People on a Bench\n\nA, B, C, D and E are sitting on a bench.\n\nGiven conditions:\n- A is sitting next to B\n- C is sitting next to D\n- D is NOT sitting with E\n- E is on the left end of the bench\n- C is on the second position from the right\n- A is to the right of B and E\n- A and C are sitting together\n\nQuestion: In which position is A sitting?',
            options: [
              { id: 'a', text: 'Between B and D' },
              { id: 'b', text: 'Between B and C' },
              { id: 'c', text: 'Between E and D' },
              { id: 'd', text: 'Between C and E' }
            ],
            correctAnswer: 'b',
            explanation: 'Solution: The arrangement is E - B - A - C - D. So A is between B and C.',
            marks: 20
          },
          {
            text: 'Problem 4: Challenge - Complex Seating\n\nSix people are seated in a row.\n- Person X is at one end\n- Person Y is in the middle (3rd or 4th position)\n- Person Z is next to Y\n- Person W is not next to X\n- Person V is to the left of Person T\n- There are 2 people between X and Z\n\nQuestion: Which arrangement is correct?',
            options: [
              { id: 'a', text: 'X is at position 1, all conditions satisfied' },
              { id: 'b', text: 'Y must be at position 3, Z at position 2 or 4' },
              { id: 'c', text: 'V and T must be adjacent' },
              { id: 'd', text: 'W must be at one of the ends' }
            ],
            correctAnswer: 'a',
            explanation: 'Solution: X is at position 1, all conditions can be satisfied with proper arrangement.',
            marks: 30
          },
          {
            text: 'Problem 5.1: Circular Seating Arrangement\n\nP, Q, R, S, T, U, V and W are sitting round the circle facing the centre.\n\nGiven conditions:\n1. P is second to the right of T\n2. T is the neighbour of R and V\n3. S is not the neighbour of P\n4. V is the neighbour of U\n5. Q is not between S and W\n6. W is not between U and S\n\nQuestion: Which two of the following are not neighbours?',
            options: [
              { id: 'a', text: 'R and V' },
              { id: 'b', text: 'U and V' },
              { id: 'c', text: 'R and P' },
              { id: 'd', text: 'Q and W' }
            ],
            correctAnswer: 'a',
            explanation: 'Solution: Arrangement is V - T - R - P - Q - S - W - U (clockwise). R and V are NOT neighbours (distance 2 apart).',
            marks: 25
          },
          {
            text: 'Problem 5.2: Circular Seating Arrangement (Continued)\n\nUsing the same circular arrangement from Problem 5.1:\nV - T - R - P - Q - S - W - U (clockwise)\n\nQuestion: Which one is immediate right to the V?',
            options: [
              { id: 'a', text: 'P' },
              { id: 'b', text: 'U' },
              { id: 'c', text: 'R' },
              { id: 'd', text: 'T' }
            ],
            correctAnswer: 'd',
            explanation: 'Solution: V is at position 1. Immediately to the right (clockwise) is position 2 = T.',
            marks: 25
          },
          {
            text: 'Problem 5.3: Circular Seating Arrangement (Continued)\n\nUsing the same circular arrangement:\nV - T - R - P - Q - S - W - U (clockwise)\n\nQuestion: What is the position of S?',
            options: [
              { id: 'a', text: 'Between U and V' },
              { id: 'b', text: 'Second to the right of P' },
              { id: 'c', text: 'To the immediate right of W' },
              { id: 'd', text: 'Data inadequate' }
            ],
            correctAnswer: 'b',
            explanation: 'Solution: P is at position 4. Second to the right is position 6 = S.',
            marks: 25
          }
        ]
      }
    });

    console.log('✅ Created fresh test with 7 questions\n');
    console.log(`Test ID: ${newTest.id}`);
    console.log(`Title: ${newTest.title}`);
    console.log(`Questions: ${(newTest.questions as any).length}`);
    console.log(`Marks: ${newTest.totalMarks}`);
    console.log(`Duration: ${newTest.duration} min\n`);

    console.log('✨ Done! Test is ready with all 7 questions!');

    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

deleteAndRecreate();
