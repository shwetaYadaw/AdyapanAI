export interface Question {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface Topic {
  name: string;
  pageNumber: number;
  questions: Question[];
}

/** Convert a topic name to a URL-safe slug. e.g. "Profit & Loss" → "profit-loss" */
export function topicSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

/** Find a topic in an array by its slug */
export function findTopic(topics: Topic[], slug: string): Topic | undefined {
  return topics.find((t) => topicSlug(t.name) === slug);
}
