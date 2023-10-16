/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { getToken, getUserRole } from '@/services/tokenService'
import toast from 'react-hot-toast'
import { createItemSchema } from '@/validation/createItemSchema'
import { Button, Divider, Input } from '@nextui-org/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faEraser, faPen } from '@fortawesome/free-solid-svg-icons'
import { getItemInfoAction } from '@/server/item/_getItemInfoAction'
import { updateItemAction } from '@/server/item/_updateItemAction'

export default function UpdateItem() {
  const router = useRouter()

  /* UNAUTHORIZED */
  if(getUserRole() !== 'SITE_MANAGER'){
    toast.error('403: You are not authorized to access')
    router.push('/dashboard')
  }

  const initialFormData = {
    itemId: "", name: "", description: "",
    manufacturer: "", price: "",
    volumeType: "", weight: "",
    color: ""
  }

  /* FORM FIELDS */
  const [formData, setFormData] = React.useState<ItemDTO>(initialFormData)
  const [fetched, setFetched] = React.useState(false)

  /* FETCH ITEM INFO */
  async function fetchItemInfo(){    
    if(formData.itemId === ""){
      toast.error("400: item id is required")
    }else if(formData.itemId !== undefined && formData.itemId !== ""){
      const response = await getItemInfoAction(formData.itemId, await getToken())
      
      if(!response.statusCode){
        let updatedFormData = {
          itemId: response.itemId,
          name: response.name,
          description: response.description,
          manufacturer: response.manufacturer,
          price: response.price.toString(),
          volumeType: response.volumeType,
          weight: response.weight,
          color: response.color
        }  
        if (response.description === null) updatedFormData.description = ""
        if (response.weight === null) updatedFormData.weight = ""
        if (response.weight !== null) updatedFormData.weight.toString()
        if (response.color === null) updatedFormData.color = ""
        setFormData(updatedFormData)
        setFetched(true)
      }else if(Number.isInteger(response.status)){
        toast.error(response.status + ": " + response.title?.toLocaleLowerCase())
      } else {
        toast.error(response.statusCode + ": " + response.message)
      }
    }
  }

  /* ZOD VALIDATION */
  const [zodErrors, setZodErrors] = React.useState<any[]>([])
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setZodErrors([]) 

    if(formData.itemId === ""){
      toast.error("400: item id is required")
    }else{
      try {
        createItemSchema.parse(formData)
      } catch (error: any) {
        toast.error("400: " + error.errors[0].message)
        setZodErrors(error.errors)
      }
    }
  }

  /* FORM SUBMISSION */
  React.useEffect(() => {    
    if (zodErrors.length === 0 && formData.itemId !== '') {
      submitForm()
    }
  }, [zodErrors])

  async function submitForm(){
    const response: ResponseMessage = await updateItemAction(formData, await getToken())
    
    if (response.statusCode === 200) {
      clearForm()
      toast.success(response.message)
    }else if(Number.isInteger(response.status)){
      toast.error(response.status + ": " + response.title?.toLocaleLowerCase())
    }else {
      toast.error(response.statusCode + ": " + response.message)
    }
  }

  /* FORM DATA CLEAR */
  const clearForm = () => {
    setFormData(initialFormData)
    setZodErrors([])
    setFetched(false)
  }

  return (
    <div className='dashboard-style'>
      {/* GET SITE INFO */}
      <div className='flex justify-between mb-4 mt-6'>
          <h1 className='font-semibold text-xl text-zinc-900'>FETCH ITEM INFO</h1>

          <section className='flex gap-4'>
            <Button type="button" color="default" className='button-style-1' onClick={fetchItemInfo}
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
            <Input  type="text" label="Item ID" value={formData.itemId}
                    variant="bordered" className="input-style" readOnly
                    onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}
            />
          ):(
            <Input  type="text" label="Item ID" value={formData.itemId}
                      variant="bordered" className="input-style" 
                      onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}
            />
          )}
        </section>
      </div>

      <Divider className='my-4 h-0' />

      <form onSubmit={handleSubmit}>
        {/* FORM HEADER */}
        <div className='flex justify-between mb-4'>
          <h1 className='font-semibold text-xl text-zinc-900'>UPDATE ITEM FORM</h1>

          <section className='flex gap-4'>
            <Button type="submit" color="default" className='button-style-1' 
                  startContent={<FontAwesomeIcon icon={faPen} />}>
              Update Item
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
    </div>
  )
}
