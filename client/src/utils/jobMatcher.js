/**
 * Client-Side Job Matcher Engine
 * Calculates compatibility score, matching skills, and eligibility breakdown
 */

const COMMON_TECH_SKILLS = [
  "react", "react.js", "node", "node.js", "javascript", "typescript",
  "python", "java", "c++", "c#", "go", "ruby", "php", "sql", "mongodb",
  "express", "express.js", "html", "css", "tailwind", "next.js", "vue",
  "angular", "aws", "docker", "kubernetes", "git", "rest api", "graphql",
  "django", "flask", "spring boot", "data structures", "algorithms",
  "machine learning", "deep learning", "ui/ux", "figma", "postgresql", "mysql"
];

function normalize(text) {
  return String(text || "").trim().toLowerCase();
}

export function calculateClientJobMatch(student, job) {
  const profile = student?.profile || {};
  const studentSkills = (profile.skills || []).map(normalize);

  // Extract skills from job
  const jobSkillsSet = new Set();
  if (Array.isArray(job.requiredSkills) && job.requiredSkills.length > 0) {
    job.requiredSkills.forEach((s) => jobSkillsSet.add(normalize(s)));
  }
  if (Array.isArray(job.requirements)) {
    job.requirements.forEach((req) => {
      COMMON_TECH_SKILLS.forEach((tech) => {
        if (normalize(req).includes(tech)) jobSkillsSet.add(tech);
      });
    });
  }
  const desc = normalize((job.description || "") + " " + (job.title || ""));
  COMMON_TECH_SKILLS.forEach((tech) => {
    if (desc.includes(tech)) jobSkillsSet.add(tech);
  });

  const jobSkills = Array.from(jobSkillsSet);

  const matchingSkills = [];
  const missingSkills = [];

  jobSkills.forEach((reqSkill) => {
    const isMatched = studentSkills.some(
      (s) => s === reqSkill || s.includes(reqSkill) || reqSkill.includes(s)
    );
    if (isMatched) {
      matchingSkills.push(reqSkill);
    } else {
      missingSkills.push(reqSkill);
    }
  });

  let skillScore = 0;
  if (jobSkills.length > 0) {
    skillScore = Math.round((matchingSkills.length / jobSkills.length) * 45);
  } else {
    skillScore = Math.min(45, studentSkills.length * 9);
  }

  // CGPA Score (20 pts)
  const studentCgpa = Number(profile.cgpa || 7.5);
  const requiredCgpa = Number(job.requiredCgpa || 6.0);
  let cgpaScore = 0;
  if (studentCgpa >= requiredCgpa) {
    cgpaScore = 20;
  } else {
    cgpaScore = Math.max(0, Math.round(20 - (requiredCgpa - studentCgpa) * 15));
  }

  // Role Score (15 pts)
  const preferredRole = normalize(profile.preferredRole || "Software Engineer");
  const jobTitle = normalize(job.title || "");
  let roleScore = 5;
  if (jobTitle.includes(preferredRole) || preferredRole.includes(jobTitle)) {
    roleScore = 15;
  } else if (
    ["engineer", "developer", "intern", "analyst"].some((k) => jobTitle.includes(k))
  ) {
    roleScore = 10;
  }

  // Experience Score (10 pts)
  let expScore = 10;
  const studentExp = Number(profile.experienceYears || 0);
  const jobExp = Number(job.experienceLevel || 0);
  if (studentExp < jobExp) expScore = 6;

  // Location Score (10 pts)
  let locScore = 10;
  const prefLoc = normalize(profile.preferredLocation || "remote");
  const jobLoc = normalize(job.location || "");
  if (
    !jobLoc.includes("remote") &&
    !prefLoc.includes("remote") &&
    !jobLoc.includes(prefLoc) &&
    !prefLoc.includes(jobLoc)
  ) {
    locScore = 5;
  }

  const matchScore = Math.min(100, Math.max(15, skillScore + cgpaScore + roleScore + expScore + locScore));
  const isEligible = studentCgpa >= requiredCgpa - 0.5 && matchScore >= 50;

  const reasons = [];
  if (matchingSkills.length > 0) {
    reasons.push(`Matches ${matchingSkills.length} required skill${matchingSkills.length > 1 ? "s" : ""}: ${matchingSkills.slice(0, 3).join(", ")}`);
  }
  if (studentCgpa >= requiredCgpa) {
    reasons.push(`CGPA ${studentCgpa.toFixed(1)} satisfies minimum requirement (${requiredCgpa.toFixed(1)})`);
  }
  if (roleScore >= 10) {
    reasons.push(`Target role aligns with ${job.title}`);
  }

  return {
    matchScore,
    matchingSkills,
    missingSkills,
    eligibilityStatus: isEligible ? "Eligible" : "Needs Review",
    reasons,
    breakdown: {
      skills: skillScore,
      cgpa: cgpaScore,
      role: roleScore,
      experience: expScore,
      location: locScore,
    },
  };
}
