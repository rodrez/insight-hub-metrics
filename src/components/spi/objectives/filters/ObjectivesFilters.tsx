import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ObjectivesFiltersProps {
  searchQuery: string;
  filterStatus: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: string) => void;
}

export function ObjectivesFilters({
  searchQuery,
  filterStatus,
  onSearchChange,
  onFilterChange,
}: ObjectivesFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Input
          placeholder="Search objectives..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
      </div>
      <Select
        value={filterStatus}
        onValueChange={onFilterChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Objectives</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="in-progress">In Progress</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}