import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, BookText, Settings } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { db } from '@/lib/db';
import { defaultTechDomains } from '@/lib/types/techDomain';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Collaborations', path: '/collaborations' },
  { icon: BookOpen, label: 'Wiki', path: '/wiki' },
  { icon: BookText, label: 'Glossary', path: '/glossary' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function PullDownMenu({ onClose }: { onClose: () => void }) {
  const { theme, setTheme } = useTheme();
  
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => db.getAllProjects(),
  });

  // Transform projects data for the radar chart
  const techDomainData = defaultTechDomains.map(domain => ({
    subject: domain.name,
    value: projects.filter(p => p.techDomainId === domain.id).length,
  }));

  return (
    <div className="absolute top-16 left-0 right-0 bg-background border-b animate-slide-down">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Navigation</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className="flex items-center gap-3 p-4 rounded-lg hover:bg-accent transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="h-[300px] bg-card rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">Technology Radar</h3>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={techDomainData}>
                <PolarGrid />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: theme === 'dark' ? '#fff' : '#000' }}
                />
                <Radar
                  name="Projects"
                  dataKey="value"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}