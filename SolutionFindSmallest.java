// Java Solution - Find the smallest number in an array
import java.util.Scanner;

public class SolutionFindSmallest {
    
    public static String findTheSmallestNumberInAnArray(String inputStr) {
        // Split input string and convert to integers
        String[] nums = inputStr.trim().split(" ");
        
        // Find minimum
        int minNum = Integer.parseInt(nums[0]);
        for (int i = 1; i < nums.length; i++) {
            minNum = Math.min(minNum, Integer.parseInt(nums[i]));
        }
        
        return String.valueOf(minNum);
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        if (scanner.hasNextLine()) {
            String input = scanner.nextLine().trim();
            System.out.println(findTheSmallestNumberInAnArray(input));
        }
        
        scanner.close();
    }
}
