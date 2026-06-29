import React, { useState, useRef, useCallback } from "react";
import Navbar from "./components/Navbar";
import InputArena from "./components/InputArena";
import BattleArena from "./components/BattleArena";
import JudgeVerdict from "./components/JudgeVerdict";
import Battles from "./components/Battles";
import Models from "./components/Models";
import Leaderboard from "./components/Leaderboard"; // Dynamic Analytics Standings
import { MessageSquare, RefreshCw, History, ArrowRight } from "lucide-react";
import styles from "./App.module.css"; 

// The service function mapping validation
import { getBattleData } from "./services/aiService";

const PHASES = {
  IDLE: "idle",
  LOADING_MODELS: "loading_models",
  LOADING_JUDGE: "loading_judge",
  COMPLETE: "complete",
};

export default function App() {
  const [view, setView] = useState("arena"); // "arena", "history_page", "models_page", or "leaderboard_page"
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

      setView("arena"); // Redirect to arena instantly if running a new prompt
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

        let computedWinner = "Tie";
        const score1 = data.verdict?.solution_1_score ?? 0;
        const score2 = data.verdict?.solution_2_score ?? 0;

        if (score1 > score2) {
          computedWinner = "GPT-4o";
        } else if (score2 > score1) {
          computedWinner = "Gemini Pro";
        }

        setHistory((prev) => [
          {
            id: Date.now(),
            prompt: userPrompt,
            promptPreview: userPrompt.substring(0, 80) + (userPrompt.length > 80 ? "…" : ""),
            winner: computedWinner,
            responses: { modelA: data.modelA, modelB: data.modelB },
            verdict: data.verdict,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
          ...prev,
        ]);
      } catch (err) {
        console.error("Battle error:", err);
        setPhase(PHASES.IDLE);
        alert("Failed to connect to the AI Arena. Please verify network or server status.");
      }
    },
    [phase],
  );

  const handleSelectHistoryItem = (item) => {
    setPrompt(item.prompt);
    setResponses(item.responses);
    setVerdict(item.verdict);
    setPhase(PHASES.COMPLETE);
    setView("arena");
    scrollToResults();
  };

  const handleNewBattle = useCallback(() => {
    setPhase(PHASES.IDLE);
    setPrompt("");
    setResponses(null);
    setVerdict(null);
    setView("arena");
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

      <Navbar 
        onNewBattle={handleNewBattle} 
        onShowBattles={() => setView("history_page")}
        onShowModels={() => setView("models_page")}
        onShowLeaderboard={() => setView("leaderboard_page")}
        onShowArena={() => setView("arena")}
        currentView={view}
      />

      <main className={styles.mainContent}>
        {/* VIEW 1: INTERACTIVE WORKSPACE ARENA */}
        {view === "arena" && (
          <>
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
            
            {/* Recent Inline History Snippet Draw */}
            {history.length > 0 && (
              <section className={styles.historySection}>
                <div className={styles.historyContainer}>
                  <div className={styles.historyHeader}>
                    <History size={16} className={styles.historyHeaderIcon} />
                    <h2 className={styles.historyTitleText}>Recent Arena Battles</h2>
                  </div>
                  <div className={styles.historyGrid}>
                    {history.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className={styles.historyGlassCard}
                        onClick={() => handleSelectHistoryItem(item)}
                        role="button"
                        tabIndex={0}
                      >
                        <div className={styles.historyCardBody}>
                          <p className={styles.historyPromptPreview}>{item.promptPreview}</p>
                          <div className={styles.historyCardFooter}>
                            <span
                              className={`${styles.winnerIndicator} ${
                                item.winner === "GPT-4o" ? styles.winnerPurple : item.winner === "Gemini Pro" ? styles.winnerBlue : ""
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
          </>
        )}

        {/* VIEW 2: STORED BATTLES INDEX LEDGER */}
        {view === "history_page" && (
          <Battles 
            history={history}
            onSelectBattle={handleSelectHistoryItem}
            onClose={() => setView("arena")}
            onGoToArena={handleNewBattle}
          />
        )}

        {/* VIEW 3: MODEL SPECIFICATION SHOWCASE */}
        {view === "models_page" && (
          <Models 
            onClose={() => setView("arena")}
            onGoToArena={handleNewBattle}
          />
        )}

        {/* VIEW 4: LIVE LEADERBOARD STANDINGS */}
        {view === "leaderboard_page" && (
          <Leaderboard
            history={history}
            onClose={() => setView("arena")}
            onGoToArena={handleNewBattle}
          />
        )}
      </main>
    </div>
  );
}