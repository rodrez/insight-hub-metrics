export interface PointOfContact {
  name: string;
  title: string;
  email: string;
  department: string;
}

export type ContactPerson = {
  name: string;
  role: string;
  email: string;
  phone?: string;
};