import java.util.Scanner;

public class SolutionFinal {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int min = Integer.MAX_VALUE;
        
        while (sc.hasNextInt()) {
            min = Math.min(min, sc.nextInt());
        }
        
        System.out.println(min);
    }
}
