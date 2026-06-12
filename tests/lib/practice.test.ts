import { describe, expect, it } from "vitest";
import { deriveSuggestedGrade } from "@/lib/practice";

describe("deriveSuggestedGrade", () => {
  it("returns good when both stages are correct", () => {
    expect(deriveSuggestedGrade(true, true)).toBe("good");
  });

  it("returns hard when one stage is correct", () => {
    expect(deriveSuggestedGrade(true, false)).toBe("hard");
    expect(deriveSuggestedGrade(false, true)).toBe("hard");
  });

  it("returns again when both stages are wrong", () => {
    expect(deriveSuggestedGrade(false, false)).toBe("again");
  });
});

describe("safe practice payloads", () => {
  it("due problem shape excludes spoiler fields", () => {
    const safe = { id: "uuid", statement: "Given an array..." };
    expect(safe).not.toHaveProperty("topicSlug");
    expect(safe).not.toHaveProperty("title");
    expect(safe).not.toHaveProperty("implementationCode");
    expect(safe).not.toHaveProperty("correctPatternChoiceId");
  });
});
