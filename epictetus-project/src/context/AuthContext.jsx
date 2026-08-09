import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { getValidSession } from '../services/session';
import { getUserProfile } from '../services/preferences';

const AuthContext = createContext(undefined);

function resolveStudentUser(session) {
    const sessionUser = session?.user ?? null;
    if (!sessionUser || sessionUser.user_metadata?.role === 'counselor') return null;
    return sessionUser;
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadProfile = useCallback(async (userId) => {
        if (!userId) {
            setProfile(null);
            return;
        }

        const result = await getUserProfile(userId);
        setProfile(result.data);
    }, []);

    useEffect(() => {
        getValidSession().then((session) => {
            const nextUser = resolveStudentUser(session);
            setUser(nextUser);
            setLoading(false);
            if (nextUser) loadProfile(nextUser.id);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const nextUser = resolveStudentUser(session);
            setUser(nextUser);
            if (nextUser) {
                loadProfile(nextUser.id);
            } else {
                setProfile(null);
            }
        });

        return () => subscription.unsubscribe();
    }, [loadProfile]);

    const value = {
        user,
        profile,
        loading,
        refreshProfile: () => loadProfile(user?.id)
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}
