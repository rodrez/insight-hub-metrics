import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const agreementFormSchema = z.object({
  signedDate: z.string().refine((date) => {
    const signedDate = new Date(date);
    const today = new Date();
    return signedDate <= today;
  }, "Signed date cannot be in the future"),
  expiryDate: z.string().refine((date) => {
    const expiryDate = new Date(date);
    const today = new Date();
    return expiryDate > today;
  }, "Expiry date must be in the future"),
}).refine((data) => {
  const signedDate = new Date(data.signedDate);
  const expiryDate = new Date(data.expiryDate);
  return signedDate < expiryDate;
}, {
  message: "Expiry date must be after signed date",
  path: ["expiryDate"],
});

type AgreementFormValues = z.infer<typeof agreementFormSchema>;

interface AgreementFormProps {
  type: 'nda' | 'jtda';
  onSubmit: (values: AgreementFormValues) => void;
  initialData?: {
    signedDate?: string;
    expiryDate?: string;
  };
  hasNda?: boolean;
}

export function AgreementForm({ type, onSubmit, initialData, hasNda }: AgreementFormProps) {
  const form = useForm<AgreementFormValues>({
    resolver: zodResolver(agreementFormSchema),
    defaultValues: {
      signedDate: initialData?.signedDate || '',
      expiryDate: initialData?.expiryDate || '',
    },
  });

  const handleSubmit = (values: AgreementFormValues) => {
    if (type === 'jtda' && !hasNda) {
      toast({
        title: "Warning",
        description: "An NDA must be established before creating a JTDA",
        variant: "destructive",
      });
      return;
    }
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {type === 'jtda' && !hasNda && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Warning: An NDA must be established before creating a JTDA.
            </AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="signedDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date Signed</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expiryDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiry Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Save Agreement</Button>
      </form>
    </Form>
  );
}