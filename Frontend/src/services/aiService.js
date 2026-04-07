// services/aiService.js
const BACKEND_URL = "http://localhost:3000";

export async function getBattleData(prompt) {
  try {
    const response = await fetch(`${BACKEND_URL}/invoke`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: prompt }),
    });

    if (!response.ok) throw new Error("Backend failed");

    const data = await response.json();
    
    // Look at your screenshot's "Full Backend Data" object:
    // We need to pull from data.result.solution_1, etc.
    const res = data.result;

    return {
      // Map 'solution_1' from backend to 'modelA' for frontend
      modelA: res.solution_1 || "No response from Model A",
      modelB: res.solution_2 || "No response from Model B",
      
      // Map the nested judge object
      verdict: {
        solution_1_score: res.judge?.solution_1_score || 0,
        solution_2_score: res.judge?.solution_2_score || 0,
        solution_1_reasoning: res.judge?.solution_1_reasoning || "No reasoning provided.",
        solution_2_reasoning: res.judge?.solution_2_reasoning || "No reasoning provided.",
        // Calculate winner based on scores if the backend doesn't provide a 'winner' field
        winner: res.judge?.solution_1_score > res.judge?.solution_2_score ? "GPT-4o" : "Gemini Pro"
      }
    };
  } catch (error) {
    console.error("Battle call failed:", error);
    throw error;
  }
}