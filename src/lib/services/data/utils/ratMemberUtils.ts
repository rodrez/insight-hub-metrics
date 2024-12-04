type RatMemberInfo = {
  name: string;
  expertise: string;
  role: string;
  department: string;
};

export const RAT_MEMBERS: Record<string, RatMemberInfo> = {
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
};

export const getAllRatMembers = (): string[] => {
  console.log('Getting all RAT members');
  const members = Object.keys(RAT_MEMBERS);
  console.log('Available RAT members:', members);
  return members;
};

export const getRatMemberInfo = (name: string): RatMemberInfo | undefined => {
  console.log('Getting info for RAT member:', name);
  const info = RAT_MEMBERS[name];
  console.log('Found member info:', info);
  return info;
};

export const getRatMemberRelationships = async (name: string, db: any) => {
  console.log('Getting relationships for RAT member:', name);

  try {
    // Only fetch records where ratMember field matches exactly
    const [fortune30Partners, smePartners, projects, spis, sitreps] = await Promise.all([
      db.getAllCollaborators().then(partners => {
        console.log(`Fortune 30 partners for ${name}:`, partners);
        return partners.filter((p: any) => p.ratMember === name && p.type === 'fortune30');
      }).catch(() => []),
      db.getAllSMEPartners().then(partners => {
        console.log(`SME partners for ${name}:`, partners);
        return partners.filter((p: any) => p.ratMember === name);
      }).catch(() => []),
      db.getAllProjects().then(projs => {
        console.log(`Projects for ${name}:`, projs);
        return projs.filter((p: any) => p.ratMember === name);
      }).catch(() => []),
      db.getAllSPIs().then(spiList => {
        console.log(`SPIs for ${name}:`, spiList);
        return spiList.filter((s: any) => s.ratMember === name);
      }).catch(() => []),
      db.getAllSitReps().then(sitreps => {
        console.log(`SitReps for ${name}:`, sitreps);
        return sitreps.filter((s: any) => s.ratMember === name);
      }).catch(() => [])
    ]);

    const relationships = {
      fortune30Partners,
      smePartners,
      projects,
      spis,
      sitreps
    };

    console.log(`Found relationships for ${name}:`, relationships);
    return relationships;
  } catch (error) {
    console.error('Error fetching relationships:', error);
    return {
      fortune30Partners: [],
      smePartners: [],
      projects: [],
      spis: [],
      sitreps: []
    };
  }
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
  const members = getAllRatMembers();
  return members[Math.floor(Math.random() * members.length)];
};