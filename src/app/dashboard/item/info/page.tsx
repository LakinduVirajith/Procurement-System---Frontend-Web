/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { getToken, getUserRole } from '@/services/tokenService'
import toast from 'react-hot-toast'
import { itemTableColumns } from '@/lib/itemDetailsData'
import { getAllItemsAction } from '@/server/item/_getAllItemsAction'
import { Button, Input, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from '@nextui-org/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEraser, faRetweet, faTrash } from '@fortawesome/free-solid-svg-icons'
import { deleteItemAction } from '@/server/item/_deleteItemAction'

export default function ItemInfo() {
  const router = useRouter()

  /* UNAUTHORIZED */
  if(getUserRole() !== 'SITE_MANAGER'){
    toast.error('403: You are not authorized to access')
    router.push('/dashboard')
  }

  const [isLoading, setIsLoading] = React.useState(true)
  const [itemsData, setItemsData] = React.useState<ItemDTO[]>([])
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(5)
  const [totalPages, setTotalPages] = React.useState(1)
  const tableColumns = itemTableColumns

  React.useEffect(() => {
    fetchAllItems()
  }, [])

  /* FETCH ITEMS */
  async function fetchAllItems(){
    setItemsData([])
    setIsLoading(true)

    const response: any = await getAllItemsAction(await getToken())    
    
    if(!response.statusCode){      
      setItemsData(response)
      setIsLoading(false)
      setTotalPages(Math.ceil(response.length / pageSize))
    }else if(Number.isInteger(response.status)){
      toast.error(response.status + ": " + response.title?.toLocaleLowerCase())
      setIsLoading(false)
    }else {
      toast.error(response.statusCode + ": " + response.message)
      setIsLoading(false)
    }
  }

  /* PAGE DATA SET */
  const items = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return itemsData.slice(start, end);
  }, [page, itemsData]);

  /* PAGEABLE OPTION */
  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        {itemsData.length !== 0 &&
          <span className="w-[30%] text-small text-default-400">
            showing {(page * pageSize) - pageSize + 1} to {page === totalPages ? itemsData.length : page * pageSize} of {itemsData.length} entries
          </span>
        }
        
        <Pagination isCompact showControls
                    showShadow color="success"
                    page={page} total={totalPages}
                    onChange={(page: number) => setPage(page)}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button isDisabled={page === 1} size="sm" variant="flat" onPress={() => onPreviousPage}>
            Previous
          </Button>
          <Button isDisabled={page === totalPages} size="sm" variant="flat" onPress={() => onNextPage}>
            Next
          </Button>
        </div>
      </div>
    )
  }, [itemsData.length, page, pageSize])

  const onNextPage = React.useCallback(() => {
    setPage(page + 1)
  }, [page])

  const onPreviousPage = React.useCallback(() => {
    setPage(page - 1)
  }, [page])

  /* REMOVE ITEM FORM FIELDS */
  const [formData, setFormData] = React.useState<any>({
    itemId: "", itemName: "", 
  })

  /* REMOVE ITEM HANDLE */
  const removeItemHandler = async (e: React.FormEvent<HTMLFormElement>) => {    
    e.preventDefault()

    if(formData.itemId === ""){
      toast.error("400: item id is required")
    }else if(formData.itemName === ""){
      toast.error("400: item name is required")
    }else if(formData.itemId && formData.itemName){
      const item = itemsData.find((item) => formData.itemId === item.itemId?.toString())

      if(!item){
        toast.error("400: invalid item id")
      }else if(item.name !== formData.itemName){
        toast.error("400: invalid item name")
      }else{
        const response = await deleteItemAction(formData.itemId, await getToken())

        if (response.statusCode === 200) {
          toast.success(response.message)
          fetchAllItems()
          clearForm()
        }else if(Number.isInteger(response.status)){
          toast.error(response.status + ": " + response.title?.toLocaleLowerCase())
        } else {
          toast.error(response.statusCode + ": " + response.message)
        }
      }
    }
  }

  /* FORM DATA CLEAR */
  const clearForm = () => {
    setFormData({
      itemId: "", itemName: ""
    })
  }

  return (
    <div className='dashboard-style'>
      {/* ITEM INFO TABLE */}
      <div className='flex justify-between mb-4'>
        <h1 className='font-semibold text-xl text-zinc-900'>ITEM INFORMATION</h1>

        <section className='flex gap-4'>
          <Button type="button" color="default" className='button-style-1' onClick={fetchAllItems}
              startContent={<FontAwesomeIcon icon={faRetweet} />}>
                Refetch
          </Button>
          </section>
      </div>

      {/* ITEM INFO TABLE */}
      <Table bottomContent={bottomContent}>
        <TableHeader>
          {tableColumns.map((column) =>
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody  emptyContent={" "}
                    isLoading={isLoading}
                    loadingContent={<h1>Loading...</h1>}>
          {items.map((row) =>
            <TableRow key={row.itemId}>
              {(columnKey) => (columnKey === 'price') ? (
                    <TableCell>
                      {columnKey === 'price' && <h1>LKR {parseInt(row.price).toFixed(2)}</h1>}
                    </TableCell>
                  ) : (
                    <TableCell>{getKeyValue(row, columnKey)}</TableCell>
                )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <form onSubmit={removeItemHandler} className='mt-8'>
        {/* ASSIGN SUPPLER FORM HEADER */}
        <div className='flex justify-between mb-4'>
          <h1 className='font-semibold text-xl text-zinc-900'>REMOVE ITEM</h1>

          <section className='flex gap-4'>
            <Button type="submit" color="default" className='button-style-1' 
                  startContent={<FontAwesomeIcon icon={faTrash} />}>
              Remove Item
            </Button>
            <Button type="button" color="default" className='button-style-1' onClick={clearForm}
                  startContent={<FontAwesomeIcon icon={faEraser} className='text-medium'/>} >
              Clear Form
            </Button>
          </section>
        </div>

        {/* ASSIGN SUPPLER FORM BODY*/}
        <div className='grid grid-cols-2 gap-x-4'>
          <section>
            <Input  type="number" label="Item ID" value={formData.itemId}
                      variant="bordered" className="input-style"  min={1}
                      onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}
            />
          </section>

          <section>
            <Input  type="text" label="Item Name" value={formData.itemName}
                      variant="bordered" className="input-style" 
                      onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
            />
          </section>
        </div>
      </form>
    </div>
  )
}
