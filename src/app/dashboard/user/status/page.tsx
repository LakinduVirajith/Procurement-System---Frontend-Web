/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React from 'react'
import toast from 'react-hot-toast'
import { getToken, getUserRole } from '@/services/tokenService'
import { getAllUsersAction } from '@/server/user/_getAllUsersAction'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRetweet, faPen, faEraser } from '@fortawesome/free-solid-svg-icons'
import { Button, Input, Select, SelectItem } from '@nextui-org/react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, Pagination } from '@nextui-org/react'
import { userStatusData, userTableColumns } from '@/lib/userDetailsData'
import { activateUserAction } from '@/server/user/_activateUserAction'
import { deactivateUserAction } from '@/server/user/_deactivateUserAction'
import { useRouter } from 'next/navigation'

export default function UserStatus() {
  const router = useRouter()

  /* UNAUTHORIZED */
  if(getUserRole() !== 'ADMIN'){
    toast.error('403: You are not authorized to access')
    router.push('/dashboard/procurement/approval')
  }

  /* GET ALL USERS */
  const [isLoading, setIsLoading] = React.useState(true)
  const [pageable, setPageable] = React.useState<Pageable>({
    page: 1, size: 4, sort: ["userId"], totalPages: 1, totalElements: 0
  })
  const tableColumns = userTableColumns
  const [usersData, setUsersData] = React.useState<UserDTO[]>([])
  
  React.useEffect(() => {
    fetchAllUsers()
  }, [pageable.page])

  /* FETCH USERS */
  async function fetchAllUsers(){
    setUsersData([])
    setIsLoading(true)

    const response: any = await getAllUsersAction(pageable, await getToken())        
    
    if(response.content){      
      setUsersData(response.content)
      setPageable({ ...pageable, totalPages: response.totalPages, totalElements: response.totalElements })
      setIsLoading(false)
    }
    else if(Number.isInteger(response.status)){
      toast.error(response.status + ": " + response.title?.toLocaleLowerCase())
      setIsLoading(false)
    } 
    else {
      toast.error(response.statusCode + ": " + response.message)
      setIsLoading(false)
    }
  }

  /* PAGEABLE OPTION */
  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        {pageable.totalElements !== 0 &&
          <span className="w-[30%] text-small text-default-400">
            showing {(pageable.page * pageable.size) - pageable.size + 1} to {pageable.page === pageable.totalPages ? pageable.totalElements : pageable.page * pageable.size} of {pageable.totalElements} entries
          </span>
        }
        
        <Pagination isCompact showControls
                    showShadow color="success"
                    page={pageable.page} total={pageable.totalPages}
                    onChange={(page) => setPageable({ ...pageable, page: page})}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button isDisabled={pageable.page === 1} size="sm" variant="flat" onPress={() => onPreviousPage}>
            Previous
          </Button>
          <Button isDisabled={pageable.page === pageable.totalPages} size="sm" variant="flat" onPress={() => onNextPage}>
            Next
          </Button>
        </div>
      </div>
    )
  }, [pageable.page, pageable.totalPages, pageable.totalElements])

  const onNextPage = React.useCallback(() => {
    setPageable({...pageable, page: pageable.page + 1})
  }, [pageable.page])

  const onPreviousPage = React.useCallback(() => {
    setPageable({...pageable, page: pageable.page - 1})
  }, [pageable.page])


  /* FORM FIELDS */
  const [userId, setUserId] = React.useState<string>("")
  const [userStatus, setUserStatus] = React.useState<string>("")

  /* UPDATE USER STATUS */
  async function updateStatus(){
    if(userId === "") toast.error("400: user id is required")
    else if(userStatus === "") toast.error("400: status is required")
    else{
      if(userStatus === "true") activateUser()
      else if(userStatus === "false") deactivateUser()
      else toast.error("400: bad required")
    }
  }

  /* ACTIVATE USER */
  async function activateUser(){
    const response: ResponseMessage = await activateUserAction(userId, await getToken())
    
    if (response.statusCode === 200) {
      setUserId("")
      fetchAllUsers()
      toast.success(response.message)
    }
    else if(Number.isInteger(response.status)){
      toast.error(response.status + ": " + response.title?.toLocaleLowerCase())
    } else {
      toast.error(response.statusCode + ": " + response.message)
    }
  }

  /* DEACTIVATE USER */
  async function deactivateUser(){
    const response: ResponseMessage = await deactivateUserAction(userId, await getToken())
    
    if (response.statusCode === 200) {
      setUserId("")
      fetchAllUsers()
      toast.success(response.message)
    }
    else if(Number.isInteger(response.status)){
      toast.error(response.status + ": " + response.title?.toLocaleLowerCase())
    } else {
      toast.error(response.statusCode + ": " + response.message)
    }
  }

  return (
    <div className='dashboard-style'>
      {/* USER INFO TABLE */}
      <div className='flex justify-between mb-4'>
        <h1 className='font-semibold text-xl text-zinc-900'>SITE INFORMATION</h1>

        <section className='flex gap-4'>
          <Button type="submit" color="default" className='button-style-1' onClick={fetchAllUsers}
              startContent={<FontAwesomeIcon icon={faRetweet} />}>
                Refetch
          </Button>
          </section>
      </div>
        
      {/* USER INFO TABLE */}
      <Table bottomContent={bottomContent}>
        <TableHeader>
          {tableColumns.map((column) =>
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody  emptyContent={" "}
                    isLoading={isLoading}
                    loadingContent={<h1>Loading...</h1>}>
          {usersData.map((row) =>
            <TableRow key={row.userId}>
              {(columnKey) => columnKey == 'isActive' ? (
                  <TableCell>
                    {row.isActive === true && <h1 className='status-green-style'>Active</h1>}
                    {row.isActive === false && <h1 className='status-red-style'>Deactive</h1>}
                  </TableCell>
                ) : (
                  <TableCell>{getKeyValue(row, columnKey)}</TableCell>
                )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* CHANGE USER STATUS */}
      <div className='flex justify-between mb-4 mt-6'>
        <h1 className='font-semibold text-xl text-zinc-900'>CHANGE USER STATUS</h1>

        <section className='flex gap-4'>
          <Button type="submit" color="default" className='button-style-1' onClick={updateStatus}
              startContent={<FontAwesomeIcon icon={faPen} />}>
                Update Status
          </Button>
          <Button type="submit" color="default" className='button-style-1' onClick={() => setUserId("")}
              startContent={<FontAwesomeIcon icon={faEraser} />}>
                Clear Form
          </Button>
          </section>
      </div>

      {/* STATUS FORM */}
      <div className='grid grid-cols-2 gap-x-4'>
          <section>
            <Input  type="number" label="User ID" value={userId} min={1}
                    variant="bordered" className="input-style" 
                    onChange={(e) => setUserId(e.target.value)}
            />
          </section>

          <section>
            <Select label="User Status" className="input-style" value={userStatus}
                    onChange={(e) => setUserStatus(e.target.value)}
            >
              {userStatusData.map((status) => (
                <SelectItem className="input-style" key={status.key} value={status.key}>
                  {status.label}
                </SelectItem>
              ))}
            </Select>
          </section>
      </div>
    </div>
  )
}
