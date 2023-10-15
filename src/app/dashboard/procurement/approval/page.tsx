/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { orderTableColumns } from '@/lib/orderDetailsData'
import { getToken, getUserRole } from '@/services/tokenService'
import { getAllOrdersAction } from '@/server/order/_getAllOrdersAction'
import { orderApprovedAction } from '@/server/order/_orderApprovedAction'
import { orderCancelledAction } from '@/server/order/_orderCancelledAction'
import { faCheck, faRetweet, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import React from 'react'
import toast from 'react-hot-toast'

export default function OrderApproval() {
  const router = useRouter()

  /* UNAUTHORIZED */
  if(getUserRole() !== 'PROCUREMENT_MANAGER'){
    toast.error('403: You are not authorized to access')
    router.push('/dashboard/user/create')
  }

  const [isLoading, setIsLoading] = React.useState(true)
  const [ordersData, setOrdersData] = React.useState<OrderDTO[]>([])
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  const [totalPages, setTotalPages] = React.useState(1)
  const tableColumns = orderTableColumns

  React.useEffect(() => {
    fetchAllOrders()
  }, [])

  /* FETCH SITES */
  async function fetchAllOrders(){
    setOrdersData([])
    setIsLoading(true)

    const response: any = await getAllOrdersAction(await getToken())    
    
    if(!response.statusCode){      
      setOrdersData(response)
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

  /* PAGEABLE OPTION */
  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        {ordersData.length !== 0 &&
          <span className="w-[30%] text-small text-default-400">
            showing {(page * pageSize) - pageSize + 1} to {page === totalPages ? ordersData.length : page * pageSize} of {ordersData.length} entries
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
  }, [ordersData.length, page, pageSize])

  const onNextPage = React.useCallback(() => {
    setPage(page + 1)
  }, [page])

  const onPreviousPage = React.useCallback(() => {
    setPage(page - 1)
  }, [page])

  /* ORDER APPROVED HANDLE */
  async function ordersApprovedHandler(orderId: number) {
    const response = await orderApprovedAction(orderId, await getToken())

    if (response.statusCode === 200) {
      toast.success(response.message)
      fetchAllOrders()
    }
    else if(Number.isInteger(response.status)){
      toast.error(response.status + ": " + response.title?.toLocaleLowerCase())
    } else {
      toast.error(response.statusCode + ": " + response.message)
    }
  }

  /* ORDER CANCELLED HANDLE */
  async function ordersCancelledHandler(orderId: number) {
    const response = await orderCancelledAction(orderId, await getToken())

    if (response.statusCode === 200) {
      toast.success(response.message)
      fetchAllOrders()
    }
    else if(Number.isInteger(response.status)){
      toast.error(response.status + ": " + response.title?.toLocaleLowerCase())
    } else {
      toast.error(response.statusCode + ": " + response.message)
    }
  }  

  return (
    <div className='dashboard-style'>
      {/* SITE INFO TABLE */}
      <div className='flex justify-between mb-4'>
        <h1 className='font-semibold text-xl text-zinc-900'>ORDER INFORMATION</h1>

        <section className='flex gap-4'>
          <Button type="button" color="default" className='button-style-1' onClick={fetchAllOrders}
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
          {ordersData.map((row) =>
            <TableRow key={row.siteId}>
              {(columnKey) => (columnKey === 'status' || columnKey === 'supplierId' || columnKey === 'approved' || columnKey === 'cancelled') ? (
                    <TableCell>
                      {columnKey === 'status' && row.status === 'Pending' && <h1 className='text-yellow-600'>{row.status}</h1>}
                      {columnKey === 'status' && row.status === 'Approved' && <h1 className='text-green-600'>{row.status}</h1>}
                      {columnKey === 'status' && row.status === 'Cancelled' && <h1 className='text-red-600'>{row.status}</h1>}

                      {columnKey === 'supplierId' && row.supplierId !== null && <h1>{row.supplierId}</h1>}
                      {columnKey === 'supplierId' && row.supplierId === null && <h1 className='underline'>Not Assigned</h1>}

                      {columnKey === 'approved' && row.status !== "Approved" && 
                        <Button type="button" color="default" 
                                className='button-style-2' 
                                onClick={() => ordersApprovedHandler(row.orderId)} 
                                startContent={<FontAwesomeIcon icon={faCheck} />}>
                                  Approved
                        </Button>
                      }
                      {columnKey === 'approved' && row.status === "Approved" && 
                        <Button type="button" color="default" 
                          className='button-style-2 opacity-80' 
                          disabled
                          startContent={<FontAwesomeIcon icon={faCheck} />}>
                            Approved
                        </Button>
                      }

                      {columnKey === 'cancelled' && row.status !== "Cancelled" && 
                        <Button type="button" color="default" 
                          className='button-style-3' 
                          onClick={() => ordersCancelledHandler(row.orderId)} 
                          startContent={<FontAwesomeIcon icon={faXmark} />}>
                            Cancelled
                        </Button>
                      }
                      {columnKey === 'cancelled' && row.status === "Cancelled" && 
                        <Button type="button" color="default" 
                          className='button-style-3 opacity-80' 
                          disabled
                          startContent={<FontAwesomeIcon icon={faXmark} />}>
                            Cancelled
                        </Button>
                      }
                    </TableCell>
                  ) : (
                    <TableCell>{getKeyValue(row, columnKey)}</TableCell>
                )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
