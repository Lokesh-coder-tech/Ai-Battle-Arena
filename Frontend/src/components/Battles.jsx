import React from "react";
import { History, X } from "lucide-react";
import BattleHistoryCard from "./BattleHistoryCard";
import styles from "../styles/Battles.module.css";

export default function Battles({ history, onSelectBattle, onClose, onGoToArena }) {
  return (
    <section className={styles.fullHistoryPage}>
      {/* Header Panel Architecture */}
      <div className={styles.historyPageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Stored Battles Index</h1>
          <p className={styles.pageSubtitle}>Review completed evaluations and historical execution ledgers.</p>
        </div>
        <button className={styles.closePageBtn} onClick={onClose}>
          <X size={16} /> Close Ledger
        </button>
      </div>

      {/* Main Layout Display Conditioning */}
      {history.length === 0 ? (
        <div className={styles.emptyHistoryState}>
          <div className={styles.emptyIconContainer}>
            <History size={40} className={styles.emptyIcon} />
          </div>
          <h3>No battles evaluated yet</h3>
          <p>Run prompt challenges inside the workspace arena to populate your matrix data logs.</p>
          <button onClick={onGoToArena} className={styles.primaryActionBtn}>
            Go to Arena
          </button>
        </div>
      ) : (
        <div className={styles.ledgerBigGrid}>
          {history.map((item) => (
            <BattleHistoryCard 
              key={item.id} 
              item={item} 
              onSelect={onSelectBattle} 
            />
          ))}
        </div>
      )}
    </section>
  );
}