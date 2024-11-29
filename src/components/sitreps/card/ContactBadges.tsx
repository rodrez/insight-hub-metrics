import { Badge } from "@/components/ui/badge";

interface ContactBadgesProps {
  contacts: string[];
}

export function ContactBadges({ contacts }: ContactBadgesProps) {
  return (
    <div>
      <p className="text-sm text-gray-400 mb-2">Points of Contact:</p>
      <div className="flex flex-wrap gap-2">
        {contacts.map((contact, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="bg-emerald-600/20 text-emerald-400"
          >
            {contact}
          </Badge>
        ))}
      </div>
    </div>
  );
}