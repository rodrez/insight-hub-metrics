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