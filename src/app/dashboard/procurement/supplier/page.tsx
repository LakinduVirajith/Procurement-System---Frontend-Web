/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { getAccessToken, getUserRole } from '@/lib/tokenService';
import { supplierTableColumns } from '@/lib/userDetailsData';
import { assignSupplierAction } from '@/server/_assignSupplierAction';
import { getSuppliersAction } from '@/server/_getSuppliersAction';
import { faEraser, faPlus, faRetweet } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Input, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';

export default function AssignSupplier() {
  const router = useRouter()

  /* UNAUTHORIZED */
  if(getUserRole() !== 'PROCUREMENT_MANAGER'){
    toast.error('403: You are not authorized to access')
    router.push('/dashboard/user/create')
  }

  const [isLoading, setIsLoading] = React.useState(true);
  const [suppliersData, setSuppliersData] = React.useState<UserDTO[]>([])
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  const [totalPages, setTotalPages] = React.useState(1)
  const tableColumns = supplierTableColumns

  React.useEffect(() => {
    fetchAllSuppliers()
  }, []);

  /* FETCH SUPPLIERS */
  async function fetchAllSuppliers(){
    setSuppliersData([])
    setIsLoading(true)

    const response: any = await getSuppliersAction(getAccessToken())    
    
    if(!response.statusCode){      
      setSuppliersData(response)
      setIsLoading(false)
      setTotalPages(Math.ceil(response.length / pageSize))
    }else if(Number.isInteger(response.status)){
      toast.error(response.status + ": " + response.title?.toLocaleLowerCase());
      setIsLoading(false)
    }else {
      toast.error(response.statusCode + ": " + response.message);
      setIsLoading(false)
    }
  }

  /* PAGEABLE OPTION */
  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        {suppliersData.length !== 0 &&
          <span className="w-[30%] text-small text-default-400">
            showing {(page * pageSize) - pageSize + 1} to {page === totalPages ? suppliersData.length : page * pageSize} of {suppliersData.length} entries
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
    );
  }, [suppliersData.length, page, pageSize]);

  const onNextPage = React.useCallback(() => {
    setPage(page + 1)
  }, [page]);

  const onPreviousPage = React.useCallback(() => {
    setPage(page - 1)
  }, [page]);

  /* ASSIGN SUPPLIER FORM FIELDS */
  const [formData, setFormData] = React.useState<AssignSupplier>({
    orderId: "", supplierId: "", 
  });

  /* ASSIGN SUPPLIER HANDLE */
  const assignSupplierHandler = async (e: React.FormEvent<HTMLFormElement>) => {    
    e.preventDefault();

    if(formData.orderId === ""){
      toast.error("400: order id is required")
    }else if(formData.supplierId === ""){
      toast.error("400: supplier Id is required")
    }else{
      const response = await assignSupplierAction(formData, getAccessToken())

      if (response.statusCode === 200) {
        toast.success(response.message);
      }else if(Number.isInteger(response.status)){
        toast.error(response.status + ": " + response.title?.toLocaleLowerCase());
      } else {
        toast.error(response.statusCode + ": " + response.message);
      }
    }
  }

  /* FORM DATA CLEAR */
  const clearForm = () => {
    setFormData({
      orderId: "", supplierId: ""
    });
  };

  return (
    <div className='dashboard-style'>
      {/* SUPPLIER INFO TABLE */}
      <div className='flex justify-between mb-4'>
        <h1 className='font-semibold text-xl text-zinc-900'>SUPPLIER INFORMATION</h1>

        <section className='flex gap-4'>
          <Button type="button" color="default" className='button-style-1' onClick={fetchAllSuppliers}
              startContent={<FontAwesomeIcon icon={faRetweet} />}>
                Refetch
          </Button>
          </section>
      </div>

      {/* SITE INFO TABLE */}
      <Table bottomContent={bottomContent}>
        <TableHeader>
          {tableColumns.map((column) =>
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody  emptyContent={" "}
                    isLoading={isLoading}
                    loadingContent={<h1>Loading...</h1>}>
          {suppliersData.map((row) =>
            <TableRow key={row.userId}>
              {(columnKey) => <TableCell>{getKeyValue(row, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <form onSubmit={assignSupplierHandler} className='mt-6'>
        {/* ASSIGN SUPPLER FORM HEADER */}
        <div className='flex justify-between mb-4'>
          <h1 className='font-semibold text-xl text-zinc-900'>ASSIGN SUPPLER</h1>

          <section className='flex gap-4'>
            <Button type="submit" color="default" className='button-style-1' 
                  startContent={<FontAwesomeIcon icon={faPlus} />}>
              Assign Supplier
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
              <Input  type="number" label="Order ID" value={formData.orderId}
                      variant="bordered" className="input-style"  min={1}
                      onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
              />
            </section>

            <section>
              <Input  type="number" label="Supplier ID" value={formData.supplierId}
                      variant="bordered" className="input-style" min={1} 
                      onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
              />
            </section>
          </div>
        </form>
    </div>
  )
}
