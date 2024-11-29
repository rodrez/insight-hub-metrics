import { Card } from "@/components/ui/card";
import { DEPARTMENTS } from "@/lib/constants";

// Define the business categories and their LOBs
const businessCategories = [
  {
    name: "Aircraft",
    lobs: [
      { name: "Commercial Aviation", department: "airplanes" },
      { name: "Military Aircraft", department: "airplanes" },
      { name: "Rotorcraft", department: "helicopters" },
      { name: "UAV Systems", department: "helicopters" }
    ]
  },
  {
    name: "Marine",
    lobs: [
      { name: "Naval Systems", department: "space" },
      { name: "Maritime Operations", department: "space" },
      { name: "Port Solutions", department: "energy" }
    ]
  },
  {
    name: "Technology",
    lobs: [
      { name: "Digital Solutions", department: "it" },
      { name: "Cybersecurity", department: "it" },
      { name: "Cloud Services", department: "techlab" }
    ]
  },
  {
    name: "Space",
    lobs: [
      { name: "Satellite Systems", department: "space" },
      { name: "Launch Vehicles", department: "space" },
      { name: "Space Exploration", department: "space" }
    ]
  },
  {
    name: "Energy",
    lobs: [
      { name: "Renewable Energy", department: "energy" },
      { name: "Power Systems", department: "energy" },
      { name: "Grid Solutions", department: "energy" }
    ]
  },
  {
    name: "Defense",
    lobs: [
      { name: "Missile Systems", department: "space" },
      { name: "Defense Electronics", department: "techlab" },
      { name: "Combat Systems", department: "airplanes" }
    ]
  },
  {
    name: "Research",
    lobs: [
      { name: "Advanced Materials", department: "techlab" },
      { name: "AI & Robotics", department: "techlab" },
      { name: "Future Tech", department: "techlab" }
    ]
  }
];

export function LinesOfBusinessTable() {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Lines of Business (LOB)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-6">
        {businessCategories.map((category) => (
          <div key={category.name} className="space-y-3">
            <h3 className="font-medium text-lg border-b pb-2">{category.name}</h3>
            <div className="space-y-2">
              {category.lobs.map((lob) => {
                const deptColor = DEPARTMENTS.find(d => d.id === lob.department)?.color;
                return (
                  <div
                    key={lob.name}
                    className="p-3 rounded-lg transition-all hover:scale-105"
                    style={{
                      backgroundColor: `${deptColor}15`,
                      borderLeft: `3px solid ${deptColor}`
                    }}
                  >
                    <span className="text-sm">{lob.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}