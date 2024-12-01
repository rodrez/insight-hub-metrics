import { useState } from "react";
import { SPIForm } from "@/components/spi/SPIForm";
import { SPIList } from "@/components/spi/SPIList";
import { ObjectivesList } from "@/components/spi/objectives/ObjectivesList";
import { SPIAnalytics } from "@/components/spi/analytics/SPIAnalytics";
import { SPIStats } from "@/components/spi/SPIStats";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-purple-500" />
            <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
              Schedule Performance Index
            </h1>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="shrink-0 border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 dark:border-purple-800 dark:hover:border-purple-600 transition-all duration-300"
              >
                <Plus className="h-4 w-4 text-purple-600" />
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

        <div className="mb-8 transform hover:scale-[1.01] transition-transform duration-300">
          <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-lg dark:bg-gray-800/50 p-4">
            <SPIStats />
          </div>
        </div>

        <Tabs defaultValue="spis" className="space-y-8">
          <TabsList className="w-full sm:w-auto flex justify-start overflow-x-auto p-1 bg-white/70 backdrop-blur-sm rounded-lg shadow-md dark:bg-gray-800/70">
            <TabsTrigger 
              value="spis" 
              className="flex-1 sm:flex-none data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-purple-100"
            >
              SPIs
            </TabsTrigger>
            <TabsTrigger 
              value="objectives" 
              className="flex-1 sm:flex-none data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-purple-100"
            >
              Objectives
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="flex-1 sm:flex-none data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-purple-100"
            >
              Analytics
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="spis" className="min-h-[300px] animate-fade-in">
            <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-lg p-6 dark:bg-gray-800/50 hover:shadow-xl transition-shadow duration-300">
              <SPIList />
            </div>
          </TabsContent>
          
          <TabsContent value="objectives" className="min-h-[300px] animate-fade-in">
            <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-lg p-6 dark:bg-gray-800/50 hover:shadow-xl transition-shadow duration-300">
              <ObjectivesList />
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="min-h-[300px] animate-fade-in">
            <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-lg p-6 dark:bg-gray-800/50 hover:shadow-xl transition-shadow duration-300">
              <SPIAnalytics />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}