import React, { useRef, useEffect, useState } from "react";
import { Swords, Loader2 } from "lucide-react";
import styles from "../styles/InputArena.module.css";

export default function InputArena({ onSubmit, isLoading }) {
  const textareaRef = useRef(null);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 220) + "px";
  }, [charCount]);

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

  const handleTextareaChange = (e) => {
    setCharCount(e.target.value.length);
  };

  return (
    <div className={styles.arenaWrapper}>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.inputGlassCard}>
          
          {/* Main Input Workspace */}
          <div className={styles.textareaContainer}>
            <label htmlFor="arena-prompt" className={styles.inputLabel}>
              Prompt Arena Challenge
            </label>
            <textarea
              ref={textareaRef}
              id="arena-prompt"
              className={styles.premiumTextarea}
              placeholder="Ask a complex question, compare coding styles, or generate an essay..."
              rows={4}
              onKeyDown={handleKeyDown}
              onChange={handleTextareaChange}
              disabled={isLoading}
            />
          </div>

          {/* Contextual Action Utility Bar */}
          <div className={styles.actionToolbar}>
            <div className={styles.metaInformation}>
              <span className={styles.shortcutHint}>
                <kbd className={styles.kbdKey}>⌘</kbd> + <kbd className={styles.kbdKey}>Enter</kbd> to submit
              </span>
              <span className={styles.divider}>•</span>
              <span className={styles.counter}>{charCount} characters</span>
            </div>

            <button
              type="submit"
              disabled={isLoading || charCount === 0}
              className={styles.submitButton}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className={styles.spinner} />
                  <span>Generating Battles...</span>
                </>
              ) : (
                <>
                  <Swords size={16} className={styles.swordsIcon} />
                  <span>Start Battle</span>
                </>
              )}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}