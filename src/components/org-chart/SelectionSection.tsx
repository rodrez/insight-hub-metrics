import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { OrgPosition } from "./types";

interface SelectionSectionProps {
  title: string;
  type: keyof OrgPosition;
  position: OrgPosition;
  onPositionChange: (updatedPosition: OrgPosition) => void;
  availableItems: any[];
}

export function SelectionSection({ 
  title, 
  type, 
  position, 
  onPositionChange,
  availableItems
}: SelectionSectionProps) {
  const handleValueChange = (value: string) => {
    const currentArray = Array.isArray(position[type]) ? position[type] : [];
    if (!currentArray.includes(value)) {
      const updatedPosition = {
        ...position,
        [type]: [...currentArray, value]
      };
      onPositionChange(updatedPosition);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    const currentArray = Array.isArray(position[type]) ? position[type] : [];
    const updatedPosition = {
      ...position,
      [type]: currentArray.filter((id: string) => id !== itemId)
    };
    onPositionChange(updatedPosition);
  };

  const selectedIds = Array.isArray(position[type]) ? position[type] : [];
  
  // Filter out items that are already selected
  const availableForSelection = availableItems.filter(item => !selectedIds.includes(item.id));

  // Get the selected items' full data
  const selectedItems = selectedIds
    .map(id => availableItems.find(item => item.id === id))
    .filter(item => item); // Remove any undefined items

  return (
    <div>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      <Select
        value=""
        onValueChange={handleValueChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={`Select ${title}`} />
        </SelectTrigger>
        <SelectContent>
          {availableForSelection.length > 0 ? (
            availableForSelection.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.name || item.title}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="none" disabled>No available items</SelectItem>
          )}
        </SelectContent>
      </Select>
      <div className="flex flex-wrap gap-2 mt-2">
        {selectedItems.map((item) => (
          item && (
            <Badge
              key={item.id}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {item.name || item.title}
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          )
        ))}
      </div>
    </div>
  );
}