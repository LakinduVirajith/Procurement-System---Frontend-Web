/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React from 'react'
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRetweet, faTrash, faEraser } from '@fortawesome/free-solid-svg-icons'
import { siteTableColumns } from '@/lib/siteDetailsData'
import { getAccessToken } from '@/lib/tokenService'
import { getAllSitesInfoAction } from '@/server/_getAllSitesInfoAction'
import { Button, Input } from '@nextui-org/react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, Pagination } from '@nextui-org/react'

export default function SiteInfo() {
  /* GET ALL SITES */
  const [isLoading, setIsLoading] = React.useState(true);
  const [pageable, setPageable] = React.useState<Pageable>({
    page: 1, size: 4, sort: ["siteId"], totalPages: 1, totalElements: 0
  });
  const tableColumns = siteTableColumns
  const [sitesData, setSitesData] = React.useState<SiteDTO[]>([])

  React.useEffect(() => {
    fetchAllSites()
  }, [pageable.page]);

  /* FETCH SITES */
  async function fetchAllSites(){
    setSitesData([])
    setIsLoading(true)

    const response: any = await getAllSitesInfoAction(pageable, getAccessToken())        
    
    if(response.content){      
      setSitesData(response.content)
      setPageable({ ...pageable, totalPages: response.totalPages, totalElements: response.totalElements })
      setIsLoading(false)
    }
    else if(Number.isInteger(response.status)){
      toast.error(response.status + ": " + response.title?.toLocaleLowerCase());
      setIsLoading(false)
    } 
    else {
      toast.error(response.statusCode + ": " + response.message);
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
    );
  }, [pageable.page, pageable.totalPages, pageable.totalElements]);

  const onNextPage = React.useCallback(() => {
    setPageable({...pageable, page: pageable.page + 1})
  }, [pageable.page]);

  const onPreviousPage = React.useCallback(() => {
    setPageable({...pageable, page: pageable.page - 1})
  }, [pageable.page]);

  /* FORM FIELDS */
  const [siteId, setSiteId] = React.useState<string>("");

  /* UPDATE USER STATUS */
  async function deleteSiteHandler(){
    if(siteId === "") toast.error("400: site id is required")
    else {
    }
  }

  return (
    <div className='dashboard-style'>
    {/* SITE INFO TABLE */}
    <div className='flex justify-between mb-4'>
      <h1 className='font-semibold text-xl text-zinc-900'>SITE INFORMATION</h1>

      <section className='flex gap-4'>
        <Button type="submit" color="default" className='button-style-1' onClick={fetchAllSites}
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
        {sitesData.map((row) =>
          <TableRow key={row.siteId}>
            {(columnKey) => (columnKey === 'procurementManagerId' || columnKey === 'startDate') ? (
                  <TableCell>
                    {columnKey === 'procurementManagerId' && row.procurementManagerId === null && <h1 className='status-red-style'>null</h1>}
                    {columnKey === 'procurementManagerId' && row.procurementManagerId !== null && <h1 className='status-red-style'>{row.procurementManagerId}</h1>}
                    {columnKey === 'startDate' && <h1>{row.startDate.substring(0, 10)}</h1>}
                  </TableCell>
                ) : (
                  <TableCell>{getKeyValue(row, columnKey)}</TableCell>
              )}
          </TableRow>
        )}
      </TableBody>
    </Table>

    {/* DELETE SITE */}
    <div className='flex justify-between mb-4 mt-6'>
        <h1 className='font-semibold text-xl text-zinc-900'>DELETE SITE INFO</h1>

        <section className='flex gap-4'>
          <Button type="submit" color="default" className='button-style-1' onClick={deleteSiteHandler}
              startContent={<FontAwesomeIcon icon={faTrash} />}>
                Delete
          </Button>
          <Button type="submit" color="default" className='button-style-1' onClick={() => setSiteId("")}
              startContent={<FontAwesomeIcon icon={faEraser} />}>
                Clear ID
          </Button>
          </section>
      </div>

      <div className='grid grid-cols-1 gap-x-4'>
        <section>
            <Input  type="number" label="Site ID" value={siteId} min={1}
                      variant="bordered" className="input-style" 
                      onChange={(e) => setSiteId(e.target.value)}
              />
          </section>
      </div>
  </div>
  )
}
