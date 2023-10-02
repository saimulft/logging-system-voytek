import { useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({children}) => {
    const {user, loading} = useContext(AuthContext)

    if(loading){
        return <div className='w-screen h-screen flex items-center justify-center text-3xl font-bold'>Loading...</div>
    }

    if(user){
        return children;
    }

    return <Navigate to="/user/authentication" />
};

export default ProtectedRoute;