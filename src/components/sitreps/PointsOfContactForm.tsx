import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEPARTMENTS } from "@/lib/constants";

interface PointOfContact {
  name: string;
  email: string;
  title: string;
  department: string;
}

interface PointsOfContactFormProps {
  pointsOfContact: PointOfContact[];
  setPointsOfContact: (pocs: PointOfContact[]) => void;
}

export function PointsOfContactForm({ pointsOfContact, setPointsOfContact }: PointsOfContactFormProps) {
  const [newPOC, setNewPOC] = useState<PointOfContact>({
    name: "",
    email: "",
    title: "",
    department: DEPARTMENTS[0].id
  });

  const addPointOfContact = () => {
    if (newPOC.name && newPOC.email) {
      setPointsOfContact([...pointsOfContact, newPOC]);
      setNewPOC({
        name: "",
        email: "",
        title: "",
        department: DEPARTMENTS[0].id
      });
    }
  };

  return (
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
              {DEPARTMENTS.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
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
  );
}