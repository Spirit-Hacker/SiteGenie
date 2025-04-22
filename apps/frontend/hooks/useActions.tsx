import { BACKEND_URL } from "@/config";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";

interface Action {
  id: string;
  content: string;
  projectId: string;
}

export function useActions(projectId: String) {
  const [actions, setActions] = useState<Action[]>([]);
  const { getToken } = useAuth();

  async function getActions() {
    const token = await getToken();
    const res = await axios.get(`${BACKEND_URL}/actions/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("User Actions: ", res.data.actions);
    setActions(res.data.actions);
  }

  useEffect(() => {
    (async () => {
        await getActions();
    })();
    let interval = setInterval(getActions, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log("All Prompts: ", actions);
  }, [actions]);

  return {
    actions,
  };
}
