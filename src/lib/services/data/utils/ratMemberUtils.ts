const RAT_MEMBERS = [
  "Sarah Johnson",
  "Michael Chen",
  "Emily Rodriguez", 
  "David Kim",
  "James Wilson",
  "Maria Garcia",
  "Robert Taylor"
];

export const getRandomRatMember = () => {
  const randomIndex = Math.floor(Math.random() * RAT_MEMBERS.length);
  return RAT_MEMBERS[randomIndex];
};

export const getAllRatMembers = () => RAT_MEMBERS;