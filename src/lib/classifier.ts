const INCLUDE_KEYWORDS = [
  "new grad",
  "new graduate",
  "university grad",
  "university graduate",
  "entry level",
  "entry-level",
  "early career",
  "early-career",
  "college grad",
  "college graduate",
  "recent grad",
  "recent graduate",
  "university hire",
  "graduate software",
  "graduate engineer",
  "software engineer i",
  "software dev engineer i",
  "swe i",
  "software developer i",
  "associate software",
  "junior software",
  "2026",
  "2027",
  "2028",
];

const EXCLUDE_KEYWORDS = [
  "senior",
  "staff",
  "principal",
  "lead",
  "manager",
  "director",
  "intern",
  "internship",
  "phd",
  "software engineer ii",
  "software engineer iii",
  "software engineer iv",
  "software dev engineer ii",
  "software dev engineer iii",
  "swe ii",
  "swe iii",
  "vp",
  "head of",
  "architect",
];

const SOFTWARE_KEYWORDS = [
  "software",
  "developer",
  "engineer",
  "swe",
  "programmer",
  "full stack",
  "fullstack",
  "backend",
  "front end",
  "frontend",
  "full-stack",
];

function normalize(text: string) {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function containsKeyword(text: string, keyword: string) {
  if (/^(ii|iii|iv|v)$/.test(keyword)) {
    return new RegExp(`\\b${keyword}\\b`, "i").test(text);
  }

  return text.includes(keyword);
}

export function isSoftwareRole(title: string) {
  const normalized = normalize(title);
  return SOFTWARE_KEYWORDS.some((keyword) => normalized.includes(keyword));
}

export function isNewGradRole(title: string, description = "") {
  const normalized = normalize(`${title} ${description}`);

  if (!isSoftwareRole(title)) {
    return false;
  }

  if (EXCLUDE_KEYWORDS.some((keyword) => containsKeyword(normalized, keyword))) {
    return false;
  }

  return INCLUDE_KEYWORDS.some((keyword) => normalized.includes(keyword));
}

export function classifyJob(title: string, description = "") {
  return {
    isSoftware: isSoftwareRole(title),
    isNewGrad: isNewGradRole(title, description),
  };
}
