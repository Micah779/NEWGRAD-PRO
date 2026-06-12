import { getDataDb } from "@/lib/data";
import { getCompaniesWithScanStatus } from "@/scan/engine";
import { CompanyList } from "@/components/companies/company-list";

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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Target Companies</h2>
        <p className="text-slate-500">
          Manage which companies are included in automated scans.
        </p>
      </div>
      <CompanyList companies={serialized} />
    </div>
  );
}
