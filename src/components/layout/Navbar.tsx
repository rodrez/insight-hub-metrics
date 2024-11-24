import { Link, useNavigate } from "react-router-dom";
import { GlobalSearch } from "../search/GlobalSearch";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { useState } from "react";
import PullDownMenu from "./PullDownMenu";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Insight Hub</span>
          </Link>

          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center space-x-1 text-sm font-medium transition-colors hover:text-foreground/80"
          >
            <span>Menu</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${showMenu ? 'rotate-180' : ''}`} />
          </button>

          <div className="ml-auto flex items-center space-x-4">
            <GlobalSearch />
            <Link to="/settings" className="transition-colors hover:text-foreground/80">Settings</Link>
          </div>
        </div>
      </nav>
      
      {showMenu && <PullDownMenu onClose={() => setShowMenu(false)} />}
    </>
  );
}