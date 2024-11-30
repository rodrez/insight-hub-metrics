import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SPI } from "@/lib/types/spi";
import { format } from "date-fns";

interface SPICardProps {
  spi: SPI;
}

export function SPICard({ spi }: SPICardProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'on-track':
        return 'secondary';
      default:
        return 'destructive';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{spi.name}</CardTitle>
        <Badge variant={getStatusVariant(spi.status)}>
          {spi.status}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">{spi.deliverable}</p>
        <div className="text-sm">
          Expected completion: {format(new Date(spi.expectedCompletionDate), 'PPP')}
        </div>
      </CardContent>
    </Card>
  );
}