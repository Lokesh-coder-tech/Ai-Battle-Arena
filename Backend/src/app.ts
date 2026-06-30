// app.ts
import express from "express";
import runGraph from "./ai/graph.ai.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
}));

// app.get("/", async (req, res) => {
//     try {
//         const result = await runGraph("Write an code for Factorial function in js");
//         res.json(result);
//     } catch (error) {
//         console.error("GET Error:", error);
//         res.status(500).json({ error: "Graph crashed on root test check." });
//     }
// });

app.post("/invoke", async (req, res) => {
    try {
        const { input } = req.body;
        const result = await runGraph(input);

        // Debug log to confirm Gemini is actually returning scores to your console
        console.log("Graph Output State:", JSON.stringify(result.judge, null, 2));

        res.status(200).json({
            message: "Graph executed successfully",
            success: true,
            result
        });
    } catch (error) {
        console.error("POST /invoke Graph Run Error:", error);
        res.status(500).json({
            message: "Graph execution runtime crashed",
            success: false,
            error: error instanceof Error ? error.message : String(error)
        });
    }
});

// Static file serving
app.use(express.static('public'));

// SPA fallback middleware - MUST be last to catch all unmatched routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});
export default app;