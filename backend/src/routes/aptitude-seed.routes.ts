import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { prisma } from '../config/prisma';
import { sendSuccess } from '../utils/response.utils';
import { AppError } from '../middleware/errorHandler.middleware';

const router = Router();
router.use(authenticate, authorize('admin'));

// ─── Complete topic catalogue ─────────────────────────────────────────────────

const DEFAULT_TOPICS: Array<{ section: string; name: string; icon: string; order: number }> = [
  // ── Verbal Ability (20 topics) ──────────────────────────────────────────────
  { section: 'Verbal Ability', name: 'Verbal Analogies',           icon: '🔤', order: 1 },
  { section: 'Verbal Ability', name: 'Synonyms',                   icon: '📖', order: 2 },
  { section: 'Verbal Ability', name: 'Antonyms',                   icon: '📝', order: 3 },
  { section: 'Verbal Ability', name: 'Sentence Completion',        icon: '✍️', order: 4 },
  { section: 'Verbal Ability', name: 'Sentence Correction',        icon: '✏️', order: 5 },
  { section: 'Verbal Ability', name: 'Spotting Errors',            icon: '🔍', order: 6 },
  { section: 'Verbal Ability', name: 'Selecting Words',            icon: '🎯', order: 7 },
  { section: 'Verbal Ability', name: 'Ordering of Words',          icon: '🗂️', order: 8 },
  { section: 'Verbal Ability', name: 'Ordering of Sentences',      icon: '📋', order: 9 },
  { section: 'Verbal Ability', name: 'Paragraph Formation',        icon: '📄', order: 10 },
  { section: 'Verbal Ability', name: 'Logical Sequence of Words',  icon: '🔗', order: 11 },
  { section: 'Verbal Ability', name: 'Idioms and Phrases',         icon: '💬', order: 12 },
  { section: 'Verbal Ability', name: 'One Word Substitution',      icon: '📚', order: 13 },
  { section: 'Verbal Ability', name: 'Change of Voice',            icon: '🎙️', order: 14 },
  { section: 'Verbal Ability', name: 'Direct and Indirect Speech', icon: '💭', order: 15 },
  { section: 'Verbal Ability', name: 'Verbal Classification',      icon: '🏷️', order: 16 },
  { section: 'Verbal Ability', name: 'Essential Part',             icon: '🔑', order: 17 },
  { section: 'Verbal Ability', name: 'Letter and Symbol Series',   icon: '🔡', order: 18 },
  { section: 'Verbal Ability', name: 'Verbal Reasoning',           icon: '🧩', order: 19 },
  { section: 'Verbal Ability', name: 'Reading Comprehension',      icon: '📰', order: 20 },

  // ── Numerical Ability (33 topics) ───────────────────────────────────────────
  { section: 'Numerical Ability', name: 'Numbers',                 icon: '🔢', order: 1 },
  { section: 'Numerical Ability', name: 'HCF and LCM',            icon: '📐', order: 2 },
  { section: 'Numerical Ability', name: 'Decimal Fractions',       icon: '➗', order: 3 },
  { section: 'Numerical Ability', name: 'Simplification',          icon: '🔣', order: 4 },
  { section: 'Numerical Ability', name: 'Square Roots',            icon: '√',  order: 5 },
  { section: 'Numerical Ability', name: 'Cube Roots',              icon: '∛',  order: 6 },
  { section: 'Numerical Ability', name: 'Average',                 icon: '📊', order: 7 },
  { section: 'Numerical Ability', name: 'Problems on Numbers',     icon: '🔢', order: 8 },
  { section: 'Numerical Ability', name: 'Problems on Ages',        icon: '👥', order: 9 },
  { section: 'Numerical Ability', name: 'Surds and Indices',       icon: '📈', order: 10 },
  { section: 'Numerical Ability', name: 'Percentage',              icon: '💯', order: 11 },
  { section: 'Numerical Ability', name: 'Profit and Loss',         icon: '💰', order: 12 },
  { section: 'Numerical Ability', name: 'Ratio and Proportion',    icon: '⚖️', order: 13 },
  { section: 'Numerical Ability', name: 'Partnership',             icon: '🤝', order: 14 },
  { section: 'Numerical Ability', name: 'Chain Rule',              icon: '⛓️', order: 15 },
  { section: 'Numerical Ability', name: 'Time and Work',           icon: '⏱️', order: 16 },
  { section: 'Numerical Ability', name: 'Pipes and Cisterns',      icon: '🚰', order: 17 },
  { section: 'Numerical Ability', name: 'Time and Distance',       icon: '🚗', order: 18 },
  { section: 'Numerical Ability', name: 'Boats and Streams',       icon: '🚣', order: 19 },
  { section: 'Numerical Ability', name: 'Problems on Trains',      icon: '🚂', order: 20 },
  { section: 'Numerical Ability', name: 'Alligation and Mixture',  icon: '🧪', order: 21 },
  { section: 'Numerical Ability', name: 'Simple Interest',         icon: '🏦', order: 22 },
  { section: 'Numerical Ability', name: 'Compound Interest',       icon: '📈', order: 23 },
  { section: 'Numerical Ability', name: 'Logarithms',              icon: '🔬', order: 24 },
  { section: 'Numerical Ability', name: 'Area',                    icon: '📏', order: 25 },
  { section: 'Numerical Ability', name: 'Volume and Surface Area', icon: '📦', order: 26 },
  { section: 'Numerical Ability', name: 'Races and Games',         icon: '🏁', order: 27 },
  { section: 'Numerical Ability', name: 'Calendar',                icon: '📅', order: 28 },
  { section: 'Numerical Ability', name: 'Clock',                   icon: '🕐', order: 29 },
  { section: 'Numerical Ability', name: 'Stocks and Shares',       icon: '📉', order: 30 },
  { section: 'Numerical Ability', name: 'True Discount',           icon: '💸', order: 31 },
  { section: 'Numerical Ability', name: "Banker's Discount",       icon: '🏧', order: 32 },
  { section: 'Numerical Ability', name: 'Data Interpretation',     icon: '📊', order: 33 },

  // ── Logical Reasoning (30 topics) ───────────────────────────────────────────
  { section: 'Logical Reasoning', name: 'Statement and Conclusion', icon: '💡', order: 1 },
  { section: 'Logical Reasoning', name: 'Statement and Assumption', icon: '🤔', order: 2 },
  { section: 'Logical Reasoning', name: 'Statement and Argument',   icon: '⚔️', order: 3 },
  { section: 'Logical Reasoning', name: 'Course of Action',         icon: '🎬', order: 4 },
  { section: 'Logical Reasoning', name: 'Cause and Effect',         icon: '🔄', order: 5 },
  { section: 'Logical Reasoning', name: 'Assertion and Reason',     icon: '📌', order: 6 },
  { section: 'Logical Reasoning', name: 'Syllogism',                icon: '🧩', order: 7 },
  { section: 'Logical Reasoning', name: 'Blood Relations',          icon: '👨‍👩‍👧', order: 8 },
  { section: 'Logical Reasoning', name: 'Direction Sense Test',     icon: '🧭', order: 9 },
  { section: 'Logical Reasoning', name: 'Coding-Decoding',          icon: '🔐', order: 10 },
  { section: 'Logical Reasoning', name: 'Number Series',            icon: '🔢', order: 11 },
  { section: 'Logical Reasoning', name: 'Alphabet Series',          icon: '🔡', order: 12 },
  { section: 'Logical Reasoning', name: 'Letter Series',            icon: '✉️', order: 13 },
  { section: 'Logical Reasoning', name: 'Analogy',                  icon: '🔗', order: 14 },
  { section: 'Logical Reasoning', name: 'Classification',           icon: '📋', order: 15 },
  { section: 'Logical Reasoning', name: 'Ranking Test',             icon: '🏅', order: 16 },
  { section: 'Logical Reasoning', name: 'Seating Arrangement',      icon: '🪑', order: 17 },
  { section: 'Logical Reasoning', name: 'Puzzle Test',              icon: '🧠', order: 18 },
  { section: 'Logical Reasoning', name: 'Data Sufficiency',         icon: '📊', order: 19 },
  { section: 'Logical Reasoning', name: 'Decision Making',          icon: '⚖️', order: 20 },
  { section: 'Logical Reasoning', name: 'Mirror Images',            icon: '🪞', order: 21 },
  { section: 'Logical Reasoning', name: 'Water Images',             icon: '💧', order: 22 },
  { section: 'Logical Reasoning', name: 'Embedded Figures',         icon: '🔲', order: 23 },
  { section: 'Logical Reasoning', name: 'Figure Classification',    icon: '🖼️', order: 24 },
  { section: 'Logical Reasoning', name: 'Figure Series',            icon: '📐', order: 25 },
  { section: 'Logical Reasoning', name: 'Paper Folding',            icon: '📃', order: 26 },
  { section: 'Logical Reasoning', name: 'Paper Cutting',            icon: '✂️', order: 27 },
  { section: 'Logical Reasoning', name: 'Cube and Dice',            icon: '🎲', order: 28 },
  { section: 'Logical Reasoning', name: 'Completion of Figures',    icon: '🖌️', order: 29 },
  { section: 'Logical Reasoning', name: 'Pattern Recognition',      icon: '👁️', order: 30 },
];

