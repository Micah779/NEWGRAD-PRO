const response = await fetch(
  "https://careers.microsoft.com/us/en/search-results?keywords=software%20engineer",
  { headers: { "User-Agent": "Mozilla/5.0" } },
);
const html = await response.text();
const match = html.match(/phApp\.ddo\s*=\s*(\{[\s\S]*?\});\s*phApp/);

if (!match) {
  console.log("no phApp.ddo found", response.status);
  process.exit(1);
}

const data = JSON.parse(match[1]);
const jobs = data?.eagerLoadRefineSearch?.data?.jobs ?? [];
console.log("jobs", jobs.length);
console.log(JSON.stringify(jobs.slice(0, 2), null, 2));
