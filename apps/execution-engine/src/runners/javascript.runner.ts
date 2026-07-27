import { BaseRunner } from './base.runner';
import { getLanguageConfig } from '../config/languages';

export class JavaScriptRunner extends BaseRunner {
  constructor() {
    super('javascript', getLanguageConfig('javascript'));
  }

  /**
   * JavaScript specific preprocessing (if needed)
   * Could add TypeScript support, custom Node flags, etc.
   */
}
