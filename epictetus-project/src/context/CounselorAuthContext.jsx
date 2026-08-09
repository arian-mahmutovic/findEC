import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { getCounselorProfile } from '../services/counselors';

const CounselorAuthContext = createContext(undefined);

function resolveCounselorId(session) {
    return session?.user?.user_metadata?.role === 'counselor' ? session.user.id : null;
}

export function CounselorAuthProvider({ children }) {
    const [counselorId, setCounselorId] = useState(null);
    const [counselor, setCounselor] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadCounselor = useCallback(async (id) => {
        if (!id) {
            setCounselor(null);
            return;
        }

        const result = await getCounselorProfile(id);
        setCounselor(result.data);
    }, []);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            const nextId = resolveCounselorId(data.session);

            setCounselorId(nextId);
            setLoading(false);
            if (nextId) loadCounselor(nextId);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const nextId = resolveCounselorId(session);

            setCounselorId(nextId);
            if (nextId) {
                loadCounselor(nextId);
            } else {
                setCounselor(null);
            }
        });

        return () => subscription.unsubscribe();
    }, [loadCounselor]);

    const value = {
        counselor,
        isCounselor: !!counselorId,
        loading,
        refreshCounselor: () => loadCounselor(counselorId)
    };

    return (
        <CounselorAuthContext.Provider value={value}>
            {children}
        </CounselorAuthContext.Provider>
    );
}

export function useCounselorAuth() {
    const context = useContext(CounselorAuthContext);

    if (context === undefined) {
        throw new Error('useCounselorAuth must be used within a CounselorAuthProvider');
    }

    return context;
}
