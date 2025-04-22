import { create } from "zustand";
import axios from "axios";
import { BACKEND_URL } from "../config";

export interface Project {
  id: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

interface ProjectStore {
  projects: Project[];
  fetchProjects: (token: string) => Promise<void>;
}

export const useProjects = create<ProjectStore>((set) => ({
  projects: [],
  fetchProjects: async (token) => {
    const response = await axios.get(`${BACKEND_URL}/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    set({ projects: response.data.projects });
  },
}));
