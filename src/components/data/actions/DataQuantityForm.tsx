import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { DataQuantities } from "../SampleData";
import { Loader2 } from "lucide-react";
import { dataQuantitiesSchema } from "../validation/databaseSchemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface DataQuantityFormProps {
  onSubmit: (quantities: DataQuantities) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export function DataQuantityForm({ onSubmit, onCancel, isLoading }: DataQuantityFormProps) {
  const form = useForm<DataQuantities>({
    resolver: zodResolver(dataQuantitiesSchema),
    defaultValues: {
      projects: 5,
      spis: 10,
      objectives: 5,
      sitreps: 10,
      fortune30: 6,
      internalPartners: 20,
      smePartners: 5
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="projects"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Projects</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="fortune30"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fortune 30 Partners</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="internalPartners"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Internal Partners</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="smePartners"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SME Partners</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="spis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SPIs</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="objectives"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Objectives</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sitreps"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sitreps</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Data
          </Button>
        </div>
      </form>
    </Form>
  );
}
