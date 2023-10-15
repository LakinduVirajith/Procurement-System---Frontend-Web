/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React from 'react'
import toast from 'react-hot-toast'
import { getAccessToken, getUserRole } from '@/lib/tokenService'
import { createSiteSchema } from '@/validation/createSiteSchema'
import { createSiteAction } from '@/server/_createSiteAction'
import { Button, Input } from '@nextui-org/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudArrowUp, faEraser } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'

export default function CreateSite() {
  const router = useRouter()

  /* UNAUTHORIZED */
  if(getUserRole() !== 'ADMIN'){
    toast.error('403: You are not authorized to access')
    router.push('/dashboard/procurement/approval')
  }

  /* FORM FIELDS */
  const [formData, setFormData] = React.useState<SiteDTO>({
    siteName: "", location: "",
    startDate: "", contactNumber: "",
    allocatedBudget: 0, siteManagerId: "",
    procurementManagerId: ""
  });

  /* ZOD VALIDATION */
  const [zodErrors, setZodErrors] = React.useState<any[]>([]);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setZodErrors([]); 

    try {
      createSiteSchema.parse(formData);
    } catch (error: any) {
      toast.error("400: " + error.errors[0].message)
      setZodErrors(error.errors)
    }
  };

  /* FORM SUBMISSION */
  React.useEffect(() => {    
    if (zodErrors.length === 0 && formData.siteName !== '') {
      submitForm()
    }
  }, [zodErrors]);

  async function submitForm(){
    const response: ResponseMessage = await createSiteAction(formData, getAccessToken())
    
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
      siteName: "", location: "",
      startDate: "", contactNumber: "",
      allocatedBudget: 0, siteManagerId: "",
      procurementManagerId: "",
    });
    setZodErrors([]);
  };

  return (
    <form onSubmit={handleSubmit} className='dashboard-style'>
      {/* FORM HEADER */}
      <div className='flex justify-between mb-4'>
        <h1 className='font-semibold text-xl text-zinc-900'>CREATE SITE FORM</h1>

        <section className='flex gap-4'>
          <Button type="submit" color="default" className='button-style-1' 
                startContent={<FontAwesomeIcon icon={faCloudArrowUp} />}>
            Create Site
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
          <Input  type="text" label="Site Name" value={formData.siteName}
                  variant="bordered" className="input-style" 
                  onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
          />
        </section>

        <section>
          <Input  type="text" label="Location" value={formData.location}
                  variant="bordered" className="input-style" 
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </section>

        <section>
          <Input  type="text" label="Start Date" value={formData.startDate}
                  variant="bordered" className="input-style" 
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
        </section>

        <section>
          <Input  type="number" label="Contact Number" value={formData.contactNumber}
                  variant="bordered" className="input-style" 
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
          />
        </section>

        <section>
          <Input  type="number" label="Allocated Budget" value={formData.allocatedBudget.toString()}
                  variant="bordered" className="input-style" 
                  endContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">LKR</span>
                    </div>
                  }
                  onChange={(e) => setFormData({ ...formData, allocatedBudget: parseInt(e.target.value) })}
          />
        </section>

        <section>
          <Input  type="number" label="Site Manager ID" value={formData.siteManagerId}
                  variant="bordered" className="input-style" 
                  onChange={(e) => setFormData({ ...formData, siteManagerId: e.target.value })}
          />
        </section>

        <section>
          <Input  type="number" label="Procurement Manager ID" value={formData.procurementManagerId}
                  variant="bordered" className="input-style" 
                  onChange={(e) => setFormData({ ...formData, procurementManagerId: e.target.value })}
          />
        </section>
      </div>
    </form>
  )
}
