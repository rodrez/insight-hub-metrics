import { Dispatch, SetStateAction } from 'react';
import { Collaborator } from '@/lib/types/collaboration';
import { Project } from '@/lib/types';

export type SPIStatus = 'on-track' | 'delayed' | 'completed' | 'cancelled';

export interface SelectFieldsProps {
  status: SPIStatus;
  setStatus: Dispatch<SetStateAction<SPIStatus>>;
  selectedProject: string;
  setSelectedProject: Dispatch<SetStateAction<string>>;
  selectedFortune30: string;
  setSelectedFortune30: Dispatch<SetStateAction<string>>;
  selectedSME: string;
  setSelectedSME: Dispatch<SetStateAction<string>>;
  selectedDepartment: string;
  setSelectedDepartment: Dispatch<SetStateAction<string>>;
  selectedRatMember: string;
  setSelectedRatMember: Dispatch<SetStateAction<string>>;
  projects?: Project[];
  fortune30Partners?: Collaborator[];
}

export function SelectFields({
  status,
  setStatus,
  selectedProject,
  setSelectedProject,
  selectedFortune30,
  setSelectedFortune30,
  selectedSME,
  setSelectedSME,
  selectedDepartment,
  setSelectedDepartment,
  selectedRatMember,
  setSelectedRatMember,
  projects,
  fortune30Partners,
}: SelectFieldsProps) {
  return (
    <div className="space-y-6">
      {/* Status Field */}
      <div>
        <label className="block text-sm font-medium">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as SPIStatus)}
          className="mt-1 block w-full border rounded-md"
        >
          <option value="on-track">On Track</option>
          <option value="delayed">Delayed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Project Field */}
      <div>
        <label className="block text-sm font-medium">Select Project</label>
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="mt-1 block w-full border rounded-md"
        >
          <option value="none">Select a project...</option>
          {projects?.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {/* Fortune 30 Partner Field */}
      <div>
        <label className="block text-sm font-medium">Select Fortune 30 Partner</label>
        <select
          value={selectedFortune30}
          onChange={(e) => setSelectedFortune30(e.target.value)}
          className="mt-1 block w-full border rounded-md"
        >
          <option value="none">Select a partner...</option>
          {fortune30Partners?.map((partner) => (
            <option key={partner.id} value={partner.id}>
              {partner.name}
            </option>
          ))}
        </select>
      </div>

      {/* SME Partner Field */}
      <div>
        <label className="block text-sm font-medium">Select SME Partner</label>
        <select
          value={selectedSME}
          onChange={(e) => setSelectedSME(e.target.value)}
          className="mt-1 block w-full border rounded-md"
        >
          <option value="none">Select a partner...</option>
        </select>
      </div>

      {/* Department Field */}
      <div>
        <label className="block text-sm font-medium">Select Department</label>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="mt-1 block w-full border rounded-md"
        >
          <option value="none">Select a department...</option>
        </select>
      </div>

      {/* Rat Member Field */}
      <div>
        <label className="block text-sm font-medium">Select Rat Member</label>
        <select
          value={selectedRatMember}
          onChange={(e) => setSelectedRatMember(e.target.value)}
          className="mt-1 block w-full border rounded-md"
        >
          <option value="none">Select a rat member...</option>
        </select>
      </div>
    </div>
  );
}
