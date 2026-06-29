import { StateGraph, StateSchema, START, END, type GraphNode } from "@langchain/langgraph"
import z from "zod";
import { geminiModel, mistralModel, cohereModel } from "./model.ai.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages"; // Ensure correct imports

const state = new StateSchema({
  problem: z.string().default(""),
  solution_1: z.string().default(""),
  solution_2: z.string().default(""),
  judge: z.object({
    solution_1_score: z.number().default(0),
    solution_2_score: z.number().default(0),
    solution_1_reasoning: z.string().default(""),
    solution_2_reasoning: z.string().default(""),
  }),
});

const solutionNode: GraphNode<typeof state> = async (state) => {
  const [mistralResponse, cohereResponse] = await Promise.all([
    mistralModel.invoke(state.problem),
    cohereModel.invoke(state.problem),
  ]);

  return {
    solution_1: mistralResponse.text,
    solution_2: cohereResponse.text,
  };
};

const judgeNode: GraphNode<typeof state> = async (state) => {
  const { problem, solution_1, solution_2 } = state;

  // Define the schema we want Gemini to return
  const judgeSchema = z.object({
    solution_1_score: z.number().min(0).max(10),
    solution_2_score: z.number().min(0).max(10),
    solution_1_reasoning: z.string(),
    solution_2_reasoning: z.string(),
  });

  // Bind the structured output directly to the Gemini model
  const structuredJudgeModel = geminiModel.withStructuredOutput(judgeSchema, {
    name: "judge_evaluation",
  });

  try {
    // Invoke the model with both system instructions and human input
    const evaluation = await structuredJudgeModel.invoke([
      new SystemMessage(
        `You are a judge in an AI battle arena. You will be given a problem and two solutions from different AI models. Your task is to evaluate the solutions based on their correctness, creativity, and relevance to the problem. Provide a score between 0 and 10 for each solution, along with your reasoning for the scores.`
      ),
      new HumanMessage(` 
        Problem: ${problem}
        Solution 1: ${solution_1}
        Solution 2: ${solution_2}
        
        Please evaluate the solutions and return the required structured JSON.
      `),
    ]);

    // evaluation is now directly typed as the Zod schema object
    return {
      judge: {
        solution_1_score: evaluation.solution_1_score,
        solution_2_score: evaluation.solution_2_score,
        solution_1_reasoning: evaluation.solution_1_reasoning,
        solution_2_reasoning: evaluation.solution_2_reasoning,
      },
    };
  } catch (error) {
    console.error("Error during judge evaluation execution:", error);
    // Return safe fallbacks if the model completely fails to prevent breaking the graph
    return {
      judge: {
        solution_1_score: 0,
        solution_2_score: 0,
        solution_1_reasoning: "Evaluation failed to execute.",
        solution_2_reasoning: "Evaluation failed to execute.",
      },
    };
  }
};

const graph = new StateGraph(state)
  .addNode("solution", solutionNode)
  .addNode("judge_node", judgeNode)
  .addEdge(START, "solution")
  .addEdge("solution", "judge_node")
  .addEdge("judge_node", END)
  .compile();

export default async function(problem: string) {
    const result = await graph.invoke({
        problem: problem
    })
    return result 
}