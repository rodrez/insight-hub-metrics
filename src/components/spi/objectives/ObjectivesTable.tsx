import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

export function ObjectivesTable() {
  const { data: objectives } = useQuery({
    queryKey: ['objectives'],
    queryFn: () => db.getAllObjectives()
  });

  const { data: initiatives } = useQuery({
    queryKey: ['initiatives'],
    queryFn: () => db.getAllInitiatives()
  });

  if (!objectives || !initiatives) return null;

  return (
    <Card className="p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Initiative</TableHead>
            <TableHead className="w-[300px]">Objective</TableHead>
            <TableHead>Desired Outcome</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {objectives.map((objective) => {
            const alignedInitiatives = initiatives.filter(
              (init) => init.objectiveId === objective.id
            );

            return alignedInitiatives.map((initiative, index) => (
              <TableRow key={initiative.id}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{initiative.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {initiative.description}
                    </div>
                  </div>
                </TableCell>
                {index === 0 && (
                  <TableCell
                    className="font-medium bg-muted/50"
                    rowSpan={alignedInitiatives.length}
                  >
                    <div className="space-y-1">
                      <div className="font-bold">{objective.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {objective.description}
                      </div>
                    </div>
                  </TableCell>
                )}
                <TableCell>{initiative.desiredOutcome}</TableCell>
              </TableRow>
            ));
          })}
        </TableBody>
      </Table>
    </Card>
  );
}