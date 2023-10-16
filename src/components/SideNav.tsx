'use client'
import React from 'react'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { getToken, getUserName, getUserRole, removeAccessToken, removeRefreshToken, removeUserRole } from '@/services/tokenService'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleDown, faBars } from '@fortawesome/free-solid-svg-icons'
import { sideNavData } from '../lib/sideNavData'
import { Button } from '@nextui-org/react'
import { logoutAction } from '@/server/_logoutAction'

const userData = {
    userName: getUserName(),
    userRole: getUserRole(),
}

export default function SideNav() {
    const router = useRouter()

    const [showSubMenu, setShowSubMenu] = React.useState(false)
    const [selectedMenu, setSelectedMenu] = React.useState('')

    const toggleSubMenu = (item: any) => {
        if(item.access !== userData.userRole){
            toast.error("403: You are not authorized to access")
        }else{
            if (selectedMenu === item.menu) {           
                setShowSubMenu(!showSubMenu)
                setSelectedMenu('')
              } else {
                setShowSubMenu(true)
                setSelectedMenu(item.menu)
              }  
        }  
    }

    const getMenuClassName = (menu: string) => {
        if (selectedMenu === menu) {
          return 'selected-menu'
        }
    }

    const handleNavigation = (route: string) => {
        router.push(route)
    }

    async function logout(){
        const response: ResponseMessage = await logoutAction(await getToken())

        if (response.statusCode === 200) {
            toast.success(response.message)
            removeAccessToken()
            removeRefreshToken()
            removeUserRole()

            router.push('/login')
        } 
        else if(Number.isInteger(response.status)){
            toast.error(response.status + ": " + response.title?.toLocaleLowerCase())
        }else {
            toast.error(response.statusCode + ": " + response.message)
        }
    }

    return (
        <aside className='h-screen'>
            <nav className='h-full flex flex-col bg-white border-r shadow-sm'>
                {/* SECTION 1 */}
                <div className='p-4 pb-4 flex justify-between items-center gap-4'>
                    <Image
                        src="/images/logo-with-name.png"
                        width={160} height={160} alt={'logo'}
                    />
                    <button className='p-1 rounded-md bg-gray-100 hover:bg-gray-200'>
                        <FontAwesomeIcon icon={faBars} className='h-4 text-black'/>
                    </button>
                </div>

                {/* SECTION 2 */}
                <ul className="flex-1 px-3">
                    {sideNavData.map((item) => (
                        <div key={item.menu}>
                            <div className={`menu-style ${getMenuClassName(item.menu)} hover:bg-zinc-100`}
                                 onClick={() => toggleSubMenu(item)}
                            >
                                <div className="flex items-center">
                                    <div className="w-7 flex justify-start">
                                        <FontAwesomeIcon icon={item.icon} className='h-4'/>
                                    </div>
                                    <li>{item.label}</li>
                                </div>
                                {showSubMenu && selectedMenu === item.menu ? (
                                    <FontAwesomeIcon icon={faAngleDown} className='h-4'/>
                                ) : (
                                    <FontAwesomeIcon icon={faAngleLeft} className='h-4'/>
                                )}
                            </div>

                            {/* SUB MENU */}
                            {showSubMenu && selectedMenu === item.menu && (
                                <div className='flex pl-3 gap-3 pt-1'>
                                    <div className='bg-zinc-900 rounded-md w-1'></div>
                                    <ul className='flex flex-col w-full'>
                                        {item.submenu.map((submenu) => (
                                            <li className="list-style hover:bg-zinc-100"
                                                key={submenu.label}
                                                onClick={() => handleNavigation(submenu.route)}
                                            >
                                            {submenu.label}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </ul>

                {/* SECTION 3 */}
                <div className='border-t flex p-3'>
                    <Image
                        src="/images/user-image.png"
                        width={45} height={45} alt={'user'}
                        className='rounded-full'
                    />
                    <div className='flex justify-between items-center w-52 ml-3 mr-4'>
                        <div className='leading-4'>
                            <h4 className='font-semibold text-sm'>{userData.userRole}</h4>
                            <span className='text-xs text-gray-600'>{userData.userName}</span>
                        </div>
                    </div>
                </div>

                {/* SECTION 4 */}
                <div className='mx-3 mb-3'>
                    <Button onClick={logout} color="default" className='button-style-1 w-full'>Logout</Button>
                </div>
            </nav>
        </aside>
    )
}
