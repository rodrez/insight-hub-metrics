import { useState } from "react";
import DataManagement from "@/components/data/DataManagement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";

type ColorSetting = {
  id: string;
  name: string;
  color: string;
};

export default function Settings() {
  const [statusColors, setStatusColors] = useState<ColorSetting[]>([
    { id: 'active', name: 'Active Status', color: '#10B981' },
    { id: 'completed', name: 'Completed Status', color: '#3B82F6' },
    { id: 'on-hold', name: 'On Hold Status', color: '#F59E0B' },
  ]);

  const handleColorChange = (id: string, color: string) => {
    setStatusColors(prev => 
      prev.map(s => s.id === id ? { ...s, color } : s)
    );
  };

  const saveColors = () => {
    localStorage.setItem('projectStatusColors', JSON.stringify(statusColors));
    toast({
      title: "Colors saved",
      description: "Your color settings have been saved successfully.",
    });
  };

  const handleDeleteDatabase = async () => {
    try {
      await db.clear();
      toast({
        title: "Database deleted",
        description: "The database has been cleared successfully. You can now repopulate it with sample data.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete database",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Status Colors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statusColors.map((status) => (
                <div key={status.id} className="flex items-center gap-4">
                  <span className="w-32">{status.name}</span>
                  <Input
                    type="color"
                    value={status.color}
                    onChange={(e) => handleColorChange(status.id, e.target.value)}
                    className="w-20 h-10"
                  />
                  <div 
                    className="w-20 h-10 rounded"
                    style={{ backgroundColor: status.color }}
                  />
                </div>
              ))}
              <Button onClick={saveColors} className="mt-4">
                Save Colors
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Database Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="destructive" 
              onClick={handleDeleteDatabase}
              className="w-full"
            >
              Delete Database
            </Button>
            <DataManagement />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}