import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";

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

  const { data: collaborators } = useQuery({
    queryKey: ['collaborators'],
    queryFn: () => db.getAllCollaborators()
  });

  const filteredSitreps = sitreps?.filter(sitrep => {
    if (!filterDate) return true;
    const sitrepDate = new Date(sitrep.date);
    return (
      sitrepDate.getFullYear() === filterDate.getFullYear() &&
      sitrepDate.getMonth() === filterDate.getMonth() &&
      sitrepDate.getDate() === filterDate.getDate()
    );
  });

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
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(sitrep.date), "MMMM d, yyyy")}
                    </p>
                  </div>
                  
                  <p className="text-sm">{sitrep.summary}</p>
                  
                  <div className="text-sm text-muted-foreground space-y-1">
                    {sitrep.projectId && projects?.find(p => p.id === sitrep.projectId) && (
                      <p>Project: {projects.find(p => p.id === sitrep.projectId)?.name}</p>
                    )}
                    
                    {sitrep.fortune30Id && collaborators?.find(c => c.id === sitrep.fortune30Id) && (
                      <p>Fortune 30: {collaborators.find(c => c.id === sitrep.fortune30Id)?.name}</p>
                    )}
                    
                    {sitrep.partnerId && (
                      <p>Internal Partner: {
                        collaborators?.find(c => c.id === sitrep.partnerId)?.name
                      }</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}