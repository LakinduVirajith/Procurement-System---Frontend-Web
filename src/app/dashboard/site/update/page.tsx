/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React from 'react'
import toast from 'react-hot-toast'
import { getAccessToken } from '@/lib/tokenService'
import { createSiteSchema } from '@/validation/createSiteSchema'
import { Button, Divider, Input } from '@nextui-org/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faEraser, faPen } from '@fortawesome/free-solid-svg-icons'
import { getSiteInfoAction } from '@/server/_getSiteInfoAction'
import { updateSiteAction } from '@/server/_updateSiteAction'

export default function UpdateSite() {
  const initialFormData = {
    siteId: "", siteName: "", 
    location: "", startDate: "", 
    contactNumber: "", allocatedBudget: 0, 
    siteManagerId: "", procurementManagerId: "",
  };

  /* FORM FIELDS */
  const [formData, setFormData] = React.useState<SiteDTO>(initialFormData);
  const [fetched, setFetched] = React.useState(false)

  /* FETCH SITE INFO */
  async function fetchSiteInfo(){    
    if(formData.siteId === ""){
      toast.error("400: site id is required")
    }else if(formData.siteId !== undefined && formData.siteId !== ""){
      const response = await getSiteInfoAction(formData.siteId, getAccessToken())
      
      if(!response.statusCode){
        let updatedFormData = {
          siteId: response.siteId,
          siteName: response.siteName,
          location: response.location,
          startDate: response.startDate,
          contactNumber: response.contactNumber,
          allocatedBudget: response.allocatedBudget,
          siteManagerId: response.siteManagerId.toString(),
          procurementManagerId: response.procurementManagerId
        };  
        if (response.startDate === null) updatedFormData.startDate = "";
        if (response.procurementManagerId === null) updatedFormData.procurementManagerId = "";
        if(response.procurementManagerId !== null) updatedFormData.procurementManagerId.toString()
        setFormData(updatedFormData);
        setFetched(true)
      }else if(Number.isInteger(response.status)){
        toast.error(response.status + ": " + response.title?.toLocaleLowerCase());
      } else {
        toast.error(response.statusCode + ": " + response.message);
      }
    }
  }

  /* ZOD VALIDATION */
  const [zodErrors, setZodErrors] = React.useState<any[]>([]);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setZodErrors([]); 

    if(formData.siteId === ""){
      toast.error("400: site id is required")
    }else{
      try {
        createSiteSchema.parse(formData);
      } catch (error: any) {
        toast.error("400: " + error.errors[0].message)
        setZodErrors(error.errors)
      }
    }
  };

  /* FORM SUBMISSION */
  React.useEffect(() => {    
    if (zodErrors.length === 0 && formData.siteId !== '') {
      submitForm()
    }
  }, [zodErrors]);

  async function submitForm(){
    const response: ResponseMessage = await updateSiteAction(formData, getAccessToken())
    
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
    setFormData(initialFormData);
    setZodErrors([]);
    setFetched(false)
  };

  return (
    <div className='dashboard-style'>
      {/* GET SITE INFO */}
      <div className='flex justify-between mb-4 mt-6'>
          <h1 className='font-semibold text-xl text-zinc-900'>FETCH SITE INFO</h1>

          <section className='flex gap-4'>
            <Button type="button" color="default" className='button-style-1' onClick={fetchSiteInfo}
                startContent={<FontAwesomeIcon icon={faDownload} />}>
                  Fetch Data
            </Button>
            <Button type="button" color="default" className='button-style-1' onClick={clearForm}
                startContent={<FontAwesomeIcon icon={faEraser} />}>
                  Clear Form
            </Button>
          </section>
      </div>

      <div className='grid grid-cols-1 gap-x-4'>
        <section>
          {fetched ? (
            <Input  type="text" label="Site ID" value={formData.siteId}
                    variant="bordered" className="input-style" readOnly
                    onChange={(e) => setFormData({ ...formData, siteId: e.target.value })}
            />
          ):(
            <Input  type="text" label="Site ID" value={formData.siteId}
                      variant="bordered" className="input-style" 
                      onChange={(e) => setFormData({ ...formData, siteId: e.target.value })}
            />
          )}
        </section>
      </div>

      <Divider className='my-4 h-0' />

      <form onSubmit={handleSubmit}>
        {/* FORM HEADER */}
        <div className='flex justify-between mb-4'>
          <h1 className='font-semibold text-xl text-zinc-900'>UPDATE SITE FORM</h1>

          <section className='flex gap-4'>
            <Button type="submit" color="default" className='button-style-1' 
                  startContent={<FontAwesomeIcon icon={faPen} />}>
              Update Site
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
    </div>
  )
}
