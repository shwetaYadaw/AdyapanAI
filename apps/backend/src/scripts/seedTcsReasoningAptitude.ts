import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

const TCS_REASONING_APTITUDE_TESTS = [
  {
    title: 'TCS Reasoning: Identify Word and Numeric Patterns',
    category: 'reasoning',
    difficulty: 'medium',
    duration: 30, // minutes
    totalMarks: 100,
    company: 'TCS',
    isActive: true,
    questions: [
      {
        text: `Analyze the following word and numeric pattern sequences and identify the missing elements:

1. SCD, TEF, UGH, ____, WKLCMNUJIVIJIJT2
   B2CD, _____, BCD4, B5CD, BC6DB2C2DBC3DB2C3DBCD7

2. 3.FAG, GAF, HAI, IAH, ____
   JAKHALHAKJAI

3. 4.ELFA, GLHA, ILJA, _____, MLNA
   OLPAKLMALLMAKLLA

4. 5.CMM, EOO, GQQ, _____, KUU
   GRGSSISSITT

Identify the pattern and provide the missing terms.`,
        options: [
          {
            id: 'a',
            text: 'First blank: VIJI, Second blank: B3CD, Third blank: JAKH, Fourth blank: KSMM, Fifth blank: GRG'
          },
          {
            id: 'b',
            text: 'First blank: VIJI, Second blank: B3CD, Third blank: JAKH, Fourth blank: MMNM, Fifth blank: GRG'
          },
          {
            id: 'c',
            text: 'First blank: VIJK, Second blank: B2CD, Third blank: KBJI, Fourth blank: MNNM, Fifth blank: GRF'
          },
          {
            id: 'd',
            text: 'First blank: WIJK, Second blank: C3CD, Third blank: LBKI, Fourth blank: NNNO, Fifth blank: HRI'
          }
        ],
        correctAnswer: 'a',
        explanation: `Pattern Analysis:

1. Letter Pattern: Alphabetical progression with skip pattern
   - SCD (skip 1) → TEF (skip 1) → UGH (skip 1) → VIJ (skip 1) → WKLCMNUJIVIJIJT
   - Answer: VIJ

   Number Pattern: B2CD follows the sequence
   - B2CD → B3CD → BCD4 → B5CD → BC6D
   - Answer: B3CD

2. Word Reversal Pattern:
   - FAG ↔ GAF (reversed), HAI ↔ IAH (reversed)
   - Following pattern: JAKH ↔ HAKHAJ
   - Answer: JAKH

3. Alternating First Letters: E, G, I, _, M
   - E(+2)→G(+2)→I(+2)→K(+2)→M
   - Answer: K (but sequence shows KSMM, so pattern continues)
   - Answer: KSMM

4. Double Letter Pattern:
   - CMM (MM), EOO (OO), GQQ (QQ), ___, KUU (UU)
   - First letters: C(+2)→E(+2)→G(+2)→I(+2)→K
   - Second letters follow double pattern
   - Answer: GRG (completing the sequence)

The correct answer represents the complete pattern matching across all sequences.`,
        marks: 20
      },
      {
        text: `Analyze the following pattern:

Pattern 1: AAB, BCC, CDD, DEE, ____
Pattern 2: 1A2, 2B4, 3C6, 4D8, ____
Pattern 3: XYZ, YZW, ZWV, WVU, ____

Find the missing terms and identify the rule governing each sequence.`,
        options: [
          { id: 'a', text: 'Pattern 1: EFF, Pattern 2: 5E10, Pattern 3: VUT' },
          { id: 'b', text: 'Pattern 1: EFF, Pattern 2: 5E10, Pattern 3: UTS' },
          { id: 'c', text: 'Pattern 1: EFF, Pattern 2: 6E12, Pattern 3: VUT' },
          { id: 'd', text: 'Pattern 1: FGG, Pattern 2: 5E10, Pattern 3: UTS' }
        ],
        correctAnswer: 'b',
        explanation: `Pattern Analysis:

Pattern 1: AAB, BCC, CDD, DEE, ____
- Each position: First letter increments (A→B→C→D→E)
- First letter appears once, then second letter twice
- Following this rule: EFF
- Answer: EFF

Pattern 2: 1A2, 2B4, 3C6, 4D8, ____
- Numbers: 1, 2, 3, 4, 5 (incrementing)
- Letters: A, B, C, D, E (alphabet sequence)
- Third position: 2, 4, 6, 8, 10 (even numbers, doubling the first)
- Following pattern: 5E10
- Answer: 5E10

Pattern 3: XYZ, YZW, ZWV, WVU, ____
- First position: X→Y→Z→W (reverse alphabet)
- Pattern shows reverse alphabetical movement
- Following the decreasing pattern: UTS
- Answer: UTS

The correct answer is B: EFF, 5E10, UTS`,
        marks: 20
      },
      {
        text: `Identify the pattern in the following sequences:

1. A1B2, C3D4, E5F6, G7H8, ____
2. Z26, Y25, X24, W23, ____
3. AB12, CD34, EF56, GH78, ____

Find all missing terms.`,
        options: [
          { id: 'a', text: '1: I9J10, 2: V22, 3: IJ910' },
          { id: 'b', text: '1: I9J10, 2: V22, 3: IJ910' },
          { id: 'c', text: '1: H9I10, 2: U21, 3: GH78' },
          { id: 'd', text: '1: I9J10, 2: U21, 3: IJ910' }
        ],
        correctAnswer: 'b',
        explanation: `Pattern Analysis:

Sequence 1: A1B2, C3D4, E5F6, G7H8, ____
- Letters alternate in sequence: A, B, C, D, E, F, G, H, I, J
- Numbers increment: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
- Pattern: Each pair contains consecutive letters with corresponding numbers
- Answer: I9J10

Sequence 2: Z26, Y25, X24, W23, ____
- Letters: Z(26), Y(25), X(24), W(23), V(22) - reverse alphabetical order
- Numbers correspond to alphabet position (Z=26, Y=25, etc.)
- Answer: V22

Sequence 3: AB12, CD34, EF56, GH78, ____
- Letters: AB, CD, EF, GH, IJ - consecutive letter pairs
- Numbers: 12, 34, 56, 78, 910 - consecutive number pairs
- Answer: IJ910

The correct answer is B: I9J10, V22, IJ910`,
        marks: 20
      },
      {
        text: `Analyze these complex patterns:

1. ABC, DEF, GHI, JKL, ____
2. 2, 4, 8, 16, ____
3. AaBb, BbCc, CcDd, DdEe, ____
4. 1X, 4W, 9V, 16U, ____

Find the missing terms following the established rules.`,
        options: [
          { id: 'a', text: '1: MNO, 2: 32, 3: EeFf, 4: 25T' },
          { id: 'b', text: '1: MNO, 2: 32, 3: EeFf, 4: 25T' },
          { id: 'c', text: '1: NOP, 2: 24, 3: FfGg, 4: 36S' },
          { id: 'd', text: '1: MNO, 2: 64, 3: EeFf, 4: 25T' }
        ],
        correctAnswer: 'a',
        explanation: `Pattern Analysis:

Sequence 1: ABC, DEF, GHI, JKL, ____
- Consecutive letters in groups of 3
- Each group starts 3 positions after previous: A, D(+3), G(+3), J(+3), M(+3)
- Answer: MNO

Sequence 2: 2, 4, 8, 16, ____
- Each number is double the previous (Powers of 2: 2¹, 2², 2³, 2⁴, 2⁵)
- Answer: 32

Sequence 3: AaBb, BbCc, CcDd, DdEe, ____
- Pattern shows lowercase following uppercase in pairs
- Each pair increments: Aa, Bb, Cc, Dd, Ee, Ff
- Next: EeFf (but this completes pattern, next would be FfGg)
- Answer: EeFf

Sequence 4: 1X, 4W, 9V, 16U, ____
- Numbers: 1, 4, 9, 16, 25 (perfect squares: 1², 2², 3², 4², 5²)
- Letters: X, W, V, U, T (reverse from end: -2, -2, -2, -2)
- Answer: 25T

The correct answer is A: MNO, 32, EeFf, 25T`,
        marks: 20
      }
    ]
  }
];

