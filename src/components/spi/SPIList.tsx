import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { SPI } from "@/lib/types/spi";

export function SPIList() {
  const { data: spis } = useQuery({
    queryKey: ['spis'],
    queryFn: () => db.getAllSPIs()
  });

  if (!spis) return null;

  const getStatusColor = (status: SPI['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'delayed':
        return 'bg-red-500';
      case 'on-track':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      {spis.map(spi => (
        <div key={spi.id} className={`p-4 border rounded ${getStatusColor(spi.status)}`}>
          <h2 className="font-bold">{spi.name}</h2>
          <p>{spi.deliverable}</p>
          <p>Status: {spi.status}</p>
        </div>
      ))}
    </div>
  );
}
