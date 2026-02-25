import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './PhotographyPortfolio.module.css';

const gallery = [
    { id: 1, title: 'Urban Dusk', category: 'Street', color: '#ff6ef7' },
    { id: 2, title: 'Morning Light', category: 'Nature', color: '#ffb86e' },
    { id: 3, title: 'Silent Moments', category: 'Portrait', color: '#ff6e8a' },
    { id: 4, title: 'City Rhythm', category: 'Street', color: '#c86eff' },
    { id: 5, title: 'Golden Hour', category: 'Landscape', color: '#ffb86e' },
    { id: 6, title: 'Inner World', category: 'Portrait', color: '#ff6ef7' },
    { id: 7, title: 'Reflections', category: 'Abstract', color: '#6eb4ff' },
    { id: 8, title: 'Timeless', category: 'Nature', color: '#7fff6e' },
    { id: 9, title: 'Shadows & Light', category: 'Street', color: '#ff6e8a' },
];

const categories = ['All', 'Street', 'Nature', 'Portrait', 'Landscape', 'Abstract'];

export default function PhotographyPortfolio() {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        requestAnimationFrame(() => setVisible(true));
    }, []);

    const filtered = activeCategory === 'All'
        ? gallery
        : gallery.filter(p => p.category === activeCategory);

    return (
        <div className={`${styles.page} ${visible ? styles.visible : ''}`}>
            {/* Ambient background */}
            <div className={styles.bgAmbient} />

            {/* Back button */}
            <button className={styles.backBtn} onClick={() => navigate('/')}>
                <span className={styles.backArrow}>←</span>
                <span>Back to Brain</span>
            </button>

            {/* Hero section */}
            <header className={styles.hero}>
                <div className={styles.heroGlow} />
                <p className={styles.heroLabel}>RIGHT HEMISPHERE</p>
                <h1 className={styles.heroTitle}>
                    <span className={styles.titleLine}>Visual</span>
                    <span className={styles.titleAccent}>Artistry</span>
                </h1>
                <p className={styles.heroSubtitle}>
                    Capturing moments, emotions, and stories through the lens. Every frame tells a unique narrative.
                </p>
            </header>

            {/* Category Filter */}
            <section className={styles.filterSection}>
                <div className={styles.filterBar}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterActive : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </section>

            {/* Gallery Grid */}
            <section className={styles.gallerySection}>
                <div className={styles.galleryGrid}>
                    {filtered.map((photo, i) => (
                        <div
                            key={photo.id}
                            className={styles.galleryItem}
                            style={{
                                animationDelay: `${0.1 + i * 0.08}s`,
                                '--item-color': photo.color,
                            }}
                        >
                            {/* Placeholder image — replace with your actual photos */}
                            <div className={styles.photoPlaceholder}>
                                <div className={styles.placeholderIcon}>📷</div>
                                <span className={styles.placeholderText}>Add Photo</span>
                            </div>
                            <div className={styles.photoOverlay}>
                                <span className={styles.photoCat}>{photo.category}</span>
                                <h3 className={styles.photoTitle}>{photo.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* About section */}
            <section className={styles.aboutSection}>
                <div className={styles.aboutContent}>
                    <h2 className={styles.sectionTitle}>
                        <span className={styles.sectionDot} />
                        About My Photography
                    </h2>
                    <p className={styles.aboutText}>
                        Photography is my way of seeing the world differently. I specialize in street photography,
                        portraiture, and capturing natural landscapes. Every image is a story frozen in time,
                        waiting to be told.
                    </p>
                    <div className={styles.aboutStats}>
                        <div className={styles.stat}>
                            <span className={styles.statNum}>500+</span>
                            <span className={styles.statLabel}>Photos Taken</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statNum}>50+</span>
                            <span className={styles.statLabel}>Projects</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statNum}>3+</span>
                            <span className={styles.statLabel}>Years Experience</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className={styles.ctaSection}>
                <h2 className={styles.ctaTitle}>Let's Create Together</h2>
                <p className={styles.ctaDesc}>Available for photography sessions, events, and creative collaborations</p>
                <a href="mailto:dulitha@example.com" className={styles.ctaButton}>
                    Get In Touch
                </a>
            </section>

            <footer className={styles.footer}>
                <p>© 2026 Dulitha K. — All Rights Reserved</p>
            </footer>
        </div>
    );
}
