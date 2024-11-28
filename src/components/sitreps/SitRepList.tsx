import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, subDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function SitRepList() {
  const [filterDate, setFilterDate] = useState<Date>();

  const { data: sitreps } = useQuery({
    queryKey: ['sitreps', filterDate?.toISOString()],
    queryFn: () => db.getAllSitReps()
  });

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => db.getAllProjects()
  });

  const filteredSitreps = sitreps?.filter(sitrep => {
    if (!filterDate) {
      // Show last 7 days by default
      const sevenDaysAgo = subDays(new Date(), 7);
      return new Date(sitrep.date) >= sevenDaysAgo;
    }
    const sitrepDate = new Date(sitrep.date);
    return (
      sitrepDate.getFullYear() === filterDate.getFullYear() &&
      sitrepDate.getMonth() === filterDate.getMonth() &&
      sitrepDate.getDate() === filterDate.getDate()
    );
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-6">
        <div>
          <h2 className="text-lg font-medium mb-2">Filter by Date</h2>
          <Calendar
            mode="single"
            selected={filterDate}
            onSelect={setFilterDate}
            className="rounded-md border"
          />
        </div>

        <div className="flex-1 space-y-4">
          {filteredSitreps?.map(sitrep => (
            <Card key={sitrep.id}>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(sitrep.date), "MMMM d, yyyy")}
                      </p>
                      {sitrep.projectId && projects?.find(p => p.id === sitrep.projectId) && (
                        <Badge variant="outline">
                          {projects.find(p => p.id === sitrep.projectId)?.name}
                        </Badge>
                      )}
                    </div>
                    <Badge variant={sitrep.status === 'on-track' ? 'default' : 'destructive'}>
                      {sitrep.status === 'on-track' ? 'On Track' : 'At Risk'}
                    </Badge>
                  </div>
                  
                  <p className="text-sm">{sitrep.summary}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}