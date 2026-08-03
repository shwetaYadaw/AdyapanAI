import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function main() {
  const count = await prisma.question.count();
  console.log(`Total questions in database: ${count}`);
  await prisma.$disconnect();
}

main();
