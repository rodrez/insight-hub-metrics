import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";

interface SMEPartnerSelectProps {
  selectedSME: string;
  setSelectedSME: (value: string) => void;
}

export function SMEPartnerSelect({ selectedSME, setSelectedSME }: SMEPartnerSelectProps) {
  const { data: smePartners = [] } = useQuery({
    queryKey: ['sme-partners'],
    queryFn: () => db.getAllSMEPartners()
  });

  return (
    <div>
      <Label htmlFor="smePartner">SME Partner</Label>
      <Select value={selectedSME} onValueChange={setSelectedSME}>
        <SelectTrigger>
          <SelectValue placeholder="Select SME partner" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          {smePartners.map((partner) => (
            <SelectItem key={partner.id} value={partner.id}>
              {partner.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}