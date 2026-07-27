import { BaseRunner } from './base.runner';
import { getLanguageConfig } from '../config/languages';

export class CppRunner extends BaseRunner {
  constructor() {
    super('cpp', getLanguageConfig('cpp'));
  }

  /**
   * C++ specific preprocessing (if needed)
   * Could add sanitizers, custom compile flags, etc.
   */
}
