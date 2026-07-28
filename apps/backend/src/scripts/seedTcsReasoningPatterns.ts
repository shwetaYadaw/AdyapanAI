import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

const TCS_REASONING_PATTERNS = [
  {
    title: 'Identify Word and Numeric Pattern - Series 1',
    description: 'Find the missing elements in word and numeric sequences',
    puzzleType: 'pattern',
    difficulty: 'medium',
    question: `Analyze the following word and numeric pattern sequences and identify the missing elements:

1. SCD, TEF, UGH, ____, WKLCMNUJIVIJIJT2
   B2CD, _____, BCD4, B5CD, BC6DB2C2DBC3DB2C3DBCD7

2. 3.FAG, GAF, HAI, IAH, ____
   JAKHALHAKJAI

3. 4.ELFA, GLHA, ILJA, _____, MLNA
   OLPAKLMALLMAKLLA

4. 5.CMM, EOO, GQQ, _____, KUU
   GRGSSISSITT

Identify the pattern and provide the missing terms.`,
    options: JSON.stringify([
      {
        id: 'a',
        description: 'First blank: VIJI, Second blank: B3CD, Third blank: JAKH, Fourth blank: KSMM, Fifth blank: GRG'
      },
      {
        id: 'b',
        description: 'First blank: VIJI, Second blank: B3CD, Third blank: JAKH, Fourth blank: MMNM, Fifth blank: GRG'
      },
      {
        id: 'c',
        description: 'First blank: VIJK, Second blank: B2CD, Third blank: KBJI, Fourth blank: MNNM, Fifth blank: GRF'
      },
      {
        id: 'd',
        description: 'First blank: WIJK, Second blank: C3CD, Third blank: LBKI, Fourth blank: NNNO, Fifth blank: HRI'
      }
    ]),
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
    category: 'TCS Reasoning',
    topic: 'Word and Numeric Pattern',
    tags: JSON.stringify(['tcs-nqt', 'pattern-recognition', 'reasoning', 'verbal-ability']),
    estimatedTime: 180,
    isPublished: true,
    createdBy: 'admin'
  },
  {
    title: 'Identify Word and Numeric Pattern - Series 2',
    description: 'Complex letter and number sequence pattern recognition',
    puzzleType: 'pattern',
    difficulty: 'hard',
    question: `Analyze the following pattern:

Pattern 1: AAB, BCC, CDD, DEE, ____
Pattern 2: 1A2, 2B4, 3C6, 4D8, ____
Pattern 3: XYZ, YZW, ZWV, WVU, ____

Find the missing terms and identify the rule governing each sequence.`,
    options: JSON.stringify([
      {
        id: 'a',
        description: 'Pattern 1: EFF, Pattern 2: 5E10, Pattern 3: VUT'
      },
      {
        id: 'b',
        description: 'Pattern 1: EFF, Pattern 2: 5E10, Pattern 3: UTS'
      },
      {
        id: 'c',
        description: 'Pattern 1: EFF, Pattern 2: 6E12, Pattern 3: VUT'
      },
      {
        id: 'd',
        description: 'Pattern 1: FGG, Pattern 2: 5E10, Pattern 3: UTS'
      }
    ]),
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
    category: 'TCS Reasoning',
    topic: 'Word and Numeric Pattern',
    tags: JSON.stringify(['tcs-nqt', 'pattern-recognition', 'reasoning', 'advanced']),
    estimatedTime: 240,
    isPublished: true,
    createdBy: 'admin'
  }
];

async function seedTcsReasoningPatterns() {
  try {
    console.log('🌱 Seeding TCS Reasoning Pattern Recognition Questions...\n');
    console.log('Checking Prisma connection...');

    // Test connection
    const testConnection = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database connection successful');

    for (let i = 0; i < TCS_REASONING_PATTERNS.length; i++) {
      const puzzle = TCS_REASONING_PATTERNS[i];
      console.log(`Processing: ${puzzle.title}`);

      const created = await prisma.puzzle.create({
        data: {
          title: puzzle.title,
          description: puzzle.description,
          puzzleType: puzzle.puzzleType,
          difficulty: puzzle.difficulty,
          question: puzzle.question,
          options: JSON.parse(puzzle.options),
          correctAnswer: puzzle.correctAnswer,
          explanation: puzzle.explanation,
          category: puzzle.category,
          topic: puzzle.topic,
          tags: JSON.parse(puzzle.tags),
          estimatedTime: puzzle.estimatedTime,
          isPublished: puzzle.isPublished,
          createdBy: puzzle.createdBy
        }
      });

      console.log(`✅ Created: ${created.title} (ID: ${created.id})`);
    }

    const total = await prisma.puzzle.count({
      where: {
        category: 'TCS Reasoning',
        topic: 'Word and Numeric Pattern'
      }
    });

    console.log(`\n✨ Success! Added ${TCS_REASONING_PATTERNS.length} TCS Reasoning Pattern questions`);
    console.log(`📊 Total TCS Reasoning Pattern puzzles: ${total}`);
    console.log(`\n🔍 Access these puzzles at: GET /api/puzzles?category=TCS Reasoning&topic=Word%20and%20Numeric%20Pattern`);

    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error seeding TCS Reasoning patterns:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

seedTcsReasoningPatterns();
