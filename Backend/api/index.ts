import type { VercelRequest, VercelResponse } from "@vercel/node";
import runGraph from "../src/ai/graph.ai.js"; // path check kar lena

export default async function handler(req: VercelRequest, res: VercelResponse) {

  // ✅ GET /
  if (req.method === "GET") {
    try {
      const result = await runGraph("write a code to return a number in js");

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  // ✅ POST /invoke
  if (req.method === "POST" && req.url?.includes("/invoke")) {
    try {
      const { input } = req.body;

      const result = await runGraph(input);

      return res.status(200).json({
        message: "Graph executed successfully",
        success: true,
        result
      });
    } catch (error) {
      return res.status(500).json({ error: "Execution failed" });
    }
  }

  // ❌ Default
  return res.status(404).json({ message: "Not found" });
}