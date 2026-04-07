import React, { useRef, useEffect } from "react";

export default function InputArena({ onSubmit, isLoading }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 220) + "px";
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = textareaRef.current?.value?.trim();
    if (!val || isLoading) return;
    onSubmit(val);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e);
    }
  };

  return (
    <div className="animate-slide-in-up">
      <form onSubmit={handleSubmit}>
        <div
          className="glass-card"
          style={{
            padding: "4px",
            borderColor: "rgba(117,86,255,0.18)",
            borderRadius: "18px",
          }}
        >
          {/* Inner area */}
          <div
            style={{
              borderRadius: "14px",
              padding: "20px 24px 16px",
              background: "rgba(117,86,255,0.04)",
            }}
          >
            <label
              htmlFor="arena-prompt"
              style={{
                display: "block",
                fontSize: "0.65rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "#acaab1",
                fontFamily: "'Space Grotesk', sans-serif",
                marginBottom: "12px",
              }}
            >
              Your Challenge
            </label>
            <textarea
              ref={textareaRef}
              id="arena-prompt"
              className="arena-textarea"
              placeholder="Enter your question, problem, or coding challenge…"
              rows={4}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              style={{ minHeight: "100px", maxHeight: "220px" }}
            />
          </div>

          {/* Bottom bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 20px 16px",
              gap: "16px",
            }}
          >
            <p
              style={{
                fontSize: "0.75rem",
                color: "#acaab1",
                fontFamily: "'Manrope', sans-serif",
              }}
            >
              <kbd
                style={{
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "0.65rem",
                  background: "rgba(255,255,255,0.08)",
                  color: "#acaab1",
                  border: "1px solid rgba(255,255,255,0.1)",
                  fontFamily: "inherit",
                }}
              >
                Ctrl
              </kbd>{" "}
              +{" "}
              <kbd
                style={{
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "0.65rem",
                  background: "rgba(255,255,255,0.08)",
                  color: "#acaab1",
                  border: "1px solid rgba(255,255,255,0.1)",
                  fontFamily: "inherit",
                }}
              >
                Enter
              </kbd>{" "}
              to submit
            </p>
            <button
              type="submit"
              disabled={isLoading}
              id="start-battle-btn"
              className="btn-plasma"
              style={{
                padding: "12px 24px",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {isLoading ? (
                <>
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      border: "2px solid rgba(0,0,0,0.3)",
                      borderTopColor: "#000",
                      animation: "spin-slow 0.8s linear infinite",
                    }}
                  />
                  Battling…
                </>
              ) : (
                <>⚔️ Start Battle</>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
