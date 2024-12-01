import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CardTitle } from "@/components/ui/card";

interface NABCFieldsProps {
  needs: string;
  setNeeds: (value: string) => void;
  approach: string;
  setApproach: (value: string) => void;
  benefits: string;
  setBenefits: (value: string) => void;
  competition: string;
  setCompetition: (value: string) => void;
}

export function NABCFields({
  needs,
  setNeeds,
  approach,
  setApproach,
  benefits,
  setBenefits,
  competition,
  setCompetition
}: NABCFieldsProps) {
  return (
    <div className="space-y-4">
      <CardTitle className="text-lg">NABC Analysis</CardTitle>
      
      <div>
        <Label htmlFor="needs">Needs</Label>
        <Textarea
          id="needs"
          placeholder="What customer and market needs are being addressed?"
          value={needs}
          onChange={(e) => setNeeds(e.target.value)}
          className="h-24"
          required
        />
      </div>

      <div>
        <Label htmlFor="approach">Approach</Label>
        <Textarea
          id="approach"
          placeholder="How will these needs be met?"
          value={approach}
          onChange={(e) => setApproach(e.target.value)}
          className="h-24"
          required
        />
      </div>

      <div>
        <Label htmlFor="benefits">Benefits</Label>
        <Textarea
          id="benefits"
          placeholder="What are the quantifiable benefits?"
          value={benefits}
          onChange={(e) => setBenefits(e.target.value)}
          className="h-24"
          required
        />
      </div>

      <div>
        <Label htmlFor="competition">Competition</Label>
        <Textarea
          id="competition"
          placeholder="How does this compare to competitive approaches?"
          value={competition}
          onChange={(e) => setCompetition(e.target.value)}
          className="h-24"
          required
        />
      </div>
    </div>
  );
}