import * as cheerio from "cheerio";

function decodeHtmlEntities(text) {
  return text
    .replace(/&#34;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

const response = await fetch(
  "https://careers.microsoft.com/us/en/search-results?keywords=software%20engineer",
  { headers: { "User-Agent": "Mozilla/5.0" } },
);
const html = await response.text();
const $ = cheerio.load(html);
const pcsxRaw = $("#pcsx-data").html();

if (!pcsxRaw) {
  console.log("no pcsx-data");
  process.exit(1);
}

const pcsxData = JSON.parse(decodeHtmlEntities(pcsxRaw));
console.log("domain", pcsxData.domain);
const baseFq = pcsxData.configs?.pcsxConfig?.searchConfig?.basePositionFq;
console.log("baseFq", baseFq?.slice(0, 200));

const url = new URL("https://app.eightfold.ai/api/pcsx/search");
url.searchParams.set("domain", pcsxData.domain);
url.searchParams.set("query", "software engineer");
url.searchParams.set("start", "0");
url.searchParams.set("num", "5");
if (baseFq) {
  url.searchParams.set("filterQuery", baseFq);
}

const apiResponse = await fetch(url, {
  headers: {
    "User-Agent": "Mozilla/5.0",
    Accept: "application/json",
    Referer: "https://careers.microsoft.com/",
  },
});

const data = await apiResponse.json();
console.log("api status", apiResponse.status);
console.log("positions", data?.data?.positions?.length ?? 0);
console.log(JSON.stringify(data?.data?.positions?.slice(0, 2), null, 2));
