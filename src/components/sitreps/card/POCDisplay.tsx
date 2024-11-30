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
    <div className="space-y-3">
      {keyPOC && (
        <div 
          className="p-3 rounded-md"
          style={{ 
            backgroundColor: `${getDepartmentColor(keyPOC.department)}15`,
            borderLeft: `3px solid ${getDepartmentColor(keyPOC.department)}`
          }}
        >
          <p className="text-sm font-medium">Key POC</p>
          <p className="text-sm">{keyPOC.name}</p>
          <p className="text-sm text-muted-foreground">
            {DEPARTMENTS.find(d => d.id === keyPOC.department)?.name}
          </p>
        </div>
      )}
      
      {supportingPOCs && supportingPOCs.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Supporting POCs:</p>
          {supportingPOCs.map((poc, index) => (
            <div
              key={`${poc.name}-${index}`}
              className="p-2 rounded-md"
              style={{ 
                backgroundColor: `${getDepartmentColor(poc.department)}15`,
                borderLeft: `3px solid ${getDepartmentColor(poc.department)}`
              }}
            >
              <p className="text-sm">{poc.name}</p>
              <p className="text-xs text-muted-foreground">
                {DEPARTMENTS.find(d => d.id === poc.department)?.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}