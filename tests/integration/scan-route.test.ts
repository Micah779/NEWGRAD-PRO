import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/cron/scan/route";

const runScanMock = vi.fn();

vi.mock("@/db", () => ({
  getDb: () => ({}),
}));

vi.mock("@/scan/engine", () => ({
  runScan: (...args: unknown[]) => runScanMock(...args),
}));

describe("cron scan route", () => {
  beforeEach(() => {
    process.env.CRON_SECRET = "test-secret";
    runScanMock.mockResolvedValue({
      scanRunId: "scan-1",
      success: true,
      results: [],
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("rejects unauthorized requests", async () => {
    const response = await GET(
      new Request("http://localhost/api/cron/scan"),
    );

    expect(response.status).toBe(401);
  });

  it("runs scan when authorized", async () => {
    const response = await GET(
      new Request("http://localhost/api/cron/scan", {
        headers: {
          Authorization: "Bearer test-secret",
        },
      }),
    );

    expect(response.status).toBe(200);
    expect(runScanMock).toHaveBeenCalledOnce();
    await expect(response.json()).resolves.toMatchObject({
      scanRunId: "scan-1",
      success: true,
    });
  });
});