// ─── POST /admin/aptitude/seed — Seed all default topics (DB must be empty) ──

router.post('/seed', async (req, res, next) => {
  try {
    const existingCount = await prisma.aptitudeTopic.count();
    if (existingCount > 0) {
      throw new AppError(`Aptitude data already exists (${existingCount} topics). Use /seed/safe to add missing ones.`, 409);
    }

    const created = await prisma.aptitudeTopic.createMany({
      data: DEFAULT_TOPICS.map((t) => ({
        name: t.name,
        section: t.section,
        icon: t.icon,
        order: t.order,
        createdBy: req.user?.userId,
      })),
      skipDuplicates: true,
    });

    sendSuccess({
      res,
      statusCode: 201,
      data: { created: created.count, total: DEFAULT_TOPICS.length },
      message: `Seeded ${created.count} topics (${DEFAULT_TOPICS.filter(t => t.section === 'Verbal Ability').length} Verbal, ${DEFAULT_TOPICS.filter(t => t.section === 'Numerical Ability').length} Numerical, ${DEFAULT_TOPICS.filter(t => t.section === 'Logical Reasoning').length} Logical)`,
    });
  } catch (err) { next(err); }
});

// ─── POST /admin/aptitude/seed/safe — Add only missing topics ────────────────

router.post('/seed/safe', async (req, res, next) => {
  try {
    const existing = await prisma.aptitudeTopic.findMany({ select: { name: true } });
    const existingNames = new Set(existing.map((t) => t.name));
    const missing = DEFAULT_TOPICS.filter((t) => !existingNames.has(t.name));

    if (missing.length === 0) {
      return sendSuccess({ res, data: { created: 0, skipped: existing.length }, message: 'All topics already exist' });
    }

    const created = await prisma.aptitudeTopic.createMany({
      data: missing.map((t) => ({
        name: t.name,
        section: t.section,
        icon: t.icon,
        order: t.order,
        createdBy: req.user?.userId,
      })),
      skipDuplicates: true,
    });

    sendSuccess({
      res,
      statusCode: 201,
      data: { created: created.count, skipped: existing.length, total: DEFAULT_TOPICS.length },
      message: `Added ${created.count} missing topics`,
    });
  } catch (err) { next(err); }
});

// ─── DELETE /admin/aptitude/seed — Wipe all aptitude data ────────────────────

router.delete('/seed', async (req, res, next) => {
  try {
    const deleted = await prisma.aptitudeTopic.deleteMany({});
    sendSuccess({ res, data: { deleted: deleted.count }, message: `Deleted ${deleted.count} topics and all cascaded data` });
  } catch (err) { next(err); }
});

export default router;
