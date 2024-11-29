import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import { GlossaryList } from "@/components/glossary/GlossaryList";
import { AddTermDialog } from "@/components/glossary/AddTermDialog";
import { GlossaryItem } from "@/types/glossary";

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

  const existingCategories = Array.from(
    new Set(GLOSSARY_ITEMS.map(item => item.category))
  );

  const handleAddTerm = (newTerm: { term: string; definition: string; category: string }) => {
    const newItem: GlossaryItem = {
      id: crypto.randomUUID(),
      ...newTerm,
    };
    
    // In a real app, you would save this to your database
    console.log('New term added:', newItem);
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Glossary</h1>
        <AddTermDialog 
          onAddTerm={handleAddTerm}
          existingCategories={existingCategories}
        />
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search terms..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <GlossaryList items={filteredItems} />
    </div>
  );
}
