import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { prisma } from '../config/prisma';
import { sendSuccess } from '../utils/response.utils';
import { AppError } from '../middleware/errorHandler.middleware';

const router = Router();

// Apply auth and admin authorization
router.use(authenticate, authorize('admin'));

/**
 * POST /admin/aptitude/seed
 * Seeds sample aptitude data with topics, chapters, and questions
 */
router.post('/seed', async (req, res, next) => {
  try {
    // Check if data already exists
    const existingTopics = await prisma.aptitudeTopic.count();
    if (existingTopics > 0) {
      throw new AppError('Aptitude data already exists. Please delete existing data first.', 409);
    }

    // Create Topics
    const topics = await Promise.all([
      prisma.aptitudeTopic.create({
        data: {
          name: 'Quantitative Aptitude',
          description: 'Mathematical and numerical reasoning questions',
          icon: '🔢',
          order: 1,
        },
      }),
      prisma.aptitudeTopic.create({
        data: {
          name: 'Logical Reasoning',
          description: 'Analytical and logical thinking questions',
          icon: '🧠',
          order: 2,
        },
      }),
      prisma.aptitudeTopic.create({
        data: {
          name: 'Verbal Reasoning',
          description: 'Language and comprehension based questions',
          icon: '📚',
          order: 3,
        },
      }),
    ]);

    // Create Chapters for Quantitative Aptitude
    const quantChapters = await Promise.all([
      prisma.aptitudeChapter.create({
        data: {
          topicId: topics[0].id,
          name: 'Train Problems',
          description: 'Problems related to trains, speed, and distance',
          order: 1,
        },
      }),
      prisma.aptitudeChapter.create({
        data: {
          topicId: topics[0].id,
          name: 'Speed & Distance',
          description: 'Speed, distance, and time problems',
          order: 2,
        },
      }),
      prisma.aptitudeChapter.create({
        data: {
          topicId: topics[0].id,
          name: 'Time & Work',
          description: 'Time and work related problems',
          order: 3,
        },
      }),
    ]);

    // Create Chapters for Logical Reasoning
    const logicChapters = await Promise.all([
      prisma.aptitudeChapter.create({
        data: {
          topicId: topics[1].id,
          name: 'Series',
          description: 'Number and letter series problems',
          order: 1,
        },
      }),
      prisma.aptitudeChapter.create({
        data: {
          topicId: topics[1].id,
          name: 'Analogy',
          description: 'Analogy based problems',
          order: 2,
        },
      }),
      prisma.aptitudeChapter.create({
        data: {
          topicId: topics[1].id,
          name: 'Puzzles',
          description: 'Logic puzzles and problem solving',
          order: 3,
        },
      }),
    ]);

    // Create Chapters for Verbal Reasoning
    const verbalChapters = await Promise.all([
      prisma.aptitudeChapter.create({
        data: {
          topicId: topics[2].id,
          name: 'Reading Comprehension',
          description: 'Passage comprehension and understanding',
          order: 1,
        },
      }),
      prisma.aptitudeChapter.create({
        data: {
          topicId: topics[2].id,
          name: 'Vocabulary',
          description: 'Word meanings and usage',
          order: 2,
        },
      }),
      prisma.aptitudeChapter.create({
        data: {
          topicId: topics[2].id,
          name: 'Grammar',
          description: 'Grammar rules and sentence structure',
          order: 3,
        },
      }),
    ]);

    // Sample Question 1: Train Problem
    await prisma.aptitudeQuestion.create({
      data: {
        chapterId: quantChapters[0].id,
        statement: 'A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?',
        difficulty: 'easy',
        correctOption: 'A',
        explanation:
          'Speed = 60 km/hr = 60 × (5/18) = 16.67 m/s. Time = 9 seconds. Distance = Speed × Time = 16.67 × 9 = 150 metres',
        xpReward: 10,
        companies: 'TCS,Infosys,Wipro',
        timeLimit: 60,
        options: {
          create: [
            { optionKey: 'A', text: '150 metres', isCorrect: true, order: 0 },
            { optionKey: 'B', text: '120 metres', isCorrect: false, order: 1 },
            { optionKey: 'C', text: '180 metres', isCorrect: false, order: 2 },
            { optionKey: 'D', text: '324 metres', isCorrect: false, order: 3 },
          ],
        },
      },
      include: { options: true },
    });

    // Sample Question 2: Train Problem
    await prisma.aptitudeQuestion.create({
      data: {
        chapterId: quantChapters[0].id,
        statement: 'Two trains are running in opposite directions at speeds of 50 km/hr and 70 km/hr. If they are 200 km apart, how long will it take for them to meet?',
        difficulty: 'medium',
        correctOption: 'B',
        explanation:
          'When two trains move in opposite directions, relative speed = 50 + 70 = 120 km/hr. Time = Distance / Speed = 200 / 120 = 1.67 hours = 100 minutes',
        xpReward: 15,
        companies: 'TCS,Infosys',
        timeLimit: 90,
        options: {
          create: [
            { optionKey: 'A', text: '1 hour', isCorrect: false, order: 0 },
            { optionKey: 'B', text: '1 hour 40 minutes', isCorrect: true, order: 1 },
            { optionKey: 'C', text: '2 hours', isCorrect: false, order: 2 },
            { optionKey: 'D', text: '2 hours 30 minutes', isCorrect: false, order: 3 },
          ],
        },
      },
      include: { options: true },
    });

    // Sample Question 3: Series Problem
    await prisma.aptitudeQuestion.create({
      data: {
        chapterId: logicChapters[0].id,
        statement: 'What is the next number in the series? 2, 6, 12, 20, 30, ?',
        difficulty: 'easy',
        correctOption: 'C',
        explanation: 'The pattern is: 1×2, 2×3, 3×4, 4×5, 5×6, 6×7. So the answer is 6×7 = 42',
        xpReward: 10,
        companies: 'TCS,Infosys,Wipro,HCL',
        timeLimit: 45,
        options: {
          create: [
            { optionKey: 'A', text: '36', isCorrect: false, order: 0 },
            { optionKey: 'B', text: '40', isCorrect: false, order: 1 },
            { optionKey: 'C', text: '42', isCorrect: true, order: 2 },
            { optionKey: 'D', text: '48', isCorrect: false, order: 3 },
          ],
        },
      },
      include: { options: true },
    });

    // Sample Question 4: Analogy Problem
    await prisma.aptitudeQuestion.create({
      data: {
        chapterId: logicChapters[1].id,
        statement: 'Flower : Vase :: _____ : Pot',
        difficulty: 'easy',
        correctOption: 'A',
        explanation: 'A flower is kept in a vase, similarly, a plant is kept in a pot.',
        xpReward: 10,
        companies: 'TCS,Infosys',
        timeLimit: 40,
        options: {
          create: [
            { optionKey: 'A', text: 'Plant', isCorrect: true, order: 0 },
            { optionKey: 'B', text: 'Seed', isCorrect: false, order: 1 },
            { optionKey: 'C', text: 'Soil', isCorrect: false, order: 2 },
            { optionKey: 'D', text: 'Water', isCorrect: false, order: 3 },
          ],
        },
      },
      include: { options: true },
    });

    // Sample Question 5: Reading Comprehension
    await prisma.aptitudeQuestion.create({
      data: {
        chapterId: verbalChapters[0].id,
        statement:
          'Passage: "The Internet has revolutionized the way we communicate. It has made the world smaller and connected billions of people." What has the Internet made according to the passage?',
        difficulty: 'easy',
        correctOption: 'B',
        explanation: 'The passage clearly states: "It has made the world smaller and connected billions of people."',
        xpReward: 10,
        companies: 'TCS,Infosys,Wipro',
        timeLimit: 50,
        options: {
          create: [
            { optionKey: 'A', text: 'Better communication', isCorrect: false, order: 0 },
            { optionKey: 'B', text: 'The world smaller and connected billions', isCorrect: true, order: 1 },
            { optionKey: 'C', text: 'Technology advanced', isCorrect: false, order: 2 },
            { optionKey: 'D', text: 'Schools more efficient', isCorrect: false, order: 3 },
          ],
        },
      },
      include: { options: true },
    });

    // Sample Question 6: Vocabulary
    await prisma.aptitudeQuestion.create({
      data: {
        chapterId: verbalChapters[1].id,
        statement: 'What does "Pragmatic" mean?',
        difficulty: 'medium',
        correctOption: 'C',
        explanation: 'Pragmatic means dealing with things in a practical, realistic way based on actual circumstances rather than theory.',
        xpReward: 15,
        companies: 'TCS,Infosys,Wipro,HCL',
        timeLimit: 40,
        options: {
          create: [
            { optionKey: 'A', text: 'Theoretical and abstract', isCorrect: false, order: 0 },
            { optionKey: 'B', text: 'Emotional and sentimental', isCorrect: false, order: 1 },
            { optionKey: 'C', text: 'Practical and realistic', isCorrect: true, order: 2 },
            { optionKey: 'D', text: 'Loud and aggressive', isCorrect: false, order: 3 },
          ],
        },
      },
      include: { options: true },
    });

    // Sample Question 7: Speed & Distance
    await prisma.aptitudeQuestion.create({
      data: {
        chapterId: quantChapters[1].id,
        statement: 'A car travels 120 km in 2 hours and 30 minutes. What is its speed?',
        difficulty: 'easy',
        correctOption: 'A',
        explanation: 'Speed = Distance / Time = 120 km / 2.5 hours = 48 km/hr',
        xpReward: 10,
        companies: 'TCS,Infosys',
        timeLimit: 45,
        options: {
          create: [
            { optionKey: 'A', text: '48 km/hr', isCorrect: true, order: 0 },
            { optionKey: 'B', text: '50 km/hr', isCorrect: false, order: 1 },
            { optionKey: 'C', text: '52 km/hr', isCorrect: false, order: 2 },
            { optionKey: 'D', text: '60 km/hr', isCorrect: false, order: 3 },
          ],
        },
      },
      include: { options: true },
    });

    // Sample Question 8: Grammar
    await prisma.aptitudeQuestion.create({
      data: {
        chapterId: verbalChapters[2].id,
        statement: 'Choose the grammatically correct sentence:',
        difficulty: 'medium',
        correctOption: 'B',
        explanation: 'The correct tense and structure is "He has been working here for five years."',
        xpReward: 15,
        companies: 'TCS,Infosys,Wipro',
        timeLimit: 40,
        options: {
          create: [
            { optionKey: 'A', text: 'He is working here for five years', isCorrect: false, order: 0 },
            { optionKey: 'B', text: 'He has been working here for five years', isCorrect: true, order: 1 },
            { optionKey: 'C', text: 'He works here for five years', isCorrect: false, order: 2 },
            { optionKey: 'D', text: 'He was working here for five years', isCorrect: false, order: 3 },
          ],
        },
      },
      include: { options: true },
    });

    sendSuccess({
      res,
      statusCode: 201,
      data: {
        topics: topics.length,
        chapters: (await prisma.aptitudeChapter.count()),
        questions: (await prisma.aptitudeQuestion.count()),
      },
      message: `Aptitude seed data created successfully! ${topics.length} topics, ${await prisma.aptitudeChapter.count()} chapters, and ${await prisma.aptitudeQuestion.count()} questions.`,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
