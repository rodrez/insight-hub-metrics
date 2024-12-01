import { Collaborator } from "@/lib/types/collaboration";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, AlertTriangle, Shield } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { getDaysUntilExpiry, getAgreementWarningSettings } from "@/lib/utils/agreementUtils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    const settings = getAgreementWarningSettings();
    if (daysUntil <= 0) return "text-red-500";
    if (daysUntil <= settings.criticalDays) return "text-red-500";
    if (daysUntil <= settings.warningDays) return "text-orange-500";
    return "text-green-500";
  };

  const getWarningMessage = (daysUntil: number, type: string) => {
    const settings = getAgreementWarningSettings();
    if (daysUntil <= 0) {
      return `${type} has expired!`;
    }
    if (daysUntil <= settings.criticalDays) {
      return `Critical: ${type} expires in ${daysUntil} days`;
    }
    if (daysUntil <= settings.warningDays) {
      return `Warning: ${type} expires in ${daysUntil} days`;
    }
    return `${daysUntil} days until expiration`;
  };

  return (
    <div className="space-y-6">
      {collaborators.map((collaborator) => {
        const hasJtdaWithoutNda = collaborator.agreements?.jtda && !collaborator.agreements?.nda;
        const hasExpiredNda = collaborator.agreements?.nda && 
          getDaysUntilExpiry(collaborator.agreements.nda.expiryDate) <= 0;
        const hasExpiredJtda = collaborator.agreements?.jtda && 
          getDaysUntilExpiry(collaborator.agreements.jtda.expiryDate) <= 0;

        return (
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
                {(hasJtdaWithoutNda || hasExpiredNda || hasExpiredJtda) && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      {hasJtdaWithoutNda && "Warning: JTDA exists without an NDA. An NDA is required before establishing a JTDA."}
                      {hasExpiredNda && " NDA has expired!"}
                      {hasExpiredJtda && " JTDA has expired!"}
                    </AlertDescription>
                  </Alert>
                )}

                {collaborator.agreements?.nda && (
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <h3 className="font-medium flex items-center gap-2">
                        NDA
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Shield className="h-4 w-4" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Non-Disclosure Agreement</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Signed: {new Date(collaborator.agreements.nda.signedDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Expires: {new Date(collaborator.agreements.nda.expiryDate).toLocaleDateString()}
                      </p>
                      <p className={`text-sm ${getStatusColor(getDaysUntilExpiry(collaborator.agreements.nda.expiryDate))}`}>
                        {getWarningMessage(getDaysUntilExpiry(collaborator.agreements.nda.expiryDate), 'NDA')}
                      </p>
                      {collaborator.workstreams && (
                        <div className="mt-2">
                          <p className="text-sm font-medium">Associated Workstreams:</p>
                          <ul className="list-disc list-inside text-sm text-muted-foreground">
                            {collaborator.workstreams.map((workstream) => (
                              <li key={workstream.id}>{workstream.title}</li>
                            ))}
                          </ul>
                        </div>
                      )}
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
                      <h3 className="font-medium flex items-center gap-2">
                        JTDA
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Shield className="h-4 w-4" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Joint Technology Development Agreement</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Signed: {new Date(collaborator.agreements.jtda.signedDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Expires: {new Date(collaborator.agreements.jtda.expiryDate).toLocaleDateString()}
                      </p>
                      <p className={`text-sm ${getStatusColor(getDaysUntilExpiry(collaborator.agreements.jtda.expiryDate))}`}>
                        {getWarningMessage(getDaysUntilExpiry(collaborator.agreements.jtda.expiryDate), 'JTDA')}
                      </p>
                      {collaborator.workstreams && (
                        <div className="mt-2">
                          <p className="text-sm font-medium">Associated Workstreams:</p>
                          <ul className="list-disc list-inside text-sm text-muted-foreground">
                            {collaborator.workstreams.map((workstream) => (
                              <li key={workstream.id}>{workstream.title}</li>
                            ))}
                          </ul>
                        </div>
                      )}
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
        )
      })}
    </div>
  );
}