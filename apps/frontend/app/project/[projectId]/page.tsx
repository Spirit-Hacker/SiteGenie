"use client";
import { Appbar } from "@/components/Appbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WORKER_BACKEND_URL, WORKER_URL } from "@/config";
import { useActions } from "@/hooks/useActions";
import { usePrompts } from "@/hooks/usePrompts";
import axios from "axios";
import { Send } from "lucide-react";
import { useState } from "react";

export default function ProjectPage({
  params,
}: {
  params: { projectId: string };
}) {
  const { prompts } = usePrompts(params.projectId);
  const { actions } = useActions(params.projectId);
  const [prompt, setPrompt] = useState("");
  console.log("Project ID Page.tsx :", params.projectId);

  return (
    <div className="h-screen">
      {/* <Appbar /> */}
      <div className="text-white flex h-full">
        <div className="w-1/4 h-screen flex flex-col justify-between p-4">
          <div>
            Chat History
            {prompts
              .filter((prompt) => prompt.type === "USER")
              .map((prompt) => (
                <div key={prompt.id}>{prompt.content}</div>
              ))}
            {actions.map((action) => (
              <div key={action.id}>{action.content}</div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
              }}
            />
            <Button
              className="bg-white text-black cursor-pointer hover:bg-slate-200"
              onClick={async () => {
                await axios.post(`${WORKER_BACKEND_URL}/prompt`, {
                  projectId: params.projectId,
                  prompt: prompt,
                });
                setPrompt("");
              }}
            >
              <Send />
            </Button>
          </div>
        </div>
        <div className="w-3/4 p-4">
          <iframe src={`${WORKER_URL}`} height={"100%"} width={"100%"}></iframe>
        </div>
      </div>
    </div>
  );
}
