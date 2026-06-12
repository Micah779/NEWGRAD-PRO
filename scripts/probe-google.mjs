import * as cheerio from "cheerio";

const url =
  "https://www.google.com/about/careers/applications/jobs/results/?q=new%20grad%20software%20engineer&employment_type=FULL_TIME&page_size=20";
const response = await fetch(url, {
  headers: { "User-Agent": "Mozilla/5.0" },
});
const html = await response.text();
const $ = cheerio.load(html);

const links = [];
$("a[href]").each((_, el) => {
  const href = $(el).attr("href") ?? "";
  const text = $(el).text().trim();
  if (href.includes("/jobs/results/") && text.length > 5) {
    links.push({ text, href });
  }
});

console.log("status", response.status, "links", links.length);
console.log(links.slice(0, 5));

const scripts = [];
$("script").each((_, el) => {
  const content = $(el).html() ?? "";
  if (content.includes("job") && content.length < 50000) {
    scripts.push(content.slice(0, 200));
  }
});
console.log("script snippets", scripts.length);
