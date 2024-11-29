import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { DEPARTMENTS } from "@/lib/constants";
import { SupportingTeamsSelect } from "./SupportingTeamsSelect";
import { PointsOfContactForm } from "./PointsOfContactForm";

interface CompactSitRepFormProps {
  onSubmitSuccess: () => void;
}

interface PointOfContact {
  name: string;
  email: string;
  title: string;
  department: string;
}

export function CompactSitRepForm({ onSubmitSuccess }: CompactSitRepFormProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [importanceLevel, setImportanceLevel] = useState<"cto" | "svp" | "ceo">("cto");
  const [keyTeam, setKeyTeam] = useState<string>("none");
  const [supportingTeams, setSupportingTeams] = useState<string[]>([]);
  const [pointsOfContact, setPointsOfContact] = useState<PointOfContact[]>([]);

  const { data: teams } = useQuery({
    queryKey: ['teams'],
    queryFn: () => db.getAllTeams()
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      await db.addSitRep({
        id: `sitrep-${Date.now()}`,
        date: new Date().toISOString(),
        spiId: "temp-spi-id",
        title,
        update: content,
        challenges: "",
        nextSteps: "",
        status: 'pending-review',
        summary: content,
        departmentId: keyTeam !== "none" ? keyTeam : "default",
        level: importanceLevel.toUpperCase() as "CEO" | "SVP" | "CTO",
        teams: supportingTeams,
        pointsOfContact: pointsOfContact.map(poc => `${poc.name} (${poc.title})`)
      });
      
      toast({
        title: "Success",
        description: "SitRep added successfully"
      });
      
      setOpen(false);
      setTitle("");
      setContent("");
      setKeyTeam("none");
      setSupportingTeams([]);
      setPointsOfContact([]);
      
      onSubmitSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add SitRep",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-[#1A1F2C] text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">Create New Sitrep</DialogTitle>
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

            <div>
              <Label className="text-white">Key Team</Label>
              <Select value={keyTeam} onValueChange={setKeyTeam}>
                <SelectTrigger className="bg-[#13151D] border-gray-700 text-white">
                  <SelectValue placeholder="Select key team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {DEPARTMENTS.map(dept => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
            Create Sitrep
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}