import styles from './HUD.module.css';

/**
 * Heads-Up Display overlay — title, badge chips, hemisphere labels, and bottom hint.
 * 
 * Props:
 *   hoveredSide — "left" | "right" | null
 */
export default function HUD({ hoveredSide }) {
    return (
        <div className={styles.hud} aria-hidden="true">
            {/* Top-left title */}
            <div className={styles.titleBlock}>
                <h1 className={styles.title}>
                    Portfolio&nbsp;/&nbsp;<span className={styles.titleAccent}>Dulitha K.</span>
                </h1>
            </div>

            {/* Top-right chips */}
            <div className={styles.badge}>
                <span className={styles.chip}>Three.js</span>
                <span className={styles.chip}>Interactive</span>
            </div>

            {/* ── Hemisphere Navigation Labels ── */}
            <div className={`${styles.hemisphereLabel} ${styles.leftLabel} ${hoveredSide === 'left' ? styles.active : ''}`}>
                <div className={styles.labelIcon}>💻</div>
                <div className={styles.labelText}>Programming</div>
                <div className={styles.labelSubtext}>Click to explore</div>
            </div>

            <div className={`${styles.hemisphereLabel} ${styles.rightLabel} ${hoveredSide === 'right' ? styles.active : ''}`}>
                <div className={styles.labelIcon}>📷</div>
                <div className={styles.labelText}>Photography</div>
                <div className={styles.labelSubtext}>Click to explore</div>
            </div>

            {/* Bottom centre hint */}
            <p className={styles.hint}>
                {hoveredSide
                    ? `click to open ${hoveredSide === 'left' ? 'programming' : 'photography'} portfolio`
                    : 'hover over a hemisphere · click to navigate'
                }
            </p>
        </div>
    );
}
