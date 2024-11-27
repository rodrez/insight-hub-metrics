import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <div className="pt-14">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/collaborations" element={<Collaborations />} />
              <Route path="/internal-support" element={<InternalSupport />} />
              <Route path="/collaborations/:id" element={<CollaboratorDetails />} />
              <Route path="/collaborations/department/:departmentId" element={<Collaborations />} />
              <Route path="/wiki" element={<Wiki />} />
              <Route path="/glossary" element={<Glossary />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />
              <Route path="/departments/:id" element={<DepartmentDetails />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;