import { Card } from "@/components/ui/card";
import { Network } from "lucide-react";

export default function OrgChart() {
  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Network className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Organization Chart</h1>
      </div>
      
      <div className="grid gap-8">
        {/* Director Level */}
        <div className="flex justify-center">
          <Card className="w-96 p-6 shadow-lg animate-fade-in">
            <h2 className="text-xl font-semibold mb-4">Director</h2>
            <p className="text-sm text-muted-foreground">Add director details and relationships</p>
          </Card>
        </div>

        {/* Senior Manager Level */}
        <div className="flex justify-center gap-8">
          {[1, 2, 3].map((index) => (
            <Card key={index} className="w-80 p-6 shadow-lg animate-fade-in">
              <h2 className="text-xl font-semibold mb-4">Senior Manager {index}</h2>
              <p className="text-sm text-muted-foreground">Add manager details and relationships</p>
            </Card>
          ))}
        </div>

        {/* Tech Lead Level */}
        <div className="flex justify-center gap-4">
          {[1, 2, 3].map((index) => (
            <Card key={index} className="w-72 p-6 shadow-lg animate-fade-in">
              <h2 className="text-xl font-semibold mb-4">Tech Lead {index}</h2>
              <p className="text-sm text-muted-foreground">Add tech lead details and relationships</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}