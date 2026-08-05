/**
 * Course/Job Role Configuration
 * Maps each course to relevant programming languages and topics
 * Used to filter Coding Arena and Placement Prep questions per student
 */

export interface CourseConfig {
  id: string;
  name: string;
  category: string;
  languages: string[];        // Primary programming languages
  technologies: string[];     // Related frameworks/tools
  description: string;
}

export const COURSES: CourseConfig[] = [
  // Software Development
  { id: 'software-engineer', name: 'Software Engineer', category: 'Software Development', languages: ['java', 'python', 'cpp', 'c', 'go'], technologies: ['Git', 'Linux', 'SQL'], description: 'Core software engineering with DSA focus' },
  { id: 'full-stack-developer', name: 'Full Stack Developer', category: 'Software Development', languages: ['javascript', 'typescript', 'python', 'java', 'php'], technologies: ['React', 'Angular', 'Node.js', 'Express'], description: 'Frontend + Backend web development' },
  { id: 'frontend-developer', name: 'Frontend Developer', category: 'Software Development', languages: ['javascript', 'typescript'], technologies: ['HTML', 'CSS', 'React', 'Vue', 'Angular'], description: 'UI/UX focused web development' },
  { id: 'backend-developer', name: 'Backend Developer', category: 'Software Development', languages: ['java', 'python', 'go', 'cpp', 'javascript', 'php'], technologies: ['Spring Boot', 'Django', 'Express', '.NET'], description: 'Server-side development' },
  
  // Mobile Development
  { id: 'android-developer', name: 'Mobile App Developer (Android)', category: 'Mobile Development', languages: ['kotlin', 'java'], technologies: ['Android Studio', 'Firebase'], description: 'Native Android development' },
  { id: 'ios-developer', name: 'Mobile App Developer (iOS)', category: 'Mobile Development', languages: ['swift'], technologies: ['Xcode'], description: 'Native iOS development' },
  { id: 'cross-platform-developer', name: 'Cross-Platform Developer', category: 'Mobile Development', languages: ['dart', 'javascript', 'typescript'], technologies: ['Flutter', 'React Native'], description: 'Cross-platform mobile apps' },

  // Data & AI
  { id: 'data-analyst', name: 'Data Analyst', category: 'Data & AI', languages: ['python', 'sql', 'r'], technologies: ['Excel', 'Power BI', 'Tableau'], description: 'Data analysis and visualization' },
  { id: 'data-scientist', name: 'Data Scientist', category: 'Data & AI', languages: ['python', 'r', 'sql'], technologies: ['Pandas', 'NumPy', 'TensorFlow'], description: 'Statistical analysis and ML' },
  { id: 'ml-engineer', name: 'Machine Learning Engineer', category: 'Data & AI', languages: ['python', 'cpp'], technologies: ['PyTorch', 'TensorFlow', 'Scikit-learn'], description: 'ML model development' },
  { id: 'ai-engineer', name: 'AI Engineer', category: 'Data & AI', languages: ['python'], technologies: ['LangChain', 'OpenAI APIs', 'Hugging Face'], description: 'AI/LLM development' },
  { id: 'gen-ai-engineer', name: 'Generative AI Engineer', category: 'Data & AI', languages: ['python', 'javascript'], technologies: ['LLMs', 'RAG', 'Vector Databases'], description: 'Generative AI applications' },
  { id: 'nlp-engineer', name: 'NLP Engineer', category: 'Data & AI', languages: ['python'], technologies: ['Hugging Face', 'SpaCy'], description: 'Natural Language Processing' },
  { id: 'computer-vision-engineer', name: 'Computer Vision Engineer', category: 'Data & AI', languages: ['python', 'cpp'], technologies: ['OpenCV', 'TensorFlow'], description: 'Image/video processing with AI' },

  // DevOps & Cloud
  { id: 'devops-engineer', name: 'DevOps Engineer', category: 'DevOps & Cloud', languages: ['python', 'bash', 'go'], technologies: ['Docker', 'Kubernetes', 'Jenkins'], description: 'CI/CD and infrastructure automation' },
  { id: 'cloud-engineer', name: 'Cloud Engineer', category: 'DevOps & Cloud', languages: ['python', 'go', 'java'], technologies: ['AWS', 'Azure', 'GCP'], description: 'Cloud infrastructure management' },
  { id: 'sre', name: 'Site Reliability Engineer (SRE)', category: 'DevOps & Cloud', languages: ['go', 'python', 'bash'], technologies: ['Kubernetes', 'Prometheus'], description: 'System reliability and scaling' },

  // Security
  { id: 'cybersecurity-analyst', name: 'Cybersecurity Analyst', category: 'Security', languages: ['python', 'bash'], technologies: ['Kali Linux', 'Wireshark'], description: 'Security analysis and defense' },
  { id: 'penetration-tester', name: 'Penetration Tester', category: 'Security', languages: ['python', 'bash', 'ruby'], technologies: ['Metasploit', 'Burp Suite'], description: 'Ethical hacking and security testing' },
  { id: 'ethical-hacker', name: 'Ethical Hacker', category: 'Security', languages: ['python', 'c', 'bash'], technologies: ['Nmap', 'SQLMap'], description: 'Vulnerability assessment' },

  // Data Engineering
  { id: 'data-engineer', name: 'Data Engineer', category: 'Data Engineering', languages: ['python', 'sql', 'scala', 'java'], technologies: ['Airflow', 'Spark'], description: 'Data pipeline development' },
  { id: 'big-data-engineer', name: 'Big Data Engineer', category: 'Data Engineering', languages: ['java', 'scala', 'python'], technologies: ['Spark', 'Hadoop', 'Kafka'], description: 'Large-scale data processing' },
  { id: 'database-admin', name: 'Database Administrator', category: 'Data Engineering', languages: ['sql', 'python'], technologies: ['Oracle', 'MySQL', 'PostgreSQL'], description: 'Database management' },

  // Specialized
  { id: 'blockchain-developer', name: 'Blockchain Developer', category: 'Specialized', languages: ['solidity', 'rust', 'go', 'javascript'], technologies: ['Ethereum', 'Hyperledger'], description: 'Decentralized applications' },
  { id: 'game-developer', name: 'Game Developer', category: 'Specialized', languages: ['cpp', 'c'], technologies: ['Unity', 'Unreal Engine'], description: 'Game programming' },
  { id: 'embedded-systems', name: 'Embedded Systems Engineer', category: 'Specialized', languages: ['c', 'cpp'], technologies: ['RTOS', 'Microcontrollers'], description: 'Hardware-level programming' },
  { id: 'iot-developer', name: 'IoT Developer', category: 'Specialized', languages: ['c', 'cpp', 'python'], technologies: ['Arduino', 'Raspberry Pi'], description: 'Internet of Things' },
  { id: 'robotics-engineer', name: 'Robotics Engineer', category: 'Specialized', languages: ['python', 'cpp'], technologies: ['ROS'], description: 'Robotics software' },

  // QA & Testing
  { id: 'qa-automation', name: 'QA Automation Engineer', category: 'QA & Testing', languages: ['java', 'python', 'javascript'], technologies: ['Selenium', 'Cypress', 'Playwright'], description: 'Test automation' },
  { id: 'automation-test', name: 'Automation Test Engineer', category: 'QA & Testing', languages: ['java', 'python'], technologies: ['Selenium', 'Appium'], description: 'Mobile/web test automation' },

  // Enterprise
  { id: 'erp-developer', name: 'ERP Developer', category: 'Enterprise', languages: ['java', 'python'], technologies: ['SAP', 'Oracle ERP'], description: 'Enterprise resource planning' },
  { id: 'salesforce-developer', name: 'Salesforce Developer', category: 'Enterprise', languages: ['java', 'javascript'], technologies: ['Salesforce Platform'], description: 'CRM development' },

  // FinTech
  { id: 'fintech-developer', name: 'FinTech Developer', category: 'FinTech', languages: ['java', 'python', 'cpp'], technologies: ['Spring Boot', 'Kafka'], description: 'Financial technology' },
  { id: 'quant-developer', name: 'Quantitative Developer', category: 'FinTech', languages: ['cpp', 'python'], technologies: ['Financial Modeling'], description: 'Quantitative finance' },
];

/**
 * Get course config by ID
 */
export function getCourseById(courseId: string): CourseConfig | undefined {
  return COURSES.find(c => c.id === courseId);
}

/**
 * Get all languages for a course
 */
export function getLanguagesForCourse(courseId: string): string[] {
  const course = getCourseById(courseId);
  return course?.languages ?? [];
}

/**
 * Get all courses grouped by category
 */
export function getCoursesByCategory(): Record<string, CourseConfig[]> {
  const grouped: Record<string, CourseConfig[]> = {};
  for (const course of COURSES) {
    if (!grouped[course.category]) grouped[course.category] = [];
    grouped[course.category].push(course);
  }
  return grouped;
}
