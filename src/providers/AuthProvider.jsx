import React, { createContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
export const AuthContext = createContext(null)

const AuthProvider = ({ children }) => { 
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)


    const token = Cookies.get("loginToken")

    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/get-user?token=${token === undefined ? '' : token}`)
            const data = await res.json()
            setLoading(false)

            if (data.status === 'success') {
                setUser(data.userData)
            }
            
        }

        return () => fetchUser();
    }, [token])

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