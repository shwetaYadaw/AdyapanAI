import { Request, Response, NextFunction } from 'express';
import { validationResult, body } from 'express-validator';
import { isValidLanguage } from '../config/languages';

/**
 * Validate request and return errors if any
 */
export function validate(req: Request, res: Response, next: NextFunction): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  next();
}

/**
 * Validation rules for /run endpoint
 */
export const runCodeValidation = [
  body('code').isString().trim().notEmpty().withMessage('Code is required'),
  body('language')
    .isString()
    .trim()
    .notEmpty()
    .custom((value) => isValidLanguage(value))
    .withMessage('Invalid language'),
  body('input').optional().isString(),
  body('timeLimit').optional().isInt({ min: 100, max: 30000 }),
  body('memoryLimit').optional().isInt({ min: 16, max: 1024 }),
];

/**
 * Validation rules for /submit endpoint
 */
export const submitCodeValidation = [
  body('code').isString().trim().notEmpty().withMessage('Code is required'),
  body('language')
    .isString()
    .trim()
    .notEmpty()
    .custom((value) => isValidLanguage(value))
    .withMessage('Invalid language'),
  body('testCases')
    .isArray({ min: 1 })
    .withMessage('At least one test case is required'),
  body('testCases.*.input').isString(),
  body('testCases.*.expectedOutput').optional().isString(),
  body('timeLimit').optional().isInt({ min: 100, max: 30000 }),
  body('memoryLimit').optional().isInt({ min: 16, max: 1024 }),
];
