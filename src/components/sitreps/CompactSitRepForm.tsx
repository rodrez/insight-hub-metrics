import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { SupportingTeamsSelect } from "./SupportingTeamsSelect";
import { PointsOfContactForm } from "./PointsOfContactForm";
import { PartnerSelectionFields } from "./form/PartnerSelectionFields";
import { SitRep } from "@/lib/types/sitrep";
import { PointOfContact } from "@/lib/types/pointOfContact";

interface CompactSitRepFormProps {
  onSubmitSuccess: () => void;
  initialData?: SitRep;
}

export function CompactSitRepForm({ onSubmitSuccess, initialData }: CompactSitRepFormProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.update || "");
  const [importanceLevel, setImportanceLevel] = useState<"cto" | "svp" | "ceo">(
    (initialData?.level?.toLowerCase() as "cto" | "svp" | "ceo") || "cto"
  );
  const [keyTeam, setKeyTeam] = useState<string>(initialData?.departmentId || "none");
  const [supportingTeams, setSupportingTeams] = useState<string[]>(initialData?.teams || []);
  const [pointsOfContact, setPointsOfContact] = useState<PointOfContact[]>(
    initialData?.pointsOfContact?.map(poc => {
      const [name, title] = poc.split(" (");
      return {
        name,
        title: title?.replace(")", "") || "",
        email: "",
        department: ""
      };
    }) || []
  );
  const [selectedFortune30, setSelectedFortune30] = useState<string>(initialData?.fortune30PartnerId || "none");
  const [selectedSME, setSelectedSME] = useState<string>(initialData?.smePartnerId || "none");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    
    if (!title || !content) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (wordCount < 100) {
      toast({
        title: "Error",
        description: "Content must be at least 100 words",
        variant: "destructive"
      });
      return;
    }

    try {
      const sitrepData = {
        id: initialData?.id || `sitrep-${Date.now()}`,
        date: initialData?.date || new Date().toISOString(),
        spiId: initialData?.spiId || "temp-spi-id",
        title,
        update: content,
        challenges: initialData?.challenges || "",
        nextSteps: initialData?.nextSteps || "",
        status: initialData?.status || 'pending-review',
        summary: content,
        departmentId: keyTeam !== "none" ? keyTeam : "default",
        level: importanceLevel.toUpperCase() as "CEO" | "SVP" | "CTO",
        teams: supportingTeams,
        pointsOfContact: pointsOfContact.map(poc => `${poc.name} (${poc.title})`),
        fortune30PartnerId: selectedFortune30 !== "none" ? selectedFortune30 : undefined,
        smePartnerId: selectedSME !== "none" ? selectedSME : undefined
      };

      if (initialData) {
        await db.updateSitRep(initialData.id, sitrepData);
      } else {
        await db.addSitRep(sitrepData);
      }
      
      toast({
        title: "Success",
        description: initialData ? "SitRep updated successfully" : "SitRep added successfully"
      });
      
      setOpen(false);
      onSubmitSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: initialData ? "Failed to update SitRep" : "Failed to add SitRep",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={!initialData && open} onOpenChange={setOpen}>
      {!initialData ? (
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent className="sm:max-w-[600px] bg-[#1A1F2C] text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            {initialData ? "Edit Sitrep" : "Create New Sitrep"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="text-white">Title</Label>
              <Input
                placeholder="Enter sitrep title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-[#13151D] border-gray-700 text-white"
              />
            </div>

            <div>
              <Label className="text-white">Content</Label>
              <Textarea
                placeholder="Enter sitrep content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="h-32 bg-[#13151D] border-gray-700 text-white"
              />
            </div>

            <div>
              <Label className="text-white">Importance Level</Label>
              <RadioGroup
                value={importanceLevel}
                onValueChange={(value: "cto" | "svp" | "ceo") => setImportanceLevel(value)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cto" id="cto" />
                  <Label htmlFor="cto">CTO</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="svp" id="svp" />
                  <Label htmlFor="svp">SVP</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ceo" id="ceo" />
                  <Label htmlFor="ceo">CEO</Label>
                </div>
              </RadioGroup>
            </div>

            <PartnerSelectionFields
              selectedFortune30={selectedFortune30}
              setSelectedFortune30={setSelectedFortune30}
              selectedSME={selectedSME}
              setSelectedSME={setSelectedSME}
            />

            <SupportingTeamsSelect 
              supportingTeams={supportingTeams}
              setSupportingTeams={setSupportingTeams}
            />

            <PointsOfContactForm
              pointsOfContact={pointsOfContact}
              setPointsOfContact={setPointsOfContact}
            />
          </div>

          <Button type="submit" className="w-full bg-white text-black hover:bg-gray-100">
            {initialData ? "Update Sitrep" : "Create Sitrep"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}