import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './ProgrammingPortfolio.module.css';

const projects = [
    {
        title: 'Project One',
        description: 'A full-stack web application built with React and Node.js',
        tags: ['React', 'Node.js', 'MongoDB'],
        color: '#56cfff',
    },
    {
        title: 'Project Two',
        description: 'Mobile app development with cross-platform support',
        tags: ['React Native', 'Firebase', 'TypeScript'],
        color: '#7fff6e',
    },
    {
        title: 'Project Three',
        description: 'Cloud infrastructure and DevOps automation pipeline',
        tags: ['AWS', 'Docker', 'Kubernetes'],
        color: '#ff6ef7',
    },
    {
        title: 'Project Four',
        description: 'Machine learning model for predictive analytics',
        tags: ['Python', 'TensorFlow', 'Data Science'],
        color: '#ffb86e',
    },
    {
        title: 'Project Five',
        description: 'Real-time collaboration tool with WebSocket integration',
        tags: ['WebSocket', 'Redis', 'Vue.js'],
        color: '#6eb4ff',
    },
    {
        title: 'Project Six',
        description: 'API gateway and microservices architecture design',
        tags: ['Go', 'gRPC', 'PostgreSQL'],
        color: '#c86eff',
    },
];

const skills = [
    { name: 'JavaScript / TypeScript', level: 95 },
    { name: 'React / Next.js', level: 90 },
    { name: 'Node.js / Express', level: 88 },
    { name: 'Python', level: 82 },
    { name: 'AWS / Cloud', level: 78 },
    { name: 'SQL / NoSQL', level: 85 },
    { name: 'Docker / DevOps', level: 75 },
    { name: 'Three.js / WebGL', level: 70 },
];

export default function ProgrammingPortfolio() {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => setVisible(true));
    }, []);

    return (
        <div className={`${styles.page} ${visible ? styles.visible : ''}`}>
            {/* Animated background particles */}
            <div className={styles.bgGrid} />

            {/* Back button */}
            <button className={styles.backBtn} onClick={() => navigate('/')}>
                <span className={styles.backArrow}>←</span>
                <span>Back to Brain</span>
            </button>

            {/* Hero section */}
            <header className={styles.hero}>
                <div className={styles.heroGlow} />
                <p className={styles.heroLabel}>LEFT HEMISPHERE</p>
                <h1 className={styles.heroTitle}>
                    <span className={styles.titleLine}>Software</span>
                    <span className={styles.titleAccent}>Engineering</span>
                </h1>
                <p className={styles.heroSubtitle}>
                    Building digital experiences with clean code, modern architectures, and creative problem-solving.
                </p>
            </header>

            {/* Skills section */}
            <section className={styles.skillsSection}>
                <h2 className={styles.sectionTitle}>
                    <span className={styles.sectionDot} />
                    Technical Skills
                </h2>
                <div className={styles.skillsGrid}>
                    {skills.map((skill, i) => (
                        <div
                            key={skill.name}
                            className={styles.skillItem}
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            <div className={styles.skillHeader}>
                                <span className={styles.skillName}>{skill.name}</span>
                                <span className={styles.skillPercent}>{skill.level}%</span>
                            </div>
                            <div className={styles.skillBar}>
                                <div
                                    className={styles.skillFill}
                                    style={{
                                        width: visible ? `${skill.level}%` : '0%',
                                        transitionDelay: `${0.5 + i * 0.1}s`
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Projects section */}
            <section className={styles.projectsSection}>
                <h2 className={styles.sectionTitle}>
                    <span className={styles.sectionDot} />
                    Featured Projects
                </h2>
                <div className={styles.projectsGrid}>
                    {projects.map((project, i) => (
                        <div
                            key={project.title}
                            className={styles.projectCard}
                            style={{
                                animationDelay: `${0.3 + i * 0.12}s`,
                                '--card-color': project.color
                            }}
                        >
                            <div className={styles.cardGlow} />
                            <div className={styles.cardNumber}>0{i + 1}</div>
                            <h3 className={styles.cardTitle}>{project.title}</h3>
                            <p className={styles.cardDesc}>{project.description}</p>
                            <div className={styles.cardTags}>
                                {project.tags.map(tag => (
                                    <span key={tag} className={styles.tag}>{tag}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact CTA */}
            <section className={styles.ctaSection}>
                <h2 className={styles.ctaTitle}>Let's Build Something Amazing</h2>
                <p className={styles.ctaDesc}>Open for freelance projects and full-time roles</p>
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
