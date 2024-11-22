import { useParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, Building, Calendar, FileCheck } from "lucide-react";
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

  const getStatusBadge = (status?: string) => {
    const variants = {
      signed: "bg-green-500",
      pending: "bg-yellow-500",
      expired: "bg-red-500"
    };
    return (
      <Badge className={`${status ? variants[status as keyof typeof variants] : 'bg-gray-500'} text-white`}>
        {status || 'N/A'}
      </Badge>
    );
  };

  const getAgreementDates = (agreement?: { signedDate?: string; expiryDate?: string }) => {
    if (!agreement) return { signed: 'N/A', expires: 'N/A' };
    return {
      signed: agreement.signedDate ? format(new Date(agreement.signedDate), 'MMM d, yyyy') : 'N/A',
      expires: agreement.expiryDate ? format(new Date(agreement.expiryDate), 'MMM d, yyyy') : 'N/A'
    };
  };

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

      {/* Header Section */}
      <div className="space-y-4">
        <h1 className={`inline-block text-2xl font-bold px-3 py-1 rounded ${collaborator.color ? `bg-[${collaborator.color}]` : 'bg-blue-500'} text-white`}>
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

      {/* Projects Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Associated Projects
          </CardTitle>
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
                    getStatusBadge(collaborator.agreements.nda.status)
                  )}
                  {collaborator.agreements?.jtda && (
                    getStatusBadge(collaborator.agreements.jtda.status)
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>NDA Dates</span>
                  </div>
                  {collaborator.agreements?.nda && (
                    <div className="pl-6 space-y-1">
                      <p>Signed: {getAgreementDates(collaborator.agreements.nda).signed}</p>
                      <p>Expires: {getAgreementDates(collaborator.agreements.nda).expires}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>JTDA Dates</span>
                  </div>
                  {collaborator.agreements?.jtda && (
                    <div className="pl-6 space-y-1">
                      <p>Signed: {getAgreementDates(collaborator.agreements.jtda).signed}</p>
                      <p>Expires: {getAgreementDates(collaborator.agreements.jtda).expires}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Activity Summary Section */}
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

      {/* Admin Actions */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline">
          Update Details
        </Button>
      </div>
    </div>
  );
}