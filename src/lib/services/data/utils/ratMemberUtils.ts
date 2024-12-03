const ratMembers = {
  "Sarah Johnson": {
    role: "Director",
    expertise: "Retail Operations",
    department: "Retail Innovation"
  },
  "Michael Chen": {
    role: "Senior Manager",
    expertise: "Cloud Architecture",
    department: "Technology"
  },
  "Emily Rodriguez": {
    role: "Senior Manager",
    expertise: "Product Innovation",
    department: "R&D"
  },
  "David Kim": {
    role: "Senior Manager",
    expertise: "Enterprise Software",
    department: "Software Development"
  },
  "James Wilson": {
    role: "Tech Lead",
    expertise: "AI/ML",
    department: "Advanced Technology"
  },
  "Maria Garcia": {
    role: "Tech Lead",
    expertise: "Data Science",
    department: "Analytics"
  },
  "Robert Taylor": {
    role: "Tech Lead",
    expertise: "Systems Integration",
    department: "Infrastructure"
  }
} as const;

export const getAllRatMembers = () => Object.keys(ratMembers);

export const getRatMemberRole = (member: string) => {
  return ratMembers[member as keyof typeof ratMembers]?.role || "Unknown Role";
};

export const getRatMemberInfo = (member: string) => {
  return ratMembers[member as keyof typeof ratMembers] || null;
};

export const getRandomRatMember = () => {
  const members = getAllRatMembers();
  return members[Math.floor(Math.random() * members.length)];
};