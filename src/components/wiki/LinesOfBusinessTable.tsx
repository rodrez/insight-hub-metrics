import { Card } from "@/components/ui/card";
import { DEPARTMENTS } from "@/lib/constants";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Define the business categories and their descriptions
const businessCategories = [
  {
    name: "Aircraft",
    description: "Development and manufacturing of commercial and military aircraft, including rotorcraft and unmanned aerial systems",
    lobs: [
      { name: "Commercial Aviation", department: "airplanes" },
      { name: "Military Aircraft", department: "airplanes" },
      { name: "Rotorcraft", department: "helicopters" },
      { name: "UAV Systems", department: "helicopters" }
    ]
  },
  {
    name: "Marine",
    description: "Maritime solutions including naval systems, port operations, and offshore technologies",
    lobs: [
      { name: "Naval Systems", department: "space" },
      { name: "Maritime Operations", department: "space" },
      { name: "Port Solutions", department: "energy" }
    ]
  },
  {
    name: "Technology",
    description: "Digital solutions and cybersecurity services, including cloud infrastructure and software development",
    lobs: [
      { name: "Digital Solutions", department: "it" },
      { name: "Cybersecurity", department: "it" },
      { name: "Cloud Services", department: "techlab" }
    ]
  },
  {
    name: "Space",
    description: "Space exploration technologies, satellite systems, and launch vehicle development",
    lobs: [
      { name: "Satellite Systems", department: "space" },
      { name: "Launch Vehicles", department: "space" },
      { name: "Space Exploration", department: "space" }
    ]
  },
  {
    name: "Energy",
    description: "Sustainable energy solutions, power systems, and grid infrastructure development",
    lobs: [
      { name: "Renewable Energy", department: "energy" },
      { name: "Power Systems", department: "energy" },
      { name: "Grid Solutions", department: "energy" }
    ]
  },
  {
    name: "Defense",
    description: "Defense systems and electronics, including missile systems and combat technologies",
    lobs: [
      { name: "Missile Systems", department: "space" },
      { name: "Defense Electronics", department: "techlab" },
      { name: "Combat Systems", department: "airplanes" }
    ]
  },
  {
    name: "Research",
    description: "Advanced research and development in materials, AI, robotics, and emerging technologies",
    lobs: [
      { name: "Advanced Materials", department: "techlab" },
      { name: "AI & Robotics", department: "techlab" },
      { name: "Future Tech", department: "techlab" }
    ]
  }
];

export function LinesOfBusinessTable() {
  return (
    <Card className="p-6 relative">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Lines of Business (LOB)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-6">
          {businessCategories.map((category) => (
            <div key={category.name} className="space-y-3">
              <h3 className="font-medium text-lg border-b pb-2 flex items-center gap-2">
                {category.name}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{category.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </h3>
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

        {/* Updated color key styling */}
        <div className="absolute bottom-4 right-4">
          <div className="bg-card/80 backdrop-blur-sm p-3 rounded-lg shadow-sm border">
            <div className="grid grid-cols-3 gap-x-4 gap-y-2">
              {DEPARTMENTS.map((dept) => (
                <div key={dept.id} className="flex items-center gap-1.5">
                  <div 
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: dept.color }}
                  />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{dept.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}