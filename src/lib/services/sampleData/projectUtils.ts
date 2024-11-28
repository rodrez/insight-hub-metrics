export const projectDescriptions = {
  airplanes: "Developing next-generation airplanes systems with improved efficiency and reduced environmental impact.",
  helicopters: "Developing next-generation helicopters systems with improved efficiency and reduced environmental impact.",
  energy: "Developing next-generation energy systems with improved efficiency and reduced environmental impact.",
  space: "Developing next-generation space systems with improved efficiency and reduced environmental impact.",
  it: "Implementing enterprise-wide IT infrastructure improvements and cybersecurity enhancements."
};

export const generateProjectNABC = (needs: string, approach: string, benefits: string, competition: string) => ({
  needs,
  approach,
  benefits,
  competition
});