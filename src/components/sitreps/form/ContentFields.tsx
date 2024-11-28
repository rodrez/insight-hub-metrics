import { Textarea } from "@/components/ui/textarea";

interface ContentFieldsProps {
  summary: string;
  setSummary: (summary: string) => void;
  update: string;
  setUpdate: (update: string) => void;
  challenges: string;
  setChallenges: (challenges: string) => void;
  nextSteps: string;
  setNextSteps: (nextSteps: string) => void;
}

export function ContentFields({
  summary,
  setSummary,
  update,
  setUpdate,
  challenges,
  setChallenges,
  nextSteps,
  setNextSteps,
}: ContentFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Summary (100 words max)</label>
        <Textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Write your summary here..."
          className="h-32"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Update</label>
        <Textarea
          value={update}
          onChange={(e) => setUpdate(e.target.value)}
          placeholder="Write your update here..."
          className="h-32"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Challenges</label>
        <Textarea
          value={challenges}
          onChange={(e) => setChallenges(e.target.value)}
          placeholder="Write your challenges here..."
          className="h-32"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Next Steps</label>
        <Textarea
          value={nextSteps}
          onChange={(e) => setNextSteps(e.target.value)}
          placeholder="Write your next steps here..."
          className="h-32"
        />
      </div>
    </div>
  );
}