import { useQuery } from "@tanstack/react-query";
import { fortune30Partners } from "@/components/data/fortune30Partners";

interface PartnerDisplayProps {
  fortune30PartnerId?: string;
  smePartnerId?: string;
}

export function PartnerDisplay({ fortune30PartnerId, smePartnerId }: PartnerDisplayProps) {
  // Get Fortune 30 partner directly from our static data
  const fortune30Partner = fortune30Partners.find(
    partner => partner.id === fortune30PartnerId
  );

  const { data: smePartner } = useQuery({
    queryKey: ['sme-partner', smePartnerId],
    queryFn: async () => {
      if (!smePartnerId || smePartnerId === 'none') return null;
      const response = await fetch(`/api/sme-partners/${smePartnerId}`);
      if (!response.ok) return null;
      return response.json();
    },
    enabled: !!smePartnerId && smePartnerId !== 'none'
  });

  if (!fortune30PartnerId && !smePartnerId) return null;

  return (
    <div className="flex flex-wrap gap-4 text-sm">
      {fortune30PartnerId && (
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Fortune 30:</span>
          <span style={{ color: fortune30Partner?.color || '#4B5563' }}>
            {fortune30Partner?.name || 'Not found'}
          </span>
        </div>
      )}
      {smePartnerId && (
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">SME:</span>
          <span style={{ color: smePartner?.color || '#6E59A5' }}>
            {smePartner ? smePartner.name : 'None'}
          </span>
        </div>
      )}
    </div>
  );
}