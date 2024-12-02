import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SPIList } from "@/components/spi/SPIList";
import { SPIForm } from "@/components/spi/SPIForm";
import { SPIStats } from "@/components/spi/SPIStats";
import { SPIAnalytics } from "@/components/spi/analytics/SPIAnalytics";
import { ObjectivesList } from "@/components/spi/objectives/ObjectivesList";

export default function SPI() {
  const [statusColors, setStatusColors] = useState({
    active: '#10B981'
  });

  useEffect(() => {
    const loadStatusColors = () => {
      const saved = localStorage.getItem('projectStatusColors');
      if (saved) {
        const colors = JSON.parse(saved);
        const activeColor = colors.find((c: any) => c.id === 'active')?.color;
        if (activeColor) {
          setStatusColors({
            active: activeColor
          });
        }
      }
    };

    loadStatusColors();
    window.addEventListener('storage', loadStatusColors);
    return () => window.removeEventListener('storage', loadStatusColors);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">SPI List</TabsTrigger>
          <TabsTrigger value="new">New SPI</TabsTrigger>
          <TabsTrigger value="objectives">Objectives</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <div 
          className="bg-card rounded-lg p-4 mt-4"
          style={{ 
            borderLeft: `4px solid ${statusColors.active}`,
            boxShadow: `0 4px 6px -1px ${statusColors.active}10, 0 2px 4px -1px ${statusColors.active}06`
          }}
        >
          <SPIStats />
        </div>

        <TabsContent value="list" className="space-y-6">
          <SPIList />
        </TabsContent>

        <TabsContent value="new">
          <SPIForm />
        </TabsContent>

        <TabsContent value="objectives">
          <ObjectivesList />
        </TabsContent>

        <TabsContent value="analytics">
          <SPIAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}