import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { SitRepCard } from "./SitRepCard";
import { SitRepStats } from "./SitRepStats";
import { Skeleton } from "@/components/ui/skeleton";

interface SitRepListProps {
  showDateFilter: boolean;
}

export function SitRepList({ showDateFilter }: SitRepListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const { data: sitreps, isLoading } = useQuery({
    queryKey: ['sitreps'],
    queryFn: () => db.getAllSitReps()
  });

  const filteredSitreps = sitreps?.filter(sitrep => {
    const matchesSearch = sitrep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sitrep.summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter ? sitrep.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <SitRepStats onStatusFilter={setStatusFilter} activeFilter={statusFilter} />
      
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Search sitreps..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {isLoading ? (
          [...Array(3)].map((_, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <Skeleton className="h-6 w-3/4 mb-4" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))
        ) : (
          filteredSitreps?.map(sitrep => (
            <SitRepCard
              key={sitrep.id}
              sitrep={sitrep}
              onEdit={(id) => console.log('Edit', id)}
              onDelete={(id) => console.log('Delete', id)}
            />
          ))
        )}
      </div>
    </div>
  );
}