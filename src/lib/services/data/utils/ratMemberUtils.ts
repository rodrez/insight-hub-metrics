import { RAT_MEMBERS } from './ratMemberConstants';

export type RatMemberInfo = {
  name: string;
  expertise: string;
  role: string;
  department: string;
};

const cachedRatMembers = Object.keys(RAT_MEMBERS);

export const getAllRatMembers = (): string[] => {
  return cachedRatMembers;
};

export const getRatMemberInfo = (name: string): RatMemberInfo | undefined => {
  return RAT_MEMBERS[name];
};

export const getRatMemberRole = (name: string): string | undefined => {
  return RAT_MEMBERS[name]?.role;
};

export const getRatMemberExpertise = (name: string): string | undefined => {
  return RAT_MEMBERS[name]?.expertise;
};

export const getRatMemberDepartment = (name: string): string | undefined => {
  return RAT_MEMBERS[name]?.department;
};

export const getRandomRatMember = (): string => {
  return cachedRatMembers[Math.floor(Math.random() * cachedRatMembers.length)];
};

export const getRatMemberRelationships = async (name: string, db: any) => {
  try {
    // Get all relationships from different stores
    const [projects, fortune30Partners, smePartners, spis, sitreps] = await Promise.all([
      db.getAllProjects(),
      db.getAllFortune30Partners(),
      db.getAllSMEPartners(),
      db.getAllSPIs(),
      db.getAllSitReps()
    ]);

    // Filter relationships where the RAT member matches
    return {
      projects: projects?.filter((p: any) => p.ratMember === name) || [],
      fortune30Partners: fortune30Partners?.filter((p: any) => p.ratMember === name) || [],
      smePartners: smePartners?.filter((p: any) => p.ratMember === name) || [],
      spis: spis?.filter((s: any) => s.ratMember === name) || [],
      sitreps: sitreps?.filter((s: any) => s.ratMember === name) || []
    };
  } catch (error) {
    console.error('Error fetching RAT member relationships:', error);
    return {
      projects: [],
      fortune30Partners: [],
      smePartners: [],
      spis: [],
      sitreps: []
    };
  }
};

export { RAT_MEMBERS };