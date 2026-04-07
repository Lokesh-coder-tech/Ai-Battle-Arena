import React, { useState, useRef, useCallback } from "react";
import Navbar from "./components/Navbar";
import InputArena from "./components/InputArena";
import BattleArena from "./components/BattleArena";
import JudgeVerdict from "./components/JudgeVerdict";
import { getBattleData } from "./services/aiService"; // Ensure this matches your service filename
import "./index.css";

const PHASES = {
  IDLE: "idle",
  LOADING_MODELS: "loading_models",
  LOADING_JUDGE: "loading_judge",
  COMPLETE: "complete",
};

export default function App() {
  const [phase, setPhase] = useState(PHASES.IDLE);
  const [prompt, setPrompt] = useState("");
  const [responses, setResponses] = useState(null);
  const [verdict, setVerdict] = useState(null);
  const [history, setHistory] = useState([]);

  const resultsRef = useRef(null);

  const scrollToResults = () => {
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 150);
  };

  const handleSubmit = useCallback(
    async (userPrompt) => {
      if (phase !== PHASES.IDLE && phase !== PHASES.COMPLETE) return;

      // 1. Reset UI & start loading
      setPrompt(userPrompt);
      setResponses(null);
      setVerdict(null);
      setPhase(PHASES.LOADING_MODELS);
      scrollToResults();

      try {
        // 2. Single call to fetch everything from backend
        const data = await getBattleData(userPrompt);

        // 3. Update Model Responses
        setResponses({
          modelA: data.modelA,
          modelB: data.modelB,
        });

        // 4. Brief transition to "Judging" phase for better UX
        setPhase(PHASES.LOADING_JUDGE);

        // Small delay so the user sees the "Judge Evaluating" status
        await new Promise((resolve) => setTimeout(resolve, 800));

        // 5. Update Verdict and finish
        setVerdict(data.verdict);
        setPhase(PHASES.COMPLETE);

        // 6. Update History
        setHistory((prev) => [
          {
            id: Date.now(),
            prompt:
              userPrompt.substring(0, 80) + (userPrompt.length > 80 ? "…" : ""),
            winner: data.verdict.winner || "Tie",
            timestamp: new Date(),
          },
          ...prev.slice(0, 9),
        ]);
      } catch (err) {
        console.error("Battle error:", err);
        // Fallback to idle so user can try again
        setPhase(PHASES.IDLE);
        alert(
          "Failed to connect to the AI Arena. Please ensure your backend is running.",
        );
      }
    },
    [phase],
  );

  const handleNewBattle = useCallback(() => {
    setPhase(PHASES.IDLE);
    setPrompt("");
    setResponses(null);
    setVerdict(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Derived loading states for components
  const isModelLoading = phase === PHASES.LOADING_MODELS;
  const isJudgeLoading = phase === PHASES.LOADING_JUDGE;
  const showResults = phase !== PHASES.IDLE;

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#0e0e13",
        backgroundImage: `
          linear-gradient(rgba(108, 71, 255, 0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(108, 71, 255, 0.04) 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* Background ambient glows */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: "10%",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(117,86,255,0.3) 0%, transparent 70%)",
            filter: "blur(80px)",
            opacity: 0.2,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            right: "5%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,210,253,0.25) 0%, transparent 70%)",
            filter: "blur(80px)",
            opacity: 0.15,
          }}
        />
      </div>

      <Navbar onNewBattle={handleNewBattle} />

      <main style={{ paddingTop: "64px", position: "relative", zIndex: 1 }}>
        {/* Hero Section */}
        <section style={{ padding: "64px 24px 48px", textAlign: "center" }}>
          <div style={{ maxWidth: "720px", margin: "0 auto" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "24px",
              }}
            >
              <span
                className="chip chip-primary"
                style={{ gap: "8px", padding: "6px 16px" }}
              >
                <span
                  className="animate-pulse-glow"
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "currentColor",
                    display: "inline-block",
                  }}
                />
                AI Battle Arena — Live
              </span>
            </div>

            <h1
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(2.5rem, 7vw, 4rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                marginBottom: "20px",
              }}
            >
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #e8e4ff 0%, #b0a2ff 40%, #00d2fd 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Ask. Battle.
              </span>
              <br />
              <span style={{ color: "#f9f5fd" }}>Discover.</span>
            </h1>

            <p
              style={{
                color: "#acaab1",
                fontFamily: "'Manrope', sans-serif",
                fontSize: "1.05rem",
                lineHeight: 1.7,
                marginBottom: "40px",
              }}
            >
              Submit any challenge.{" "}
              <span style={{ color: "#b0a2ff" }}>GPT-4o</span> and{" "}
              <span style={{ color: "#00d2fd" }}>Gemini Pro</span> compete, then
              an <span style={{ color: "#ffe792" }}>AI Judge</span> decides.
            </p>

            <InputArena
              onSubmit={handleSubmit}
              isLoading={isModelLoading || isJudgeLoading}
            />
          </div>
        </section>

        {/* Current Prompt Display */}
        {showResults && prompt && (
          <section
            className="animate-fade-in"
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              padding: "0 24px 24px",
            }}
          >
            <div
              style={{
                borderRadius: "16px",
                padding: "16px 24px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                background: "rgba(117,86,255,0.06)",
                border: "1px solid rgba(176,162,255,0.12)",
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>💬</span>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: "#acaab1",
                    marginBottom: "4px",
                  }}
                >
                  Battle Prompt
                </p>
                <p style={{ color: "#d0cee8", lineHeight: 1.6 }}>{prompt}</p>
              </div>
              <div>
                {isModelLoading && (
                  <span className="chip chip-primary">Models Thinking…</span>
                )}
                {isJudgeLoading && (
                  <span className="chip chip-gold">Judge Evaluating…</span>
                )}
                {phase === PHASES.COMPLETE && (
                  <span className="chip chip-gold">✓ Complete</span>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Battle Results */}
        {showResults && (
          <section
            ref={resultsRef}
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              padding: "0 24px 40px",
              display: "flex",
              flexDirection: "column",
              gap: "32px",
            }}
          >
            <BattleArena responses={responses} isLoading={isModelLoading} />

            {(isJudgeLoading || verdict) && (
              <>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "16px" }}
                >
                  <div
                    style={{
                      flex: 1,
                      height: "1px",
                      background: "rgba(255,231,146,0.1)",
                    }}
                  />
                  <span
                    className="text-gradient-gold"
                    style={{
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      padding: "0 12px",
                    }}
                  >
                    Judge's Verdict
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: "1px",
                      background: "rgba(255,231,146,0.1)",
                    }}
                  />
                </div>
                <JudgeVerdict verdict={verdict} isLoading={isJudgeLoading} />
              </>
            )}

            {phase === PHASES.COMPLETE && (
              <div
                className="animate-fade-in"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  paddingTop: "16px",
                }}
              >
                <button
                  onClick={handleNewBattle}
                  className="btn-plasma"
                  style={{ padding: "16px 32px" }}
                >
                  ⚔️ New Battle
                </button>
              </div>
            )}
          </section>
        )}

        {/* History Section */}
        {history.length > 0 && (
          <section
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              padding: "40px 24px",
              borderTop: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <h2
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "#acaab1",
                marginBottom: "20px",
              }}
            >
              Recent Battles
            </h2>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {history.map((item) => (
                <div
                  key={item.id}
                  className="glass-card"
                  style={{
                    padding: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    borderRadius: "12px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSubmit(item.prompt)}
                >
                  <span
                    style={{
                      flex: 1,
                      fontSize: "0.875rem",
                      color: "#d0cee8",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.prompt}
                  </span>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: item.winner?.includes("GPT")
                        ? "#b0a2ff"
                        : "#00d2fd",
                    }}
                  >
                    🏆 {item.winner}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
