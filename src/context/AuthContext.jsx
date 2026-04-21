import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as userService from '../services/userService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshAuth = useCallback(async function refreshAuth() {
        try {
            const currentUser = await userService.isLoggedIn();
            setUser(currentUser);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshAuth();
    }, [refreshAuth]);

    const value = useMemo(
        () => ({
            user,
            loading,
            isAuthenticated: Boolean(user),
            refreshAuth,
            setUser,
        }),
        [user, loading, refreshAuth]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
