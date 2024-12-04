import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Navbar from "./components/layout/Navbar";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Collaborations from "./pages/Collaborations";
import InternalSupport from "./pages/InternalSupport";
import Wiki from "./pages/Wiki";
import Glossary from "./pages/Glossary";
import ProjectDetails from "./components/projects/ProjectDetails";
import CollaboratorDetails from "./pages/CollaboratorDetails";
import DepartmentDetails from "./pages/DepartmentDetails";
import SitReps from "./pages/SitReps";
import SPI from "./pages/SPI";
import BackButton from "./components/navigation/BackButton";
import SME from "./pages/SME";
import AddProject from "./pages/AddProject";
import OrgChart from "./pages/OrgChart";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // Data remains fresh for 5 minutes
      gcTime: 1000 * 60 * 30, // Cache persists for 30 minutes
      refetchOnMount: 'always',
      refetchInterval: false,
      networkMode: 'online'
    },
    mutations: {
      networkMode: 'online',
      retry: 1
    }
  }
});

const ROOT_PAGES = ['/', '/settings', '/collaborations', '/sme', '/internal-support', 
  '/wiki', '/glossary', '/sitreps', '/spi', '/org-chart'];

function AppContent() {
  const location = useLocation();
  const showBackButton = !ROOT_PAGES.includes(location.pathname);

  return (
    <div className="min-h-screen">
      <Navbar />
      {showBackButton && <BackButton />}
      <div className="pt-14">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/collaborations" element={<Collaborations />} />
          <Route path="/sme" element={<SME />} />
          <Route path="/internal-support" element={<InternalSupport />} />
          <Route path="/collaborations/:id" element={<CollaboratorDetails />} />
          <Route path="/collaborations/department/:departmentId" element={<Collaborations />} />
          <Route path="/wiki" element={<Wiki />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/projects/new" element={<AddProject />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/departments/:id" element={<DepartmentDetails />} />
          <Route path="/sitreps" element={<SitReps />} />
          <Route path="/spi" element={<SPI />} />
          <Route path="/org-chart" element={<OrgChart />} />
        </Routes>
      </div>
    </div>
  );
}

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;