import * as React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { Project } from "@/lib/types";
import { Search } from "lucide-react";
import { useDataInitialization } from "@/components/data/hooks/useDataInitialization";
import { Skeleton } from "@/components/ui/skeleton";

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { isInitialized } = useDataInitialization();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => db.getAllProjects(),
    enabled: isInitialized
  });

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Search className="h-4 w-4" />
        <span>Search...</span>
        <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search all projects and resources..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {isLoading ? (
            <CommandGroup heading="Loading...">
              {[...Array(3)].map((_, i) => (
                <CommandItem key={i} disabled>
                  <Skeleton className="h-4 w-full" />
                </CommandItem>
              ))}
            </CommandGroup>
          ) : (
            projects?.length ? (
              <CommandGroup heading="Projects">
                {projects.map((project: Project) => (
                  <CommandItem
                    key={project.id}
                    onSelect={() => {
                      navigate(`/projects/${project.id}`);
                      setOpen(false);
                    }}
                  >
                    {project.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null
          )}
          <CommandGroup heading="Quick Links">
            <CommandItem onSelect={() => {
              navigate("/wiki");
              setOpen(false);
            }}>
              Wiki
            </CommandItem>
            <CommandItem onSelect={() => {
              navigate("/glossary");
              setOpen(false);
            }}>
              Glossary
            </CommandItem>
            <CommandItem onSelect={() => {
              navigate("/collaborations");
              setOpen(false);
            }}>
              Collaborations
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}