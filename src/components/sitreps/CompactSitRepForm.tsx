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
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [importanceLevel, setImportanceLevel] = useState<"vp" | "svp" | "ceo">("vp");
  const [keyTeam, setKeyTeam] = useState<string>("none");
  const [supportingTeams, setSupportingTeams] = useState<string[]>([]);
  const [pointsOfContact, setPointsOfContact] = useState<PointOfContact[]>([]);
  const [newPOC, setNewPOC] = useState<PointOfContact>({
    name: "",
    email: "",
    title: "",
    department: "Engineering"
  });

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
        content,
        importanceLevel,
        keyTeam: keyTeam !== "none" ? keyTeam : undefined,
        supportingTeams,
        pointsOfContact,
        status: 'on-track',
        update: content,
        challenges: "",
        nextSteps: "",
        summary: content
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

  const addPointOfContact = () => {
    if (newPOC.name && newPOC.email) {
      setPointsOfContact([...pointsOfContact, newPOC]);
      setNewPOC({
        name: "",
        email: "",
        title: "",
        department: "Engineering"
      });
    }
  };

  const handleImportanceLevelChange = (value: string) => {
    if (value === "vp" || value === "svp" || value === "ceo") {
      setImportanceLevel(value);
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
                onValueChange={handleImportanceLevelChange}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="vp" id="vp" />
                  <Label htmlFor="vp">VP</Label>
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
                  {teams?.map(team => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-white">Supporting Teams</Label>
              <ScrollArea className="h-32 rounded-md border border-gray-700 bg-[#13151D]">
                <div className="p-4 space-y-2">
                  {["Engineering", "Product", "Design", "Marketing", "Operations"].map((team) => (
                    <div key={team} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={team}
                        checked={supportingTeams.includes(team)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSupportingTeams([...supportingTeams, team]);
                          } else {
                            setSupportingTeams(supportingTeams.filter(t => t !== team));
                          }
                        }}
                        className="rounded border-gray-700"
                      />
                      <Label htmlFor={team}>{team}</Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div>
              <Label className="text-white">Points of Contact</Label>
              <div className="space-y-4">
                {pointsOfContact.map((poc, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-[#13151D] p-2 rounded">
                    <span>{poc.name}</span>
                    <span className="text-gray-400">({poc.email})</span>
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Name"
                    value={newPOC.name}
                    onChange={(e) => setNewPOC({ ...newPOC, name: e.target.value })}
                    className="bg-[#13151D] border-gray-700 text-white"
                  />
                  <Input
                    placeholder="Title"
                    value={newPOC.title}
                    onChange={(e) => setNewPOC({ ...newPOC, title: e.target.value })}
                    className="bg-[#13151D] border-gray-700 text-white"
                  />
                  <Input
                    placeholder="Email"
                    type="email"
                    value={newPOC.email}
                    onChange={(e) => setNewPOC({ ...newPOC, email: e.target.value })}
                    className="bg-[#13151D] border-gray-700 text-white"
                  />
                  <Select
                    value={newPOC.department}
                    onValueChange={(value) => setNewPOC({ ...newPOC, department: value })}
                  >
                    <SelectTrigger className="bg-[#13151D] border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["Engineering", "Product", "Design", "Marketing", "Operations"].map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addPointOfContact}
                  className="w-full bg-[#13151D] text-white border-gray-700"
                >
                  + Add POC
                </Button>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full bg-white text-black hover:bg-gray-100">
            Create Sitrep
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
