const response = await fetch(
  "https://jobs.apple.com/en-us/search?search=software%20engineer",
  { headers: { "User-Agent": "Mozilla/5.0" } },
);
const html = await response.text();
const match = html.match(
  /window\.__staticRouterHydrationData = JSON\.parse\("([\s\S]*?)"\);/,
);

if (!match) {
  console.log("no hydration data");
  process.exit(1);
}

const decoded = JSON.parse(
  match[1]
    .replace(/\\"/g, '"')
    .replace(/\\n/g, "\n")
    .replace(/\\u0026/g, "&")
    .replace(/\\\\/g, "\\"),
);

function findJobs(node, path = "") {
  if (!node || typeof node !== "object") return [];
  if (Array.isArray(node.searchResults)) {
    return node.searchResults;
  }
  if (Array.isArray(node)) {
    return node.flatMap((item, index) => findJobs(item, `${path}[${index}]`));
  }
  return Object.entries(node).flatMap(([key, value]) =>
    findJobs(value, `${path}.${key}`),
  );
}

const jobs = findJobs(decoded);
console.log("jobs found", jobs.length);
console.log(JSON.stringify(jobs.slice(0, 2), null, 2));
