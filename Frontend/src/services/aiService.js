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

    // Determine winner based on scores
    const modelAScore = res.judge?.solution_1_score || 0;
    const modelBScore = res.judge?.solution_2_score || 0;
    
    let winner = 'Tie';
    if (modelAScore > modelBScore) winner = 'modelA';
    if (modelBScore > modelAScore) winner = 'modelB';

    return {
      modelA: res.solution_1 || "No response from Model A",
      modelB: res.solution_2 || "No response from Model B",
      verdict: {
        winner: winner,
        scores: {
          modelA: modelAScore,
          modelB: modelBScore,
        },
        explanation: res.judge?.explanation || `Model A scored ${modelAScore}/10, Model B scored ${modelBScore}/10`,
        reasoning: res.judge?.explanation || `The judge evaluated both responses based on accuracy, clarity, and helpfulness.`,
      }
    };
  } catch (error) {
    console.error("Battle call failed:", error);
    throw error;
  }
}