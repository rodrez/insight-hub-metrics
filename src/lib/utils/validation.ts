import { Project, Collaborator } from "../types";

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+1 \(\d{3}\) \d{3}-\d{4}$/;
  return phoneRegex.test(phone);
};

export const validateCollaborator = (collaborator: Partial<Collaborator>): boolean => {
  if (!collaborator.name || !collaborator.email || !collaborator.role || !collaborator.department) {
    return false;
  }

  if (!validateEmail(collaborator.email)) {
    return false;
  }

  if (collaborator.primaryContact) {
    if (!collaborator.primaryContact.name || 
        !collaborator.primaryContact.email || 
        !collaborator.primaryContact.role) {
      return false;
    }

    if (!validateEmail(collaborator.primaryContact.email)) {
      return false;
    }

    if (collaborator.primaryContact.phone && !validatePhoneNumber(collaborator.primaryContact.phone)) {
      return false;
    }
  }

  return true;
};

export const validateProject = (project: Partial<Project>): boolean => {
  if (!project.id || !project.name || !project.departmentId) {
    return false;
  }

  if (project.budget !== undefined && project.budget < 0) {
    return false;
  }

  if (project.spent !== undefined && project.spent < 0) {
    return false;
  }

  return true;
};