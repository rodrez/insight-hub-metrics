import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { SitRepCard } from "./SitRepCard";

interface SitRepListProps {
  showDateFilter: boolean;
}

export function SitRepList({ showDateFilter }: SitRepListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: sitreps } = useQuery({
    queryKey: ['sitreps'],
    queryFn: () => db.getAllSitReps()
  });

  const filteredSitreps = sitreps?.filter(sitrep => 
    sitrep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sitrep.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          className="pl-10 bg-[#1A1F2C] text-white border-gray-700"
          placeholder="Search sitreps..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredSitreps?.map(sitrep => (
          <SitRepCard
            key={sitrep.id}
            sitrep={sitrep}
            onEdit={(id) => console.log('Edit', id)}
            onDelete={(id) => console.log('Delete', id)}
          />
        ))}
      </div>
    </div>
  );
}