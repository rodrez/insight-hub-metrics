import { NABC } from "@/lib/types";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";

interface NABCSectionProps {
  projectId: string;
  nabc: NABC;
  onUpdate: (newNabc: NABC) => void;
}

export function NABCSection({ projectId, nabc, onUpdate }: NABCSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNabc, setEditedNabc] = useState(nabc);

  const handleSave = async () => {
    try {
      const project = await db.getProject(projectId);
      if (project) {
        const updatedProject = {
          ...project,
          nabc: editedNabc
        };
        await db.addProject(updatedProject);
        onUpdate(editedNabc);
        setIsEditing(false);
        toast({
          title: "Success",
          description: "NABC framework updated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update NABC framework",
        variant: "destructive",
      });
    }
  };

  if (!isEditing) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TooltipProvider>
          <Card>
            <CardHeader>
              <CardTitle>
                <Tooltip>
                  <TooltipTrigger className="flex items-center gap-2">
                    Needs
                    <Info className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>What customer and market needs are being addressed?</p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
            </CardHeader>
            <CardContent>{nabc.needs}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <Tooltip>
                  <TooltipTrigger className="flex items-center gap-2">
                    Approach
                    <Info className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>How will these needs be met?</p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
            </CardHeader>
            <CardContent>{nabc.approach}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <Tooltip>
                  <TooltipTrigger className="flex items-center gap-2">
                    Benefits
                    <Info className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>What are the quantifiable benefits?</p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
            </CardHeader>
            <CardContent>{nabc.benefits}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <Tooltip>
                  <TooltipTrigger className="flex items-center gap-2">
                    Competition
                    <Info className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>How does this compare to competitive approaches?</p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
            </CardHeader>
            <CardContent>{nabc.competition}</CardContent>
          </Card>
        </TooltipProvider>
        <div className="col-span-full">
          <Button onClick={() => setIsEditing(true)}>Edit NABC Framework</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="font-medium">Needs</label>
          <Textarea
            value={editedNabc.needs}
            onChange={(e) => setEditedNabc({ ...editedNabc, needs: e.target.value })}
            placeholder="What customer and market needs are being addressed?"
          />
        </div>
        <div className="space-y-2">
          <label className="font-medium">Approach</label>
          <Textarea
            value={editedNabc.approach}
            onChange={(e) => setEditedNabc({ ...editedNabc, approach: e.target.value })}
            placeholder="How will these needs be met?"
          />
        </div>
        <div className="space-y-2">
          <label className="font-medium">Benefits</label>
          <Textarea
            value={editedNabc.benefits}
            onChange={(e) => setEditedNabc({ ...editedNabc, benefits: e.target.value })}
            placeholder="What are the quantifiable benefits?"
          />
        </div>
        <div className="space-y-2">
          <label className="font-medium">Competition</label>
          <Textarea
            value={editedNabc.competition}
            onChange={(e) => setEditedNabc({ ...editedNabc, competition: e.target.value })}
            placeholder="How does this compare to competitive approaches?"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSave}>Save Changes</Button>
        <Button variant="outline" onClick={() => {
          setIsEditing(false);
          setEditedNabc(nabc);
        }}>Cancel</Button>
      </div>
    </div>
  );
}