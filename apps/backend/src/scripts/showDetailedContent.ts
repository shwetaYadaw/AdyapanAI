import { prisma } from '../config/prisma';

async function showDetailedContent() {
  try {
    console.log('📖 Fetching detailed content for Jump Game problem...\n');

    const jumpGame = await prisma.question.findUnique({
      where: { id: 'e484f9ef-cb3e-4aa2-8e4a-a2f463c8e9f4' }
    });

    if (jumpGame) {
      console.log('═'.repeat(80));
      console.log(`PROBLEM: ${jumpGame.title}`);
      console.log('═'.repeat(80));
      
      console.log(`\n📌 Basic Information:`);
      console.log(`   ID: ${jumpGame.id}`);
      console.log(`   Slug: ${jumpGame.slug}`);
      console.log(`   Difficulty: ${jumpGame.difficulty}`);
      console.log(`   XP Reward: ${jumpGame.xpReward}`);
      const topics = Array.isArray(jumpGame.topics) ? jumpGame.topics : [];
      const companies = Array.isArray(jumpGame.companies) ? jumpGame.companies : [];
      console.log(`   Topics: ${topics.join(', ')}`);
      console.log(`   Companies: ${companies.join(', ')}`);

      console.log(`\n📝 Problem Statement (First 500 chars):`);
      const stmt = (jumpGame.statement as string) || '';
      console.log(stmt.substring(0, 500) + '...\n');

      console.log(`📋 Input Format:`);
      console.log(jumpGame.inputFormat);

      console.log(`\n📋 Output Format:`);
      console.log(jumpGame.outputFormat);

      console.log(`\n⚙️  Constraints:`);
      console.log(jumpGame.constraints);

      console.log(`\n💾 Sample Input/Output:`);
      console.log(`   Input:\n${jumpGame.sampleInput}`);
      console.log(`\n   Output:\n${jumpGame.sampleOutput}`);

      console.log(`\n🔧 Code Templates:`);
      const templates = Array.isArray(jumpGame.templates) ? jumpGame.templates : [];
      templates.forEach((template: any) => {
        console.log(`   ✓ ${template.language}`);
      });

      console.log(`\n✅ Test Cases: ${Array.isArray(jumpGame.testCases) ? (jumpGame.testCases as any[]).length : 0}`);
      const testCases = Array.isArray(jumpGame.testCases) ? (jumpGame.testCases as any[]) : [];
      const visible = testCases.filter((t: any) => !t.isHidden).length;
      const hidden = testCases.filter((t: any) => t.isHidden).length;
      console.log(`   • Visible: ${visible}`);
      console.log(`   • Hidden: ${hidden}`);

      console.log(`\n📌 First 3 Test Cases:`);
      testCases.slice(0, 3).forEach((tc: any, idx: number) => {
        console.log(`\n   Test ${idx + 1}:`);
        console.log(`      Input: ${tc.input.split('\n').join(' ')}`);
        console.log(`      Expected Output: ${tc.output}`);
        console.log(`      Type: ${tc.type} ${tc.isHidden ? '(Hidden)' : '(Visible)'}`);
      });

      console.log(`\n${'═'.repeat(80)}`);
      console.log('✅ Problem has comprehensive content successfully loaded!');
      console.log('═'.repeat(80));

    } else {
      console.log('❌ Problem not found!');
    }

  } catch (error) {
    console.error('❌ Error fetching problem:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

showDetailedContent();
