import { toast } from "@/components/ui/use-toast";
import { GenerationResult } from "@/lib/types/data";

export abstract class BaseGenerationService<T> {
  protected showProgress(step: string, count: number) {
    toast({
      title: step,
      description: `Generated ${count} items`,
      duration: 2000
    });
  }

  abstract generate(quantity: number): Promise<GenerationResult<T>>;
}