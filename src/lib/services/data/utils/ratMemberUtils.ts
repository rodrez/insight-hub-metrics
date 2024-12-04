type RatMemberInfo = {
  name: string;
  expertise: string;
  role: string;
  department: string;
  fortune30Partner?: string;
  smePartners: string[];
  spis: string[];
  sitreps: string[];
};

const RAT_MEMBERS: Record<string, RatMemberInfo> = {
  "Sarah Johnson": {
    name: "Sarah Johnson",
    expertise: "Retail Operations",
    role: "Director",
    department: "Retail Innovation",
    fortune30Partner: "Walmart",
    smePartners: ["InnoTech Solutions", "DataFlow Analytics"],
    spis: ["retail-spi-1", "retail-spi-2"],
    sitreps: ["retail-sitrep-1", "retail-sitrep-2"]
  },
  "Michael Chen": {
    name: "Michael Chen",
    expertise: "Cloud Architecture",
    role: "Senior Manager",
    department: "Technology",
    fortune30Partner: "Amazon",
    smePartners: ["CloudScale Systems"],
    spis: ["cloud-spi-1", "cloud-spi-2"],
    sitreps: ["cloud-sitrep-1", "cloud-sitrep-2"]
  },
  "Emily Rodriguez": {
    name: "Emily Rodriguez",
    expertise: "Product Innovation",
    role: "Senior Manager",
    department: "R&D",
    fortune30Partner: "Apple",
    smePartners: ["AgileWorks Consulting"],
    spis: ["product-spi-1", "product-spi-2"],
    sitreps: ["product-sitrep-1", "product-sitrep-2"]
  },
  "David Kim": {
    name: "David Kim",
    expertise: "Enterprise Software",
    role: "Senior Manager",
    department: "Software Development",
    fortune30Partner: "CVS Health",
    smePartners: ["SecureNet Solutions"],
    spis: ["software-spi-1", "software-spi-2"],
    sitreps: ["software-sitrep-1", "software-sitrep-2"]
  },
  "James Wilson": {
    name: "James Wilson",
    expertise: "AI/ML",
    role: "Tech Lead",
    department: "Advanced Technology",
    fortune30Partner: "UnitedHealth",
    smePartners: ["InnoTech Solutions", "DataFlow Analytics"],
    spis: ["ai-spi-1", "ai-spi-2"],
    sitreps: ["ai-sitrep-1", "ai-sitrep-2"]
  },
  "Maria Garcia": {
    name: "Maria Garcia",
    expertise: "Data Science",
    role: "Tech Lead",
    department: "Analytics",
    fortune30Partner: "Microsoft",
    smePartners: ["DataFlow Analytics"],
    spis: ["data-spi-1", "data-spi-2"],
    sitreps: ["data-sitrep-1", "data-sitrep-2"]
  },
  "Robert Taylor": {
    name: "Robert Taylor",
    expertise: "Systems Integration",
    role: "Tech Lead",
    department: "Infrastructure",
    smePartners: ["CloudScale Systems", "SecureNet Solutions"],
    spis: ["integration-spi-1", "integration-spi-2"],
    sitreps: ["integration-sitrep-1", "integration-sitrep-2"]
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
  const memberInfo = RAT_MEMBERS[name];
  if (!memberInfo) {
    console.log('No member info found for:', name);
    return null;
  }

  try {
    // Wait for all promises to resolve
    const [fortune30Partners, smePartners, projects, spis, sitreps] = await Promise.all([
      db.getAllCollaborators().then(partners => {
        console.log(`Fortune 30 partners for ${name}:`, partners);
        return partners;
      }).catch(() => []),
      db.getAllSMEPartners().then(partners => {
        console.log(`SME partners for ${name}:`, partners);
        return partners;
      }).catch(() => []),
      db.getAllProjects().then(projs => {
        console.log(`Projects for ${name}:`, projs);
        return projs;
      }).catch(() => []),
      db.getAllSPIs().then(spiList => {
        console.log(`SPIs for ${name}:`, spiList);
        return spiList;
      }).catch(() => []),
      db.getAllSitReps().then(sitreps => {
        console.log(`SitReps for ${name}:`, sitreps);
        return sitreps;
      }).catch(() => [])
    ]);

    const relationships = {
      fortune30Partners: fortune30Partners.filter((p: any) => p.ratMember === name) || [],
      smePartners: smePartners.filter((p: any) => p.ratMember === name) || [],
      projects: projects.filter((p: any) => p.ratMember === name) || [],
      spis: spis.filter((s: any) => s.ratMember === name) || [],
      sitreps: sitreps.filter((s: any) => s.ratMember === name) || []
    };

    console.log('Found relationships for ${name}:', relationships);
    return relationships;
  } catch (error) {
    console.error('Error fetching relationships:', error);
    // Return empty arrays instead of null to prevent UI errors
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

export const getRatMemberSPIs = (name: string): string[] | undefined => {
  return RAT_MEMBERS[name]?.spis;
};

export const getRatMemberSitReps = (name: string): string[] | undefined => {
  return RAT_MEMBERS[name]?.sitreps;
};

export const getRatMemberSMEPartners = (name: string): string[] | undefined => {
  return RAT_MEMBERS[name]?.smePartners;
};

export const getRandomRatMember = (): string => {
  const members = getAllRatMembers();
  return members[Math.floor(Math.random() * members.length)];
};
