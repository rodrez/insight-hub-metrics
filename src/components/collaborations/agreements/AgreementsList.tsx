import { Collaborator } from "@/lib/types/collaboration";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { getDaysUntilExpiry } from "@/lib/utils/agreementUtils";

interface AgreementsListProps {
  collaborators: Collaborator[];
}

export function AgreementsList({ collaborators }: AgreementsListProps) {
  const handleUpload = () => {
    toast({
      title: "Coming Soon",
      description: "New Feature Coming Soon...",
    });
  };

  const getStatusColor = (daysUntil: number) => {
    if (daysUntil <= 0) return "text-red-500";
    if (daysUntil <= 90) return "text-orange-500";
    return "text-green-500";
  };

  return (
    <div className="space-y-6">
      {collaborators.map((collaborator) => (
        <Card key={collaborator.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: collaborator.color }}
                />
                {collaborator.name}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {collaborator.agreements?.nda && (
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h3 className="font-medium">NDA</h3>
                    <p className="text-sm text-muted-foreground">
                      Signed: {new Date(collaborator.agreements.nda.signedDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Expires: {new Date(collaborator.agreements.nda.expiryDate).toLocaleDateString()}
                    </p>
                    <p className={`text-sm ${getStatusColor(getDaysUntilExpiry(collaborator.agreements.nda.expiryDate))}`}>
                      {getDaysUntilExpiry(collaborator.agreements.nda.expiryDate)} days until expiration
                    </p>
                  </div>
                  <Button variant="outline" onClick={handleUpload}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload NDA
                  </Button>
                </div>
              )}
              
              {collaborator.agreements?.jtda && (
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">JTDA</h3>
                    <p className="text-sm text-muted-foreground">
                      Signed: {new Date(collaborator.agreements.jtda.signedDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Expires: {new Date(collaborator.agreements.jtda.expiryDate).toLocaleDateString()}
                    </p>
                    <p className={`text-sm ${getStatusColor(getDaysUntilExpiry(collaborator.agreements.jtda.expiryDate))}`}>
                      {getDaysUntilExpiry(collaborator.agreements.jtda.expiryDate)} days until expiration
                    </p>
                  </div>
                  <Button variant="outline" onClick={handleUpload}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload JTDA
                  </Button>
                </div>
              )}
              
              {!collaborator.agreements?.nda && !collaborator.agreements?.jtda && (
                <p className="text-muted-foreground">No agreements found</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}