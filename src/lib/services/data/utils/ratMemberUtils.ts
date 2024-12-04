export const RAT_MEMBERS = {
  "Sarah Johnson": {
    name: "Sarah Johnson",
    expertise: "Retail Operations",
    role: "Director",
    department: "Retail Innovation"
  },
  "Michael Chen": {
    name: "Michael Chen",
    expertise: "Cloud Architecture",
    role: "Senior Manager",
    department: "Technology"
  },
  "Emily Rodriguez": {
    name: "Emily Rodriguez",
    expertise: "Product Innovation",
    role: "Senior Manager",
    department: "R&D"
  },
  "David Kim": {
    name: "David Kim",
    expertise: "Enterprise Software",
    role: "Senior Manager",
    department: "Software Development"
  },
  "James Wilson": {
    name: "James Wilson",
    expertise: "AI/ML",
    role: "Tech Lead",
    department: "Advanced Technology"
  },
  "Maria Garcia": {
    name: "Maria Garcia",
    expertise: "Data Science",
    role: "Tech Lead",
    department: "Analytics"
  },
  "Robert Taylor": {
    name: "Robert Taylor",
    expertise: "Systems Integration",
    role: "Tech Lead",
    department: "Infrastructure"
  }
} as const;

const cachedRatMembers = Object.keys(RAT_MEMBERS);

export const getAllRatMembers = (): string[] => {
  return cachedRatMembers;
};

export const getRatMemberInfo = (name: string): typeof RAT_MEMBERS[keyof typeof RAT_MEMBERS] | undefined => {
  return RAT_MEMBERS[name as keyof typeof RAT_MEMBERS];
};

export const getRatMemberRole = (name: string): string | undefined => {
  return RAT_MEMBERS[name as keyof typeof RAT_MEMBERS]?.role;
};

export const getRatMemberExpertise = (name: string): string | undefined => {
  return RAT_MEMBERS[name as keyof typeof RAT_MEMBERS]?.expertise;
};

export const getRatMemberDepartment = (name: string): string | undefined => {
  return RAT_MEMBERS[name as keyof typeof RAT_MEMBERS]?.department;
};

export const getRandomRatMember = (): string => {
  return cachedRatMembers[Math.floor(Math.random() * cachedRatMembers.length)];
};

export const getRatMemberRelationships = async (name: string, db: any) => {
  try {
    const [projects, fortune30Partners, smePartners, spis, sitreps] = await Promise.all([
      db.getAllProjects(),
      db.getAllCollaborators(),
      db.getAllSMEPartners(),
      db.getAllSPIs(),
      db.getAllSitReps()
    ]);

    return {
      projects: projects.filter(p => p.ratMember === name),
      fortune30Partners: fortune30Partners.filter(p => p.ratMember === name),
      smePartners: smePartners.filter(p => p.ratMember === name),
      spis: spis.filter(s => s.ratMember === name),
      sitreps: sitreps.filter(s => s.ratMember === name)
    };
  } catch (error) {
    console.error('Error fetching RAT member relationships:', error);
    throw error;
  }
};