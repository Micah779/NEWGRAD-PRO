export function getDigestRecipients(): string[] {
  return (process.env.ALLOWED_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

export function getEmailFrom(): string {
  return process.env.EMAIL_FROM ?? "onboarding@resend.dev";
}

export type SendEmailOptions = {
  to: string[];
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set");
  }

  if (to.length === 0) {
    throw new Error("No email recipients configured");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: getEmailFrom(),
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend API error (${response.status}): ${body}`);
  }

  return response.json() as Promise<{ id: string }>;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type DigestListing = {
  companyName: string;
  title: string;
  locations: string[];
  url: string;
};

export type DigestStats = {
  companiesChecked: number;
  companiesDisabled: number;
  companiesFailed: number;
};

export function buildDigestHtml(
  listings: DigestListing[],
  stats: DigestStats,
): string {
  const dateLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const listingRows =
    listings.length === 0
      ? `<p style="color:#6b6b6b;margin:16px 0;">No new new-grad openings in the last 24 hours.</p>`
      : `<table style="width:100%;border-collapse:collapse;margin-top:16px;">
          <thead>
            <tr>
              <th align="left" style="padding:8px 0;border-bottom:1px solid #eee;font-size:12px;color:#6b6b6b;">Company</th>
              <th align="left" style="padding:8px 0;border-bottom:1px solid #eee;font-size:12px;color:#6b6b6b;">Role</th>
              <th align="left" style="padding:8px 0;border-bottom:1px solid #eee;font-size:12px;color:#6b6b6b;">Location</th>
            </tr>
          </thead>
          <tbody>
            ${listings
              .map(
                (listing) => `<tr>
              <td style="padding:12px 8px 12px 0;vertical-align:top;font-size:14px;">${escapeHtml(listing.companyName)}</td>
              <td style="padding:12px 8px;vertical-align:top;font-size:14px;">
                <a href="${escapeHtml(listing.url)}" style="color:#1a1a1a;text-decoration:underline;">${escapeHtml(listing.title)}</a>
              </td>
              <td style="padding:12px 0 12px 8px;vertical-align:top;font-size:13px;color:#6b6b6b;">${escapeHtml(listing.locations.join(" · ") || "Not listed")}</td>
            </tr>`,
              )
              .join("")}
          </tbody>
        </table>`;

  return `<!DOCTYPE html>
<html>
  <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#fbfbfa;color:#1a1a1a;margin:0;padding:24px;">
    <div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid rgba(0,0,0,0.06);border-radius:12px;padding:24px;">
      <h1 style="margin:0 0 4px;font-size:22px;font-weight:600;">Micah - New Grad Jobs</h1>
      <p style="margin:0 0 20px;font-size:14px;color:#6b6b6b;">${escapeHtml(dateLabel)}</p>

      <p style="margin:0;font-size:14px;line-height:1.6;">
        <strong>${listings.length}</strong> new listing${listings.length === 1 ? "" : "s"} in the last 24 hours.
      </p>

      <p style="margin:12px 0 0;font-size:13px;line-height:1.6;color:#6b6b6b;">
        Scan summary: <strong>${stats.companiesChecked}</strong> companies checked,
        <strong>${stats.companiesDisabled}</strong> disabled (not scanned),
        <strong>${stats.companiesFailed}</strong> could not be checked this run.
      </p>

      ${listingRows}

      <p style="margin:32px 0 0;font-size:15px;font-weight:500;color:#1a1a1a;">lock in, you wont regret it</p>
    </div>
  </body>
</html>`;
}

export const DIGEST_SUBJECT = "Micah - New Grad Jobs";
