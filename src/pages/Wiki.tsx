import { WikiContent } from "@/components/wiki/WikiContent";
import { LinesOfBusinessTable } from "@/components/wiki/LinesOfBusinessTable";

const sections = [
  {
    id: "overview",
    title: "Overview",
    content: "Welcome to the company wiki. This resource contains important information about our organization's structure, processes, and guidelines."
  },
  {
    id: "organization",
    title: "Organization Structure",
    content: "Our organization is divided into multiple departments, each specializing in different areas of technology and innovation."
  }
];

export default function Wiki() {
  const handleSectionUpdate = (id: string, newContent: string) => {
    const updatedSections = sections.map(section => 
      section.id === id ? { ...section, content: newContent } : section
    );
    // Save updatedSections as needed (e.g., to state or backend)
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Company Wiki</h1>
      <div className="mb-8">
        <LinesOfBusinessTable />
      </div>
      <WikiContent
        sections={sections}
        onSectionUpdate={handleSectionUpdate}
      />
    </div>
  );
}
