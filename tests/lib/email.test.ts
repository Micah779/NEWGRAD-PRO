import { describe, expect, it } from "vitest";
import { buildDigestHtml } from "@/lib/email";

describe("buildDigestHtml", () => {
  it("includes header, stats, listings, and footer", () => {
    const html = buildDigestHtml(
      [
        {
          companyName: "Stripe",
          title: "New Grad Software Engineer",
          locations: ["San Francisco, CA"],
          url: "https://stripe.com/jobs/1",
        },
      ],
      {
        companiesChecked: 153,
        companiesDisabled: 53,
        companiesFailed: 2,
      },
    );

    expect(html).toContain("Micah - New Grad Jobs");
    expect(html).toContain("Stripe");
    expect(html).toContain("New Grad Software Engineer");
    expect(html).toContain("153</strong> companies checked");
    expect(html).toContain("53</strong> disabled");
    expect(html).toContain("2</strong> could not be checked");
    expect(html).toContain("lock in, you wont regret it");
  });

  it("handles zero new listings", () => {
    const html = buildDigestHtml([], {
      companiesChecked: 10,
      companiesDisabled: 3,
      companiesFailed: 1,
    });

    expect(html).toContain("No new new-grad openings");
    expect(html).toContain("0</strong> new listing");
  });
});
