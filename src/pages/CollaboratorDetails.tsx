import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Calendar, ArrowLeft, Building, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { collaborators } from "@/lib/data/collaborators";
import { format } from "date-fns";

export default function CollaboratorDetails() {
  const { id } = useParams();
  const collaborator = collaborators.find(c => c.id === id);

  if (!collaborator) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Collaborator not found</h1>
          <Link to="/collaborations">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Collaborations
            </Button>
          </Link>
        </div>
      </div>
    );
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

      <div className="space-y-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Building className="h-6 w-6" />
          {collaborator.name}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${collaborator.email}`} className="hover:underline">
                  {collaborator.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{collaborator.phone || "No phone number available"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{collaborator.role}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Agreement Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>NDA Signed: {format(new Date(), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Agreement Type: {collaborator.type}</span>
              </div>
              <Badge variant={collaborator.type === 'fortune30' ? 'default' : 'secondary'}>
                {collaborator.type === 'fortune30' ? 'Fortune 30' : 'Partner'}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Associated Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {collaborator.projects?.map((project, index) => (
              <Link 
                key={index} 
                to={`/projects/${index}`}
                className="block p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="font-medium">{project}</div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}