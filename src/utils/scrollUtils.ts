export const scrollToProject = (projectId: string) => {
  setTimeout(() => {
    const element = document.getElementById(`project-${projectId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 100);
};

export const scrollToCollaborator = (collaboratorId: string) => {
  setTimeout(() => {
    const element = document.getElementById(`collaborator-${collaboratorId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 100);
};