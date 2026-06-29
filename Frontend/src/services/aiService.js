// services/aiService.js
const BACKEND_URL = "http://localhost:3000"; // Update this if your backend is hosted elsewhere

export async function getBattleData(prompt) {
  try {
    const response = await fetch(`${BACKEND_URL}/invoke`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: prompt }),
    });

    if (!response.ok) throw new Error("Backend failed");

    const data = await response.json();
    const res = data.result;

    // Safety fallback checking if the backend result or judge object is entirely missing
    if (!res || !res.judge) {
      console.warn("Warning: Backend run finished but 'judge' or 'result' configuration was empty.");
    }

    return {
      modelA: res?.solution_1 || "No response from Model A",
      modelB: res?.solution_2 || "No response from Model B",
      
      // Match the exact flat property keys expected by your UI component views
      verdict: {
        solution_1_score: res?.judge?.solution_1_score ?? 0,
        solution_2_score: res?.judge?.solution_2_score ?? 0,
        solution_1_reasoning: res?.judge?.solution_1_reasoning || "No analytics compiled for Solution 1.",
        solution_2_reasoning: res?.judge?.solution_2_reasoning || "No analytics compiled for Solution 2.",
      }
    };
  } catch (error) {
    console.error("Battle call failed:", error);
    throw error;
  }
}