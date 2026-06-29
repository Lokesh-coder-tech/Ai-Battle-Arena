import React from "react";
import { Calendar, ArrowRight, Trophy } from "lucide-react";
import styles from "../styles/Battles.module.css";

export default function BattleHistoryCard({ item, onSelect }) {
  const isGPTWinner = item.winner === "GPT-4o";
  const isGeminiWinner = item.winner === "Gemini Pro";

  return (
    <div className={styles.premiumLedgerCard} onClick={() => onSelect(item)}>
      <div className={styles.ledgerCardHeader}>
        <span className={styles.timeTag}>
          <Calendar size={12} /> {item.timestamp}
        </span>
        <span
          className={`${styles.winnerBadgeIndicator} ${
            isGPTWinner ? styles.winnerPurple : isGeminiWinner ? styles.winnerBlue : styles.winnerTie
          }`}
        >
          {item.winner === "Tie" ? "Tie Match" : `🏆 ${item.winner}`}
        </span>
      </div>
      
      <p className={styles.ledgerCardPrompt}>{item.promptPreview}</p>
      
      <div className={styles.ledgerCardFooter}>
        <span className={styles.scoresRowSummary}>
          Matrix Score: <strong className={isGPTWinner ? styles.textPurple : ""}>{item.verdict?.solution_1_score || 0}</strong> vs <strong className={isGeminiWinner ? styles.textBlue : ""}>{item.verdict?.solution_2_score || 0}</strong>
        </span>
        <div className={styles.openDetailsLink}>
          <span>Inspect Battle</span> <ArrowRight size={14} />
        </div>
      </div>
    </div>
  );
}