import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SPIList } from "@/components/spi/SPIList";
import { SPIProgressCharts } from "@/components/spi/SPIProgressCharts";

export default function SPI() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Strategic Program Initiatives</h1>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add SPI
        </Button>
      </div>
      
      <SPIProgressCharts />
      <SPIList />
    </div>
  );
}