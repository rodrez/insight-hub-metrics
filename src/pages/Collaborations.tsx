import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Mail, Calendar } from 'lucide-react';
import { collaborators } from '@/lib/data/collaborators';
import { Badge } from "@/components/ui/badge";

export default function Collaborations() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCollaborators = collaborators.filter(collaborator =>
    collaborator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collaborator.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collaborator.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collaborator.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Collaborations</h1>
          <div className="relative w-72">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search collaborators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

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
              {filteredCollaborators.map((collaborator) => (
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
      </div>
    </div>
  );
}