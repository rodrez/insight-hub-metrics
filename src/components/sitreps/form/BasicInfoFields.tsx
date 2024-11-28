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
  status: 'on-track' | 'at-risk';
  setStatus: (status: 'on-track' | 'at-risk') => void;
}

export function BasicInfoFields({
  selectedDate,
  setSelectedDate,
  title,
  setTitle,
  status,
  setStatus
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
        <Select value={status} onValueChange={(value: 'on-track' | 'at-risk') => setStatus(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="on-track">On Track</SelectItem>
            <SelectItem value="at-risk">At Risk</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}