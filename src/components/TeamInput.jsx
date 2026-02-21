import './TeamInput.css';

export default function TeamInput({ index, name, onChange }) {
    return (
        <div className="team-input">
            <span className="team-input__number">{index + 1}</span>
            <input
                type="text"
                className="team-input__field"
                value={name}
                onChange={(e) => onChange(index, e.target.value)}
                placeholder={`Team ${index + 1}`}
                maxLength={30}
            />
        </div>
    );
}
