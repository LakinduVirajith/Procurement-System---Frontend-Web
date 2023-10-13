'use client'
import React from 'react'
import { setAccessToken, setRefreshToken, setUserRole } from '@/lib/tokenService'
import { loginAction } from '@/server/_loginAction'
import { useRouter } from "next/navigation"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import {Input} from '@nextui-org/react'
import {Button} from '@nextui-org/react'
import toast from 'react-hot-toast'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")

    /* PASSWORD VISIBILITY */
    const [isVisible, setIsVisible] = React.useState(false)
    const toggleVisibility = () => setIsVisible(!isVisible)

    /* LOGIN SERVER ACTION HANDLE */
    async function loginHandler() {
        const response: AuthenticationResponse = await loginAction(email, password)
        
        if(response.statusCode === 200) {            
            if(response.accessToken)
                setAccessToken(response.accessToken)
            if(response.refreshToken)
                setRefreshToken(response.refreshToken)
            if(response.userRole)
                setUserRole(response.userRole)
            
            toast.success(response.message)
            router.push('/dashboard')
        }
        else (toast.error(response.statusCode + ": " + response.message))
    }

    return (
        <div className="page-style">
            <form action={loginHandler} className='bg-white rounded-lg px-14 py-6'>
                
                <Input  type="text" label="User Name" value={email}
                        onValueChange={setEmail} placeholder="lakindu@gmail.com"
                        variant="bordered" className="input-style mt-2" 
                />
                
                <Input  type={isVisible ? "text" : "password"} label="Password" value={password} 
                        onValueChange={setPassword} placeholder="********" variant="bordered"
                        endContent={
                            <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                {isVisible ? (
                                    <FontAwesomeIcon icon={faEyeSlash} className="text-lg text-default-800 pointer-events-none"/>
                                ) : (
                                    <FontAwesomeIcon icon={faEye} className="text-lg text-default-800 pointer-events-none"/>
                                )}
                            </button>
                        }
                        className="input-style"
                />
                
                <Button type="submit" color="default" className='button-style-1 w-full mb-2'>Login</Button>
            </form>
        </div>
    )
}
