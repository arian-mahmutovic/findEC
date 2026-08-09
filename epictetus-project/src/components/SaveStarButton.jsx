import { useAuth } from '../context/AuthContext';
import { useSavedCompetitions } from '../context/SavedCompetitionsContext';
import './SaveStarButton.css';

export default function SaveStarButton({ competitionId, className = '', variant = 'icon' }) {
    const { user } = useAuth();
    const { isSaved, toggleSave } = useSavedCompetitions();

    if (!user) return null;

    const saved = isSaved(competitionId);
    const isLabel = variant === 'label';

    return (
        <button
            type="button"
            className={`save-star-button ${isLabel ? 'save-star-label' : ''} ${saved ? 'is-saved' : ''} ${className}`.trim()}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleSave(competitionId);
            }}
            aria-label={saved ? 'Remove from saved competitions' : 'Save competition'}
            aria-pressed={saved}
        >
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2Z" />
            </svg>
            {isLabel && (saved ? 'Saved' : 'Save')}
        </button>
    );
}
