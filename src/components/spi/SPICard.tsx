import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SPI } from "@/lib/types/spi";
import { format } from "date-fns";

interface SPICardProps {
  spi: SPI;
}

export function SPICard({ spi }: SPICardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{spi.name}</CardTitle>
        <Badge variant={
          spi.status === 'completed' ? 'success' :
          spi.status === 'on-track' ? 'default' :
          'warning'
        }>
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