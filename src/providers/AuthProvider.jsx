import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch('http://164.92.108.233/get-user')
            const data = await res.json()
            setLoading(false)

            if (data.status === 'success') {
                setUser(data.userData)
            }
        }
        return () => fetchUser();
    }, [])

    const authInfo = {
        user, setUser, loading, setLoading
    }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;