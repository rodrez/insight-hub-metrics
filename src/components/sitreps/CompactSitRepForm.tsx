import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { SitRep } from "@/lib/types/sitrep";
import { SitRepFormContent } from "./form/SitRepFormContent";

interface CompactSitRepFormProps {
  onSubmitSuccess: () => void;
  initialData?: SitRep;
}

export function CompactSitRepForm({ onSubmitSuccess, initialData }: CompactSitRepFormProps) {
  const [open, setOpen] = useState(false);

  if (!initialData) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Create New Sitrep</DialogTitle>
          </DialogHeader>
          <SitRepFormContent
            onSubmitSuccess={onSubmitSuccess}
            onClose={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <SitRepFormContent
      initialData={initialData}
      onSubmitSuccess={onSubmitSuccess}
    />
  );
}