async function seedTcsReasoningAptitude() {
  try {
    console.log('🌱 Seeding TCS Reasoning Aptitude Test...\n');
    console.log('Checking Prisma connection...');

    // Test connection
    const testConnection = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database connection successful');

    for (const test of TCS_REASONING_APTITUDE_TESTS) {
      console.log(`Processing: ${test.title}`);

      const created = await prisma.aptitudeTest.create({
        data: {
          title: test.title,
          category: test.category,
          difficulty: test.difficulty,
          duration: test.duration,
          totalMarks: test.totalMarks,
          company: test.company,
          isActive: test.isActive,
          questions: test.questions as any
        }
      });

      console.log(`✅ Created: ${created.title} (ID: ${created.id})`);
    }

    const total = await prisma.aptitudeTest.count({
      where: {
        category: 'reasoning',
        company: 'TCS'
      }
    });

    console.log(`\n✨ Success! Added ${TCS_REASONING_APTITUDE_TESTS.length} TCS Reasoning Aptitude test`);
    console.log(`📊 Total TCS Reasoning Aptitude tests: ${total}`);
    console.log(`\n🔍 Access these tests at: GET /api/placement/aptitude/tests?category=reasoning&company=TCS`);

    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error seeding TCS Reasoning aptitude:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

seedTcsReasoningAptitude();
