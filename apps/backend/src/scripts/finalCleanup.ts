import { prisma } from '../config/prisma';

async function finalCleanup() {
  try {
    // The 4 old problems that should be UPDATED (not deleted)
    const keepIds = [
      '0cccc1fa-4067-4845-aefa-019ffa56d613', // minimize-cash-flow-...
      '0e7c8db2-74cd-46c3-a991-dd18e6bbe29c', // gas-station-greedy
      'fb32e963-d583-4c1e-9e1a-76d61c27be28', // jump-game-ii-greedy
      'e484f9ef-cb3e-4aa2-8e4a-a2f463c8e9f4'  // jump-game-greedy
    ];

    console.log('Starting cleanup...\n');
    console.log('Problems to KEEP for updating:');
    keepIds.forEach(id => console.log(`  - ${id}`));

    // Delete all problems created after 2026-07-20 except the 4 old ones we're keeping
    const deleted = await prisma.question.deleteMany({
      where: {
        AND: [
          { createdAt: { gt: new Date('2026-07-20T06:00:00Z') } },
          { id: { notIn: keepIds } }
        ]
      }
    });

    console.log(`\n✅ Deleted ${deleted.count} extra problems created after 2026-07-20`);

    // Verify final count
    const finalCount = await prisma.question.count();
    console.log(`\n📊 Final database count: ${finalCount} problems`);
    
    if (finalCount === 545) {
      console.log('✅ Successfully restored to 545 problems!');
    } else {
      console.log(`⚠️  Expected 545 but have ${finalCount}`);
    }

    // List the 4 problems that remain for update
    console.log('\n\n4 Problems ready for content update:');
    console.log('=====================================\n');
    
    const remaining = await prisma.question.findMany({
      where: { id: { in: keepIds } },
      select: { id: true, title: true, slug: true }
    });

    remaining.forEach((p, idx) => {
      console.log(`${idx + 1}. ID: ${p.id}`);
      console.log(`   Title: ${p.title}`);
      console.log(`   Slug: ${p.slug}\n`);
    });

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

finalCleanup();
