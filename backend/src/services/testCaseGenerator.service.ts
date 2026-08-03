import { logger } from '../utils/logger';

interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  type: 'visible' | 'hidden' | 'edge';
}

interface TestCaseGeneratorConfig {
  problemSlug: string;
  visibleCount?: number;
  hiddenCount?: number;
  edgeCount?: number;
}

/**
 * Test Case Generator Service
 * Dynamically generates test cases for various problems
 */
class TestCaseGeneratorService {
  /**
   * Generate test cases for "Smallest Number with Given Digit Sum" problem
   * 
   * The optimal number N with d digits and digit sum s:
   * - Cannot exist if: s < 1, s > 9*d, or (d == 1 && s == 0)
   * - Minimum possible: first digit >= 1, rest >= 0
   * - Maximum possible: all digits = 9
   * 
   * Algorithm to find smallest N:
   * 1. Fill all d digits with 0 except first = 1 (minimal: 10...0, sum=1)
   * 2. Distribute remaining (s - 1) from RIGHT to LEFT with max 9 per digit
   * 3. Adjust first digit if needed
   */
  generateSmallestNumberCases(config: Partial<TestCaseGeneratorConfig> = {}): TestCase[] {
    const {
      visibleCount = 6,
      hiddenCount = 18,
      edgeCount = 0
    } = config;

    const testCases: TestCase[] = [];
    const generated = new Set<string>(); // Track unique inputs to avoid duplicates

    logger.info(`[TEST CASE GENERATOR] Generating test cases for "Smallest Number with Given Digit Sum"`);

    // ========== VISIBLE TEST CASES (Basic Examples) ==========
    const visibleExamples = [
      { s: 0, d: 1, expected: '-1' },           // Edge: sum 0 with 1 digit
      { s: 1, d: 1, expected: '1' },            // Single digit = sum
      { s: 9, d: 2, expected: '18' },           // 2 digits, sum 9
      { s: 20, d: 3, expected: '299' },         // 3 digits, sum 20
      { s: 15, d: 3, expected: '159' },         // 3 digits, sum 15
      { s: 5, d: 2, expected: '14' }            // 2 digits, sum 5
    ];

    for (const { s, d, expected } of visibleExamples) {
      if (testCases.length >= visibleCount) break;
      const input = `${s} ${d}`;
      if (!generated.has(input)) {
        testCases.push({
          input,
          expectedOutput: expected,
          isHidden: false,
          type: 'visible'
        });
        generated.add(input);
        logger.debug(`[VISIBLE] Input: ${input} → Output: ${expected}`);
      }
    }

    // ========== HIDDEN TEST CASES (Systematic Coverage) ==========
    const hiddenTestCases: Array<{ s: number; d: number }> = [];

    // 1. Edge cases (impossible cases)
    hiddenTestCases.push(
      { s: 0, d: 2 },        // Cannot have 2-digit number with sum 0
      { s: 100, d: 2 },      // Sum too large for 2 digits
      { s: 1, d: 0 },        // 0 digits
      { s: -5, d: 3 },       // Negative sum
      { s: 0, d: 5 }         // Zero sum, multiple digits
    );

    // 2. Single digit cases (d = 1)
    for (let s = 2; s <= 9; s++) {
      hiddenTestCases.push({ s, d: 1 });
    }

    // 3. Two digit cases (d = 2)
    hiddenTestCases.push(
      { s: 1, d: 2 },    // 10
      { s: 2, d: 2 },    // 11
      { s: 10, d: 2 },   // 19
      { s: 11, d: 2 },   // 29
      { s: 18, d: 2 },   // 99
      { s: 19, d: 2 }    // Impossible (max = 18)
    );

    // 4. Three digit cases (d = 3) — various sums
    hiddenTestCases.push(
      { s: 1, d: 3 },    // 100
      { s: 3, d: 3 },    // 111
      { s: 6, d: 3 },    // 114
      { s: 10, d: 3 },   // 118
      { s: 12, d: 3 },   // 129
      { s: 25, d: 3 },   // 799
      { s: 27, d: 3 },   // 999
      { s: 28, d: 3 }    // Impossible (max = 27)
    );

    // 5. Four+ digit cases (d = 4, 5)
    hiddenTestCases.push(
      { s: 1, d: 4 },    // 1000
      { s: 4, d: 4 },    // 1111
      { s: 20, d: 4 },   // 1299
      { s: 36, d: 4 },   // 9999
      { s: 1, d: 5 },    // 10000
      { s: 10, d: 5 }    // 10009
    );

    // Generate expected outputs for hidden test cases
    for (const { s, d } of hiddenTestCases) {
      if (testCases.length >= visibleCount + hiddenCount) break;

      const input = `${s} ${d}`;
      if (!generated.has(input)) {
        const expected = this.calculateSmallestNumber(s, d);
        testCases.push({
          input,
          expectedOutput: expected,
          isHidden: true,
          type: 'hidden'
        });
        generated.add(input);
        logger.debug(`[HIDDEN] Input: ${input} → Output: ${expected}`);
      }
    }

    logger.info(`[TEST CASE GENERATOR] Generated ${testCases.length} test cases (${visibleCount} visible, ${testCases.length - visibleCount} hidden)`);
    return testCases;
  }

