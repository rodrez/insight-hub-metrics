import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useErrorStore } from "./hooks/useErrorStore";
import { useState } from "react";
import { ErrorItem } from "@/lib/types/error";
import { ErrorFixDialog } from "./ErrorFixDialog";

export function ErrorHandlingSettings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedErrors, setSelectedErrors] = useState<string[]>([]);
  const [isFixDialogOpen, setIsFixDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { deleteError, updateErrorStatus } = useErrorStore();

  const { data: errors = [] } = useQuery({
    queryKey: ['errors'],
    queryFn: async () => {
      const errorStore = useErrorStore();
      return errorStore.getAllErrors();
    },
  });

  const filteredErrors = errors
    .filter(error => 
      error.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      error.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 10);

  const handleDelete = async (errorId: string) => {
    try {
      await deleteError(errorId);
      queryClient.invalidateQueries({ queryKey: ['errors'] });
      toast({
        title: "Error deleted",
        description: "The error has been removed from the list",
      });
    } catch (error) {
      toast({
        title: "Failed to delete error",
        description: "There was a problem deleting the error",
        variant: "destructive",
      });
    }
  };

  const handleErrorSelection = (errorId: string, checked: boolean) => {
    setSelectedErrors(prev => 
      checked 
        ? [...prev, errorId]
        : prev.filter(id => id !== errorId)
    );
  };

  const handleFixErrors = () => {
    if (selectedErrors.length === 0) {
      toast({
        title: "No errors selected",
        description: "Please select at least one error to fix",
        variant: "destructive",
      });
      return;
    }
    setIsFixDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Error Handling</h2>
        <Button
          onClick={handleFixErrors}
          disabled={selectedErrors.length === 0}
        >
          Fix Selected Errors
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search errors..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredErrors.map((error) => (
          <Card key={error.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedErrors.includes(error.id)}
                  onCheckedChange={(checked) => 
                    handleErrorSelection(error.id, checked as boolean)
                  }
                />
                <CardTitle className="text-sm font-medium">
                  {error.type}
                </CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Badge 
                  variant={error.status === 'resolved' ? "secondary" : "destructive"}
                >
                  {error.status}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(error.id)}
                >
                  Delete
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{error.message}</p>
              {error.stackTrace && (
                <pre className="mt-2 text-xs bg-muted p-2 rounded-md overflow-x-auto">
                  {error.stackTrace}
                </pre>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <ErrorFixDialog
        open={isFixDialogOpen}
        onOpenChange={setIsFixDialogOpen}
        errors={errors.filter(error => selectedErrors.includes(error.id))}
        onComplete={() => {
          setSelectedErrors([]);
          queryClient.invalidateQueries({ queryKey: ['errors'] });
        }}
      />
    </div>
  );
}