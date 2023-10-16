/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { getToken, getUserRole } from '@/services/tokenService'
import { createItemSchema } from '@/validation/createItemSchema'
import { createItemAction } from '@/server/item/_createItemAction'
import { Button, Input } from '@nextui-org/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudArrowUp, faEraser } from '@fortawesome/free-solid-svg-icons'

export default function CreateItem() {
  const router = useRouter()

  /* UNAUTHORIZED */
  if(getUserRole() !== 'SITE_MANAGER'){
    toast.error('403: You are not authorized to access')
    router.push('/dashboard')
  }

  const initialFormData = {
    name: "", description: "",
    manufacturer: "", price: "",
    volumeType: "", weight: "",
    color: ""
  }

  /* FORM FIELDS */
  const [formData, setFormData] = React.useState<ItemDTO>(initialFormData)

  /* ZOD VALIDATION */
  const [zodErrors, setZodErrors] = React.useState<any[]>([])
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setZodErrors([]) 

    try {
      createItemSchema.parse(formData)
    } catch (error: any) {     
      toast.error("400: " + error.errors[0].message)
      setZodErrors(error.errors)
    }
  }

  /* FORM SUBMISSION */
  React.useEffect(() => {    
    if (zodErrors.length === 0 && formData.name !== '') {
      submitForm()
    }
  }, [zodErrors])

  async function submitForm(){
    const response: ResponseMessage = await createItemAction(formData, await getToken())
    
    if (response.statusCode === 200) {
      clearForm()
      toast.success(response.message)
    }
    else if(Number.isInteger(response.status)){
      toast.error(response.status + ": " + response.title?.toLocaleLowerCase())
    } else {
      toast.error(response.statusCode + ": " + response.message)
    }
  }

  /* FORM DATA CLEAR */
  const clearForm = () => {
    setFormData(initialFormData)
    setZodErrors([])
  }
  
  return (
    <form onSubmit={handleSubmit} className='dashboard-style'>
      {/* FORM HEADER */}
      <div className='flex justify-between mb-4'>
        <h1 className='font-semibold text-xl text-zinc-900'>CREATE ITEM FORM</h1>

        <section className='flex gap-4'>
          <Button type="submit" color="default" className='button-style-1' 
                startContent={<FontAwesomeIcon icon={faCloudArrowUp} />}>
            Create Item
          </Button>
          <Button type="button" color="default" className='button-style-1' onClick={clearForm}
                startContent={<FontAwesomeIcon icon={faEraser} className='text-medium'/>} >
            Clear Form
          </Button>
        </section>
      </div>

      {/* FORM BODY */}
      <div className='grid grid-cols-2 gap-x-4'>
        <section>
          <Input  type="text" label="Item Name" value={formData.name}
                  variant="bordered" className="input-style" 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </section>

        <section>
          <Input  type="text" label="Description" value={formData.description}
                  variant="bordered" className="input-style" 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </section>

        <section>
          <Input  type="text" label="Manufacturer" value={formData.manufacturer}
                  variant="bordered" className="input-style" 
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
          />
        </section>

        <section>
          <Input  type="number" label="Item Price" value={formData.price}
                  variant="bordered" className="input-style" min={1}
                  endContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">LKR</span>
                    </div>
                  }
                  onChange={(e) => setFormData({ ...formData, price: e.target.value.toString() })}
          />
        </section>

        <section>
          <Input  type="text" label="Volume Type" value={formData.volumeType}
                  variant="bordered" className="input-style" 
                  onChange={(e) => setFormData({ ...formData, volumeType: e.target.value})}
          />
        </section>

        <section>
          <Input  type="number" label="Weight" value={formData.weight}
                  variant="bordered" className="input-style" 
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value.toString() })}
          />
        </section>

        <section>
          <Input  type="text" label="Color" value={formData.color}
                  variant="bordered" className="input-style" 
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
          />
        </section>
      </div>
    </form>
  )
}
