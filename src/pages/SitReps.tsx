import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { Input } from "@/components/ui/input";
import { Search, Calendar } from "lucide-react";
import { SitRepCard } from "../components/sitreps/SitRepCard";
import { SitRepStats } from "../components/sitreps/SitRepStats";
import { CompactSitRepForm } from "@/components/sitreps/CompactSitRepForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SitRepAnalytics } from "@/components/sitreps/analytics/SitRepAnalytics";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export default function SitReps() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isFiltering, setIsFiltering] = useState(false);

  const { data: sitreps } = useQuery({
    queryKey: ['sitreps'],
    queryFn: () => db.getAllSitReps()
  });

  const filteredSitreps = sitreps?.filter(sitrep => {
    const matchesSearch = sitrep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sitrep.summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter ? sitrep.status === statusFilter : true;
    
    const matchesDateRange = !isFiltering || !dateRange?.from || !dateRange?.to ? true :
      new Date(sitrep.date) >= dateRange.from &&
      new Date(sitrep.date) <= dateRange.to;
    
    return matchesSearch && matchesStatus && matchesDateRange;
  });

  const handleApplyDateFilter = () => {
    if (!dateRange?.from || !dateRange?.to) {
      toast({
        title: "Date Range Required",
        description: "Please select both start and end dates",
        variant: "destructive"
      });
      return;
    }
    setIsFiltering(true);
    toast({
      title: "Date Filter Applied",
      description: `Showing SitReps from ${format(dateRange.from, 'PP')} to ${format(dateRange.to, 'PP')}`
    });
  };

  const handleClearDateFilter = () => {
    setDateRange(undefined);
    setIsFiltering(false);
    toast({
      title: "Date Filter Cleared",
      description: "Showing all SitReps"
    });
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Situational Reports</h1>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="p-3 space-y-3">
                <CalendarComponent
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  className="rounded-md border"
                  classNames={{
                    day_range_middle: "bg-green-100 text-green-900",
                    day_selected: "bg-green-600 text-white hover:bg-green-700",
                    day_range_end: "bg-green-600 text-white hover:bg-green-700",
                    day_range_start: "bg-green-600 text-white hover:bg-green-700"
                  }}
                />
                <div className="flex gap-2">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700" 
                    onClick={handleApplyDateFilter}
                  >
                    Apply Filter
                  </Button>
                  {isFiltering && (
                    <Button 
                      variant="outline" 
                      onClick={handleClearDateFilter}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <CompactSitRepForm onSubmitSuccess={() => {}} />
        </div>
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <div>
            <SitRepStats onStatusFilter={setStatusFilter} activeFilter={statusFilter} />
            
            <div className="relative mt-6">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Search sitreps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-4 mt-6">
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
        </TabsContent>
        <TabsContent value="analytics">
          <SitRepAnalytics 
            startDate={dateRange?.from} 
            endDate={dateRange?.to}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}