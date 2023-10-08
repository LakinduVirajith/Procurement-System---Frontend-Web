'use client'
import { setAccessToken, setRefreshToken, setUserRole } from '@/lib/tokenService'
import { loginAction } from '@/server/_loginAction'
import { useRouter } from "next/navigation"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import toast from 'react-hot-toast'
import { useState } from 'react'

export default function LoginPage() {
    const [showPassword, setShowPassowrd] = useState(false)
    const [inputPassword, setInputPassword] = useState("password")
    const router = useRouter()

    async function loginHandler(form: FormData) {
        const response: AuthenticationResponse = await loginAction(form)
        
        if(response.statusCode === 200) {
            setAccessToken(response.accessToken)
            setRefreshToken(response.refreshToken)
            setUserRole(response.userRole)
            
            toast.success(response.message)
            router.push('/dashboard')
        }
        else (toast.error(response.message))
    }

    function passwordHandler(type: number){
        if(type == 1){
            setShowPassowrd(true)
            setInputPassword("text")
        }else{
            setShowPassowrd(false)
            setInputPassword("password")
        }
    }

    return (
        <div className="page-style">
            <form action={loginHandler} className='bg-white rounded-md px-14 py-6'>
                <div className="input-wapper">
                    <label>User Name</label>
                    <input type="text" name="email" placeholder="lakindu@gmail.com" className="input-style"/>
                </div>
                
                <div className="input-wapper">
                    <label>Password</label>
                    <div className="input-style flex">
                        <input type={inputPassword} name="password" placeholder="********" className='outline-none'/>
                        {!showPassword? (
                            <FontAwesomeIcon icon={faEyeSlash} 
                                className='text-zinc-900 cursor-pointer flex my-auto h-4' 
                                onClick={() => passwordHandler(1)}/>
                        ):(
                            <FontAwesomeIcon icon={faEye} 
                                className='text-zinc-900 cursor-pointer flex my-auto h-4' 
                                onClick={() => passwordHandler(2)}/>
                        )}
                    </div>
                </div>
                
                <button type="submit" className="button-style-1 my-2" >
                    Login
                </button>
            </form>
        </div>
    )
}
