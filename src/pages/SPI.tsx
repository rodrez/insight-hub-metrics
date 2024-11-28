import { SPIForm } from "@/components/spi/SPIForm";
import { SPIList } from "@/components/spi/SPIList";
import { useQueryClient } from "@tanstack/react-query";

export default function SPIPage() {
  const queryClient = useQueryClient();

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['spis'] });
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Schedule Performance Index</h1>
      <SPIForm onSubmitSuccess={handleFormSuccess} />
      <SPIList />
    </div>
  );
}