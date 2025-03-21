import { useState, useEffect } from "react";
import { postScript } from "@/services/script";
import { Script } from "@/types/Script";

export const usePostScript = (
  title: string,
  description: string,
  scriptPrompt: string
) => {
  const [generatedScript, setGeneratedScript] = useState<Script>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadScript = async () => {
      try {
        setLoading(true);
        const data = await postScript(title, description, scriptPrompt);
        console.log("data", data);
        setGeneratedScript(data);
      } catch (error: any) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    loadScript();
  }, []);

  return { generatedScript, loading, error };
};
