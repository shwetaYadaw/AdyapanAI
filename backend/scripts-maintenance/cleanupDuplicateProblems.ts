import { prisma } from '../config/prisma';

async function cleanupDuplicateProblems() {
  try {
    // IDs of the 10 NEW problems I created (to be deleted)
    const newProblemIds = [
      "022053ad-2bdb-43f8-b3ce-36e2a5a2a47a",    // minimum-coins-specific-denominations
      "c85339b6-4378-4898-9dd5-ffc40a20afbe",    // jump-game-ii
      "74f3a774-8400-4830-a266-7f62b68c0387",    // maximum-height-stacking-cuboids
      "18c44c1d-1bba-4bd4-bc4a-8e44b7a660eb",    // jump-game
      "7d5287f4-2f3a-436d-95eb-01db6ca47e6c",    // minimum-cost-coins-k-extra
      "1c31fbeb-4f3b-4725-877c-ba7099b93ddd",    // max-equal-sum-three-stacks
      "0bc75ee0-17df-454e-a643-b951e46f2660",    // minimum-arrows-burst-balloons
      "6d2888da-a85a-4af3-8ba4-013fc3b1cf3d",    // gas-station
      "b24ea478-0592-4db9-ab49-457a5446aa30",    // minimize-cash-flow
      "673a9155-2fa9-421b-bf48-e8d32e667c90"     // minimum-absolute-sum-difference
    ];

    console.log('🗑️ Starting cleanup of duplicate problems...\n');

    for (const id of newProblemIds) {
      const problem = await prisma.question.findUnique({
        where: { id }
      });

      if (problem) {
        await prisma.question.delete({
          where: { id }
        });
        console.log(`✅ Deleted: ${problem.slug} (ID: ${id})`);
      } else {
        console.log(`⏭️  Already deleted or not found: ${id}`);
      }
    }

    console.log('\n✅ Cleanup complete!');
    console.log('Your database has been restored to the original 545 problems.');
    console.log('Now you can UPDATE the 4 existing problems with the new comprehensive content.');

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

cleanupDuplicateProblems();
