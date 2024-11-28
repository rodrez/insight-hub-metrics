import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SPI } from "@/lib/types/spi";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";

export function SPIList() {
  const navigate = useNavigate();
  
  const { data: spis } = useQuery({
    queryKey: ['spis'],
    queryFn: () => db.getAllSPIs()
  });

  const { data: sitreps } = useQuery({
    queryKey: ['sitreps'],
    queryFn: () => db.getAllSitReps()
  });

  const getStatusColor = (status: SPI['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'delayed':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
    }
  };

  const viewSitrep = (sitrepId: string) => {
    navigate('/sitreps', { state: { highlightId: sitrepId } });
  };

  return (
    <div className="grid gap-6">
      {spis?.map((spi) => (
        <Card key={spi.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>{spi.name}</CardTitle>
              <Badge className={getStatusColor(spi.status)}>
                {spi.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Goals</h4>
                <p className="text-sm text-muted-foreground">{spi.goals}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Dates</h4>
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Expected: </span>
                    {format(new Date(spi.expectedCompletionDate), 'PPP')}
                  </p>
                  {spi.actualCompletionDate && (
                    <p className="text-sm">
                      <span className="text-muted-foreground">Actual: </span>
                      {format(new Date(spi.actualCompletionDate), 'PPP')}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {spi.sitrepIds.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Related SitReps</h4>
                <div className="flex gap-2">
                  {spi.sitrepIds.map(sitrepId => {
                    const sitrep = sitreps?.find(s => s.id === sitrepId);
                    return sitrep ? (
                      <Button
                        key={sitrepId}
                        variant="outline"
                        size="sm"
                        onClick={() => viewSitrep(sitrepId)}
                      >
                        {format(new Date(sitrep.date), 'PP')}
                      </Button>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}