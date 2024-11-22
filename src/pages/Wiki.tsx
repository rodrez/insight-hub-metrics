import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Search, ChevronDown } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const WIKI_SECTIONS = [
  {
    id: '1',
    title: 'Approval Workflows',
    content: 'Detailed steps for getting project approvals, including required documentation and stakeholder sign-offs.'
  },
  {
    id: '2',
    title: 'Milestone Tracking',
    content: 'Guidelines for setting, tracking, and updating project milestones. Includes best practices for milestone definition.'
  },
  {
    id: '3',
    title: 'KPI Definitions',
    content: 'Comprehensive list of Key Performance Indicators used across projects, including calculation methods and reporting frequencies.'
  },
  {
    id: '4',
    title: 'Funding Allocation Rules',
    content: 'Policies and procedures for allocating and managing project budgets, including approval thresholds and reporting requirements.'
  }
];

export default function Wiki() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSections = WIKI_SECTIONS.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <h1 className="text-3xl font-bold mb-8">Wiki</h1>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search wiki..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-4">
        {filteredSections.map((section) => (
          <Collapsible key={section.id}>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-4 font-medium hover:bg-muted">
              {section.title}
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 pt-2 text-sm text-muted-foreground">
              {section.content}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}