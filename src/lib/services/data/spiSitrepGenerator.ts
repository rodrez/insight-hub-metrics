import { SPI } from '@/lib/types/spi';
import { SitRep } from '@/lib/types/sitrep';
import { format, subDays, addDays } from 'date-fns';

export const generateSampleSPIs = (): SPI[] => {
  const spis: SPI[] = [];
  
  const spiNames = [
    "Cloud Migration Initiative",
    "AI Integration Project",
    "Security Enhancement Program",
    "DevOps Transformation",
    "Data Center Optimization",
    "Mobile App Development",
    "Network Infrastructure Upgrade",
    "Blockchain Implementation",
    "IoT Platform Development",
    "Digital Transformation Initiative"
  ];

  const deliverables = [
    "Improve system efficiency by 30%",
    "Reduce operational costs by 25%",
    "Enhance user experience metrics",
    "Increase platform reliability to 99.99%",
    "Optimize resource utilization",
    "Strengthen security measures",
    "Accelerate deployment cycles",
    "Modernize legacy systems",
    "Implement automated testing",
    "Establish new data centers"
  ];

  spiNames.forEach((name, index) => {
    const createdAt = subDays(new Date(), Math.floor(Math.random() * 30)).toISOString();
    const expectedDate = addDays(new Date(), 30 + Math.floor(Math.random() * 60)).toISOString();
    
    spis.push({
      id: `sample-spi-${index + 1}`,
      name,
      deliverable: deliverables[index],
      details: "",
      expectedCompletionDate: expectedDate,
      status: Math.random() > 0.7 ? 'delayed' : 'on-track',
      sitrepIds: [],
      createdAt
    });
  });

  return spis;
};

export const generateSampleSitReps = (spiIds: string[]): SitRep[] => {
  const sitreps: SitRep[] = [];
  
  const updates = [
    "Successfully completed milestone 1",
    "Team alignment meeting conducted",
    "Technical challenges identified",
    "Resource allocation optimized",
    "Integration testing completed",
    "Performance metrics improved",
    "Security audit passed",
    "User feedback incorporated",
    "Documentation updated",
    "Deployment strategy finalized"
  ];

  const challenges = [
    "Resource constraints affecting timeline",
    "Technical debt in legacy systems",
    "Integration complexity higher than expected",
    "Team capacity limitations",
    "Dependencies causing delays",
    "Performance bottlenecks identified",
    "Security compliance requirements",
    "Stakeholder alignment needed",
    "Budget constraints",
    "Technical skill gaps"
  ];

  updates.forEach((update, index) => {
    const date = subDays(new Date(), Math.floor(Math.random() * 15)).toISOString();
    const spiId = spiIds[Math.floor(Math.random() * spiIds.length)];
    
    sitreps.push({
      id: `sample-sitrep-${index + 1}`,
      title: `SitRep ${index + 1}`,
      date,
      spiId,
      update,
      challenges: challenges[index],
      nextSteps: "Continue with planned activities and monitor progress",
      status: Math.random() > 0.3 ? 'on-track' : 'at-risk',
      content: update
    });
  });

  return sitreps;
};