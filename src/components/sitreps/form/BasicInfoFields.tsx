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
    </div>
  );
}