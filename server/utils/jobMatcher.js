/**
 * AI-Powered Job Matching Engine
 * Compares student profile against job requirements across multiple weighted dimensions.
 */

function normalize(text) {
  return String(text || "").trim().toLowerCase();
}

function extractKeywords(str) {
  if (!str) return [];
  return String(str)
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

const COMMON_TECH_SKILLS = [
  "react", "react.js", "node", "node.js", "javascript", "typescript",
  "python", "java", "c++", "c#", "go", "ruby", "php", "sql", "mongodb",
  "express", "express.js", "html", "css", "tailwind", "next.js", "vue",
  "angular", "aws", "docker", "kubernetes", "git", "rest api", "graphql",
  "django", "flask", "spring boot", "data structures", "algorithms",
  "machine learning", "deep learning", "ui/ux", "figma", "postgresql", "mysql"
];

function extractJobSkills(job) {
  const skills = new Set();
  
  if (Array.isArray(job.requiredSkills) && job.requiredSkills.length > 0) {
    job.requiredSkills.forEach((s) => skills.add(normalize(s)));
  }

  if (Array.isArray(job.requirements)) {
    job.requirements.forEach((req) => {
      COMMON_TECH_SKILLS.forEach((tech) => {
        if (normalize(req).includes(tech)) skills.add(tech);
      });
    });
  }

  const desc = normalize(job.description + " " + job.title);
  COMMON_TECH_SKILLS.forEach((tech) => {
    if (desc.includes(tech)) skills.add(tech);
  });

  return Array.from(skills);
}

/**
 * Calculates a match percentage and detailed breakdown between a student and a job.
 * @param {Object} student - User model or profile object
 * @param {Object} job - Job model object
 * @returns {Object} match result { matchScore, matchingSkills, missingSkills, eligibilityStatus, reasons, breakdown }
 */
function calculateJobMatch(student, job) {
  const profile = student?.profile || {};
  const studentSkills = (profile.skills || []).map(normalize);
  const jobSkills = extractJobSkills(job);

  const reasons = [];
  let score = 0;

  // 1. Technical Skills Overlap (Weight: 45 points)
  let skillScore = 0;
  const matchingSkills = [];
  const missingSkills = [];

  if (jobSkills.length > 0) {
    jobSkills.forEach((reqSkill) => {
      const match = studentSkills.some(
        (s) => s === reqSkill || s.includes(reqSkill) || reqSkill.includes(s)
      );
      if (match) {
        matchingSkills.push(reqSkill);
      } else {
        missingSkills.push(reqSkill);
      }
    });

    const skillRatio = matchingSkills.length / jobSkills.length;
    skillScore = Math.round(skillRatio * 45);
    if (matchingSkills.length > 0) {
      reasons.push(
        `Matches ${matchingSkills.length} of ${jobSkills.length} key required skills (${matchingSkills.slice(0, 4).join(", ")})`
      );
    }
    if (missingSkills.length > 0) {
      reasons.push(`Missing key skill requirements: ${missingSkills.slice(0, 3).join(", ")}`);
    }
  } else {
    // If job didn't specify distinct skills, base on student skill breadth
    skillScore = Math.min(45, studentSkills.length * 9);
    reasons.push(`Student profile showcases ${studentSkills.length} verified technical skills`);
  }

  // 2. CGPA & Academic Standing (Weight: 20 points)
  let cgpaScore = 0;
  const studentCgpa = Number(profile.cgpa || 7.5);
  const requiredCgpa = Number(job.requiredCgpa || 6.0);

  if (studentCgpa >= requiredCgpa) {
    cgpaScore = 20;
    reasons.push(`CGPA ${studentCgpa.toFixed(1)} meets or exceeds minimum requirement of ${requiredCgpa.toFixed(1)}`);
  } else {
    const diff = requiredCgpa - studentCgpa;
    cgpaScore = Math.max(0, Math.round(20 - diff * 15));
    reasons.push(`CGPA ${studentCgpa.toFixed(1)} is below the target ${requiredCgpa.toFixed(1)}`);
  }

  // 3. Role Title Relevance (Weight: 15 points)
  let roleScore = 0;
  const preferredRole = normalize(profile.preferredRole || "Software Engineer");
  const jobTitle = normalize(job.title || "");
  const roleKeywords = extractKeywords(preferredRole);
  const titleKeywords = extractKeywords(jobTitle);

  const commonKeywords = roleKeywords.filter((k) => titleKeywords.includes(k));
  if (commonKeywords.length > 0 || preferredRole === jobTitle) {
    roleScore = 15;
    reasons.push(`Target role "${profile.preferredRole}" closely aligns with opportunity title`);
  } else if (titleKeywords.some((k) => ["engineer", "developer", "intern", "analyst"].includes(k))) {
    roleScore = 10;
    reasons.push(`Opportunity aligns with general engineering / tech career path`);
  } else {
    roleScore = 5;
  }

  // 4. Job Type & Experience Level (Weight: 10 points)
  let expScore = 10;
  const studentExp = Number(profile.experienceYears || 0);
  const jobExp = Number(job.experienceLevel || 0);
  if (studentExp >= jobExp) {
    expScore = 10;
    reasons.push(`Experience level matches position criteria`);
  } else {
    expScore = 6;
  }

  // 5. Location Compatibility (Weight: 10 points)
  let locationScore = 10;
  const prefLoc = normalize(profile.preferredLocation || "remote");
  const jobLoc = normalize(job.location || "");

  if (
    jobLoc.includes("remote") ||
    prefLoc.includes("remote") ||
    prefLoc.includes("flexible") ||
    jobLoc.includes(prefLoc) ||
    prefLoc.includes(jobLoc)
  ) {
    locationScore = 10;
    reasons.push(`Location preference (${profile.preferredLocation || "Flexible"}) aligns with role (${job.location})`);
  } else {
    locationScore = 5;
    reasons.push(`Role location is ${job.location}`);
  }

  score = Math.min(100, Math.max(15, skillScore + cgpaScore + roleScore + expScore + locationScore));

  const isEligible = studentCgpa >= (requiredCgpa - 0.5) && score >= 50;

  return {
    matchScore: score,
    matchingSkills: matchingSkills.slice(0, 10),
    missingSkills: missingSkills.slice(0, 10),
    eligibilityStatus: isEligible ? "Eligible" : "Needs Review",
    reasons,
    breakdown: {
      skills: skillScore,
      cgpa: cgpaScore,
      role: roleScore,
      experience: expScore,
      location: locationScore,
    },
  };
}

module.exports = {
  calculateJobMatch,
  extractJobSkills,
};
