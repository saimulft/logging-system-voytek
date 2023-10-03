import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';

const Authentication = () => {
    const [openLoginModal, setOpenLoginModal] = useState(true)
    const [openSignupModal, setOpenSignupModal] = useState(false)
    const { setUser, loading, setLoading } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleLogin = (event) => {
        event.preventDefault()
        setLoading(true)

        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;
        const user = { email, password }

        fetch('http://164.92.108.233/login', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(user),
        })
            .then(res => res.json())
            .then(data => {
                setLoading(false)

                if (data.status === 'success') {
                    setUser(data.userData)
                    navigate('/', { replace: true })
                }
            })
            .catch(error => console.log(error))
    }

    const handleSignup = (event) => {
        event.preventDefault()
        setLoading(true)

        const form = event.target;
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;
        const user = { name, email, password };

        fetch('http://164.92.108.233/signup', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(res => res.json())
            .then(data => {
                setLoading(false)

                if (data.status === 'success') {
                    setOpenSignupModal(false)
                    setOpenLoginModal(true)
                }

            })
            .catch(error => console.log(error))
    }

    const handleForgotPassword = () => {
        console.log("Forgot password api is fetching...")
    }

    return (
        <div className='max-w-screen h-screen relative'>
            {
                openLoginModal && <div className='absolute left-0 top-0 right-0 bottom-0 w-full h-full bg-[#d9d9d999] flex justify-center items-center'>
                    <div data-aos="zoom-in" className='relative custom-shadow rounded-2xl w-[500px] h-auto py-[50px] bg-[#fff]'>
                        <h3 className='text-3xl font-medium mb-4 text-center'>Login to your account</h3>
                        <form onSubmit={handleLogin} className='flex justify-center items-center flex-col'>
                            <input className='w-3/5 my-3 p-2 border border-[#ddd] focus:outline-none placeholder:text-[#ABABAB]' placeholder='Enter your email' type="email" name='email' required />
                            <input className='w-3/5 my-3 p-2 border border-[#ddd] focus:outline-none placeholder:text-[#ABABAB]' placeholder='Enter your password' type="password" name='password' required />
                            {/* <p onClick={handleForgotPassword} className='hover:underline hover:cursor-pointer hover:text-[#A8A8A8] transition -ml-40'>Forgot Password?</p> */}
                            <button type='submit' disabled={loading} className='mt-10 bg-[#30FFE4] py-3 px-14 rounded-2xl font-bold'>Login</button>
                        </form>

                        {/* <p className='text-center'>Don&apos;t have an account? <span onClick={() => {
                            setOpenLoginModal(false)
                            setOpenSignupModal(true)
                        }} className='underline cursor-pointer text-[#A8A8A8] transition hover:text-[#8a8a8a]'>Signup</span></p> */}
                    </div>
                </div>
            }

            {
                openSignupModal && <div className='absolute left-0 top-0 right-0 bottom-0 w-full h-full bg-[#d9d9d999] flex justify-center items-center'>
                    <div data-aos="zoom-in" className='relative custom-shadow rounded-2xl w-[500px] h-auto py-[50px] bg-[#fff]'>
                        <h3 className='text-3xl font-medium mb-4 text-center'>Signup your account</h3>
                        <form onSubmit={handleSignup} className='flex justify-center items-center flex-col'>
                            <input className='w-3/5 my-3 p-2 border border-[#ddd] focus:outline-none placeholder:text-[#ABABAB]' placeholder='Enter your name' type="text" name='name' required />
                            <input className='w-3/5 my-3 p-2 border border-[#ddd] focus:outline-none placeholder:text-[#ABABAB]' placeholder='Enter your email' type="email" name='email' required />
                            <input className='w-3/5 my-3 p-2 border border-[#ddd] focus:outline-none placeholder:text-[#ABABAB]' placeholder='Enter your password' type="password" name='password' required />
                            <button type='submit' disabled={loading} className='mt-10 mb-10 bg-[#30FFE4] py-3 px-14 rounded-2xl font-bold'>Signup</button>
                        </form>

                        <p className='text-center'>Already have an account? <span onClick={() => {
                            setOpenSignupModal(false)
                            setOpenLoginModal(true)
                        }} className='underline cursor-pointer text-[#A8A8A8] transition hover:text-[#8a8a8a]'>Login</span></p>
                    </div>
                </div>
            }
        </div>
    );
};

export default Authentication;