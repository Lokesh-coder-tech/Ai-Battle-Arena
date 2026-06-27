import React, { useState, useRef, useCallback } from "react";
import Navbar from "./components/Navbar";
import InputArena from "./components/InputArena";
import BattleArena from "./components/BattleArena";
import JudgeVerdict from "./components/JudgeVerdict";
import { MessageSquare, RefreshCw, History, ArrowRight } from "lucide-react";
import styles from "./App.module.css"; // Import the main CSS file for the app

// The service function mapping validation
import { getBattleData } from "./services/aiService";

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

      setPrompt(userPrompt);
      setResponses(null);
      setVerdict(null);
      setPhase(PHASES.LOADING_MODELS);
      scrollToResults();

      try {
        const data = await getBattleData(userPrompt);

        setResponses({
          modelA: data.modelA,
          modelB: data.modelB,
        });

        setPhase(PHASES.LOADING_JUDGE);
        await new Promise((resolve) => setTimeout(resolve, 800));

        setVerdict(data.verdict);
        setPhase(PHASES.COMPLETE);

        setHistory((prev) => [
          {
            id: Date.now(),
            prompt: userPrompt.substring(0, 80) + (userPrompt.length > 80 ? "…" : ""),
            winner: data.verdict?.winner || "Tie",
            timestamp: new Date(),
          },
          ...prev.slice(0, 9),
        ]);
      } catch (err) {
        console.error("Battle error:", err);
        setPhase(PHASES.IDLE);
        alert("Failed to connect to the AI Arena. Please verify network or server status.");
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

  const isModelLoading = phase === PHASES.LOADING_MODELS;
  const isJudgeLoading = phase === PHASES.LOADING_JUDGE;
  const showResults = phase !== PHASES.IDLE;

  return (
    <div className={styles.appCanvas}>
      {/* Premium Ambient Background Environment */}
      <div className={styles.backgroundGrid} aria-hidden="true">
        <div className={styles.glowBlobLeft} />
        <div className={styles.glowBlobRight} />
      </div>

      <Navbar onNewBattle={handleNewBattle} />

      <main className={styles.mainContent}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroContainer}>
            <div className={styles.badgeWrapper}>
              <span className={styles.liveBadge}>
                <span className={styles.pulseDot} />
                AI Battle Arena v2.0
              </span>
            </div>

            <h1 className={styles.heroTitle}>
              Ask the Prompts. <br />
              <span className={styles.gradientText}>Watch them Battle.</span>
            </h1>

            <p className={styles.heroSubtitle}>
              Deploy a prompt workspace challenge. Experience instant evaluation as{" "}
              <span className={styles.textHighlightPurple}>GPT-4o</span> and{" "}
              <span className={styles.textHighlightBlue}>Gemini Pro</span> compete in real-time, adjudicated by our objective AI Judge.
            </p>

            <InputArena
              onSubmit={handleSubmit}
              isLoading={isModelLoading || isJudgeLoading}
            />
          </div>
        </section>

        {/* Workspace Operations Container Panel */}
        {showResults && (
          <div className={styles.workspaceContainer}>
            {prompt && (
              <section className={styles.currentPromptSection}>
                <div className={styles.promptGlassCard}>
                  <div className={styles.promptIconBox}>
                    <MessageSquare size={16} />
                  </div>
                  <div className={styles.promptBody}>
                    <span className={styles.promptLabel}>Active Battle Query</span>
                    <p className={styles.promptText}>{prompt}</p>
                  </div>
                  <div className={styles.statusBadgeArea}>
                    {isModelLoading && (
                      <span className={`${styles.statusBadge} ${styles.badgePurple}`}>Synthesizing Responses...</span>
                    )}
                    {isJudgeLoading && (
                      <span className={`${styles.statusBadge} ${styles.badgeGold}`}>Evaluating Logs...</span>
                    )}
                    {phase === PHASES.COMPLETE && (
                      <span className={`${styles.statusBadge} ${styles.badgeGreen}`}>Analysis Compiled</span>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Battle Viewports Output */}
            <section ref={resultsRef} className={styles.arenaOutputSection}>
              <BattleArena responses={responses} isLoading={isModelLoading} />

              {(isJudgeLoading || verdict) && (
                <div className={styles.verdictWrapper}>
                  <div className={styles.sectionDividerRow}>
                    <div className={styles.dividerLine} />
                    <span className={styles.dividerLabel}>Orchestration Matrix Feedback</span>
                    <div className={styles.dividerLine} />
                  </div>
                  <JudgeVerdict verdict={verdict} isLoading={isJudgeLoading} />
                </div>
              )}

              {phase === PHASES.COMPLETE && (
                <div className={styles.actionFooter}>
                  <button onClick={handleNewBattle} className={styles.resetButton}>
                    <RefreshCw size={14} />
                    <span>Initialize New Session</span>
                  </button>
                </div>
              )}
            </section>
          </div>
        )}

        {/* History Ledger System Grid */}
        {history.length > 0 && (
          <section className={styles.historySection}>
            <div className={styles.historyContainer}>
              <div className={styles.historyHeader}>
                <History size={16} className={styles.historyHeaderIcon} />
                <h2 className={styles.historyTitleText}>System Battle History Ledger</h2>
              </div>
              <div className={styles.historyGrid}>
                {history.map((item) => (
                  <div
                    key={item.id}
                    className={styles.historyGlassCard}
                    onClick={() => handleSubmit(item.prompt)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit(item.prompt)}
                  >
                    <div className={styles.historyCardBody}>
                      <p className={styles.historyPromptPreview}>{item.prompt}</p>
                      <div className={styles.historyCardFooter}>
                        <span
                          className={`${styles.winnerIndicator} ${
                            item.winner?.includes("GPT") ? styles.winnerPurple : styles.winnerBlue
                          }`}
                        >
                          Winner: {item.winner}
                        </span>
                        <ArrowRight size={14} className={styles.arrowIcon} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}