import React, { useState } from "react";
import { Zap, Menu, X } from "lucide-react";
import styles from "../styles/Navbar.module.css";

const Navbar = ({ onNewBattle, onShowBattles, onShowModels, onShowLeaderboard, onShowArena, currentView }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className={styles.navWrapper} aria-label="Main Navigation">
      <div className={styles.navContainer}>
        
        {/* LEFT: Branding Section */}
        <div 
          className={styles.brandSection} 
          onClick={onShowArena} 
          style={{ cursor: "pointer" }}
        >
          <div className={styles.logoIcon} aria-hidden="true">
            <Zap size={18} className={styles.zapIcon} />
          </div>
          <div className={styles.brandText}>
            <h3 className={styles.title}>AI Battle Arena</h3>
            <p className={styles.subtitle}>Two AIs. One Judge.</p>
          </div>
        </div>

        {/* CENTER: Navigation Links */}
        <div className={`${styles.navLinks} ${isOpen ? styles.navLinksOpen : ""}`}>
          
          {/* Explicit Arena Link */}
          <button 
            onClick={() => { onShowArena(); setIsOpen(false); }} 
            className={`${styles.navLinkItem} ${currentView === "arena" ? styles.activeLink : ""}`}
            style={{ background: "none", border: "none", textAlign: "left", cursor: "pointer" }}
          >
            Arena
          </button>

          {/* Core Menu Layout Map */}
          {["Battles", "Leaderboard", "Models"].map((item) => {
            const isBattles = item === "Battles";
            const isLeaderboard = item === "Leaderboard";
            const isModels = item === "Models";
            
            // Check dynamic view states to assign highlight anchors
            const isActive = 
              (isBattles && currentView === "history_page") || 
              (isLeaderboard && currentView === "leaderboard_page") ||
              (isModels && currentView === "models_page");

            return (
              <button 
                key={item} 
                onClick={() => {
                  if (isBattles) onShowBattles();
                  else if (isLeaderboard) onShowLeaderboard();
                  else if (isModels) onShowModels();
                  setIsOpen(false);
                }} 
                className={`${styles.navLinkItem} ${isActive ? styles.activeLink : ""}`}
                style={{ background: "none", border: "none", textAlign: "left", cursor: "pointer" }}
                disabled={!isBattles && !isLeaderboard && !isModels} // Community remains placeholder
              >
                {item}
              </button>
            );
          })}

          {/* Mobile Overlay Action Trigger */}
          <button 
            onClick={() => { onNewBattle(); setIsOpen(false); }} 
            className={styles.mobileActionButton}
          >
            Start Battle
          </button>
        </div>

        {/* RIGHT: Status Indicator & Action CTA */}
        <div className={styles.actionSection}>
          <div className={styles.statusBadge}>
            <span className={styles.statusDot} />
            <span className={styles.statusText}>LIVE</span>
          </div>

          <button onClick={onNewBattle} className={styles.primaryButton}>
            Start Battle
          </button>

          {/* Responsive Hamburger Toggle Menu */}
          <button 
            className={styles.hamburgerButton} 
            onClick={toggleMenu} 
            aria-expanded={isOpen} 
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;