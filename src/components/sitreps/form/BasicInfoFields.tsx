import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BasicInfoFieldsProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  title: string;
  setTitle: (title: string) => void;
  status: 'pending-review' | 'ready' | 'submitted';
  setStatus: (status: 'pending-review' | 'ready' | 'submitted') => void;
  level: "CEO" | "SVP" | "CTO" | undefined;
  setLevel: (level: "CEO" | "SVP" | "CTO") => void;
}

export function BasicInfoFields({
  selectedDate,
  setSelectedDate,
  title,
  setTitle,
  status,
  setStatus,
  level,
  setLevel
}: BasicInfoFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Date</label>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter sitrep title"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Status</label>
        <Select value={status} onValueChange={(value: 'pending-review' | 'ready' | 'submitted') => setStatus(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending-review">Pending Review</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Importance Level</label>
        <Select value={level} onValueChange={(value: "CEO" | "SVP" | "CTO") => setLevel(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select importance level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CEO">CEO Level</SelectItem>
            <SelectItem value="SVP">SVP Level</SelectItem>
            <SelectItem value="CTO">CTO Level</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}