  /**
   * Calculate the smallest number with exactly d digits and digit sum s
   * 
   * Returns: The number as a string, or "-1" if impossible
   */
  private calculateSmallestNumber(s: number, d: number): string {
    // ===== VALIDITY CHECK =====
    if (d < 1 || d > 1000 || s < 0 || s > 9000) {
      return '-1'; // Invalid constraints
    }

    // Special case: 1 digit with sum 0 is impossible (no "0" as 1-digit number)
    if (d === 1 && s === 0) {
      return '-1';
    }

    // Minimum possible sum: 1 (first digit) + 0 * (d - 1) = 1
    // Maximum possible sum: 9 * d
    if (s < 1 || s > 9 * d) {
      return '-1';
    }

    // ===== CONSTRUCT THE ANSWER =====
    const digits: number[] = new Array(d).fill(0);

    // Start with first digit = 1 (minimum for d-digit number)
    digits[0] = 1;
    let remaining = s - 1;

    // Fill from right to left, adding min(9, remaining) to each position
    for (let i = d - 1; i >= 1 && remaining > 0; i--) {
      const add = Math.min(9, remaining);
      digits[i] = add;
      remaining -= add;
    }

    // Add any leftover to first digit
    digits[0] += remaining;

    // Edge case: if first digit becomes > 9, it's impossible
    if (digits[0] > 9) {
      return '-1';
    }

    // Convert digits to string
    return digits.join('');
  }

  /**
   * Verify a test case by running it against reference implementation
   */
  verifyTestCase(s: number, d: number, expectedOutput: string): boolean {
    const calculated = this.calculateSmallestNumber(s, d);
    const match = calculated === expectedOutput;

    if (!match) {
      logger.warn(
        `[VERIFY MISMATCH] Input: s=${s}, d=${d} | Expected: ${expectedOutput} | Calculated: ${calculated}`
      );
    }

    return match;
  }

  /**
   * Generate and verify all test cases for a problem
   */
  generateAndVerifyTestCases(config: TestCaseGeneratorConfig): TestCase[] {
    const testCases = this.generateSmallestNumberCases(config);

    // Verify all test cases
    let verifyCount = 0;
    for (const tc of testCases) {
      const [sStr, dStr] = tc.input.split(' ');
      const s = parseInt(sStr, 10);
      const d = parseInt(dStr, 10);

      if (this.verifyTestCase(s, d, tc.expectedOutput)) {
        verifyCount++;
      }
    }

    logger.info(`[VERIFY COMPLETE] ${verifyCount}/${testCases.length} test cases verified successfully`);

    if (verifyCount !== testCases.length) {
      logger.error(`[VERIFY FAILED] ${testCases.length - verifyCount} test cases have mismatches`);
    }

    return testCases;
  }
}

export const testCaseGeneratorService = new TestCaseGeneratorService();
