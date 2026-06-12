import { describe, expect, it } from "vitest";
import { classifyJob, isNewGradRole, isSoftwareRole } from "./classifier";

describe("classifier", () => {
  it("detects software roles", () => {
    expect(isSoftwareRole("Software Engineer")).toBe(true);
    expect(isSoftwareRole("Product Manager")).toBe(false);
  });

  it("detects new grad software roles", () => {
    expect(
      isNewGradRole(
        "Software Dev Engineer I, Amazon University Talent Acquisition",
        "university hire",
      ),
    ).toBe(true);
    expect(isNewGradRole("Senior Software Engineer", "")).toBe(false);
    expect(isNewGradRole("Software Engineering Intern", "")).toBe(false);
    expect(isNewGradRole("Software Engineer II", "")).toBe(false);
    expect(
      isNewGradRole("Software Engineer, Early Career 2026", "entry level"),
    ).toBe(true);
  });

  it("returns structured classification", () => {
    expect(
      classifyJob("New Grad Software Engineer", "university graduate program"),
    ).toEqual({
      isSoftware: true,
      isNewGrad: true,
    });
  });
});
