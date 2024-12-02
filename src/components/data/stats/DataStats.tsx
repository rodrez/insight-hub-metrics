import { DataCounts } from "../types/dataTypes";

interface DataStatsProps {
  dataCounts: DataCounts;
  currentPage: number;
  itemsPerPage: number;
}

export function DataStats({ dataCounts, currentPage, itemsPerPage }: DataStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-lg border p-4">
        <h3 className="text-sm font-medium">Projects</h3>
        <p className="mt-2 text-2xl font-bold">
          {dataCounts.projects}
        </p>
      </div>
      <div className="rounded-lg border p-4">
        <h3 className="text-sm font-medium">Fortune 30 Partners</h3>
        <p className="mt-2 text-2xl font-bold">{dataCounts.fortune30}</p>
      </div>
      <div className="rounded-lg border p-4">
        <h3 className="text-sm font-medium">Internal Partners</h3>
        <p className="mt-2 text-2xl font-bold">{dataCounts.internalPartners}</p>
      </div>
      <div className="rounded-lg border p-4">
        <h3 className="text-sm font-medium">SME Partners</h3>
        <p className="mt-2 text-2xl font-bold">{dataCounts.smePartners}</p>
      </div>
      <div className="rounded-lg border p-4">
        <h3 className="text-sm font-medium">SPIs</h3>
        <p className="mt-2 text-2xl font-bold">{dataCounts.spis}</p>
      </div>
      <div className="rounded-lg border p-4">
        <h3 className="text-sm font-medium">Objectives</h3>
        <p className="mt-2 text-2xl font-bold">{dataCounts.objectives}</p>
      </div>
      <div className="rounded-lg border p-4">
        <h3 className="text-sm font-medium">SitReps</h3>
        <p className="mt-2 text-2xl font-bold">{dataCounts.sitreps}</p>
      </div>
    </div>
  );
}