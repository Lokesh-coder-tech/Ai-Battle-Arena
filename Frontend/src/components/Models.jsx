import React from "react";
import { Sparkles, Terminal, Scale, Cpu, CheckCircle2, Shield, X } from "lucide-react";
import styles from "../styles/Models.module.css";

export default function Models({ onClose, onGoToArena }) {
  const modelsData = [
    {
      id: "gpt-4o",
      name: "GPT-4o",
      provider: "OpenAI",
      role: "Contender (Model A)",
      icon: <Sparkles className={styles.iconPurple} size={22} />,
      badgeClass: styles.badgePurple,
      description: "Omni architecture designed for high-speed multi-modal synthesis. Known for exceptional structural logic, clean frontend code architecture, and high creative precision.",
      specs: { context: "128k", capability: "Logic & Code", latency: "Ultra-Low" }
    },
    {
      id: "gemini-pro",
      name: "Gemini Pro",
      provider: "Google",
      role: "Contender (Model B)",
      icon: <Terminal className={styles.iconBlue} size={22} />,
      badgeClass: styles.badgeBlue,
      description: "Highly optimized semantic engine built for complex contextual reasoning. Excels at modern algorithmic scale, broad performance explanations, and strict technical edge cases.",
      specs: { context: "2M+", capability: "Context & Scale", latency: "Optimized" }
    },
    {
      id: "judge-grok",
      name: "Judge Grok",
      provider: "xAI",
      role: "Supreme Arena Judge",
      icon: <Scale className={styles.iconGold} size={22} />,
      badgeClass: styles.badgeGold,
      description: "The arena's designated matrix arbitrator. Operating on cold logic parameters to grade competitor output strictly against execution parameters, formatting, and edge validation without bias.",
      specs: { context: "128k", capability: "Objective Adjudication", latency: "Real-Time" }
    }
  ];

  return (
    <section className={styles.modelsPageWrapper}>
      {/* Top Meta Panel Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Model Architecture Index</h1>
          <p className={styles.pageSubtitle}>Inspect runtime configurations and evaluation roles across active models.</p>
        </div>
        <button className={styles.closePageBtn} onClick={onClose}>
          <X size={16} /> Close Index
        </button>
      </div>

      {/* Grid Architecture Showcase */}
      <div className={styles.modelsGrid}>
        {modelsData.map((model) => (
          <div key={model.id} className={styles.modelGlassCard}>
            
            {/* Card Header row */}
            <div className={styles.cardHeader}>
              <div className={styles.profileBox}>
                <div className={styles.iconFrame}>{model.icon}</div>
                <div>
                  <h3 className={styles.modelName}>{model.name}</h3>
                  <span className={styles.providerMeta}>by {model.provider}</span>
                </div>
              </div>
              <span className={`${styles.roleBadge} ${model.badgeClass}`}>
                {model.role}
              </span>
            </div>

            <div className={styles.internalDivider} />

            {/* Core Description Text Area */}
            <div className={styles.descriptionSection}>
              <p className={styles.descriptionText}>{model.description}</p>
            </div>

            {/* Spec Matrix Blocks */}
            <div className={styles.specsSubGrid}>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Context Window</span>
                <span className={styles.specValue}>{model.specs.context}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Core Strength</span>
                <span className={styles.specValue}>{model.specs.capability}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Response Speed</span>
                <span className={styles.specValue}>{model.specs.latency}</span>
              </div>
            </div>

            {/* Status Footer Panel */}
            <div className={styles.cardFooter}>
              <div className={styles.statusRow}>
                <CheckCircle2 size={14} className={styles.successCheck} />
                <span>Runtime Node Online</span>
              </div>
              <div className={styles.secureBadge}>
                <Shield size={12} /> API Secure
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Bottom CTA Dashboard Section */}
      <div className={styles.actionBanner}>
        <div className={styles.bannerText}>
          <h3>Ready to test their logic boundaries?</h3>
          <p>Launch an orchestration prompt challenge to stream a live competitive battle matrix.</p>
        </div>
        <button className={styles.arenaLaunchBtn} onClick={onGoToArena}>
          <Cpu size={16} /> Launch Arena Challenge
        </button>
      </div>
    </section>
  );
}