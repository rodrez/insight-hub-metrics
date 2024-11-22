import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

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
    definition: 'Need, Approach, Benefits, Competition - A framework for evaluating project proposals',
    category: 'Frameworks'
  },
  {
    id: '2',
    term: 'POC',
    definition: 'Point of Contact - The primary person responsible for a project or initiative',
    category: 'Roles'
  },
  {
    id: '3',
    term: 'KPI',
    definition: 'Key Performance Indicator - Metrics used to evaluate project success',
    category: 'Metrics'
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
                    <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
                      {item.category}
                    </span>
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