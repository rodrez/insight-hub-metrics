export interface Contact {
  name: string;
  role: string;
  email: string;
  phone: string;
  notes?: string;
}

export interface LOB {
  name: string;
  department: string;
}

export interface BusinessCategory {
  name: string;
  description: string;
  detailedDescription?: string;
  contacts: Contact[];
  lobs: LOB[];
}

export const businessCategories: BusinessCategory[] = [
  {
    name: "Aircraft",
    description: "Development and manufacturing of commercial and military aircraft, including rotorcraft and unmanned aerial systems",
    detailedDescription: "Our Aircraft division specializes in cutting-edge aerospace technology, from commercial airliners to military aircraft. We focus on innovative design, advanced materials, and sustainable aviation solutions. Key areas include passenger aircraft, military transport, combat aircraft, and next-generation propulsion systems.",
    contacts: [
      { name: "John Smith", role: "Program Director", email: "j.smith@company.com", phone: "555-0101", notes: "Primary contact for commercial aviation projects" },
      { name: "Sarah Johnson", role: "Technical Lead", email: "s.johnson@company.com", phone: "555-0102", notes: "Handles all technical specifications" },
      { name: "Mike Chen", role: "Operations Manager", email: "m.chen@company.com", phone: "555-0103", notes: "Manages day-to-day operations" }
    ],
    lobs: [
      { name: "Commercial Aviation", department: "airplanes" },
      { name: "Military Aircraft", department: "airplanes" },
      { name: "Rotorcraft", department: "helicopters" },
      { name: "UAV Systems", department: "helicopters" }
    ]
  },
  {
    name: "Marine",
    description: "Maritime solutions including naval systems, port operations, and offshore technologies",
    detailedDescription: "The Marine division delivers comprehensive maritime solutions for military and commercial applications. We excel in naval architecture, ship systems integration, and advanced marine technologies. Our expertise covers submarine systems, surface vessels, port automation, and offshore energy platforms.",
    contacts: [
      { name: "Lisa Brown", role: "Marine Systems Director", email: "l.brown@company.com", phone: "555-0201", notes: "Oversees naval projects" },
      { name: "David Park", role: "Naval Architecture Lead", email: "d.park@company.com", phone: "555-0202", notes: "Expert in ship design" },
      { name: "Emma Wilson", role: "Operations Coordinator", email: "e.wilson@company.com", phone: "555-0203", notes: "Coordinates operations for marine projects" }
    ],
    lobs: [
      { name: "Naval Systems", department: "space" },
      { name: "Maritime Operations", department: "space" },
      { name: "Port Solutions", department: "energy" }
    ]
  },
  {
    name: "Technology",
    description: "Digital solutions and cybersecurity services, including cloud infrastructure and software development",
    detailedDescription: "Our Technology division focuses on providing innovative digital solutions, developing robust cloud infrastructures, and delivering comprehensive cybersecurity services. We are experts in software development, aiming to enhance operational efficiencies and protect organizational data.",
    contacts: [
      { name: "Alex Rivera", role: "Technology Director", email: "a.rivera@company.com", phone: "555-0301", notes: "Leads technology initiatives" },
      { name: "Grace Liu", role: "Solutions Architect", email: "g.liu@company.com", phone: "555-0302", notes: "Designs technical solutions" },
      { name: "Tom Anderson", role: "Security Lead", email: "t.anderson@company.com", phone: "555-0303", notes: "Handles cybersecurity measures" }
    ],
    lobs: [
      { name: "Digital Solutions", department: "it" },
      { name: "Cybersecurity", department: "it" },
      { name: "Cloud Services", department: "techlab" }
    ]
  },
  {
    name: "Space",
    description: "Space exploration technologies, satellite systems, and launch vehicle development",
    detailedDescription: "Our Space division focuses on pioneering technologies that advance space exploration. We are involved in developing satellite systems and launch vehicles, emphasizing high-performance engineering and reliability in extreme environments.",
    contacts: [
      { name: "Kevin Turner", role: "Program Manager", email: "k.turner@company.com", phone: "555-0401", notes: "Manages space projects" },
      { name: "Nancy Green", role: "Spacecraft Engineer", email: "n.green@company.com", phone: "555-0402", notes: "Responsible for spacecraft systems" },
      { name: "Chris Evans", role: "Launch Coordinator", email: "c.evans@company.com", phone: "555-0403", notes: "Coordinates launch schedules" }
    ],
    lobs: [
      { name: "Satellite Systems", department: "space" },
      { name: "Launch Vehicles", department: "space" },
      { name: "Space Exploration", department: "space" }
    ]
  },
  {
    name: "Energy",
    description: "Sustainable energy solutions, power systems, and grid infrastructure development",
    detailedDescription: "The Energy division is committed to creating sustainable solutions that enhance energy efficiency and reduce carbon footprints. Our projects encompass renewable energy technologies, power systems, and development of robust grid infrastructures.",
    contacts: [
      { name: "Diana Lane", role: "Energy Project Lead", email: "d.lane@company.com", phone: "555-0501", notes: "Leads energy projects" },
      { name: "Mark Smith", role: "Grid Systems Engineer", email: "m.smith@company.com", phone: "555-0502", notes: "Expert in grid technology" },
      { name: "Laura Hill", role: "Renewable Energy Analyst", email: "l.hill@company.com", phone: "555-0503", notes: "Analyzes renewable projects" }
    ],
    lobs: [
      { name: "Renewable Energy", department: "energy" },
      { name: "Power Systems", department: "energy" },
      { name: "Grid Solutions", department: "energy" }
    ]
  },
  {
    name: "Defense",
    description: "Defense systems and electronics, including missile systems and combat technologies",
    detailedDescription: "Our Defense division specializes in advanced systems and electronics for military applications. We focus on development of missile systems, combat technologies, and integrative defense solutions that ensure security and operational effectiveness.",
    contacts: [
      { name: "Henry Adams", role: "Defense Systems Director", email: "h.adams@company.com", phone: "555-0601", notes: "Oversees defense projects" },
      { name: "Sophia Carter", role: "Combat Systems Engineer", email: "s.carter@company.com", phone: "555-0602", notes: "Designs combat systems" },
      { name: "Oliver James", role: "Missile Systems Analyst", email: "o.james@company.com", phone: "555-0603", notes: "Analyzes missile systems" }
    ],
    lobs: [
      { name: "Missile Systems", department: "space" },
      { name: "Defense Electronics", department: "techlab" },
      { name: "Combat Systems", department: "airplanes" }
    ]
  },
  {
    name: "Research",
    description: "Advanced research and development in materials, AI, robotics, and emerging technologies",
    detailedDescription: "Our Research division is at the forefront of scientific inquiry and technological innovation. We conduct advanced research in materials science, artificial intelligence, robotics, and other emerging fields to drive the next wave of innovation.",
    contacts: [
      { name: "Ella Johnson", role: "R&D Lead", email: "e.johnson@company.com", phone: "555-0701", notes: "Leads research initiatives" },
      { name: "Jake Brown", role: "AI Researcher", email: "j.brown@company.com", phone: "555-0702", notes: "Focuses on AI projects" },
      { name: "Emily Davis", role: "Robotics Engineer", email: "e.davis@company.com", phone: "555-0703", notes: "Works on robotics development" }
    ],
    lobs: [
      { name: "Advanced Materials", department: "techlab" },
      { name: "AI & Robotics", department: "techlab" },
      { name: "Future Tech", department: "techlab" }
    ]
  }
];
