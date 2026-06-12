import * as cheerio from "cheerio";

const pages = [
  ["netflix", "https://jobs.netflix.com/search?query=software%20engineer"],
  ["ms", "https://careers.microsoft.com/us/en/search-results?keywords=software%20engineer"],
  ["meta", "https://www.metacareers.com/jobs?q=software%20engineer"],
  ["google", "https://www.google.com/about/careers/applications/jobs/results/?q=software%20engineer"],
];

for (const [name, url] of pages) {
  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  const html = await response.text();
  const $ = cheerio.load(html);
  const next = html.includes("__NEXT_DATA__");
  const links = [];

  $("a").each((_, element) => {
    const href = $(element).attr("href") ?? "";
    const text = $(element).text().trim();
    if (
      (href.includes("job") || href.includes("position") || href.includes("details")) &&
      text.length > 8
    ) {
      links.push({ text, href });
    }
  });

  console.log(name, response.status, "next", next, "links", links.slice(0, 5));
}
