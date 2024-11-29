import { useState } from 'react';
import { SearchBar } from '@/components/wiki/SearchBar';
import { WikiContent } from '@/components/wiki/WikiContent';
import { LinesOfBusinessTable } from '@/components/wiki/LinesOfBusinessTable';

const DEFAULT_WIKI_SECTIONS = [
  {
    id: '1',
    title: 'Project Management',
    content: `Project Management in our application follows these key processes:

1. Project Creation
- Projects must have a POC (Point of Contact) and Tech Lead from different departments
- Each project requires a defined tech domain and department assignment
- NABC framework must be completed before project activation

2. Collaboration Types
- Internal Partners: Team members from various departments
- Fortune 30 Partners: External collaborators from Fortune 30 companies
- Each collaboration type requires specific agreements (NDAs, JTDAs)

3. Budget Management
- Projects are allocated department-specific budgets
- Spending is tracked against allocated budgets
- Progress bars indicate budget utilization`
  },
  {
    id: '2',
    title: 'Collaboration Agreements',
    content: `
Understanding our collaboration agreements:

1. Non-Disclosure Agreement (NDA)
- Required for all external collaborations
- Valid for 12 months from signing date
- Must be renewed before expiration
- Status tracked in collaborator profiles

2. Joint Technology Development Agreement (JTDA)
- Required for Fortune 30 partnerships
- Defines IP ownership and sharing terms
- Includes milestone commitments
- Requires legal department review

3. Agreement Status Monitoring
- Active agreements shown in green
- Expired agreements shown in red
- Warning notifications 30 days before expiration
    `
  },
  {
    id: '3',
    title: 'Department Structure',
    content: `
Our organization consists of two types of departments:

1. Business Departments
- Airplanes: Commercial aviation projects
- Helicopters: Rotorcraft development
- Space: Space exploration technology
- Energy: Sustainable energy solutions

2. Functional Departments
- IT: Technical infrastructure and support
- Tech Lab: Research and development

Each department has:
- Dedicated budget allocation
- Project quota limits
- Specific collaboration guidelines
- Department-specific approval workflows
    `
  },
  {
    id: '4',
    title: 'NABC Framework',
    content: `
The NABC Framework is crucial for project evaluation:

1. Need
- Clear problem statement
- Market opportunity identification
- Stakeholder impact analysis
- Urgency assessment

2. Approach
- Technical solution overview
- Resource requirements
- Timeline and milestones
- Risk mitigation strategies

3. Benefits
- Quantifiable outcomes
- ROI projections
- Strategic advantages
- Long-term impact

4. Competition
- Market analysis
- Alternative solutions
- Competitive advantages
- Differentiation strategy
    `
  },
  {
    id: '5',
    title: 'Project Milestones',
    content: `
Understanding project milestone management:

1. Milestone Types
- Planning milestones
- Development checkpoints
- Review gates
- Delivery milestones

2. Status Tracking
- Pending: Not yet started
- In Progress: Currently active
- Completed: Finished and verified

3. Progress Monitoring
- Percentage completion tracking
- Due date management
- Dependencies visualization
- Status reporting requirements
    `
  },
  {
    id: '6',
    title: 'Tech Domains',
    content: `
Tech Domains categorize project focus areas:

1. Domain Categories
- AI/ML
- Robotics
- Cloud Infrastructure
- IoT/Embedded Systems
- Advanced Materials
- Sustainable Technologies

2. Domain Management
- Clear scope definition
- Required expertise levels
- Resource allocation guidelines
- Technology roadmap alignment

3. Cross-Domain Projects
- Integration requirements
- Expertise combination
- Resource sharing
- Risk assessment
    `
  }
];

export default function Wiki() {
  const [searchQuery, setSearchQuery] = useState('');
  const [wikiSections, setWikiSections] = useState(DEFAULT_WIKI_SECTIONS);

  const filteredSections = wikiSections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSectionUpdate = (id: string, newContent: string) => {
    setWikiSections(prevSections =>
      prevSections.map(section =>
        section.id === id ? { ...section, content: newContent } : section
      )
    );
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col items-start gap-2">
          <h1 className="text-4xl font-bold tracking-tight">Wiki</h1>
          <p className="text-muted-foreground">
            Documentation, guidelines, and compliance information for our projects
          </p>
        </div>
        
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        
        <LinesOfBusinessTable />
        
        <WikiContent 
          sections={filteredSections}
          onSectionUpdate={handleSectionUpdate}
        />
      </div>
    </div>
  );
}
