import { CompactSitRepForm } from "@/components/sitreps/CompactSitRepForm";
import { SitRepList } from "@/components/sitreps/SitRepList";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SitRepAnalytics } from "@/components/sitreps/analytics/SitRepAnalytics";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function SitReps() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Situational Reports</h1>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "justify-start text-left font-normal",
                  dateRange && "text-muted-foreground"
                )}
              >
                <Calendar className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
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
            <h2 className="text-2xl font-semibold mb-4">Recent Sitreps</h2>
            <SitRepList showDateFilter={false} />
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