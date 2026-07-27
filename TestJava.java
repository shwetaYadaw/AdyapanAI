// Java Test File - Smallest Number with Given Digit Count and Sum
import java.util.*;

public class TestJava {
    
    public static String smallestNumberWithDigitSum(int s, int d) {
        if (s < 1 || s > 9 * d) return "-1";
        int[] result = new int[d];
        result[0] = 1;
        int remaining = s - 1;
        for (int i = d - 1; i >= 1 && remaining > 0; i--) {
            int add = Math.min(9, remaining);
            result[i] += add;
            remaining -= add;
        }
        result[0] += remaining;
        if (result[0] > 9) return "-1";
        StringBuilder sb = new StringBuilder();
        for (int digit : result) sb.append(digit);
        return sb.toString();
    }
    
    static class TestCase {
        int s, d;
        String expected;
        TestCase(int s, int d, String expected) {
            this.s = s;
            this.d = d;
            this.expected = expected;
        }
    }
    
    public static void main(String[] args) {
        List<TestCase> testCases = Arrays.asList(
            new TestCase(0, 1, "-1"),
            new TestCase(1, 1, "1"),
            new TestCase(9, 2, "18"),
            new TestCase(20, 3, "299"),
            new TestCase(15, 3, "159"),
            new TestCase(5, 2, "14"),
            new TestCase(1, 2, "-1"),
            new TestCase(2, 1, "2"),
            new TestCase(10, 2, "19"),
            new TestCase(27, 3, "999"),
            new TestCase(5, 1, "5"),
            new TestCase(18, 2, "99"),
            new TestCase(2, 2, "-1"),
            new TestCase(3, 1, "3"),
            new TestCase(11, 2, "29"),
            new TestCase(25, 3, "889"),
            new TestCase(12, 2, "39"),
            new TestCase(9, 1, "9"),
            new TestCase(30, 4, "3999"),
            new TestCase(50, 5, "59999"),
            new TestCase(45, 5, "99999"),
            new TestCase(1, 10, "1000000000"),
            new TestCase(9, 10, "1000000008"),
            new TestCase(91, 10, "-1")
        );
        
        System.out.println("🧪 Java Test Suite\n" + "=".repeat(60));
        int passed = 0, failed = 0;
        
        for (int i = 0; i < testCases.size(); i++) {
            TestCase test = testCases.get(i);
            String result = smallestNumberWithDigitSum(test.s, test.d);
            boolean pass = result.equals(test.expected);
            passed += pass ? 1 : 0;
            failed += !pass ? 1 : 0;
            System.out.println((pass ? "✅" : "❌") + " Test " + (i + 1) + ": s=" + test.s + ", d=" + test.d);
            if (!pass) System.out.println("   Expected: \"" + test.expected + "\" | Got: \"" + result + "\"");
        }
        
        System.out.println("=".repeat(60));
        System.out.printf("\n📊 %d/%d PASSED (%.2f%%)\n\n", passed, testCases.size(), 
                         (double)passed/testCases.size()*100);
    }
}
