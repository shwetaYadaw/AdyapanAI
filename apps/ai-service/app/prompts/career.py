def get_career_recommendation_prompt(skills: list, interests: list, experience: str) -> str:
    return f"""You are ADYAPAN's expert career counselor. Analyze the student profile and provide career recommendations.

Student Profile:
- Skills: {", ".join(skills) if skills else "Not specified"}
- Interests: {", ".join(interests) if interests else "Not specified"}
- Experience: {experience or "Fresher"}

Return ONLY valid JSON:
{{
  "recommendations": [
    {{
      "role": "Job role title",
      "matchScore": 85,
      "description": "What this role involves",
      "requiredSkills": ["skill1", "skill2"],
      "missingSkills": ["skill3", "skill4"],
      "averageSalary": "₹8-15 LPA",
      "growthProspect": "High",
      "courses": ["Course name 1", "Course name 2"]
    }}
  ]
}}

Provide 5 career recommendations sorted by match score descending.
Include both tech and non-tech options where applicable."""


def get_skill_gap_prompt(target_role: str, current_skills: list) -> str:
    return f"""Analyze the skill gap for the target role and provide a detailed learning roadmap.

Target Role: {target_role}
Current Skills: {", ".join(current_skills) if current_skills else "None"}

Return ONLY valid JSON:
{{
  "targetRole": "{target_role}",
  "matchPercentage": 45,
  "strongSkills": ["skill1", "skill2"],
  "missingSkills": [
    {{"skill": "skill name", "priority": "high", "resources": ["Resource 1", "Resource 2"]}}
  ],
  "learningPath": [
    {{
      "step": 1,
      "skill": "Skill to learn",
      "duration": "2 weeks",
      "resources": ["YouTube playlist", "Documentation", "Practice project"]
    }}
  ],
  "estimatedTimeWeeks": 16
}}"""


def get_study_plan_prompt(goal: str, hours_per_day: float, target_date: str, current_level: str) -> str:
    return f"""Create a personalized study plan for the following goal.

Goal: {goal}
Available Hours Per Day: {hours_per_day}
Target Date: {target_date}
Current Level: {current_level or "Beginner"}

Return ONLY valid JSON:
{{
  "goal": "{goal}",
  "totalWeeks": 12,
  "phases": [
    {{
      "phase": 1,
      "title": "Foundation Phase",
      "weeks": 3,
      "topics": ["Topic 1", "Topic 2"],
      "milestones": ["Complete X", "Build Y project"]
    }}
  ],
  "dailySchedule": [
    {{
      "day": "Monday",
      "tasks": ["Task 1 (1 hour)", "Task 2 (30 min)"],
      "estimatedHours": 1.5
    }}
  ]
}}"""


def get_resume_analysis_prompt(resume_text: str, target_role: str) -> str:
    return f"""You are an expert ATS (Applicant Tracking System) and resume reviewer.

Analyze this resume for the target role and provide actionable feedback.

Target Role: {target_role or "Software Engineer"}

Resume:
{resume_text[:3000]}

Return ONLY valid JSON:
{{
  "atsScore": 72,
  "overallRating": 7.5,
  "strengths": ["Clear work experience section", "Good use of action verbs"],
  "weaknesses": ["Missing quantified achievements", "No LinkedIn URL"],
  "suggestions": [
    {{
      "section": "Work Experience",
      "issue": "No quantified achievements",
      "recommendation": "Add metrics like 'Increased performance by 30%'",
      "priority": "high"
    }}
  ],
  "keywordsFound": ["Python", "React", "SQL"],
  "keywordsMissing": ["Docker", "CI/CD", "Agile"],
  "formattingScore": 80,
  "contentScore": 65
}}"""


def get_cover_letter_prompt(resume_text: str, job_description: str, company_name: str) -> str:
    return f"""Write a professional, personalized cover letter.

Company: {company_name}
Job Description: {job_description[:1000]}

Candidate Background (from resume):
{resume_text[:1500]}

Requirements:
- 3-4 paragraphs, professional tone
- Highlight specific match between candidate skills and job requirements
- Show genuine interest in the company
- End with a clear call to action
- Do NOT use generic phrases like "I am writing to apply"
- Return only the cover letter text, no JSON"""


def get_interview_start_prompt(role: str, company: str, level: str, interview_type: str) -> str:
    return f"""You are an experienced interviewer at {company or "a top tech company"}.

Generate an interview session for:
- Role: {role}
- Company: {company or "Top MNC"}
- Level: {level}
- Interview Type: {interview_type}

Return ONLY valid JSON:
{{
  "questions": [
    {{
      "id": "q1",
      "question": "Tell me about yourself and your experience with X",
      "type": "{interview_type}",
      "hints": ["Hint 1 to guide the answer"],
      "followUps": ["Can you elaborate on that?", "What was the outcome?"]
    }}
  ],
  "sessionInfo": {{
    "role": "{role}",
    "company": "{company or "Top MNC"}",
    "estimatedDuration": "45 minutes",
    "tips": ["Tip 1", "Tip 2"]
  }}
}}

Generate 8-10 questions appropriate for the role and level."""


def get_interview_feedback_prompt(question: str, answer: str, role: str) -> str:
    return f"""You are an expert interviewer evaluating a candidate's answer.

Role: {role}
Question: {question}
Candidate's Answer: {answer}

Return ONLY valid JSON:
{{
  "score": 7,
  "strengths": ["Good structure", "Relevant example used"],
  "improvements": ["Add more specific metrics", "Explain the impact more clearly"],
  "modelAnswer": "A strong answer would include...",
  "communication": 8,
  "technical": 7,
  "confidence": 6,
  "feedback": "Overall feedback in 2-3 sentences"
}}"""
