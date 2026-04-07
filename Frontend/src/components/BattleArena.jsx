import React from "react";
import ReactMarkdown from "react-markdown";

const MODEL_CONFIG = {
  a: {
    label: "Model A",
    name: "GPT-4o",
    icon: "🤖",
    chipClass: "chip-primary",
    accentColor: "#b0a2ff",
    borderTop: "2px solid rgba(117, 86, 255, 0.6)",
    iconBg: "rgba(117,86,255,0.15)",
    iconBorder: "rgba(176,162,255,0.25)",
  },
  b: {
    label: "Model B",
    name: "Gemini Pro",
    icon: "🧠",
    chipClass: "chip-secondary",
    accentColor: "#00d2fd",
    borderTop: "2px solid rgba(0, 210, 253, 0.6)",
    iconBg: "rgba(0,210,253,0.12)",
    iconBorder: "rgba(0,210,253,0.25)",
  },
};

function SkeletonLoader() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "8px 0" }}>
      {[100, 83, 100, 75, 100, 90].map((w, i) => (
        <div key={i} className="skeleton" style={{ height: "14px", width: `${w}%` }} />
      ))}
    </div>
  );
}

function ModelCard({ modelKey, response, isLoading }) {
  const cfg = MODEL_CONFIG[modelKey];

  return (
    <div
      className="glass-card animate-fade-in"
      id={`model-${modelKey}-card`}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderTop: cfg.borderTop,
        animationDelay: modelKey === "a" ? "0ms" : "100ms",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px 20px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
              flexShrink: 0,
              background: cfg.iconBg,
              border: `1px solid ${cfg.iconBorder}`,
            }}
          >
            {cfg.icon}
          </div>
          <div>
            <p
              style={{
                fontSize: "0.62rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#acaab1",
                fontFamily: "'Space Grotesk', sans-serif",
                marginBottom: "2px",
              }}
            >
              {cfg.label}
            </p>
            <h3
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "1rem",
                fontWeight: 700,
                lineHeight: 1.2,
                color: cfg.accentColor,
              }}
            >
              {cfg.name}
            </h3>
          </div>
        </div>

        <span className={`chip ${cfg.chipClass}`} style={{ fontSize: "0.62rem" }}>
          {isLoading ? (
            <>
              <span
                className="animate-pulse-glow"
                style={{ width: "5px", height: "5px", borderRadius: "50%", background: "currentColor", display: "inline-block" }}
              />
              Thinking…
            </>
          ) : response ? (
            <>
              <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
              Ready
            </>
          ) : (
            "Standby"
          )}
        </span>
      </div>

      {/* Divider */}
      <div style={{ margin: "0 20px 16px", height: "1px", background: "rgba(255,255,255,0.05)" }} />

      {/* Response Body */}
      <div style={{ padding: "0 20px 20px", flex: 1, overflowY: "auto" }}>
        {isLoading ? (
          <SkeletonLoader />
        ) : response ? (
          <div
            className="prose-arena"
            style={{
              color: "#d0cee8",
              fontFamily: "'Manrope', sans-serif",
              fontSize: "0.88rem",
              lineHeight: 1.7,
            }}
          >
            <ReactMarkdown>{response}</ReactMarkdown>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "32px 0",
              textAlign: "center",
              gap: "12px",
            }}
          >
            <div style={{ fontSize: "2.5rem", opacity: 0.2, filter: "grayscale(100%)" }}>
              {cfg.icon}
            </div>
            <p style={{ fontSize: "0.85rem", color: "#acaab1" }}>
              Waiting for the battle to start…
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BattleArena({ responses, isLoading }) {
  return (
    <div className="animate-slide-in-up" style={{ width: "100%" }}>
      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
          position: "relative",
        }}
      >
        <ModelCard modelKey="a" response={responses?.modelA} isLoading={isLoading} />

        {/* VS Badge - floating between cards on wider screens */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
          }}
          className="vs-badge-desktop"
        >
          <div
            className="vs-badge"
            style={{ width: "44px", height: "44px", fontSize: "0.8rem" }}
          >
            VS
          </div>
        </div>

        <ModelCard modelKey="b" response={responses?.modelB} isLoading={isLoading} />
      </div>
    </div>
  );
}
