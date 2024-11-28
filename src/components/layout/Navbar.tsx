import { Link } from "react-router-dom";
import { GlobalSearch } from "../search/GlobalSearch";
import { ThemeToggle } from "../theme/ThemeToggle";
import { ChartBar, Users, UserCheck, BookOpen, ListTodo, Settings, FileText, TrendingUp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold">Insight Hub</span>
        </Link>
        <div className="flex items-center space-x-6 text-sm font-medium">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/" className="transition-colors hover:text-foreground/80">
                  <ChartBar className="h-5 w-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Dashboard</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/collaborations" className="transition-colors hover:text-foreground/80">
                  <Users className="h-5 w-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Collaborations</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/internal-support" className="transition-colors hover:text-foreground/80">
                  <UserCheck className="h-5 w-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Internal Support</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/sitreps" className="transition-colors hover:text-foreground/80">
                  <FileText className="h-5 w-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>SitReps</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/spi" className="transition-colors hover:text-foreground/80">
                  <TrendingUp className="h-5 w-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>SPI</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/wiki" className="transition-colors hover:text-foreground/80">
                  <BookOpen className="h-5 w-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Wiki</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/glossary" className="transition-colors hover:text-foreground/80">
                  <ListTodo className="h-5 w-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Glossary</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <GlobalSearch />
          <ThemeToggle />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/settings" className="transition-colors hover:text-foreground/80">
                  <Settings className="h-5 w-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </nav>
  );
}