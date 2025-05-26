"use client";

import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Send } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { BACKEND_URL, WORKER_BACKEND_URL } from "@/config";
// import { useProjects } from "@/store/userProjects";
import { useRouter } from "next/navigation";

export function Prompt() {
  const [prompt, setPrompt] = useState("");
  const { getToken } = useAuth();
  // const { fetchProjects } = useProjects();
  const router = useRouter();

  return (
    <div>
      <Textarea
        placeholder="Create a chess app..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <div className="flex justify-end pt-2">
        <Button
          className="bg-white text-black cursor-pointer hover:bg-slate-200"
          onClick={async () => {
            if (prompt.length === 0) {
              return;
            }

            const token = await getToken();
            if (!token) {
              return;
            }

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
            console.log(response.data);
            // await fetchProjects(token);

            // call worker orchestrator to run an ec2 instance
            
            await axios.post(`${WORKER_BACKEND_URL}/prompt`, {
              projectId: response.data.projectId,
              prompt: prompt,
            });
            setPrompt("");
            router.push(`/project/${response.data.projectId}`);
          }}
        >
          <Send />
        </Button>
      </div>
    </div>
  );
}
