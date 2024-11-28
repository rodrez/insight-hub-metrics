import { Project } from '@/lib/types';
import { Collaborator } from '@/lib/types/collaboration';
import { defaultTechDomains } from '@/lib/types/techDomain';

const projectDescriptions = {
  airplanes: "Developing next-generation airplanes systems with improved efficiency and reduced environmental impact.",
  helicopters: "Developing next-generation helicopters systems with improved efficiency and reduced environmental impact.",
  energy: "Developing next-generation energy systems with improved efficiency and reduced environmental impact.",
  space: "Developing next-generation space systems with improved efficiency and reduced environmental impact.",
  it: "Implementing enterprise-wide IT infrastructure improvements and cybersecurity enhancements."
};

const generateFallbackProject = (fortune30: Collaborator[], internalPartners: Collaborator[]): Project => ({
  id: "fallback-project-1",
  name: "Airplanes Innovation Project 1",
  departmentId: "airplanes",
  poc: "Rachel Lewis",
  pocDepartment: "airplanes",
  techLead: "Patricia Martinez",
  techLeadDepartment: "engineering",
  budget: 1000000,
  spent: 390000,
  status: "active",
  collaborators: fortune30.slice(0, 1),
  internalPartners: internalPartners.slice(0, 3),
  techDomainId: defaultTechDomains[0].id,
  nabc: {
    needs: projectDescriptions.airplanes,
    approach: "Implementing cutting-edge technologies and innovative solutions",
    benefits: "Improved efficiency and reduced environmental impact",
    competition: "Leading the industry in sustainable aviation"
  },
  isSampleData: true
});

