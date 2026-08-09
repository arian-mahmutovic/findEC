import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { getSavedCompetitions, saveCompetition, unsaveCompetition } from '../services/savedCompetitions';
import { trackEvent } from '../services/analytics';

const SavedCompetitionsContext = createContext(undefined);

export function SavedCompetitionsProvider({ children }) {
    const { user } = useAuth();
    const [savedIds, setSavedIds] = useState(new Set());
    const [savedRows, setSavedRows] = useState([]);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        if (!user) {
            setSavedRows([]);
            setSavedIds(new Set());
            setLoading(false);
            return;
        }

        setLoading(true);
        const result = await getSavedCompetitions(user.id);
        const rows = result.data || [];
        setSavedRows(rows);
        setSavedIds(new Set(rows.map((row) => row.competition_id)));
        setLoading(false);
    }, [user]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    async function toggleSave(competitionId) {
        if (!user) return;

        const isSaved = savedIds.has(competitionId);

        setSavedIds((prev) => {
            const next = new Set(prev);
            if (isSaved) {
                next.delete(competitionId);
            } else {
                next.add(competitionId);
            }
            return next;
        });

        if (isSaved) {
            await unsaveCompetition(user.id, competitionId);
        } else {
            await saveCompetition(user.id, competitionId);
            trackEvent("competition_saved", { userId: user.id, competitionId });
        }

        refresh();
    }

    const value = {
        savedIds,
        savedRows,
        loading,
        toggleSave,
        isSaved: (competitionId) => savedIds.has(competitionId),
        refresh
    };

    return (
        <SavedCompetitionsContext.Provider value={value}>
            {children}
        </SavedCompetitionsContext.Provider>
    );
}

export function useSavedCompetitions() {
    const context = useContext(SavedCompetitionsContext);

    if (context === undefined) {
        throw new Error('useSavedCompetitions must be used within a SavedCompetitionsProvider');
    }

    return context;
}
