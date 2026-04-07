import React, { useState, useEffect, useRef } from "react";

function ScoreRing({ score, color }) {
  const [animated, setAnimated] = useState(false);
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 10);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 450);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ position: "relative", width: "68px", height: "68px" }}>
        <svg
          width="68"
          height="68"
          viewBox="0 0 68 68"
          style={{ transform: "rotate(-90deg)", display: "block" }}
        >
          {/* Track */}
          <circle
            cx="34" cy="34" r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="5"
          />
          {/* Animated fill */}
          <circle
            cx="34" cy="34" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={animated ? offset : circumference}
            style={{
              transition: "stroke-dashoffset 1.1s cubic-bezier(0.4, 0, 0.2, 1)",
              filter: `drop-shadow(0 0 4px ${color})`,
            }}
          />
        </svg>
        {/* Score label */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 0,
          }}
        >
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "1.25rem",
              color,
              lineHeight: 1,
            }}
          >
            {score}
          </span>
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "0.55rem",
              color: "#76747b",
              lineHeight: 1,
              marginTop: "1px",
            }}
          >
            /10
          </span>
        </div>
      </div>
    </div>
  );
}

function ReasoningCard({ solutionKey, modelName, icon, score, reasoning, accentColor, borderTop, isWinner }) {
  const rgb = accentColor === "#b0a2ff" ? "117,86,255" : "0,210,253";

  return (
    <div
      style={{
        background: "rgba(25, 25, 31, 0.75)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderTop,
        borderRadius: "16px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "0",
      }}
    >
      {/* Top row: model info + score ring */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        {/* Left: icon + name */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1rem",
              flexShrink: 0,
              background: `rgba(${rgb}, 0.12)`,
              border: `1px solid rgba(${rgb}, 0.2)`,
            }}
          >
            {icon}
          </div>
          <div>
            <p
              style={{
                fontSize: "0.58rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#76747b",
                fontFamily: "'Space Grotesk', sans-serif",
                marginBottom: "1px",
              }}
            >
              {solutionKey}
            </p>
            <h3
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "0.95rem",
                color: accentColor,
                lineHeight: 1.2,
              }}
            >
              {modelName}
            </h3>
          </div>
        </div>

        {/* Right: score ring */}
        <ScoreRing score={score} color={accentColor} />
      </div>

      {/* Winner badge row */}
      {isWinner && (
        <div style={{ marginBottom: "12px" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              background: "rgba(255,215,9,0.12)",
              border: "1px solid rgba(255,231,146,0.25)",
              color: "#ffe792",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "0.62rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              padding: "3px 10px",
              borderRadius: "999px",
            }}
          >
            🏆 Winner
          </span>
        </div>
      )}

      {/* Divider */}
      <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", marginBottom: "14px" }} />

      {/* Analysis label */}
      <p
        style={{
          fontSize: "0.58rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "#76747b",
          fontFamily: "'Space Grotesk', sans-serif",
          marginBottom: "8px",
        }}
      >
        Judge's Analysis
      </p>

      {/* Reasoning */}
      <p
        style={{
          color: "#c8c6d8",
          fontFamily: "'Manrope', sans-serif",
          fontSize: "0.875rem",
          lineHeight: 1.8,
          margin: 0,
        }}
      >
        {reasoning}
      </p>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div
      style={{
        background: "rgba(25,25,31,0.75)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderTop: "2px solid rgba(255,255,255,0.1)",
        borderRadius: "16px",
        padding: "20px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="skeleton" style={{ width: "36px", height: "36px", borderRadius: "10px" }} />
          <div>
            <div className="skeleton" style={{ width: "60px", height: "10px", marginBottom: "5px" }} />
            <div className="skeleton" style={{ width: "80px", height: "16px" }} />
          </div>
        </div>
        <div className="skeleton" style={{ width: "68px", height: "68px", borderRadius: "50%" }} />
      </div>
      <div className="skeleton" style={{ height: "1px", marginBottom: "14px" }} />
      <div className="skeleton" style={{ width: "90px", height: "10px", marginBottom: "8px" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
        <div className="skeleton" style={{ height: "13px", width: "100%" }} />
        <div className="skeleton" style={{ height: "13px", width: "92%" }} />
        <div className="skeleton" style={{ height: "13px", width: "96%" }} />
        <div className="skeleton" style={{ height: "13px", width: "78%" }} />
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
    <div
      className="verdict-card animate-slide-in-up"
      id="judge-verdict-card"
      style={{ padding: "24px 28px", animationDelay: "200ms" }}
    >
      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem",
            flexShrink: 0,
            background: "rgba(255,215,9,0.15)",
            border: "1px solid rgba(255,231,146,0.3)",
            boxShadow: "0 0 18px rgba(255,215,9,0.18)",
          }}
        >
          👨‍⚖️
        </div>
        <div>
          <p
            style={{
              fontSize: "0.58rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#76747b",
              fontFamily: "'Space Grotesk', sans-serif",
              marginBottom: "1px",
            }}
          >
            AI Evaluation
          </p>
          <h2
            className="text-gradient-gold"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "1.2rem",
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            Judge's Verdict
          </h2>
        </div>
      </div>

      {/* Gold divider */}
      <div style={{ height: "1px", background: "rgba(255,231,146,0.08)", marginBottom: "20px" }} />

      {/* ── Two cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "16px",
        }}
      >
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
              icon="🤖"
              score={score1}
              reasoning={verdict?.solution_1_reasoning ?? "No reasoning provided."}
              accentColor="#b0a2ff"
              borderTop="2px solid rgba(117, 86, 255, 0.55)"
              isWinner={isWinner1}
            />
            <ReasoningCard
              solutionKey="Solution 2"
              modelName="Gemini Pro"
              icon="🧠"
              score={score2}
              reasoning={verdict?.solution_2_reasoning ?? "No reasoning provided."}
              accentColor="#00d2fd"
              borderTop="2px solid rgba(0, 210, 253, 0.55)"
              isWinner={isWinner2}
            />
          </>
        )}
      </div>
    </div>
  );
}
