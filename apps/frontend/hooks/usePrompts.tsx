import { BACKEND_URL } from "@/config";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";

interface Prompt {
  id: string;
  content: string;
  type: "USER" | "SYSTEM";
  projectId: string;
}

export function usePrompts(projectId: String) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const { getToken } = useAuth();
  
  async function getPrompts() {
    const token = await getToken();
    const res = await axios.get(`${BACKEND_URL}/prompts/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("User Prompts: ", res.data.prompts);
    setPrompts(res.data.prompts);
  }

  useEffect(() => {
    (async () => {
        await getPrompts();
    })();
    let interval = setInterval(getPrompts, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log("All Prompts: ", prompts);
  }, [prompts]);

  return {
    prompts,
  };
}
