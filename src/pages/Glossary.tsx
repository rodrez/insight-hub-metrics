import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Search, Pen, Trash2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

type GlossaryItem = {
  id: string;
  term: string;
  definition: string;
  category: string;
};

const GLOSSARY_ITEMS: GlossaryItem[] = [
  {
    id: '1',
    term: 'NABC',
    definition: 'Need, Approach, Benefits, Competition - A framework for evaluating project proposals and ensuring comprehensive project planning',
    category: 'Frameworks'
  },
  {
    id: '2',
    term: 'POC',
    definition: 'Point of Contact - The primary person responsible for a project or initiative, who serves as the main communication channel',
    category: 'Roles'
  },
  {
    id: '3',
    term: 'KPI',
    definition: 'Key Performance Indicator - Metrics used to evaluate project success and track progress towards objectives',
    category: 'Metrics'
  },
  {
    id: '4',
    term: 'NDA',
    definition: 'Non-Disclosure Agreement - A legal contract that establishes confidentiality between parties, required for all external collaborations',
    category: 'Agreements'
  },
  {
    id: '5',
    term: 'JTDA',
    definition: 'Joint Technology Development Agreement - A contract defining the terms of collaboration between organizations, including IP rights and development milestones',
    category: 'Agreements'
  },
  {
    id: '6',
    term: 'ROI',
    definition: 'Return on Investment - A measure of the profitability or benefit of an investment relative to its cost',
    category: 'Metrics'
  },
  {
    id: '7',
    term: 'IP',
    definition: 'Intellectual Property - Legal rights to creations of the mind, including patents, trade secrets, and proprietary technologies',
    category: 'Legal'
  },
  {
    id: '8',
    term: 'AI/ML',
    definition: 'Artificial Intelligence/Machine Learning - Technologies that enable computers to learn from data and make intelligent decisions',
    category: 'Tech Domains'
  },
  {
    id: '9',
    term: 'IoT',
    definition: 'Internet of Things - Network of physical objects embedded with sensors, software, and connectivity for data exchange',
    category: 'Tech Domains'
  },
  {
    id: '10',
    term: 'AR/VR',
    definition: 'Augmented Reality/Virtual Reality - Technologies that either enhance real-world environments with digital content (AR) or create fully immersive digital environments (VR)',
    category: 'Tech Domains'
  }
];

export default function Glossary() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = GLOSSARY_ITEMS.filter(item =>
    item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.definition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedItems = filteredItems.reduce((acc, item) => {
    const firstLetter = item.term[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(item);
    return acc;
  }, {} as Record<string, GlossaryItem[]>);

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <h1 className="text-3xl font-bold mb-8">Glossary</h1>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search terms..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-8">
        {Object.entries(groupedItems).sort().map(([letter, items]) => (
          <div key={letter}>
            <h2 className="text-2xl font-semibold mb-4">{letter}</h2>
            <div className="grid gap-4">
              {items.map((item) => (
                <div key={item.id} className="p-4 rounded-lg border">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{item.term}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{item.definition}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-400 hover:text-green-500 transition-colors"
                            >
                              <Pen className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit term</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete term</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}