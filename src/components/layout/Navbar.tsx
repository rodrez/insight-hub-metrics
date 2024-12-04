import { Link } from "react-router-dom";
import { GlobalSearch } from "../search/GlobalSearch";
import { ThemeToggle } from "../theme/ThemeToggle";
import { ChartBar, Users, UserCheck, BookOpen, ListTodo, Settings, FileText, TrendingUp, UserCog, Network } from "lucide-react";
import { NavItem } from "./NavItem";
import { ErrorBoundary } from "./ErrorBoundary";

const navItems = [
  { icon: ChartBar, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Collaborations', path: '/collaborations' },
  { icon: UserCog, label: 'SME', path: '/sme' },
  { icon: UserCheck, label: 'Internal Support', path: '/internal-support' },
  { icon: Network, label: 'Org Chart', path: '/org-chart' },
  { icon: FileText, label: 'SitReps', path: '/sitreps' },
  { icon: TrendingUp, label: 'SPI', path: '/spi' },
  { icon: BookOpen, label: 'Wiki', path: '/wiki' },
  { icon: ListTodo, label: 'Glossary', path: '/glossary' },
];

export default function Navbar() {
  return (
    <ErrorBoundary>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Insight Hub</span>
          </Link>
          <div className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <NavItem
                key={item.path}
                to={item.path}
                icon={item.icon}
                label={item.label}
              />
            ))}
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <GlobalSearch />
            <ThemeToggle />
            <NavItem to="/settings" icon={Settings} label="Settings" />
          </div>
        </div>
      </nav>
    </ErrorBoundary>
  );
}