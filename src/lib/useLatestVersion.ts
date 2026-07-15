import { useState, useEffect } from "react";

export function useLatestVersion(owner: string, repo: string) {
  const [version, setVersion] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchVersion() {
      try {
        const res = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/releases/latest`,
          {
            headers: {
              Accept: "application/vnd.github+json",
              "X-GitHub-Api-Version": "2026-03-10",
            },
          }
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && data?.tag_name) {
          setVersion(data.tag_name);
        }
      } catch {
        // silently fail
      }
    }

    fetchVersion();

    return () => {
      cancelled = true;
    };
  }, []);

  return version;
}
