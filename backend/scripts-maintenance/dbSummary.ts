import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
const prisma = new PrismaClient();
async function main() {
  const questions = await prisma.question.count();
  const tcs = await prisma.question.count({ where: { companies: { array_contains: 'TCS' } } });
  const courses = await prisma.course.count();
  const users = await prisma.user.count();
  console.log('');
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║      MySQL Database Summary — ADYAPAN         ║');
  console.log('╠══════════════════════════════════════════════╣');
  console.log('║  Coding Arena Questions : ' + String(questions).padEnd(18) + '║');
  console.log('║  TCS NQT Questions      : ' + String(tcs).padEnd(18) + '║');
  console.log('║  Courses                : ' + String(courses).padEnd(18) + '║');
  console.log('║  Users                  : ' + String(users).padEnd(18) + '║');
  console.log('╚══════════════════════════════════════════════╝');
  await prisma.$disconnect();
}
main().catch(console.error);
