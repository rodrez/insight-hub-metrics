import { Project } from '../types';
import { Collaborator, Agreement, AgreementStatus } from '../types/collaboration';
import { DataService } from './DataService';
import { DEPARTMENTS } from '../constants';

export class SampleDataService implements DataService {
  private db: DataService;

  constructor(db: DataService) {
    this.db = db;
  }

  async init(): Promise<void> {
    await this.db.init();
  }

  async populateSampleData(): Promise<void> {
    const fortune30Companies: Collaborator[] = [
      { 
        id: "walmart",
        name: "Walmart", 
        color: "#0071CE",
        email: "contact@walmart.com",
        role: "Strategic Partner",
        department: "Retail",
        projects: ["Supply Chain Optimization", "Digital Transformation"],
        lastActive: new Date().toISOString(),
        type: "fortune30",
        agreements: {
          nda: {
            signedDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
            expiryDate: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000).toISOString(),
            status: "signed"
          },
          jtda: {
            signedDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            expiryDate: new Date(Date.now() + 305 * 24 * 60 * 60 * 1000).toISOString(),
            status: "signed"
          }
        }
      },
      { 
        id: "amazon",
        name: "Amazon", 
        color: "#FF9900",
        email: "partner@amazon.com",
        role: "Technology Partner",
        department: "Cloud Services",
        projects: ["Cloud Migration", "AI Integration"],
        lastActive: new Date().toISOString(),
        type: "fortune30",
        agreements: {
          nda: {
            signedDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            expiryDate: new Date(Date.now() + 305 * 24 * 60 * 60 * 1000).toISOString(),
            status: "signed"
          }
        }
      },
      { 
        id: "apple",
        name: "Apple", 
        color: "#555555",
        email: "enterprise@apple.com",
        role: "Innovation Partner",
        department: "Product Development",
        projects: ["Mobile Solutions", "Enterprise Integration"],
        lastActive: new Date().toISOString(),
        type: "fortune30",
        agreements: {
          jtda: {
            signedDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
            expiryDate: new Date(Date.now() + 245 * 24 * 60 * 60 * 1000).toISOString(),
            status: "signed"
          }
        }
      }
    ];

    // Add collaborators
    for (const collaborator of fortune30Companies) {
      await this.db.addCollaborator(collaborator);
    }

    // Add projects
    for (const dept of DEPARTMENTS) {
      const projectCount = dept.projectCount;
      for (let i = 0; i < projectCount; i++) {
        const budget = Math.round(dept.budget / projectCount);
        const spent = Math.round(budget * (Math.random() * 0.8));

        const project = {
          id: `${dept.id}-project-${i + 1}`,
          name: `${dept.name} Project ${i + 1}`,
          departmentId: dept.id,
          poc: "John Doe",
          techLead: "Jane Smith",
          budget,
          spent,
          status: "active" as const,
          collaborators: [fortune30Companies[i % fortune30Companies.length]],
          nabc: {
            needs: `Sample needs for ${dept.name}`,
            approach: `Sample approach for ${dept.name}`,
            benefits: `Sample benefits for ${dept.name}`,
            competition: `Sample competition analysis for ${dept.name}`,
          },
          milestones: [
            {
              id: `${dept.id}-milestone-1`,
              title: "Initial Phase",
              description: "Project initialization and planning",
              dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              status: "in-progress" as const,
              progress: 65
            },
            {
              id: `${dept.id}-milestone-2`,
              title: "Development Phase",
              description: "Core development and testing",
              dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
              status: "pending" as const,
              progress: 0
            }
          ],
          metrics: [
            {
              id: `${dept.id}-metric-1`,
              name: "Progress",
              value: Math.round(Math.random() * 100),
              target: 100,
              unit: "%",
              trend: "up" as const,
              description: "Overall project completion progress"
            },
            {
              id: `${dept.id}-metric-2`,
              name: "Efficiency",
              value: Math.round(Math.random() * 95),
              target: 95,
              unit: "%",
              trend: "stable" as const,
              description: "Resource utilization efficiency"
            }
          ],
        };
        await this.db.addProject(project);
      }
    }
  }

  async getAllProjects(): Promise<Project[]> {
    return this.db.getAllProjects();
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.db.getProject(id);
  }

  async addProject(project: Project): Promise<void> {
    return this.db.addProject(project);
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    return this.db.updateProject(id, updates);
  }

  async getAllCollaborators(): Promise<Collaborator[]> {
    return this.db.getAllCollaborators();
  }

  async getCollaborator(id: string): Promise<Collaborator | undefined> {
    return this.db.getCollaborator(id);
  }

  async addCollaborator(collaborator: Collaborator): Promise<void> {
    return this.db.addCollaborator(collaborator);
  }

  async exportData(): Promise<void> {
    return this.db.exportData();
  }

  async clear(): Promise<void> {
    return this.db.clear();
  }
}
