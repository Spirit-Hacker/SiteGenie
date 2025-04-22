"use client";

import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@clerk/nextjs";
import { format } from "date-fns";
import { Project, useProjects } from "@/store/userProjects";

export default function AppSideBar() {
  const [open, setOpen] = useState(false);
  const { getToken } = useAuth();
  const { projects, fetchProjects } = useProjects();

  const [groupedProjects, setGroupedProjects] = useState<
    Record<string, Project[]>
  >({});

  const getProjects = async () => {
    const token = await getToken();
    if (!token) {
      return;
    }

    await fetchProjects(token);
    console.log("Projects: ", projects);
    // setProjects(response.data.projects);
  };

  const groupProjectByDate = (projects: Project[]) => {
    const groups: Record<string, Project[]> = {};

    projects.forEach((project) => {
      const date = format(new Date(project.createdAt), "dd MMMM yyyy");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(project);
    });

    return groups;
  };

  useEffect(() => {
    getProjects();
  }, []);

  useEffect(() => {
    const groups = groupProjectByDate(projects);
    setGroupedProjects(groups);
  }, [projects]);

  //   useEffect(() => {
  //     console.log("✅ groupedProjects (after set):", groupedProjects);
  //   }, [groupedProjects]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div className="p-2 cursor-pointer" onClick={() => setOpen(true)}>
          Bolty
        </div>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] bg-black overflow-y-auto hide-scrollbar">
        <SheetHeader>
          <SheetTitle className="text-white">My Projects</SheetTitle>
        </SheetHeader>
        <SheetDescription className="bg-black text-white">
          <div className="bg-black text-white">
            <div className="flex flex-col pl-4 pr-4">
              {Object.entries(groupedProjects)
                .sort(
                  ([dateA], [dateB]) =>
                    new Date(dateB).getTime() - new Date(dateA).getTime()
                )
                .map(([date, projects]) => (
                  <div key={date} className="">
                    <div className="text-lg font-semibold text-slate-400 pb-1 pt-1">
                      {date}
                    </div>
                    <div className="flex flex-col gap-1">
                      {projects
                        .sort(
                          (a: Project, b: Project) =>
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime()
                        )
                        .map((project) => (
                          <div
                            key={project.id}
                            className={`text-white font-semibold h-10 flex items-center justify-center hover:bg-slate-900 cursor-pointer ${project.description.length > 0 ? "bg-black" : "hidden"}`}
                          >
                            {project.description}
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </SheetDescription>
      </SheetContent>
    </Sheet>
  );
}