export const generateSampleProjects = async (fortune30: Collaborator[], internalPartners: Collaborator[]): Promise<Project[]> => {
  try {
    const projects: Project[] = [
      {
        id: "airplanes-project-1",
        name: "Airplanes Innovation Project 1",
        departmentId: "airplanes",
        poc: "Rachel Lewis",
        pocDepartment: "airplanes",
        techLead: "Patricia Martinez",
        techLeadDepartment: "engineering",
        budget: 1000000,
        spent: 390000,
        status: "active" as const,
        collaborators: [fortune30.find(c => c.name === "Walmart") || fortune30[0]],
        internalPartners: [
          { ...internalPartners[0], name: "Sandra Moore" },
          { ...internalPartners[1], name: "Maria Miller" },
          { ...internalPartners[2], name: "Joseph Allen" }
        ],
        techDomainId: "cloud-computing",
        nabc: {
          needs: projectDescriptions.airplanes,
          approach: "Cloud-based systems integration",
          benefits: "40% efficiency improvement",
          competition: "Leading cloud integration in aviation"
        },
        isSampleData: true
      },
      {
        id: "airplanes-project-2",
        name: "Airplanes Innovation Project 2",
        departmentId: "airplanes",
        poc: "Rachel Lewis",
        pocDepartment: "airplanes",
        techLead: "Charles Scott",
        techLeadDepartment: "engineering",
        budget: 1500000,
        spent: 900000,
        status: "active" as const,
        collaborators: [fortune30.find(c => c.name === "Amazon") || fortune30[1]],
        internalPartners: [
          { ...internalPartners[3], name: "Betty Robinson" },
          { ...internalPartners[4], name: "Maria Young" },
          { ...internalPartners[5], name: "Steven Garcia" }
        ],
        techDomainId: "blockchain",
        nabc: {
          needs: projectDescriptions.airplanes,
          approach: "Blockchain-based supply chain",
          benefits: "Enhanced security and traceability",
          competition: "Pioneer in aviation blockchain"
        },
        isSampleData: true
      },
      {
        id: "energy-project-1",
        name: "Energy Innovation Project 1",
        departmentId: "energy",
        poc: "Richard White",
        pocDepartment: "energy",
        techLead: "Ashley Taylor",
        techLeadDepartment: "engineering",
        budget: 800000,
        spent: 152000,
        status: "active" as const,
        collaborators: [fortune30.find(c => c.name === "Microsoft") || fortune30[2]],
        internalPartners: internalPartners.slice(6, 9),
        techDomainId: "security",
        nabc: {
          needs: projectDescriptions.energy,
          approach: "Advanced security protocols",
          benefits: "Secure energy infrastructure",
          competition: "Industry-leading security measures"
        },
        isSampleData: true
      },
      {
        id: "helicopters-project-1",
        name: "Helicopters Innovation Project 1",
        departmentId: "helicopters",
        poc: "Charles Clark",
        pocDepartment: "helicopters",
        techLead: "Richard White",
        techLeadDepartment: "engineering",
        budget: 1200000,
        spent: 864000,
        status: "active" as const,
        collaborators: [fortune30.find(c => c.name === "Amazon") || fortune30[1]],
        internalPartners: [
          { ...internalPartners[9], name: "Daniel Clark" },
          { ...internalPartners[10], name: "Robert Johnson" },
          { ...internalPartners[11], name: "Sandra Anderson" }
        ],
        techDomainId: "blockchain",
        nabc: {
          needs: projectDescriptions.helicopters,
          approach: "Blockchain-based maintenance tracking",
          benefits: "Improved maintenance efficiency",
          competition: "Leading maintenance innovation"
        },
        isSampleData: true
      },
      {
        id: "it-project-1",
        name: "Enterprise Security Enhancement",
        departmentId: "it",
        poc: "Sophie Turner",
        pocDepartment: "it",
        techLead: "William Taylor",
        techLeadDepartment: "it",
        budget: 750000,
        spent: 250000,
        status: "active" as const,
        collaborators: [fortune30.find(c => c.name === "Microsoft") || fortune30[2]],
        internalPartners: internalPartners.filter(p => p.department === "it").slice(0, 3),
        techDomainId: "security",
        nabc: {
          needs: "Enhance enterprise-wide cybersecurity infrastructure",
          approach: "Implementation of zero-trust architecture",
          benefits: "90% reduction in security incidents",
          competition: "Leading cybersecurity implementation"
        },
        isSampleData: true
      },
      {
        id: "it-project-2",
        name: "Cloud Migration Initiative",
        departmentId: "it",
        poc: "James Wilson",
        pocDepartment: "it",
        techLead: "Maria Rodriguez",
        techLeadDepartment: "it",
        budget: 900000,
        spent: 400000,
        status: "active" as const,
        collaborators: [fortune30.find(c => c.name === "Amazon") || fortune30[1]],
        internalPartners: internalPartners.filter(p => p.department === "it").slice(1, 4),
        techDomainId: "cloud-computing",
        nabc: {
          needs: "Modernize infrastructure through cloud migration",
          approach: "Phased migration to cloud services",
          benefits: "40% cost reduction in infrastructure",
          competition: "Industry-leading cloud adoption"
        },
        isSampleData: true
      },
      {
        id: "space-project-1",
        name: "Satellite Communications Platform",
        departmentId: "space",
        poc: "Thomas Anderson",
        pocDepartment: "space",
        techLead: "Sarah Johnson",
        techLeadDepartment: "space",
        budget: 2000000,
        spent: 800000,
        status: "active" as const,
        collaborators: [fortune30.find(c => c.name === "SpaceX") || fortune30[3]],
        internalPartners: internalPartners.filter(p => p.department === "space").slice(0, 3),
        techDomainId: "communications",
        nabc: {
          needs: "Next-generation satellite communications",
          approach: "Advanced signal processing algorithms",
          benefits: "200% increase in bandwidth efficiency",
          competition: "Leading satellite communications provider"
        },
        isSampleData: true
      },
      {
        id: "helicopters-project-2",
        name: "Electric VTOL System",
        departmentId: "helicopters",
        poc: "Michael Chen",
        pocDepartment: "helicopters",
        techLead: "Emily Rodriguez",
        techLeadDepartment: "helicopters",
        budget: 1800000,
        spent: 600000,
        status: "active" as const,
        collaborators: [fortune30.find(c => c.name === "Boeing") || fortune30[4]],
        internalPartners: internalPartners.filter(p => p.department === "helicopters").slice(0, 3),
        techDomainId: "propulsion",
        nabc: {
          needs: "Electric vertical takeoff and landing capability",
          approach: "Novel electric propulsion system",
          benefits: "Zero emissions and 30% noise reduction",
          competition: "Pioneer in electric VTOL technology"
        },
        isSampleData: true
      }
    ];
    
    return projects.length > 0 ? projects : [generateFallbackProject(fortune30, internalPartners)];
  } catch (error) {
    console.error('Error generating sample projects:', error);
    return [generateFallbackProject(fortune30, internalPartners)];
  }
};
