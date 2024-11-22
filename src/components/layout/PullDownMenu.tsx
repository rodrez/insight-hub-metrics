import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, BookText, Settings } from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Collaborations', path: '/collaborations' },
  { icon: BookOpen, label: 'Wiki', path: '/wiki' },
  { icon: BookText, label: 'Glossary', path: '/glossary' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function PullDownMenu({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute top-16 left-0 right-0 bg-background/80 backdrop-blur-lg border-b animate-slide-down">
      <div className="container mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
    </div>
  );
}