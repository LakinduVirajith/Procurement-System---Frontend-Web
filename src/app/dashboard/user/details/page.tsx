'use client'
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { getAccessToken, getUserRole } from '@/lib/tokenService'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faKey, faUserPlus, faUserMinus, faEraser } from '@fortawesome/free-solid-svg-icons'
import {Input} from '@nextui-org/react';
import {Button} from '@nextui-org/react';
import { resetPasswordSchema } from '@/validation/resetPasswordSchema'
import { resetPasswordAction } from '@/server/_resetPassowrdAction'

export default function CreateDetails() {
  const router = useRouter()

  /* UNAUTHORIZED */
  if(getUserRole() !== 'ADMIN'){
    toast.error('403: You are not authorized to access')
    router.push('/dashboard/procurement/approval')
  }

  /* PASSWORD VISIBILITY */
  const [isVisible, setIsVisible] = React.useState(false)
  const toggleVisibility = () => setIsVisible(!isVisible)

  /* RESET FORM FIELDS */
  const [resetFormData, setResetFormData] = React.useState<resetPassword>({
    email: "", password: "", 
  });

  /* RESET ZOD VALIDATION */
  const [zodResetErrors, setResetZodErrors] = React.useState<any[]>([]);
  const handleResetSubmit = async (e: React.FormEvent<HTMLFormElement>) => {    
    e.preventDefault();
    setResetZodErrors([]); 

    try {
      resetPasswordSchema.parse(resetFormData);
    } catch (error: any) {
      setResetZodErrors(error.errors)
      toast.error("400: " + error.errors[0].message)
    }
  };

  /* RESET FORM SUBMISSION */
  useEffect(() => {    
    if (zodResetErrors.length === 0 && resetFormData.email !== '') {
      submitResetForm()
    }
  }, [zodResetErrors]);

  async function submitResetForm(){
    const response: ResponseMessage = await resetPasswordAction(resetFormData, getAccessToken())
    
    if (response.statusCode === 200) {
      clearResetForm()
      toast.success(response.message);
    } else {
      toast.error(response.statusCode + ": " + response.message);
    }
  }

  /* RESET FORM DATA CLEAR */
  const clearResetForm = () => {
    setResetFormData({
      email: "", password: ""
    });
    setResetZodErrors([]);
  };

  return (
    <div className='dashboard-style'>
      <form onSubmit={handleResetSubmit}>
        {/* RESET FORM HEADER */}
        <div className='flex justify-between mb-4'>
          <h1 className='font-semibold text-xl text-zinc-900'>RESET USER PASSWORD</h1>

          <section className='flex gap-4'>
            <Button type="submit" color="default" className='button-style-1' 
                  startContent={<FontAwesomeIcon icon={faKey} />}>
              Reset Password
            </Button>
            <Button type="button" color="default" className='button-style-1' onClick={clearResetForm}
                  startContent={<FontAwesomeIcon icon={faEraser} className='text-medium'/>} >
              Clear Form
            </Button>
          </section>
        </div>

        {/* RESET FORM BODY */}
        <div className='grid grid-cols-2 gap-x-4'>
          <section>
            <Input  type="email" label="User Email" value={resetFormData.email}
                    variant="bordered" className="input-style" isClearable 
                    onChange={(e) => setResetFormData({ ...resetFormData, email: e.target.value })}
            />
          </section>

          <section>
            <Input  label="New Password" variant="bordered" value={resetFormData.password}
                    endContent={
                      <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                        {isVisible ? (
                          <FontAwesomeIcon icon={faEyeSlash} className="text-lg text-default-800 pointer-events-none"/>
                        ) : (
                          <FontAwesomeIcon icon={faEye} className="text-lg text-default-800 pointer-events-none"/>
                        )}
                      </button>
                    }
                    type={isVisible ? "text" : "password"}
                    className="input-style"
                    onChange={(e) => setResetFormData({ ...resetFormData, password: e.target.value })}
            />
          </section>
        </div>
      </form>
    </div>
  )
}
