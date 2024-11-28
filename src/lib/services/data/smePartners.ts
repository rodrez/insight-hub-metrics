import { Collaborator } from '@/lib/types/collaboration';

export const generateSMEPartners = (): Collaborator[] => {
  const today = new Date();
  
  return [
    {
      id: "sme-1",
      name: "Dr. Sarah Johnson",
      color: "#4A90E2",
      email: "sarah.johnson@experts.com",
      role: "AI Research Expert",
      department: "Artificial Intelligence",
      projects: [
        {
          id: "ai-research-1",
          name: "Neural Network Optimization",
          description: "Advanced research in neural network efficiency improvements"
        }
      ],
      lastActive: today.toISOString(),
      type: "sme",
      primaryContact: {
        name: "Dr. Sarah Johnson",
        role: "Lead Researcher",
        email: "sarah.johnson@experts.com",
        phone: "+1 (555) 123-4567"
      }
    },
    {
      id: "sme-2",
      name: "Prof. Michael Chen",
      color: "#50C878",
      email: "m.chen@experts.com",
      role: "Quantum Computing Specialist",
      department: "Quantum Technologies",
      projects: [
        {
          id: "quantum-1",
          name: "Quantum Algorithm Development",
          description: "Development of novel quantum computing algorithms"
        }
      ],
      lastActive: today.toISOString(),
      type: "sme",
      primaryContact: {
        name: "Prof. Michael Chen",
        role: "Principal Investigator",
        email: "m.chen@experts.com",
        phone: "+1 (555) 987-6543"
      }
    },
    {
      id: "sme-3",
      name: "Dr. Emily Rodriguez",
      color: "#9B59B6",
      email: "e.rodriguez@experts.com",
      role: "Robotics Expert",
      department: "Robotics & Automation",
      projects: [
        {
          id: "robotics-1",
          name: "Autonomous Systems Integration",
          description: "Integration of AI with robotic systems"
        }
      ],
      lastActive: today.toISOString(),
      type: "sme",
      primaryContact: {
        name: "Dr. Emily Rodriguez",
        role: "Research Director",
        email: "e.rodriguez@experts.com",
        phone: "+1 (555) 234-5678"
      }
    }
  ];
};