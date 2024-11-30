import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";

interface PartnerSelectionFieldsProps {
  selectedFortune30: string;
  setSelectedFortune30: (value: string) => void;
  selectedSME: string;
  setSelectedSME: (value: string) => void;
}

export function PartnerSelectionFields({
  selectedFortune30,
  setSelectedFortune30,
  selectedSME,
  setSelectedSME
}: PartnerSelectionFieldsProps) {
  const { data: fortune30Partners = [] } = useQuery({
    queryKey: ['collaborators-fortune30'],
    queryFn: async () => {
      const allCollaborators = await db.getAllCollaborators();
      return allCollaborators.filter(c => c.type === 'fortune30');
    },
  });

  const { data: smePartners = [] } = useQuery({
    queryKey: ['collaborators-sme'],
    queryFn: () => db.getAllSMEPartners(),
  });

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-white">Fortune 30 Partner</Label>
        <Select 
          value={selectedFortune30 === 'none' ? '' : selectedFortune30} 
          onValueChange={value => setSelectedFortune30(value || 'none')}
        >
          <SelectTrigger className="bg-[#13151D] border-gray-700 text-white">
            <SelectValue placeholder="Select Fortune 30 partner" />
          </SelectTrigger>
          <SelectContent>
            {fortune30Partners.map(partner => (
              <SelectItem key={partner.id} value={partner.id}>
                {partner.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-white">SME Partner</Label>
        <Select 
          value={selectedSME === 'none' ? '' : selectedSME} 
          onValueChange={value => setSelectedSME(value || 'none')}
        >
          <SelectTrigger className="bg-[#13151D] border-gray-700 text-white">
            <SelectValue placeholder="Select SME partner" />
          </SelectTrigger>
          <SelectContent>
            {smePartners.map(partner => (
              <SelectItem key={partner.id} value={partner.id}>
                {partner.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}