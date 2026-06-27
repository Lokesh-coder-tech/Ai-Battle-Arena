import React, { useState, useEffect } from "react";
import { Gavel, Trophy, Sparkles, Terminal, ShieldAlert } from "lucide-react";
import styles from "../styles/JudgeVerdict.module.css";

function ScoreRing({ score, colorClass }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 10);

  return (
    <div className={styles.ringFrame}>
      <div className={styles.svgWrapper}>
        <svg width="64" height="64" viewBox="0 0 68 68" className={styles.rotatingSvg}>
          <circle
            cx="34"
            cy="34"
            r={radius}
            fill="none"
            className={styles.trackCircle}
            strokeWidth="4"
          />
          <circle
            cx="34"
            cy="34"
            r={radius}
            fill="none"
            className={`${styles.fillCircle} ${colorClass}`}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className={styles.valueOverlay}>
          <span className={`${styles.scoreText} ${colorClass}`}>{score}</span>
          <span className={styles.totalBase}>/10</span>
        </div>
      </div>
    </div>
  );
}

function ReasoningCard({ solutionKey, modelName, icon, score, reasoning, colorClass, isWinner }) {
  return (
    <div className={`${styles.reasoningCard} ${isWinner ? styles.winnerHighlight : ""}`}>
      {isWinner && (
        <div className={styles.winnerRibbon}>
          <Trophy size={12} className={styles.ribbonIcon} />
          <span>Winner Selected</span>
        </div>
      )}

      <div className={styles.cardHeader}>
        <div className={styles.profileBox}>
          <div className={`${styles.iconContainer} ${colorClass}`}>{icon}</div>
          <div>
            <span className={styles.solutionMeta}>{solutionKey}</span>
            <h4 className={styles.modelMetaName}>{modelName}</h4>
          </div>
        </div>
        <ScoreRing score={score} colorClass={colorClass} />
      </div>

      <div className={styles.internalDivider} />

      <div className={styles.analysisPane}>
        <span className={styles.paneLabel}>Analytical Assessment</span>
        <p className={styles.paneText}>{reasoning}</p>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonHeader}>
        <div className={styles.skeletonProfile}>
          <div className={styles.skeletonBlockIcon} />
          <div>
            <div className={styles.skeletonLineShort} />
            <div className={styles.skeletonLineMedium} />
          </div>
        </div>
        <div className={styles.skeletonCircleRing} />
      </div>
      <div className={styles.internalDivider} />
      <div className={styles.skeletonParagraph}>
        <div className={styles.skeletonLineFull} />
        <div className={styles.skeletonLineFull} />
        <div className={styles.skeletonLineMedium} />
      </div>
    </div>
  );
}

export default function JudgeVerdict({ verdict, isLoading }) {
  if (!verdict && !isLoading) return null;

  const score1 = verdict?.solution_1_score ?? 0;
  const score2 = verdict?.solution_2_score ?? 0;
  const isWinner1 = score1 >= score2;
  const isWinner2 = score2 > score1;

  return (
    <div className={styles.verdictSectionWrapper}>
      {/* Structural Label Panel */}
      <div className={styles.sectionHeader}>
        <div className={styles.headerIconBox}>
          <Gavel size={18} className={styles.gavelIcon} />
        </div>
        <div>
          <span className={styles.sectionSub}>Orchestrator Evaluation Matrix</span>
          <h2 className={styles.sectionTitle}>Judge's Verdict</h2>
        </div>
      </div>

      {/* Main Analysis Architecture Grid */}
      <div className={styles.cardsGrid}>
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <ReasoningCard
              solutionKey="Solution 1"
              modelName="GPT-4o"
              icon={<Sparkles size={14} />}
              score={score1}
              reasoning={verdict?.solution_1_reasoning ?? "No analytics compiled."}
              colorClass={styles.purpleAccent}
              isWinner={isWinner1}
            />
            <ReasoningCard
              solutionKey="Solution 2"
              modelName="Gemini Pro"
              icon={<Terminal size={14} />}
              score={score2}
              reasoning={verdict?.solution_2_reasoning ?? "No analytics compiled."}
              colorClass={styles.blueAccent}
              isWinner={isWinner2}
            />
          </>
        )}
      </div>
    </div>
  );
}