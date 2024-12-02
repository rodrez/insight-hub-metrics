import { SPI } from '@/lib/types/spi';
import { Objective } from '@/lib/types/objective';
import { SitRep } from '@/lib/types/sitrep';
import { addDays } from 'date-fns';
import { DEPARTMENTS } from '@/lib/constants';

export const generateSampleSPIs = (projectIds: string[], count: number): SPI[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `spi-${i + 1}`,
    name: `SPI ${i + 1}`,
    deliverable: `Deliverable for SPI ${i + 1}`,
    details: `Details for SPI ${i + 1}`,
    expectedCompletionDate: addDays(new Date(), 30).toISOString(),
    status: 'on-track',
    projectId: projectIds[i % projectIds.length],
    departmentId: 'engineering',
    sitrepIds: [],
    createdAt: new Date().toISOString()
  }));
};

export const generateSampleObjectives = (count: number): Objective[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `obj-${i + 1}`,
    title: `Objective ${i + 1}`,
    description: `Description for Objective ${i + 1}`,
    initiative: `Initiative ${i + 1}`,
    desiredOutcome: `${Math.floor(Math.random() * 100)}%`,
    spiIds: []
  }));
};

export const generateSampleSitReps = (spis: SPI[], count: number): SitRep[] => {
  const departments = Array.from(DEPARTMENTS);
  const levels: Array<"CEO" | "SVP" | "CTO"> = ["CEO", "SVP", "CTO"];
  const statuses: Array<'pending-review' | 'ready' | 'submitted'> = ['pending-review', 'ready', 'submitted'];

  return Array.from({ length: count }, (_, i) => {
    const department = departments[i % departments.length];
    const teams = departments
      .filter(d => d.id !== department.id)
      .slice(0, 3)
      .map(d => d.id);

    return {
      id: `sitrep-${i + 1}`,
      title: `SPI Progress Update: Phase ${i + 1}`,
      date: new Date().toISOString(),
      spiId: spis[i % spis.length].id,
      update: `Completed milestone ${i + 1} of the SPI. Team has successfully implemented key features and resolved critical technical challenges. Performance metrics show 20% improvement in system efficiency.`,
      challenges: `Current challenges include: 1) Resource allocation for scaling operations, 2) Integration complexities with legacy systems, 3) Timeline pressure due to market demands.`,
      nextSteps: `1. Finalize implementation of remaining features\n2. Schedule integration testing with partner systems\n3. Prepare documentation for stakeholder review\n4. Plan deployment strategy for next phase`,
      status: statuses[i % statuses.length],
      summary: `Major progress achieved in ${department.name} SPI with significant technical milestones completed. Team addressing integration challenges while maintaining momentum.`,
      departmentId: department.id,
      level: levels[i % levels.length],
      teams: teams,
      pointsOfContact: teams.map(teamId => `poc-${teamId}`),
      fortune30PartnerId: `fortune30-partner-${i % 5}`,
      smePartnerId: `sme-partner-${i % 3}`,
      poc: `Department Lead ${i + 1}`,
      pocDepartment: department.id
    };
  });
};