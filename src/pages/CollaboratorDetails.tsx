import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Calendar, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { collaborators } from "@/lib/data/collaborators";
import { format } from "date-fns";

export default function CollaboratorDetails() {
  const { id } = useParams();
  const collaborator = collaborators.find(c => c.id === id);

  if (!collaborator) {
    return <div>Collaborator not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <Link to="/collaborations">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Collaborations
          </Button>
        </Link>
      </div>

      {/* Header Section */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">
          <span 
            className="px-3 py-1 rounded text-white"
            style={{ backgroundColor: collaborator.type === 'fortune30' ? collaborator.color : undefined }}
          >
            {collaborator.name}
          </span>
        </h1>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            <a href={`mailto:${collaborator.email}`} className="hover:text-foreground">
              {collaborator.email}
            </a>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>Contact number placeholder</span>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <Card>
        <CardHeader>
          <CardTitle>Associated Projects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {collaborator.projects.map((project, index) => (
            <div key={index} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <Link to={`/projects/${index}`} className="font-medium hover:text-primary">
                  {project}
                </Link>
                <div className="space-x-2">
                  <Badge variant="secondary">NDA Signed</Badge>
                  <Badge variant="secondary">JTDA Signed</Badge>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>NDA: {format(new Date(), 'MMM d, yyyy')}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>JTDA: {format(new Date(), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            {[
              { label: 'Total Projects', value: collaborator.projects.length },
              { label: 'Active NDAs', value: 2 },
              { label: 'Expired NDAs', value: 0 },
              { label: 'Active JTDAs', value: 1 },
              { label: 'Expired JTDAs', value: 1 },
            ].map((metric, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="text-sm text-muted-foreground">{metric.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}