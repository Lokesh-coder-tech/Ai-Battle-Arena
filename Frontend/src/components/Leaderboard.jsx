import React, { useMemo } from "react";
import { Trophy, Medal, Percent, BarChart3, Star, X, Zap, Terminal } from "lucide-react";
import styles from "../styles/Leaderboard.module.css";

export default function Leaderboard({ history, onClose, onGoToArena }) {
  // Dynamically calculate arena statistics based on live history state
  const leaderBoardData = useMemo(() => {
    const stats = {
      "GPT-4o": { wins: 0, totalScore: 0, matches: 0, icon: <Zap size={14} />, color: styles.purpleText },
      "Gemini Pro": { wins: 0, totalScore: 0, matches: 0, icon: <Terminal size={14} />, color: styles.blueText }
    };

    // Parse every stored execution matrix
    history.forEach((battle) => {
      const score1 = battle.verdict?.solution_1_score ?? 0;
      const score2 = battle.verdict?.solution_2_score ?? 0;

      // Update match counts
      stats["GPT-4o"].matches += 1;
      stats["Gemini Pro"].matches += 1;

      // Cumulative scores
      stats["GPT-4o"].totalScore += score1;
      stats["Gemini Pro"].totalScore += score2;

      // Accumulate wins
      if (score1 > score2) stats["GPT-4o"].wins += 1;
      if (score2 > score1) stats["Gemini Pro"].wins += 1;
    });

    // Format data into sortable ranking rows
    return Object.keys(stats).map((name) => {
      const model = stats[name];
      const avgScore = model.matches > 0 ? (model.totalScore / model.matches).toFixed(1) : "0.0";
      const winRate = model.matches > 0 ? Math.round((model.wins / model.matches) * 100) : 0;

      return {
        name,
        icon: model.icon,
        colorClass: model.color,
        wins: model.wins,
        matches: model.matches,
        avgScore,
        winRate
      };
    }).sort((a, b) => parseFloat(b.avgScore) - parseFloat(a.avgScore) || b.winRate - a.winRate);
  }, [history]);

  return (
    <section className={styles.leaderboardWrapper}>
      {/* Header architecture layout */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Model Leaderboard</h1>
          <p className={styles.pageSubtitle}>Real-time performance rankings based on competitive judge verdicts.</p>
        </div>
        <button className={styles.closePageBtn} onClick={onClose}>
          <X size={16} /> Close Standings
        </button>
      </div>

      {/* Main Leaderboard Table Architecture */}
      <div className={styles.tableResponsiveContainer}>
        <table className={styles.leaderboardTable}>
          <thead>
            <tr>
              <th className={styles.centerAlign}>Rank</th>
              <th>Model Name</th>
              <th className={styles.centerAlign}><BarChart3 size={14} className={styles.tableHeaderIcon} /> Battles</th>
              <th className={styles.centerAlign}>Wins</th>
              <th className={styles.centerAlign}><Percent size={14} className={styles.tableHeaderIcon} /> Win Rate</th>
              <th className={styles.centerAlign}><Star size={14} className={styles.tableHeaderIcon} /> Avg Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderBoardData.map((model, index) => {
              const rank = index + 1;
              return (
                <tr key={model.name} className={styles.tableRowFrame}>
                  {/* Rank Column */}
                  <td className={styles.centerAlign}>
                    <div className={styles.rankBadgeFrame}>
                      {rank === 1 ? (
                        <Trophy size={16} className={styles.goldTrophy} />
                      ) : rank === 2 ? (
                        <Medal size={16} className={styles.silverMedal} />
                      ) : (
                        <span className={styles.normalRankText}>{rank}</span>
                      )}
                    </div>
                  </td>

                  {/* Model Profile Column */}
                  <td>
                    <div className={styles.modelIdentityBox}>
                      <span className={`${styles.modelIconFrame} ${model.colorClass}`}>
                        {model.icon}
                      </span>
                      <span className={styles.modelNameText}>{model.name}</span>
                    </div>
                  </td>

                  {/* Operational Metrics Columns */}
                  <td className={styles.centerAlign}>{model.matches}</td>
                  <td className={styles.centerAlign}>{model.wins}</td>
                  <td className={styles.centerAlign}>
                    <div className={styles.percentageWrapper}>
                      <span className={styles.percentageText}>{model.winRate}%</span>
                      <div className={styles.progressTrackBar}>
                        <div className={styles.progressFill} style={{ width: `${model.winRate}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className={styles.centerAlign}>
                    <span className={styles.scoreHighlightText}>{model.avgScore} <small>/10</small></span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Conditional Warning / Placeholder banner if no match log history exists */}
      {history.length === 0 && (
        <div className={styles.emptyPromptPlaceholder}>
          <p>No evaluations tracked yet. Run battle prompts to populate active grading weights.</p>
          <button className={styles.actionRedirectBtn} onClick={onGoToArena}>Go to Arena</button>
        </div>
      )}
    </section>
  );
}