import { useState } from "react";
import { SPIForm } from "@/components/spi/SPIForm";
import { SPIList } from "@/components/spi/SPIList";
import { ObjectivesList } from "@/components/spi/objectives/ObjectivesList";
import { SPIAnalytics } from "@/components/spi/analytics/SPIAnalytics";
import { SPIStats } from "@/components/spi/SPIStats";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SPIPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['spis'] });
    setIsFormOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Schedule Performance Index</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New SPI</DialogTitle>
            </DialogHeader>
            <SPIForm onSubmitSuccess={handleFormSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <SPIStats />
      </div>

      <Tabs defaultValue="spis" className="space-y-6">
        <TabsList className="w-full sm:w-auto flex justify-start overflow-x-auto">
          <TabsTrigger value="spis" className="flex-1 sm:flex-none">SPIs</TabsTrigger>
          <TabsTrigger value="objectives" className="flex-1 sm:flex-none">Objectives</TabsTrigger>
          <TabsTrigger value="analytics" className="flex-1 sm:flex-none">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="spis" className="min-h-[300px]">
          <div className="bg-card rounded-lg p-4">
            <SPIList />
          </div>
        </TabsContent>
        
        <TabsContent value="objectives" className="min-h-[300px]">
          <div className="bg-card rounded-lg p-4">
            <ObjectivesList />
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="min-h-[300px]">
          <div className="bg-card rounded-lg p-4">
            <SPIAnalytics />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}