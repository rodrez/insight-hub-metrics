import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

type Collaborator = {
  id: string;
  name: string;
  company: string;
  projects: number;
  lastActivity: string;
};

const SAMPLE_COLLABORATORS: Collaborator[] = [
  {
    id: '1',
    name: 'John Smith',
    company: 'Tech Corp',
    projects: 3,
    lastActivity: '2024-02-15'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    company: 'Aero Systems',
    projects: 2,
    lastActivity: '2024-02-14'
  },
  {
    id: '3',
    name: 'Michael Brown',
    company: 'Space Industries',
    projects: 4,
    lastActivity: '2024-02-13'
  }
];

export default function Collaborations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [collaborators] = useState<Collaborator[]>(SAMPLE_COLLABORATORS);

  const filteredCollaborators = collaborators.filter(collaborator =>
    collaborator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collaborator.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <h1 className="text-3xl font-bold mb-8">Collaborations</h1>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search collaborators..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Active Projects</TableHead>
              <TableHead>Last Activity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCollaborators.map((collaborator) => (
              <TableRow key={collaborator.id}>
                <TableCell className="font-medium">{collaborator.name}</TableCell>
                <TableCell>{collaborator.company}</TableCell>
                <TableCell>{collaborator.projects}</TableCell>
                <TableCell>{new Date(collaborator.lastActivity).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}