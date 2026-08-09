import { Navigate, Outlet } from 'react-router';
import { useCounselorAuth } from '../context/CounselorAuthContext';
import './RequireAuth.css';

export default function RequireCounselorAuth() {
    const { isCounselor, loading } = useCounselorAuth();

    if (loading) {
        return (
            <div className="auth-loading-screen">
                <span className="auth-loading-dot" />
            </div>
        );
    }

    if (!isCounselor) {
        return <Navigate to="/counselor" replace />;
    }

    return <Outlet />;
}
