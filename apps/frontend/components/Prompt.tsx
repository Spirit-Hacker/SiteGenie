"use client";

import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { BACKEND_URL, WORKER_BACKEND_URL } from "@/config";
// import { useProjects } from "@/store/userProjects";
import { useRouter } from "next/navigation";

export function Prompt() {
  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { getToken } = useAuth();
  // const { fetchProjects } = useProjects();
  const router = useRouter();

  const handleOnClick = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (prompt.length === 0) {
        return;
      }

      const token = await getToken();

      const response = await axios.post(
        `${BACKEND_URL}/project`,
        {
          prompt: prompt,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Project Creation log: ", response);

      // call worker orchestrator to run an ec2 instance

      await axios.post(
        `${WORKER_BACKEND_URL}/prompt`,
        {
          projectId: response.data.projectId,
          prompt: prompt,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPrompt("");
      router.push(`/project/${response.data.projectId}`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        alert(error?.response?.data.message);
      } else {
        alert("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="relative rounded-md z-0">
        {/* Bright and bold top-left corner */}
        <div className="absolute rounded-md top-0 left-0 w-30 h-20 bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-500 z-0 shadow-[0_0_100px_rgba(59,130,246,1)]" />
        <div className="absolute rounded-md top-0 left-0 w-30 h-20 bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-500 z-0 shadow-[0_0_100px_rgba(59,130,246,1)]" />

        <div className="absolute rounded-md bottom-0 right-0 w-30 h-20 bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-500 z-0 shadow-[0_0_100px_rgba(59,130,246,1)]" />
        <div className="absolute rounded-md bottom-0 right-0 w-30 h-20 bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-500 z-0 shadow-[0_0_100px_rgba(59,130,246,1)]" />

        {/* Textarea wrapper */}
        <div className="relative z-10 bg-black flex justify-center p-[2px] rounded-md">
          <Textarea
            placeholder="Create a chess app..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="resize-none w-full h-40 bg-black text-white p-4 font-semibold rounded-md"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2 z-10">
        <Button
          className="bg-white text-black cursor-pointer hover:bg-slate-200 z-10"
          onClick={handleOnClick}
        >
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="flex items-center font-bold">Start Building</div>
          )}
        </Button>
      </div>
    </div>
  );
}
