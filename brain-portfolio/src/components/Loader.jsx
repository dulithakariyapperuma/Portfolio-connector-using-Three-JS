import styles from './Loader.module.css';

/**
 * Full-screen loading screen shown while Three.js initialises.
 * Fades out via CSS transition when `hidden` prop is true.
 */
export default function Loader({ hidden }) {
    return (
        <div className={`${styles.loader} ${hidden ? styles.hidden : ''}`} role="status" aria-label="Loading">
            <div className={styles.ring} />
            <p className={styles.text}>Initialising brain…</p>
        </div>
    );
}
