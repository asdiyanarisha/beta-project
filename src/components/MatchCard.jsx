import './MatchCard.css';

export default function MatchCard({ home, away, matchNumber, roundLabel }) {
    return (
        <div className="match-card">
            {matchNumber && (
                <span className="match-card__number">Match {matchNumber}</span>
            )}
            <div className="match-card__teams">
                <div className="match-card__team match-card__team--home">
                    <span className="match-card__badge match-card__badge--home">H</span>
                    <span className="match-card__name">{home}</span>
                </div>
                <div className="match-card__vs">
                    <span>VS</span>
                </div>
                <div className="match-card__team match-card__team--away">
                    <span className="match-card__name">{away}</span>
                    <span className="match-card__badge match-card__badge--away">A</span>
                </div>
            </div>
        </div>
    );
}
