/**
 * Course/Domain Configuration
 * All courses grouped by department/domain
 */

export interface CourseConfig {
  id: string;
  name: string;
  category: string;
  languages: string[];
  technologies: string[];
  description: string;
}

export const COURSES: CourseConfig[] = [
  // ─── CSE / IT DOMAINS ───────────────────────────────────────────────
  { id: 'dotnet', name: '.NET', category: 'CSE / IT Domains', languages: ['csharp', 'sql'], technologies: ['ASP.NET', 'Entity Framework', 'Azure'], description: '.NET development with C#' },
  { id: 'ai-domain', name: 'AI Domain', category: 'CSE / IT Domains', languages: ['python'], technologies: ['TensorFlow', 'PyTorch', 'OpenAI'], description: 'Artificial Intelligence' },
  { id: 'ai-ml', name: 'AI/ML', category: 'CSE / IT Domains', languages: ['python', 'r'], technologies: ['Scikit-learn', 'TensorFlow', 'Keras'], description: 'AI and Machine Learning' },
  { id: 'agentic-ai', name: 'Agentic AI', category: 'CSE / IT Domains', languages: ['python', 'javascript'], technologies: ['LangChain', 'AutoGPT', 'CrewAI'], description: 'Autonomous AI Agents' },
  { id: 'app-development', name: 'App Development', category: 'CSE / IT Domains', languages: ['kotlin', 'swift', 'dart', 'javascript'], technologies: ['Flutter', 'React Native', 'Android', 'iOS'], description: 'Mobile app development' },
  { id: 'ar-vr', name: 'AR/VR', category: 'CSE / IT Domains', languages: ['csharp', 'cpp'], technologies: ['Unity', 'Unreal Engine', 'ARKit'], description: 'Augmented & Virtual Reality' },
  { id: 'aws', name: 'AWS', category: 'CSE / IT Domains', languages: ['python', 'javascript', 'java'], technologies: ['Lambda', 'EC2', 'S3', 'CloudFormation'], description: 'Amazon Web Services' },
  { id: 'azure', name: 'Azure', category: 'CSE / IT Domains', languages: ['csharp', 'python', 'javascript'], technologies: ['Azure Functions', 'AKS', 'DevOps'], description: 'Microsoft Azure Cloud' },
  { id: 'blockchain', name: 'Blockchain', category: 'CSE / IT Domains', languages: ['solidity', 'rust', 'javascript'], technologies: ['Ethereum', 'Hyperledger', 'Web3.js'], description: 'Blockchain & Web3' },
  { id: 'ccna', name: 'CCNA 200-301', category: 'CSE / IT Domains', languages: ['python', 'bash'], technologies: ['Cisco', 'Networking', 'TCP/IP'], description: 'Cisco networking certification' },
  { id: 'cyber-security', name: 'Cyber Security', category: 'CSE / IT Domains', languages: ['python', 'bash', 'c'], technologies: ['Kali Linux', 'Wireshark', 'Metasploit'], description: 'Cybersecurity & ethical hacking' },
  { id: 'data-analytics', name: 'Data Analytics', category: 'CSE / IT Domains', languages: ['python', 'sql', 'r'], technologies: ['Power BI', 'Tableau', 'Excel'], description: 'Data analysis & visualization' },
  { id: 'data-engineering', name: 'Data Engineering', category: 'CSE / IT Domains', languages: ['python', 'sql', 'scala'], technologies: ['Spark', 'Airflow', 'Kafka'], description: 'Data pipelines & ETL' },
  { id: 'data-science', name: 'Data Science', category: 'CSE / IT Domains', languages: ['python', 'r', 'sql'], technologies: ['Pandas', 'NumPy', 'TensorFlow', 'Jupyter'], description: 'Data science & statistics' },
  { id: 'devops', name: 'DevOps', category: 'CSE / IT Domains', languages: ['python', 'bash', 'go'], technologies: ['Docker', 'Kubernetes', 'Jenkins', 'Terraform'], description: 'CI/CD & infrastructure' },
  { id: 'docker', name: 'Docker', category: 'CSE / IT Domains', languages: ['python', 'bash', 'go'], technologies: ['Docker', 'Docker Compose', 'Kubernetes'], description: 'Containerization' },
  { id: 'dsa-system-design', name: 'DSA & System Design', category: 'CSE / IT Domains', languages: ['java', 'python', 'cpp', 'javascript'], technologies: ['LeetCode', 'System Design'], description: 'Data Structures, Algorithms & System Design' },
  { id: 'full-stack', name: 'Full Stack Development', category: 'CSE / IT Domains', languages: ['javascript', 'typescript', 'python', 'java'], technologies: ['React', 'Node.js', 'MongoDB', 'PostgreSQL'], description: 'Full stack web development' },
  { id: 'gen-ai-llm', name: 'Generative AI & LLM', category: 'CSE / IT Domains', languages: ['python', 'javascript'], technologies: ['OpenAI', 'LangChain', 'RAG', 'Vector DB'], description: 'Generative AI & Large Language Models' },
  { id: 'graphic-design', name: 'Graphic Design', category: 'CSE / IT Domains', languages: [], technologies: ['Photoshop', 'Illustrator', 'Figma', 'Canva'], description: 'Visual design & graphics' },
  { id: 'java', name: 'Java', category: 'CSE / IT Domains', languages: ['java'], technologies: ['Spring Boot', 'Hibernate', 'Maven'], description: 'Java programming & frameworks' },
  { id: 'java-full-stack', name: 'Java Full Stack', category: 'CSE / IT Domains', languages: ['java', 'javascript', 'typescript'], technologies: ['Spring Boot', 'React', 'Angular', 'MySQL'], description: 'Java full stack development' },
  { id: 'manual-testing', name: 'Manual Testing', category: 'CSE / IT Domains', languages: ['sql'], technologies: ['Jira', 'TestRail', 'Postman'], description: 'Software manual testing' },
  { id: 'machine-learning', name: 'Machine Learning (ML)', category: 'CSE / IT Domains', languages: ['python', 'r'], technologies: ['Scikit-learn', 'XGBoost', 'TensorFlow'], description: 'Machine learning algorithms' },
  { id: 'metaverse', name: 'Metaverse', category: 'CSE / IT Domains', languages: ['csharp', 'cpp', 'javascript'], technologies: ['Unity', 'Unreal', 'Three.js'], description: 'Metaverse development' },
  { id: 'python', name: 'Python', category: 'CSE / IT Domains', languages: ['python'], technologies: ['Django', 'Flask', 'FastAPI'], description: 'Python programming' },
  { id: 'python-full-stack', name: 'Python Full Stack Development', category: 'CSE / IT Domains', languages: ['python', 'javascript'], technologies: ['Django', 'React', 'PostgreSQL'], description: 'Python full stack' },
  { id: 'quantum-computing', name: 'Quantum Computing', category: 'CSE / IT Domains', languages: ['python'], technologies: ['Qiskit', 'Cirq', 'Quantum Gates'], description: 'Quantum computing basics' },
  { id: 'selenium-testing', name: 'Selenium Testing', category: 'CSE / IT Domains', languages: ['java', 'python'], technologies: ['Selenium', 'TestNG', 'Cucumber'], description: 'Automated testing with Selenium' },
  { id: 'servicenow', name: 'ServiceNow', category: 'CSE / IT Domains', languages: ['javascript'], technologies: ['ServiceNow Platform', 'ITSM'], description: 'ServiceNow administration' },
  { id: 'ui-ux-design', name: 'UI/UX Design', category: 'CSE / IT Domains', languages: [], technologies: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'], description: 'User interface & experience design' },
  { id: 'web3', name: 'Web3', category: 'CSE / IT Domains', languages: ['solidity', 'javascript', 'rust'], technologies: ['Ethereum', 'IPFS', 'DeFi'], description: 'Decentralized web' },

  // ─── ECE / EEE DOMAINS ─────────────────────────────────────────────
  { id: 'electrical-cad', name: 'Electrical CAD', category: 'ECE / EEE Domains', languages: [], technologies: ['AutoCAD Electrical', 'EPLAN'], description: 'Electrical CAD design' },
  { id: 'embedded-systems', name: 'Embedded Systems', category: 'ECE / EEE Domains', languages: ['c', 'cpp'], technologies: ['RTOS', 'ARM', 'Microcontrollers'], description: 'Embedded programming' },
  { id: 'iot', name: 'Internet of Things (IoT)', category: 'ECE / EEE Domains', languages: ['c', 'cpp', 'python'], technologies: ['Arduino', 'Raspberry Pi', 'MQTT'], description: 'IoT development' },
  { id: 'hybrid-electric-vehicles', name: 'Hybrid & Electric Vehicles', category: 'ECE / EEE Domains', languages: [], technologies: ['MATLAB', 'Simulink', 'Battery Management'], description: 'EV technology' },
  { id: 'industrial-robotics', name: 'Industrial Robotics', category: 'ECE / EEE Domains', languages: ['python', 'cpp'], technologies: ['ROS', 'PLC', 'SCADA'], description: 'Industrial automation' },
  { id: 'robotics', name: 'Robotics', category: 'ECE / EEE Domains', languages: ['python', 'cpp'], technologies: ['ROS', 'OpenCV', 'Gazebo'], description: 'Robotics engineering' },
  { id: 'vlsi', name: 'VLSI', category: 'ECE / EEE Domains', languages: ['verilog', 'vhdl'], technologies: ['Cadence', 'Synopsys', 'FPGA'], description: 'VLSI chip design' },
  { id: 'drone-engineering', name: 'Drone Engineering', category: 'ECE / EEE Domains', languages: ['python', 'cpp'], technologies: ['ArduPilot', 'PX4', 'Flight Controllers'], description: 'Drone/UAV development' },

  // ─── Mechanical DOMAINS ─────────────────────────────────────────────
  { id: 'autocad', name: 'AutoCAD', category: 'Mechanical Domains', languages: [], technologies: ['AutoCAD', '2D/3D Drafting'], description: 'Computer-aided design' },
  { id: 'catia', name: 'CATIA', category: 'Mechanical Domains', languages: [], technologies: ['CATIA V5', '3D Modeling', 'Surface Design'], description: 'CATIA 3D modeling' },
  { id: 'car-design', name: 'Car Design', category: 'Mechanical Domains', languages: [], technologies: ['SolidWorks', 'CATIA', 'CFD'], description: 'Automobile design' },
  { id: 'machine-design', name: 'Machine Design', category: 'Mechanical Domains', languages: [], technologies: ['SolidWorks', 'ANSYS', 'FEA'], description: 'Mechanical machine design' },
  { id: 'ic-engine-design', name: 'IC Engine Design', category: 'Mechanical Domains', languages: [], technologies: ['MATLAB', 'ANSYS', 'Thermodynamics'], description: 'Internal combustion engines' },

  // ─── Chemical DOMAINS ───────────────────────────────────────────────
  { id: 'aspen-plus', name: 'Aspen Plus', category: 'Chemical Domains', languages: [], technologies: ['Aspen Plus', 'Process Simulation'], description: 'Chemical process simulation' },
  { id: 'aspen-hysys', name: 'Aspen HYSYS', category: 'Chemical Domains', languages: [], technologies: ['Aspen HYSYS', 'Oil & Gas Simulation'], description: 'Oil & gas process simulation' },

  // ─── Civil DOMAINS ──────────────────────────────────────────────────
  { id: 'construction-planning', name: 'Construction Planning', category: 'Civil Domains', languages: [], technologies: ['Primavera', 'MS Project', 'BIM'], description: 'Construction project management' },

  // ─── Management DOMAINS ─────────────────────────────────────────────
  { id: 'acca-f4', name: 'ACCA F4 Business', category: 'Management Domains', languages: [], technologies: ['Corporate Law', 'Business Ethics'], description: 'ACCA Business Law' },
  { id: 'business-analytics', name: 'Business Analytics', category: 'Management Domains', languages: ['python', 'sql', 'r'], technologies: ['Power BI', 'Tableau', 'Excel'], description: 'Business data analytics' },
  { id: 'digital-marketing', name: 'Digital Marketing', category: 'Management Domains', languages: [], technologies: ['Google Ads', 'SEO', 'Social Media'], description: 'Digital marketing strategies' },
  { id: 'entrepreneurship', name: 'Entrepreneurship', category: 'Management Domains', languages: [], technologies: ['Business Planning', 'Startups'], description: 'Startup & business' },
  { id: 'finance', name: 'Finance', category: 'Management Domains', languages: ['python', 'sql'], technologies: ['Excel', 'Financial Modeling'], description: 'Financial analysis' },
  { id: 'human-resource', name: 'Human Resource', category: 'Management Domains', languages: [], technologies: ['HR Analytics', 'Recruitment'], description: 'Human resource management' },
  { id: 'investment-banking', name: 'Investment Banking', category: 'Management Domains', languages: ['python'], technologies: ['Financial Modeling', 'Excel', 'Bloomberg'], description: 'Investment banking & finance' },
  { id: 'microsoft-excel', name: 'Microsoft Excel', category: 'Management Domains', languages: [], technologies: ['Excel', 'VBA', 'Macros', 'Pivot Tables'], description: 'Advanced Excel' },
  { id: 'placement-preparation', name: 'Placement Preparation', category: 'Management Domains', languages: ['java', 'python', 'cpp'], technologies: ['Aptitude', 'Reasoning', 'DSA'], description: 'Campus placement prep' },
  { id: 'power-bi', name: 'Power BI', category: 'Management Domains', languages: ['sql'], technologies: ['Power BI', 'DAX', 'Data Modeling'], description: 'Business intelligence with Power BI' },
  { id: 'salesforce', name: 'Salesforce', category: 'Management Domains', languages: ['javascript'], technologies: ['Salesforce', 'Apex', 'Lightning'], description: 'Salesforce CRM' },
  { id: 'sap', name: 'SAP', category: 'Management Domains', languages: ['abap'], technologies: ['SAP ERP', 'SAP Fiori'], description: 'SAP ERP systems' },
  { id: 'sap-grc-arm', name: 'SAP GRC ARM', category: 'Management Domains', languages: [], technologies: ['SAP GRC', 'Access Risk Management'], description: 'SAP governance & risk' },
  { id: 'sap-mm', name: 'SAP MM', category: 'Management Domains', languages: [], technologies: ['SAP MM', 'Materials Management'], description: 'SAP Materials Management' },
  { id: 'sap-successfactors', name: 'SAP SuccessFactors', category: 'Management Domains', languages: [], technologies: ['SAP SF', 'HR Cloud'], description: 'SAP HR module' },
  { id: 'stock-market', name: 'Stock Marketing', category: 'Management Domains', languages: ['python'], technologies: ['Technical Analysis', 'Trading'], description: 'Stock market & trading' },
  { id: 'supply-chain', name: 'Supply Chain Management', category: 'Management Domains', languages: [], technologies: ['SCM', 'Logistics', 'ERP'], description: 'Supply chain operations' },

  // ─── Medical, Pharma & Bio DOMAINS ──────────────────────────────────
  { id: 'bioinformatics', name: 'Bioinformatics', category: 'Medical, Pharma & Bio Domains', languages: ['python', 'r'], technologies: ['BLAST', 'Genomics Tools'], description: 'Computational biology' },
  { id: 'biostatistics', name: 'Biostatistics', category: 'Medical, Pharma & Bio Domains', languages: ['r', 'python', 'sas'], technologies: ['SPSS', 'SAS', 'Clinical Trials'], description: 'Statistical analysis in health' },
  { id: 'clinical-sas', name: 'Clinical SAS', category: 'Medical, Pharma & Bio Domains', languages: ['sas'], technologies: ['SAS', 'Clinical Data Management'], description: 'Clinical SAS programming' },
  { id: 'genetic-engineering', name: 'Genetic Engineering', category: 'Medical, Pharma & Bio Domains', languages: ['python'], technologies: ['CRISPR', 'Gene Editing'], description: 'Genetic engineering' },
  { id: 'microbiology', name: 'Microbiology', category: 'Medical, Pharma & Bio Domains', languages: [], technologies: ['Lab Techniques', 'Microscopy'], description: 'Microbiology studies' },
  { id: 'molecular-biology', name: 'Molecular Biology', category: 'Medical, Pharma & Bio Domains', languages: ['python'], technologies: ['PCR', 'Gel Electrophoresis'], description: 'Molecular biology' },
  { id: 'nano-science', name: 'Nano Science & Technology', category: 'Medical, Pharma & Bio Domains', languages: [], technologies: ['Nanomaterials', 'AFM', 'SEM'], description: 'Nanotechnology' },
];

export function getCourseById(courseId: string): CourseConfig | undefined {
  return COURSES.find(c => c.id === courseId);
}

export function getLanguagesForCourse(courseId: string): string[] {
  const course = getCourseById(courseId);
  return course?.languages ?? [];
}

export function getCoursesByCategory(): Record<string, CourseConfig[]> {
  const grouped: Record<string, CourseConfig[]> = {};
  for (const course of COURSES) {
    if (!grouped[course.category]) grouped[course.category] = [];
    grouped[course.category].push(course);
  }
  return grouped;
}
