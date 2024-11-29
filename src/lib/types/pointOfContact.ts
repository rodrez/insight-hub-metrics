export interface PointOfContact {
  name: string;
  title: string;
  email: string;
  department: string;
}

export interface BusinessCategory {
  name: string;
  description: string;
  contacts: PointOfContact[];
  lobs: {
    name: string;
    department: string;
  }[];
}