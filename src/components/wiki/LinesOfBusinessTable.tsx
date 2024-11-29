import { DEPARTMENTS } from "@/lib/constants";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface LOB {
  name: string;
  department: string;
}

interface Category {
  name: string;
  lobs: LOB[];
}

const businessCategories: Category[] = [
  {
    name: "Aircraft",
    lobs: [
      { name: "Commercial Aviation", department: "airplanes" },
      { name: "Military Aircraft", department: "airplanes" },
      { name: "Rotorcraft", department: "helicopters" },
      { name: "Urban Air Mobility", department: "helicopters" }
    ]
  },
  {
    name: "Space",
    lobs: [
      { name: "Launch Systems", department: "space" },
      { name: "Satellites", department: "space" },
      { name: "Space Exploration", department: "space" }
    ]
  },
  {
    name: "Technology",
    lobs: [
      { name: "Digital Solutions", department: "it" },
      { name: "Cloud Services", department: "it" },
      { name: "Research & Development", department: "techlab" }
    ]
  },
  {
    name: "Energy",
    lobs: [
      { name: "Renewable Energy", department: "energy" },
      { name: "Power Systems", department: "energy" },
      { name: "Grid Solutions", department: "energy" }
    ]
  }
];

export function LinesOfBusinessTable() {
  const getDepartmentColor = (departmentId: string) => {
    const department = DEPARTMENTS.find(d => d.id === departmentId);
    return department?.color || '#333';
  };

  const maxLOBs = Math.max(...businessCategories.map(cat => cat.lobs.length));

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Lines of Business (LOB)</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {businessCategories.map((category) => (
                <TableHead key={category.name} className="text-center font-semibold">
                  {category.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: maxLOBs }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {businessCategories.map((category) => {
                  const lob = category.lobs[rowIndex];
                  return (
                    <TableCell key={`${category.name}-${rowIndex}`} className="p-2">
                      {lob && (
                        <div
                          className="p-3 rounded-lg text-white text-sm transition-transform hover:scale-105"
                          style={{
                            backgroundColor: getDepartmentColor(lob.department),
                          }}
                        >
                          {lob.name}
                        </div>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}