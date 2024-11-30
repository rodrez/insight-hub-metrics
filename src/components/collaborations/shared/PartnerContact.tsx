import { Info } from "lucide-react";
import { ContactPerson } from "@/lib/types/collaboration";
import { ContactInfo } from "../shared/ContactInfo";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type PartnerContactProps = {
  contact?: ContactPerson;
};

export function PartnerContact({ contact }: PartnerContactProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <h4 className="font-medium">Business Contact</h4>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Primary contact information for this partnership</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {contact ? (
        <ContactInfo contact={contact} />
      ) : (
        <p className="text-sm text-muted-foreground">No business contact set</p>
      )}
    </div>
  );
}