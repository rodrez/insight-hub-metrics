import { Link } from "react-router-dom";
import { GlobalSearch } from "../search/GlobalSearch";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold">Insight Hub</span>
        </Link>
        <div className="flex items-center space-x-6 text-sm font-medium">
          <Link to="/" className="transition-colors hover:text-foreground/80">Dashboard</Link>
          <Link to="/collaborations" className="transition-colors hover:text-foreground/80">Collaborations</Link>
          <Link to="/wiki" className="transition-colors hover:text-foreground/80">Wiki</Link>
          <Link to="/glossary" className="transition-colors hover:text-foreground/80">Glossary</Link>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <GlobalSearch />
          <Link to="/settings" className="transition-colors hover:text-foreground/80">Settings</Link>
        </div>
      </div>
    </nav>
  );
}