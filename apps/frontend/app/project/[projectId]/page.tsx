"use client";
// import { Appbar } from "@/components/Appbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WORKER_BACKEND_URL, WORKER_URL } from "@/config";
import { Action, useActions } from "@/hooks/useActions";
import { Prompt, usePrompts } from "@/hooks/usePrompts";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { Send } from "lucide-react";
import React, { useEffect, useState } from "react";

interface GroupedPrompt extends Prompt {
  actions: Action[];
}

export default function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = React.use(params);
  const { prompts } = usePrompts(projectId);
  const { actions } = useActions(projectId);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();
  console.log("Project ID Page.tsx : ", projectId);

  const handleOnclick = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = await getToken();
      const response = await axios.post(
        `${WORKER_BACKEND_URL}/prompt`,
        {
          projectId: projectId,
          prompt: prompt,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Prompt Creation log: ", response);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) console.log("Error: ", error.message);
      else console.log("Error: ", error);
    } finally {
      setLoading(false);
      setPrompt("");
    }
  };

  const [groupedPromptWithActions, setGroupedPromptWithActions] =
    useState<GroupedPrompt[]>();

  useEffect(() => {
    console.log("All Prompts Test: ", prompts);
    console.log("All Actions Test : ", actions);

    const grouped: GroupedPrompt[] = prompts
      .filter((prompt) => prompt.type === "USER")
      .map((prompt) => {
        const relatedActions = actions.filter(
          (action) => action.promptId === prompt.id
        );
        return {
          ...prompt,
          actions: relatedActions,
        };
      });

    console.log("Grouped Prompts and Actions: ", grouped);
    setGroupedPromptWithActions(grouped);
  }, [prompts, actions]);

  return (
    <div className="h-screen overflow-y-hidden">
      {/* <Appbar /> */}
      <div className="text-white flex h-full">
        <div className="w-[600px] h-screen flex flex-col justify-between p-4 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none]">
          <div>
            <div className="text-2xl font-bold">Chat History</div>
            {groupedPromptWithActions?.map((prompt) => {
              return (
                <div key={prompt.id}>
                  <div className="flex items-center px-4 py-2 mb-3 mt-3 gap-2">
                    <div className="w-[35px] h-[35px] rounded-full bg-blue-400">
                      <img
                        className="w-full h-full rounded-full"
                        src="https://sdmntprwestus.oaiusercontent.com/files/00000000-e518-6230-a046-4300a0aa353f/raw?se=2025-05-23T12%3A09%3A25Z&sp=r&sv=2024-08-04&sr=b&scid=8078a6a6-92f1-5094-9149-f1f4a896ac93&skoid=ea0c7534-f237-4ccd-b7ea-766c4ed977ad&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-05-23T08%3A15%3A12Z&ske=2025-05-24T08%3A15%3A12Z&sks=b&skv=2024-08-04&sig=Rg3W1/LZ23bGSmzGoCBRZJXPrmQ46FTHwaM/MlcaYKo%3D"
                        alt="profile"
                      />
                    </div>
                    <div className="text-xl font-semibold text-white bg-gray-800 rounded-2xl px-4 py-2 h-full w-full">
                      {loading ? "AI is Thinking..." : prompt.content}
                    </div>
                  </div>
                  <div className="flex items-center px-4 py-2 mb-3 mt-3 gap-2">
                    <div className="w-[35px] h-[35px] rounded-full bg-blue-400">
                      <img
                        className="w-full h-full rounded-full object-cover"
                        src="https://imgs.search.brave.com/xaXDNc6mcLwfzQtdeU0CDWVDGq5JZzLzkZ7zjxRUibs/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWdz/LnNlYXJjaC5icmF2/ZS5jb20vQVlTUlBF/cDBDZm81OVlFSzhq/eS1lcHd1U0MybmdG/WEFGQ0ZqUDZMd0Fv/VS9yczpmaXQ6NTAw/OjA6MDowL2c6Y2Uv/YUhSMGNITTZMeTlw/Yldkai9aRzR1YzNS/aFlteGxaR2xtL1pu/VnphVzl1ZDJWaUxt/TnYvYlM4eU1ESTBM/ek12TXpBdi9aak5t/WXpJNVpURXRPV0U0/L01DMDBOV1V6TFRn/MU5EVXQvTmpOaU9U/VmlaREl5TWpKai9M/bXB3Wnc.jpeg"
                        alt="AI"
                      />
                    </div>

                    {prompt.actions.length > 0 && (
                      <div className="bg-gray-800 rounded-2xl w-full h-full px-4 py-2">
                        {prompt.actions.map((action) => {
                          return (
                            <div
                              key={action.id}
                              className="text-md  text-white"
                            >
                              <span className="mr-2">{action.content}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-2 sticky bottom-1 bg-black mt-1">
            <Input
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
              }}
            />
            <Button
              className="bg-white text-black cursor-pointer hover:bg-slate-200"
              onClick={handleOnclick}
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
