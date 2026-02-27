import './MatchCard.css';

export default function MatchCard({ home, away, matchNumber, status, onStatusChange, scoreHome, scoreAway, onClick }) {
    const toggleStatus = () => {
        if (onStatusChange) {
            const nextStatus = status === 'inprogress' ? 'done' : 'inprogress';
            onStatusChange(nextStatus);
        }
    };

    const handleClick = () => {
        if (onClick) onClick();
        else if (onStatusChange) toggleStatus();
    };

    const isDone = status === 'done';
    const hasScore = isDone && scoreHome !== undefined && scoreAway !== undefined;

    return (
        <div
            className={`match-card ${isDone ? 'match-card--done' : ''} ${onClick ? 'match-card--clickable' : ''}`}
            onClick={onClick ? handleClick : undefined}
        >
            <div className="match-card__main">
                {matchNumber && (
                    <span className="match-card__number">Match {matchNumber}</span>
                )}
                <div className="match-card__teams">
                    <div className="match-card__team match-card__team--home">
                        <span className="match-card__badge match-card__badge--home">H</span>
                        <span className="match-card__name">{home}</span>
                    </div>
                    <div className="match-card__vs">
                        {hasScore ? (
                            <span className="match-card__score">{scoreHome} – {scoreAway}</span>
                        ) : (
                            <span>VS</span>
                        )}
                    </div>
                    <div className="match-card__team match-card__team--away">
                        <span className="match-card__name">{away}</span>
                        <span className="match-card__badge match-card__badge--away">A</span>
                    </div>
                </div>
            </div>

            <div className="match-card__status-panel">
                {onClick ? (
                    <span className={`status-badge status-badge--${status}`}>
                        {isDone ? '✅ Done' : '⏳ In Progress'}
                    </span>
                ) : onStatusChange ? (
                    <button
                        className={`status-badge status-badge--${status}`}
                        onClick={e => { e.stopPropagation(); toggleStatus(); }}
                        title="Click to toggle status"
                    >
                        {isDone ? '✅ Done' : '⏳ In Progress'}
                    </button>
                ) : null}
            </div>
        </div>
    );
}
