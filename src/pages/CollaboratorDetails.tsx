import { useParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, Building, Calendar } from "lucide-react";
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
      <div className="flex items-center justify-between mb-8">
        <Link to="/collaborations">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Collaborations
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        <h1 className={`inline-block text-2xl font-bold px-3 py-1 rounded ${
          collaborator.type === 'fortune30' ? `bg-[${collaborator.color}]` : 'bg-gray-500'
        } text-white`}>
          {collaborator.name}
        </h1>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building className="h-4 w-4" />
            <span>{collaborator.department}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            <a href={`mailto:${collaborator.email}`} className="hover:text-foreground">
              {collaborator.email}
            </a>
          </div>
          {collaborator.primaryContact?.phone && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{collaborator.primaryContact.phone}</span>
            </div>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {collaborator.projects.map((project, index) => (
            <div key={index} className="p-4 border rounded-lg shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <Link 
                  to={`/projects/${index}`}
                  className="text-lg font-medium hover:text-blue-500 transition-colors"
                >
                  {project}
                </Link>
                <div className="space-x-2">
                  {collaborator.agreements?.nda && (
                    <Badge className={`${
                      collaborator.agreements.nda.status === 'signed' ? 'bg-green-500' :
                      collaborator.agreements.nda.status === 'pending' ? 'bg-yellow-500' :
                      'bg-red-500'
                    } text-white`}>
                      NDA {collaborator.agreements.nda.status}
                    </Badge>
                  )}
                  {collaborator.agreements?.jtda && (
                    <Badge className={`${
                      collaborator.agreements.jtda.status === 'signed' ? 'bg-green-500' :
                      collaborator.agreements.jtda.status === 'pending' ? 'bg-yellow-500' :
                      'bg-red-500'
                    } text-white`}>
                      JTDA {collaborator.agreements.jtda.status}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                {collaborator.agreements?.nda && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>NDA Dates</span>
                    </div>
                    <div className="pl-6 space-y-1">
                      <p>Signed: {format(new Date(collaborator.agreements.nda.signedDate || ''), 'MMM d, yyyy')}</p>
                      <p>Expires: {format(new Date(collaborator.agreements.nda.expiryDate || ''), 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                )}
                {collaborator.agreements?.jtda && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>JTDA Dates</span>
                    </div>
                    <div className="pl-6 space-y-1">
                      <p>Signed: {format(new Date(collaborator.agreements.jtda.signedDate || ''), 'MMM d, yyyy')}</p>
                      <p>Expires: {format(new Date(collaborator.agreements.jtda.expiryDate || ''), 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 text-center border rounded-lg">
              <p className="text-2xl font-bold">{collaborator.projects.length}</p>
              <p className="text-sm text-muted-foreground">Total Projects</p>
            </div>
            <div className="p-4 text-center border rounded-lg">
              <p className="text-2xl font-bold">
                {collaborator.agreements?.nda?.status === 'signed' ? 1 : 0}
              </p>
              <p className="text-sm text-muted-foreground">Active NDAs</p>
            </div>
            <div className="p-4 text-center border rounded-lg">
              <p className="text-2xl font-bold">
                {collaborator.agreements?.nda?.status === 'expired' ? 1 : 0}
              </p>
              <p className="text-sm text-muted-foreground">Expired NDAs</p>
            </div>
            <div className="p-4 text-center border rounded-lg">
              <p className="text-2xl font-bold">
                {collaborator.agreements?.jtda?.status === 'signed' ? 1 : 0}
              </p>
              <p className="text-sm text-muted-foreground">Active JTDAs</p>
            </div>
            <div className="p-4 text-center border rounded-lg">
              <p className="text-2xl font-bold">
                {collaborator.agreements?.jtda?.status === 'expired' ? 1 : 0}
              </p>
              <p className="text-sm text-muted-foreground">Expired JTDAs</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}