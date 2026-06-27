import React, { useState } from "react";
import { Zap, Menu, X } from "lucide-react";
import styles from "../styles/Navbar.module.css";

const Navbar = ({ onNewBattle }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className={styles.navWrapper} aria-label="Main Navigation">
      <div className={styles.navContainer}>
        
        {/* LEFT: Branding */}
        <div className={styles.brandSection}>
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
          {["Battles", "Leaderboard", "Models", "Community"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className={styles.navLinkItem}>
              {item}
            </a>
          ))}
          {/* Mobile Only Action */}
          <button onClick={() => { onNewBattle(); setIsOpen(false); }} className={styles.mobileActionButton}>
            Start Battle
          </button>
        </div>

        {/* RIGHT: System Status & Primary CTAs */}
        <div className={styles.actionSection}>
          <div className={styles.statusBadge}>
            <span className={styles.statusDot} />
            <span className={styles.statusText}>LIVE</span>
          </div>

          {/* <a 
            href="https://github.com" 
            target="_blank" 
            rel="noreferrer" 
            className={styles.iconButton} 
            aria-label="View Github Repository"
          >
            <Github size={18} />
          </a> */}

          <button onClick={onNewBattle} className={styles.primaryButton}>
            Start Battle
          </button>

          {/* Hamburger Menu Toggle */}
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