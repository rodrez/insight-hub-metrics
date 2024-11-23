export interface TechDomain {
  id: string;
  name: string;
  color: string;
  description: string;
}

export const defaultTechDomains: TechDomain[] = [
  {
    id: 'ai-ml',
    name: 'AI/ML',
    color: '#8B5CF6',
    description: 'Artificial Intelligence and Machine Learning technologies'
  },
  {
    id: 'cloud',
    name: 'Cloud Computing',
    color: '#0EA5E9',
    description: 'Cloud infrastructure and services'
  },
  {
    id: 'iot',
    name: 'IoT',
    color: '#10B981',
    description: 'Internet of Things and embedded systems'
  },
  {
    id: 'security',
    name: 'Security',
    color: '#F97316',
    description: 'Cybersecurity and data protection'
  },
  {
    id: 'blockchain',
    name: 'Blockchain',
    color: '#6366F1',
    description: 'Distributed ledger technologies'
  },
  {
    id: 'ar-vr',
    name: 'AR/VR',
    color: '#EC4899',
    description: 'Augmented and Virtual Reality'
  }
];