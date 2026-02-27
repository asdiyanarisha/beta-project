import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import './LandingPage.css';

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            <nav className="landing-nav animate-fade-in">
                <div className="landing-nav__logo">📊 MatchDraw</div>
                <Button variant="ghost" onClick={() => navigate('/matches')}>Dashboard</Button>
            </nav>

            <header className="landing-hero stagger-children">
                <div className="hero-content">
                    <span className="hero-badge">Pro Tournament Tools</span>
                    <h1>Generate Perfect <span className="gradient-text">Match Fixtures</span> in Seconds</h1>
                    <p className="hero-desc">
                        The most intuitive way to draw league schedules and cup tournaments.
                        Professional results, premium aesthetics, completely free.
                    </p>
                    <div className="hero-actions">
                        <Button variant="primary" size="lg" onClick={() => navigate('/create')}>
                            🚀 Get Started - It's Free
                        </Button>
                        <Button variant="secondary" size="lg" onClick={() => navigate('/matches')}>
                            📋 View Dashboard
                        </Button>
                    </div>
                </div>

                <div className="hero-preview animate-float">
                    <Card className="preview-card" variant="highlight">
                        <div className="preview-header">
                            <div className="dot red"></div>
                            <div className="dot yellow"></div>
                            <div className="dot green"></div>
                        </div>
                        <div className="preview-body">
                            <div className="preview-match row-stagger">
                                <div className="p-team">Champions</div>
                                <div className="p-vs">VS</div>
                                <div className="p-team">All-Stars</div>
                                <div className="p-status">DONE</div>
                            </div>
                            <div className="preview-match row-stagger">
                                <div className="p-team">City Royals</div>
                                <div className="p-vs">VS</div>
                                <div className="p-team">United FC</div>
                                <div className="p-status p-status--live">LIVE</div>
                            </div>
                            <div className="preview-match row-stagger">
                                <div className="p-team">Dragons</div>
                                <div className="p-vs">VS</div>
                                <div className="p-team">Shadows</div>
                                <div className="p-status p-status--prog">09:00</div>
                            </div>
                        </div>
                    </Card>
                </div>
            </header>

            <section className="landing-features stagger-children">
                <div className="feature-item">
                    <div className="feature-icon">🔄</div>
                    <h3>League Mode</h3>
                    <p>Round-robin generator with support for double rounds.</p>
                </div>
                <div className="feature-item">
                    <div className="feature-icon">🎯</div>
                    <h3>Cup Mode</h3>
                    <p>Group stages with automatic knockout bracket generation.</p>
                </div>
                <div className="feature-item">
                    <div className="feature-icon">💾</div>
                    <h3>Persistent</h3>
                    <p>Your tournaments are saved automatically to your browser.</p>
                </div>
            </section>

            <footer className="landing-footer animate-fade-in">
                <p>© 2026 MatchDraw. Crafted for winners.</p>
            </footer>
        </div>
    );
}
