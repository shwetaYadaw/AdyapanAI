import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function seedNonVerbalTest() {
  try {
    console.log('🎨 Seeding TCS Reasoning: Non-Verbal Reasoning Test...\n');

    const test = await prisma.aptitudeTest.create({
      data: {
        title: 'TCS Reasoning: Non-Verbal (Pattern & Sequence)',
        category: 'reasoning',
        difficulty: 'medium',
        duration: 60,
        totalMarks: 150,
        company: 'TCS',
        isActive: true,
        questions: [
          {
            text: `Question 1: Which of the images A to E is next in the sequence?

Pattern Analysis:
- Column 1: Striped Triangle, Circle, Square, Filled Triangle
- Column 2: Filled Triangle, Striped Triangle, Circle, Square
- Column 3: Square, Filled Triangle, Striped Triangle, Circle
- Column 4: Circle, Square, Filled Triangle, Striped Triangle
- Column 5: ? (Each column rotates the shapes downward, with the bottom wrapping to top)

The sequence shows a rotation pattern where each shape moves down one position, and the bottom element wraps to the top.`,
            options: [
              {
                id: 'a',
                text: 'Striped Triangle, Square, Circle, Filled Triangle'
              },
              {
                id: 'b',
                text: 'Square, Filled Triangle, Striped Triangle, Circle'
              },
              {
                id: 'c',
                text: 'Striped Triangle, Circle, Square, Filled Triangle'
              },
              {
                id: 'd',
                text: 'Square, Striped Triangle, Filled Triangle, Circle'
              },
              {
                id: 'e',
                text: 'Filled Triangle, Striped Triangle, Square, Circle'
              }
            ],
            correctAnswer: 'e',
            explanation: `Solution:

The pattern is a ROTATION sequence where shapes move downward in each column, with the bottom shape wrapping to the top.

Column progression:
- Col 1: Striped △, ○, □, Filled △
- Col 2: Filled △, Striped △, ○, □
- Col 3: □, Filled △, Striped △, ○
- Col 4: ○, □, Filled △, Striped △
- Col 5: Filled △, Striped △, □, ○ (rotation continues)

Each shape rotates down by one position:
- Striped Triangle (top) → wraps around and doesn't appear at bottom
- Actually the pattern is: each new column starts with the shape that was at the bottom of the previous column

Therefore: Column 5 = Filled Triangle (from bottom of Col 4), Striped Triangle, Square, Circle

Answer: E is correct ✓`,
            marks: 30
          },
          {
            text: `Question 2: Complete the series.

A pattern where shapes transform in size and rotation.
First shape: Small
Second shape: Medium (rotated)
Third shape: Large (rotated more)
Fourth shape: Small filled
Fifth shape: ?

Looking at the pattern, each iteration cycles through: size increase → rotation → filling → reset`,
            options: [
              {
                id: 'a',
                text: 'Medium triangle with different orientation'
              },
              {
                id: 'b',
                text: 'Large filled circle'
              },
              {
                id: 'c',
                text: 'Small outline square'
              },
              {
                id: 'd',
                text: 'Medium filled triangle'
              }
            ],
            correctAnswer: 'a',
            explanation: `Solution:

The pattern cycles through three transformations:
1. Size progression: Small → Medium → Large
2. Orientation: Each shape rotates
3. Fill pattern: Outline → Filled → Outline

Following the cycle, the next shape would be:
- Medium size (after small filled, we return to medium)
- Different orientation (continued rotation)
- Outline (alternating fill pattern)

Answer: A is correct ✓`,
            marks: 30
          },
          {
            text: `Question 3: Which figure is different from others?

Five figures showing different arrangements of basic shapes (triangles, circles, squares).
Most follow a 2-3-4 pattern (2 shapes, then 3, then 4).
One breaks this pattern.

Identify which one doesn't fit the sequence.`,
            options: [
              {
                id: 'a',
                text: '2 shapes arranged vertically'
              },
              {
                id: 'b',
                text: '3 shapes in triangle formation'
              },
              {
                id: 'c',
                text: '3 shapes in line'
              },
              {
                id: 'd',
                text: '4 shapes in square formation'
              }
            ],
            correctAnswer: 'c',
            explanation: `Solution:

Pattern Analysis:
- Option A: 2 shapes (follows pattern)
- Option B: 3 shapes in triangle formation (follows pattern)
- Option C: 3 shapes in LINE arrangement (different arrangement style)
- Option D: 4 shapes in square formation (follows pattern)

The odd one is C because while it has 3 shapes like B, they are arranged differently in a LINE rather than following the triangular/organized pattern of the sequence.

Answer: C is different ✓`,
            marks: 30
          },
          {
            text: `Question 4: What comes next?

Matrix pattern where:
- Rows increase in complexity
- Each row follows a specific transformation rule
- Row 1: Basic shapes
- Row 2: Shapes + rotation
- Row 3: Shapes + rotation + color change

Find the missing element that completes the pattern.`,
            options: [
              {
                id: 'a',
                text: 'Rotated colored shape'
              },
              {
                id: 'b',
                text: 'Basic colored shape'
              },
              {
                id: 'c',
                text: 'Rotated basic shape'
              },
              {
                id: 'd',
                text: 'Filled shape with pattern'
              }
            ],
            correctAnswer: 'a',
            explanation: `Solution:

Matrix progression analysis:
- Row 1: Basic geometric shapes (no transformation)
- Row 2: Same shapes + 90° rotation
- Row 3: Rotated shapes + fill/color change

Following the pattern, the next element should include:
1. Rotation (established in rows 2-3)
2. Color/fill change (continuing from row 3)

Answer: A (Rotated colored shape) correctly combines both established pattern rules ✓`,
            marks: 30
          },
          {
            text: `Question 5: Identify the odd pattern out.

Five sequences of shapes, each showing a specific progression rule.
Four follow a consistent mathematical/logical pattern.
One breaks the pattern.

Rules to consider:
- Number sequence: 1, 2, 3... or 1, 2, 4...
- Size progression: Small → Medium → Large
- Rotation: 0° → 90° → 180°
- Symmetry patterns`,
            options: [
              {
                id: 'a',
                text: 'Increases by 1 each step'
              },
              {
                id: 'b',
                text: 'Doubles each step'
              },
              {
                id: 'c',
                text: 'Increases by 1, then 2, then 3'
              },
              {
                id: 'd',
                text: 'Random arrangement'
              }
            ],
            correctAnswer: 'd',
            explanation: `Solution:

Pattern Analysis:
- Option A: Arithmetic progression (+1) - Logical pattern ✓
- Option B: Geometric progression (×2) - Logical pattern ✓
- Option C: Fibonacci-like progression (+1, +2, +3) - Logical pattern ✓
- Option D: Random arrangement - No logical pattern ✗

Options A, B, and C all follow mathematical progressions.
Option D has no discernible pattern.

Answer: D is the odd one out ✓`,
            marks: 30
          }
        ]
      }
    });

    console.log('✅ Non-Verbal Reasoning Test created!\n');
    console.log(`Test ID: ${test.id}`);
    console.log(`Title: ${test.title}`);
    console.log(`Duration: ${test.duration} minutes`);
    console.log(`Total Marks: ${test.totalMarks}`);
    console.log(`Questions: ${(test.questions as any).length}`);
    console.log('\n📝 Questions:');
    
    (test.questions as any).forEach((q: any, idx: number) => {
      const qText = q.text.split('\n')[0];
      console.log(`  Q${idx + 1}: ${qText}`);
      console.log(`      Marks: ${q.marks}`);
      console.log(`      Options: ${q.options.length}`);
    });

    console.log('\n✨ Test ready for deployment!');
    console.log('\n🔗 Endpoints:');
    console.log(`  List: GET /api/placement/aptitude/tests?category=reasoning&company=TCS`);
    console.log(`  Details: GET /api/placement/aptitude/tests/${test.id}`);

    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

seedNonVerbalTest();
