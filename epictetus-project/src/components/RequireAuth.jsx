import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../context/AuthContext';
import './RequireAuth.css';

export default function RequireAuth() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="auth-loading-screen">
                <span className="auth-loading-dot" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
