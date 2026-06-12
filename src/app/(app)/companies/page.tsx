import { getDataDb } from "@/lib/data";
import { getCompaniesWithScanStatus } from "@/scan/engine";
import { CompanyList } from "@/components/companies/company-list";
import { PageHeader } from "@/components/layout/page-header";

export const dynamic = "force-dynamic";

export default async function CompaniesPage() {
  const db = getDataDb();
  const companies = db ? await getCompaniesWithScanStatus(db) : [];

  const serialized = companies.map((company) => ({
    id: company.id,
    name: company.name,
    slug: company.slug,
    careersUrl: company.careersUrl,
    enabled: company.enabled,
    lastScan: company.lastScan,
    lastScannedAt: company.lastScannedAt?.toISOString() ?? null,
  }));

  return (
    <div className="space-y-5">
      <PageHeader
        title="Companies"
        description="Manage which companies are included in automated scans."
      />
      <CompanyList companies={serialized} />
    </div>
  );
}
