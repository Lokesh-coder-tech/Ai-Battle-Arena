import React from "react";
import ReactMarkdown from "react-markdown";
import { Sparkles, Terminal, Activity, CheckCircle2 } from "lucide-react";
import styles from "../styles/BattleArena.module.css";

const MODEL_CONFIG = {
  a: {
    label: "Model A",
    name: "GPT-4o",
    icon: <Sparkles size={16} />,
    themeClass: styles.themePurple,
  },
  b: {
    label: "Model B",
    name: "Gemini Pro",
    icon: <Terminal size={16} />,
    themeClass: styles.themeBlue,
  },
};

function SkeletonLoader() {
  return (
    <div className={styles.skeletonWrapper}>
      {[100, 85, 95, 70, 90, 40].map((w, i) => (
        <div key={i} className={styles.skeletonLine} style={{ width: `${w}%` }} />
      ))}
    </div>
  );
}

function ModelCard({ modelKey, response, isLoading }) {
  const cfg = MODEL_CONFIG[modelKey];

  return (
    <div className={`${styles.cardWrapper} ${cfg.themeClass}`}>
      {/* Header Panel */}
      <div className={styles.cardHeader}>
        <div className={styles.metaProfile}>
          <div className={styles.metaIcon}>{cfg.icon}</div>
          <div>
            <span className={styles.metaLabel}>{cfg.label}</span>
            <h3 className={styles.metaName}>{cfg.name}</h3>
          </div>
        </div>

        <div className={`${styles.statusChip} ${isLoading ? styles.statusThinking : response ? styles.statusReady : ""}`}>
          {isLoading ? (
            <>
              <Activity size={12} className={styles.pulseIcon} />
              <span>Thinking</span>
            </>
          ) : response ? (
            <>
              <CheckCircle2 size={12} />
              <span>Ready</span>
            </>
          ) : (
            <span>Standby</span>
          )}
        </div>
      </div>

      {/* Main Content Pane */}
      <div className={styles.cardBody}>
        {isLoading ? (
          <SkeletonLoader />
        ) : response ? (
          <div className={styles.markdownRender}>
            <ReactMarkdown>{response}</ReactMarkdown>
          </div>
        ) : (
          <div className={styles.emptyContainer}>
            <div className={styles.emptyIconContainer}>{cfg.icon}</div>
            <p className={styles.emptyText}>Awaiting system orchestration initialized via prompt submission...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BattleArena({ responses, isLoading }) {
  return (
    <div className={styles.arenaLayout}>
      <div className={styles.gridContainer}>
        <ModelCard modelKey="a" response={responses?.modelA} isLoading={isLoading} />
        
        {/* Dynamic Interactive Divider Axis */}
        <div className={styles.dividerAxis}>
          <div className={styles.vsBadge}>VS</div>
        </div>

        <ModelCard modelKey="b" response={responses?.modelB} isLoading={isLoading} />
      </div>
    </div>
  );
}