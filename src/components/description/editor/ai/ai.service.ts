export async function aiGenerate(prompt: string): Promise<string> {
  const res = await fetch("/api/ai/generate", {
    method: "POST",
    body: JSON.stringify({ prompt }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  return data.text;
}
