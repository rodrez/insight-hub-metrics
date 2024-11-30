import { DEPARTMENTS } from "@/lib/constants";

interface POCDisplayProps {
  keyPOC?: {
    name: string;
    department: string;
  };
  supportingPOCs?: Array<{
    name: string;
    department: string;
  }>;
}

export function POCDisplay({ keyPOC, supportingPOCs }: POCDisplayProps) {
  const getDepartmentColor = (departmentId: string) => {
    const department = DEPARTMENTS.find(d => d.id === departmentId);
    return department?.color || '#333';
  };

  if (!keyPOC && (!supportingPOCs || supportingPOCs.length === 0)) {
    return null;
  }

  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">Points of Contact:</p>
      <div className="flex flex-wrap gap-2 items-center">
        {keyPOC && (
          <span
            style={{ color: getDepartmentColor(keyPOC.department) }}
            className="font-medium"
          >
            {keyPOC.name}
          </span>
        )}
        
        {supportingPOCs && supportingPOCs.length > 0 && supportingPOCs.map((poc, index) => (
          <span
            key={`${poc.name}-${index}`}
            style={{ color: getDepartmentColor(poc.department) }}
          >
            {poc.name}
          </span>
        ))}
      </div>
    </div>
  );
}