import React from "react";

export default function Navbar({ onNewBattle }) {
  return (
    <nav
      className="glass"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.1rem",
              background: "linear-gradient(135deg, #7556ff, #00d2fd)",
              boxShadow: "0 0 16px rgba(117,86,255,0.5)",
              flexShrink: 0,
            }}
          >
            ⚔️
          </div>
          <div>
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "0.95rem",
                letterSpacing: "-0.01em",
                background: "linear-gradient(135deg, #b0a2ff 0%, #00d2fd 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                display: "block",
              }}
            >
              AI Battle Arena
            </span>
            <p
              style={{
                fontSize: "0.65rem",
                lineHeight: 1,
                marginTop: "2px",
                color: "#acaab1",
                fontFamily: "'Manrope', sans-serif",
              }}
            >
              Two AIs. One Judge.
            </p>
          </div>
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span className="chip chip-primary" style={{ gap: "6px" }}>
            <span
              className="animate-pulse-glow"
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "currentColor",
                display: "inline-block",
              }}
            />
            Live
          </span>
          <button
            onClick={onNewBattle}
            className="btn-ghost"
            id="new-battle-btn"
            style={{ padding: "8px 16px", fontSize: "0.85rem" }}
          >
            + New Battle
          </button>
        </div>
      </div>
    </nav>
  );
}
