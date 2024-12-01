import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";

interface PartnerDisplayProps {
  fortune30PartnerId?: string;
  smePartnerId?: string;
}

export function PartnerDisplay({ fortune30PartnerId, smePartnerId }: PartnerDisplayProps) {
  const { data: smePartner } = useQuery({
    queryKey: ['sme-partner', smePartnerId],
    queryFn: async () => {
      if (!smePartnerId || smePartnerId === 'none') return null;
      const partner = await db.getSMEPartner(smePartnerId);
      return partner || null;
    },
    enabled: !!smePartnerId && smePartnerId !== 'none'
  });

  const { data: fortune30Partner } = useQuery({
    queryKey: ['collaborators-fortune30', fortune30PartnerId],
    queryFn: async () => {
      if (!fortune30PartnerId || fortune30PartnerId === 'none') return null;
      // For testing, we'll use a specific Fortune 30 partner
      return {
        id: 'fortune30-1',
        name: 'InnoTech Solutions',
        color: '#4A90E2',
        type: 'fortune30' as const
      };
    },
    enabled: !!fortune30PartnerId && fortune30PartnerId !== 'none'
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