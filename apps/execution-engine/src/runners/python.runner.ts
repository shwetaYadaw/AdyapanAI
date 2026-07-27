import { BaseRunner } from './base.runner';
import { getLanguageConfig } from '../config/languages';

export class PythonRunner extends BaseRunner {
  constructor() {
    super('python', getLanguageConfig('python'));
  }

  /**
   * Python specific preprocessing (if needed)
   * Could add pypy support, custom modules, etc.
   */
}
