const ratMembers = {
  "Sarah Johnson": "Director",
  "Michael Chen": "Senior Manager",
  "Emily Rodriguez": "Senior Manager",
  "David Kim": "Senior Manager",
  "James Wilson": "Tech Lead",
  "Maria Garcia": "Tech Lead",
  "Robert Taylor": "Tech Lead"
} as const;

export const getAllRatMembers = () => Object.keys(ratMembers);

export const getRatMemberRole = (member: string) => {
  return ratMembers[member as keyof typeof ratMembers] || "Unknown Role";
};