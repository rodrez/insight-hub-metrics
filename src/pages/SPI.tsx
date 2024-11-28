import { useState } from "react";
import { SPIForm } from "@/components/spi/SPIForm";
import { SPIList } from "@/components/spi/SPIList";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function SPIPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['spis'] });
    setIsFormOpen(false);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Schedule Performance Index</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add SPI
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
      <SPIList />
    </div>
  );
}