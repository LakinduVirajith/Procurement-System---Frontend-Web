/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { getAccessToken, getUserRole } from '@/lib/tokenService'
import { useRouter } from 'next/navigation'
import {Input} from '@nextui-org/react';
import {Select, SelectItem} from '@nextui-org/react';
import {Button} from '@nextui-org/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faCloudArrowUp, faEraser } from '@fortawesome/free-solid-svg-icons'
import { userRoleData, isActiveData } from "../../../../lib/loginEnumData";
import { createUserSchema } from '@/validation/createUserSchema'
import { createUserAction } from '@/server/_createUserAction'

export default function UserCreate() {
  const router = useRouter()

  /* UNAUTHORIZED */
  if(getUserRole() !== 'ADMIN'){
    toast.error('403: You are not authorized to access')
    router.push('/dashboard/procurement/approval')
  }

  /* FORM FIELDS */
  const [formData, setFormData] = React.useState<userDTO>({
    firstName: "", lastName: "",
    email: "", mobileNumber: "",
    password: "", role: "",
    isActive: "",
  });

  /* PASSWORD VISIBILITY */
  const [isVisible, setIsVisible] = React.useState(false)
  const toggleVisibility = () => setIsVisible(!isVisible)

  /* ZOD VALIDATION */
  const [zodErrors, setZodErrors] = React.useState<any[]>([]);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {    
    e.preventDefault();
    setZodErrors([]); 

    try {
      createUserSchema.parse(formData);
    } catch (error: any) {
      setZodErrors(error.errors)
    }
  };

  /* FORM SUBMISSION */
  useEffect(() => {    
    if (zodErrors.length === 0 && formData.firstName !== '') {
      submitForm()
    }
  }, [zodErrors]);

  async function submitForm(){
    const response: ResponseMessage = await createUserAction(formData, getAccessToken())
    
    if (response.statusCode === 200) {
      clearForm()
      toast.success(response.message);
    }
    else if(Number.isInteger(response.status)){
      toast.error(response.status + ": " + response.title?.toLocaleLowerCase());
    } else {
      toast.error(response.statusCode + ": " + response.message);
    }
  }

  /* FORM DATA CLEAR */
  const clearForm = () => {
    setFormData({
      firstName: "", lastName: "",
      email: "", mobileNumber: "",
      password: "", role: "",
      isActive: "",
    });
    setZodErrors([]);
  };

  return (
    <form onSubmit={handleSubmit} className='dashboard-style'>
      {/* FORM HEADER */}
      <div className='flex justify-between mb-4'>
        <h1 className='font-semibold text-xl text-zinc-900'>CREATE USER FORM</h1>

        <section className='flex gap-4'>
          <Button type="submit" color="default" className='button-style-1' 
                startContent={<FontAwesomeIcon icon={faCloudArrowUp} />}>
            Create User
          </Button>
          <Button type="button" color="default" className='button-style-1' onClick={clearForm}
                startContent={<FontAwesomeIcon icon={faEraser} className='text-medium'/>} >
            Clear
          </Button>
        </section>
      </div>

      {/* FORM BODY */}
      <div className='grid grid-cols-2 gap-x-4'>
        <section>
          <Input  type="text" label="First Name" value={formData.firstName}
                  variant="bordered" className="input-style" 
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          />
          {zodErrors.find((error) => error.path[0] === 'firstName') && (
            <div className='error-text'>{zodErrors.find((error) => error.path[0] === 'firstName').message}</div>
          )}
        </section>
        
        <section>
          <Input  type="text" label="Last Name" value={formData.lastName}
                  variant="bordered" className="input-style" 
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          />
          {zodErrors.find((error) => error.path[0] === 'lastName') && (
            <div className='error-text'>{zodErrors.find((error) => error.path[0] === 'lastName').message}</div>
          )}
        </section>

        <section>
          <Input  type="email" label="Email" value={formData.email}
                  variant="bordered" className="input-style" isClearable 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          {zodErrors.find((error) => error.path[0] === 'email') && (
            <div className='error-text'>{zodErrors.find((error) => error.path[0] === 'email').message}</div>
          )}
        </section>

        <section>
          <Input  type="number" label="Mobile Number" value={formData.mobileNumber}
                  variant="bordered" className="input-style"
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
          />
          {zodErrors.find((error) => error.path[0] === 'mobileNumber') && (
            <div className='error-text'>{zodErrors.find((error) => error.path[0] === 'mobileNumber').message}</div>
          )}
        </section>

        <section>
          <Input  label="Password" variant="bordered" value={formData.password}
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
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          {zodErrors.find((error) => error.path[0] === 'password') && (
            <div className='error-text'>{zodErrors.find((error) => error.path[0] === 'password').message}</div>
          )}
        </section>

        <section>
          <Select label="User Role" className="input-style" value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            {userRoleData.map((role) => (
              <SelectItem className="input-style" key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </Select>
          {zodErrors.find((error) => error.path[0] === 'userRole') && (
            <div className='error-text'>{zodErrors.find((error) => error.path[0] === 'userRole').message}</div>
          )}
        </section>
        
        <section>
          <Select label="Is Active" className="input-style" value={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value })}
          >
            {isActiveData.map((state) => (
              <SelectItem className="input-style" key={state.value} value={state.value}>
                {state.label} 
              </SelectItem>
            ))}
          </Select>
          {zodErrors.find((error) => error.path[0] === 'isActive') && (
            <div className='error-text'>{zodErrors.find((error) => error.path[0] === 'isActive').message}</div>
          )}
        </section>

      </div>
    </form>
  )
}
