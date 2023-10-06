import { useContext, useState } from 'react';
import { FaAnglesLeft } from 'react-icons/fa6';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';
import Cookies from 'js-cookie';

const Setting = () => {
    const [password, setPassword] = useState('')
    const [confirmPassword, setconfirmPassword,] = useState('')
    const { user, setUser } = useContext(AuthContext)
    const location = useLocation()
    const from = location.state?.from?.pathname || '/';
    const navigate = useNavigate()

    const handleSignout = () => {
        Cookies.remove("loginToken")
        setUser(null)
    }
    
    const handleChangePassword = () => {
        if(!password || !confirmPassword){
            return;
        }
        else if (password && password === confirmPassword) {
            fetch(`${import.meta.env.VITE_BASE_URL}/change-password`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ email: user.email, password })
            })
                .then(res => res.json())
                .then(data => {
                    setPassword('')
                    setconfirmPassword('')
                    navigate(from)
                })
                .catch(error => console.log(error))
        }
        else {
            return ;
        }
    }

    return (
        <section className='relative max-w-7xl mx-auto  p-12'>
            <Link to={from} className='absolute top-[70px] cursor-pointer'><FaAnglesLeft size={24} /></Link>
            <h1 className="mb-16 text-4xl text-center font-bold">Settings</h1>
            <div className='mb-16 space-y-12 '>
                <div className="mb-6">
                    <input onChange={(e) => setPassword(e.target.value)} value={password} type="text" id="password" className="block w-full p-5 text-xl text-gray-900 border border-[#948C8C] rounded-lg bg-gray-50 placeholder:text-[#ABABAB] placeholder:text-xl focus:outline-none" placeholder='Change Password' />
                </div>
                <div className="mb-6">
                    <input onChange={(e) => setconfirmPassword(e.target.value)} value={confirmPassword} type="text" id="confirmPassword" className="block w-full p-5 text-xl text-gray-900 border border-[#948C8C] rounded-lg bg-gray-50 placeholder:text-[#ABABAB] placeholder:text-xl focus:outline-none" placeholder='Confirm Password' />
                </div>
            </div>
            <div className='flex justify-center items-center gap-8'>
                {
                    user && <button onClick={handleSignout} className='text-xl block bg-[#30FFE4] py-4 px-20 rounded-2xl font-semibold'>Signout</button>
                }
                <button onClick={handleChangePassword} className='text-xl block bg-[#30FFE4] py-4 px-20 rounded-2xl font-semibold'>Done</button>
            </div>
        </section>
    );
};

export default Setting; 