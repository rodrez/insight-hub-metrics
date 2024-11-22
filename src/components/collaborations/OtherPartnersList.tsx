import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Mail } from "lucide-react";
import { Collaborator } from "@/lib/types/collaboration";

type OtherPartnersListProps = {
  collaborators: Collaborator[];
};

export function OtherPartnersList({ collaborators }: OtherPartnersListProps) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Projects</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead>Contact</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {collaborators.map((collaborator) => (
            <TableRow key={collaborator.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{collaborator.name}</TableCell>
              <TableCell>{collaborator.role}</TableCell>
              <TableCell>
                <Badge variant="outline">{collaborator.department}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {collaborator.projects.map((project, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {project}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {new Date(collaborator.lastActive).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <a 
                  href={`mailto:${collaborator.email}`}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}