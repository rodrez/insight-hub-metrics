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
    // Fetch all data first
    const [allCollaborators, allSMEPartners, allProjects, allSPIs, allSitReps] = await Promise.all([
      db.getAllCollaborators(),
      db.getAllSMEPartners(),
      db.getAllProjects(),
      db.getAllSPIs(),
      db.getAllSitReps()
    ]);

    // Filter Fortune 30 partners
    const fortune30Partners = allCollaborators.filter((p: any) => 
      p.ratMember === name && p.type === 'fortune30'
    );
    console.log(`Fortune 30 partners for ${name}:`, fortune30Partners);

    // Filter SME partners
    const smePartners = allSMEPartners.filter((p: any) => p.ratMember === name);
    console.log(`SME partners for ${name}:`, smePartners);

    // Filter projects
    const projects = allProjects.filter((p: any) => p.ratMember === name);
    console.log(`Projects for ${name}:`, projects);

    // Filter SPIs
    const spis = allSPIs.filter((s: any) => s.ratMember === name);
    console.log(`SPIs for ${name}:`, spis);

    // Filter SitReps
    const sitreps = allSitReps.filter((s: any) => s.ratMember === name);
    console.log(`SitReps for ${name}:`, sitreps);

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