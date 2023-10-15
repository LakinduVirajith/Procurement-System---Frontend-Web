/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React from 'react'
import toast from 'react-hot-toast'
import { getToken, getUserRole } from '@/services/tokenService'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faKey, faUserPlus, faUserMinus, faEraser } from '@fortawesome/free-solid-svg-icons'
import { Input, Button } from '@nextui-org/react'
import { resetPasswordSchema } from '@/validation/resetPasswordSchema'
import { resetPasswordAction } from '@/server/user/_resetPassowrdAction'
import { allocateSiteSchema } from '@/validation/allocateSiteSchema'
import { allocateSiteAction } from '@/server/site/_allocateSiteAction'
import { deallocateSiteSchema } from '@/validation/deallocateSiteSchema'
import { deallocateSiteAction } from '@/server/site/_deallocateSiteAction'

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
  const [resetFormData, setResetFormData] = React.useState<ResetPassword>({
    email: "", password: "", 
  })

  /* RESET ZOD VALIDATION */
  const [zodResetErrors, setResetZodErrors] = React.useState<any[]>([])
  const handleResetSubmit = async (e: React.FormEvent<HTMLFormElement>) => {    
    e.preventDefault()
    setResetZodErrors([]) 

    try {
      resetPasswordSchema.parse(resetFormData)
    } catch (error: any) {
      setResetZodErrors(error.errors)
      toast.error("400: " + error.errors[0].message)
    }
  }

  /* RESET FORM SUBMISSION */
  React.useEffect(() => {    
    if (zodResetErrors.length === 0 && resetFormData.email !== '') {
      submitResetForm()
    }
  }, [zodResetErrors])

  async function submitResetForm(){
    const response: ResponseMessage = await resetPasswordAction(resetFormData, await getToken())
    
    if (response.statusCode === 200) {
      clearResetForm()
      toast.success(response.message)
    } else {
      toast.error(response.statusCode + ": " + response.message)
    }
  }

  /* RESET FORM DATA CLEAR */
  const clearResetForm = () => {
    setResetFormData({
      email: "", password: ""
    })
    setResetZodErrors([])
  }

  /* ALLOCATE FORM FIELDS */
  const [allocateFormData, setAllocateFormData] = React.useState<AllocateSite>({
    siteId: "", userEmail: "", 
  })

  
  /* ALLOCATE ZOD VALIDATION */
  const [zodAllocateErrors, setAllocateZodErrors] = React.useState<any[]>([])
  const handleAllocateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {    
    e.preventDefault()
    setAllocateZodErrors([]) 

    try {
      allocateSiteSchema.parse(allocateFormData)
    } catch (error: any) {      
      setAllocateZodErrors(error.errors)
      toast.error("400: " + error.errors[0].message)
    }
  }

  /* ALLOCATE FORM SUBMISSION */
  React.useEffect(() => {    
    if (zodAllocateErrors.length === 0 && allocateFormData.siteId !== '') {
      submitAllocateForm()
    }
  }, [zodAllocateErrors])

  async function submitAllocateForm(){
    const response: ResponseMessage = await allocateSiteAction(allocateFormData, await getToken())
    
    if (response.statusCode === 200) {
      clearAllocateForm()
      toast.success(response.message)
    }
    else if(Number.isInteger(response.status)){
      toast.error(response.status + ": " + response.title?.toLocaleLowerCase())
    }
    else {
      toast.error(response.statusCode + ": " + response.message)
    }
  }

  /* ALLOCATE FORM DATA CLEAR */
  const clearAllocateForm = () => {
    setAllocateFormData({
      siteId: "", userEmail: ""
    })
    setAllocateZodErrors([])
  }

  /* DEALLOCATE FORM FIELDS */
  const [deallocateFormData, setDeallocateFormData] = React.useState<DeallocateSite>({
    siteId: "", userEmail: "", 
  })

  
  /* DEALLOCATE ZOD VALIDATION */
  const [zodDeallocateErrors, setDeallocateZodErrors] = React.useState<any[]>([])
  const handleDeallocateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {    
    e.preventDefault()
    setDeallocateZodErrors([]) 

    try {
      deallocateSiteSchema.parse(deallocateFormData)
    } catch (error: any) {      
      setDeallocateZodErrors(error.errors)
      toast.error("400: " + error.errors[0].message)
    }
  }

  /* DEALLOCATE FORM SUBMISSION */
  React.useEffect(() => {    
    if (zodDeallocateErrors.length === 0 && deallocateFormData.siteId !== '') {
      submitDeallocateForm()
    }
  }, [zodDeallocateErrors])

  async function submitDeallocateForm(){
    const response: ResponseMessage = await deallocateSiteAction(deallocateFormData, await getToken())
    
    if (response.statusCode === 200) {
      clearDeallocateForm()
      toast.success(response.message)
    }
    else if(Number.isInteger(response.status)){
      toast.error(response.status + ": " + response.title?.toLocaleLowerCase())
    }
    else {
      toast.error(response.statusCode + ": " + response.message)
    }
  }

  /* DEALLOCATE FORM DATA CLEAR */
  const clearDeallocateForm = () => {
    setDeallocateFormData({
      siteId: "", userEmail: ""
    })
    setDeallocateZodErrors([])
  }

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
      
      <form onSubmit={handleAllocateSubmit} className='mt-4'>
        {/* ALLOCATE FORM HEADER */}
        <div className='flex justify-between mb-4'>
          <h1 className='font-semibold text-xl text-zinc-900'>ALLOCATE USER TO SITE</h1>

          <section className='flex gap-4'>
            <Button type="submit" color="default" className='button-style-1' 
                  startContent={<FontAwesomeIcon icon={faUserPlus} />}>
              Allocate User
            </Button>
            <Button type="button" color="default" className='button-style-1' onClick={clearAllocateForm}
                  startContent={<FontAwesomeIcon icon={faEraser} className='text-medium'/>} >
              Clear Form
            </Button>
          </section>
        </div>

        {/* ALLOCATE FORM BODY */}
        <div className='grid grid-cols-2 gap-x-4'>
          <section>
            <Input  type="number" label="Site ID" value={allocateFormData.siteId}
                    variant="bordered" className="input-style"  min={1}
                    onChange={(e) => setAllocateFormData({ ...allocateFormData, siteId: e.target.value })}
            />
          </section>

          <section>
            <Input  type="text" label="User Email" value={allocateFormData.userEmail}
                    variant="bordered" className="input-style" isClearable 
                    onChange={(e) => setAllocateFormData({ ...allocateFormData, userEmail: e.target.value })}
            />
          </section>
        </div>
      </form>

      <form onSubmit={handleDeallocateSubmit} className='mt-4'>
        {/* DEALLOCATE FORM HEADER */}
        <div className='flex justify-between mb-4'>
          <h1 className='font-semibold text-xl text-zinc-900'>DEALLOCATE USER</h1>

          <section className='flex gap-4'>
            <Button type="submit" color="default" className='button-style-1' 
                  startContent={<FontAwesomeIcon icon={faUserMinus} />}>
              Deallocate User
            </Button>
            <Button type="button" color="default" className='button-style-1' onClick={clearDeallocateForm}
                  startContent={<FontAwesomeIcon icon={faEraser} className='text-medium'/>} >
              Clear Form
            </Button>
          </section>
        </div>

        {/* DEALLOCATE FORM BODY */}
        <div className='grid grid-cols-2 gap-x-4'>
          <section>
            <Input  type="number" label="Site ID" value={deallocateFormData.siteId}
                    variant="bordered" className="input-style"  min={1}
                    onChange={(e) => setDeallocateFormData({ ...deallocateFormData, siteId: e.target.value })}
            />
          </section>

          <section>
            <Input  type="text" label="User Email" value={deallocateFormData.userEmail}
                    variant="bordered" className="input-style" isClearable 
                    onChange={(e) => setDeallocateFormData({ ...deallocateFormData, userEmail: e.target.value })}
            />
          </section>
        </div>
      </form>
    </div>
  )
}
