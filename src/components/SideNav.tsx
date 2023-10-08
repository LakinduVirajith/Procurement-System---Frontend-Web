'use client'
import { getUserRole, removeAccessToken, removeRefreshToken, removeUserRole } from '@/lib/tokenService'
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image';

export default function SideNav() {
    const router = useRouter()
    const userRole = getUserRole()

    function logout(){
        removeAccessToken()
        removeRefreshToken()
        removeUserRole()

        router.push('/login')
    }

    return (
        <aside className='h-screen'>
            <nav className='h-full flex flex-col bg-white border-r shadow-sm'>
                <div className='p-4 pb-2 flex justify-between items-center'>
                    <Image
                        src="/images/logo-with-name.png"
                        width={120} height={120} alt={'logo'}
                    />
                    <button className='p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100'>
                        <FontAwesomeIcon icon={faAngleLeft} />
                    </button>
                </div>

                <ul className='flex-1 px-3'>
                    <li>User
                        <li>User Details</li> {/* Reset Password */}
                        <li>Assign User</li>
                        <li>User Status</li>  {/* active / deactive / allocate site / deaclocate*/}
                    </li>
                    

                    <li>Site
                        <li>Create Site</li>
                        <li>Update Site</li>
                        <li>Site Informations</li> {/* Delete site */}
                    </li>
                    

                    <li>procurement
                        <li>Assign supplier</li>
                        <li>Order Approval</li> {/* Approve / Cancel*/}
                    </li>
                </ul>

                <div className='border-t flex p-3'>
                    <Image
                        src="/images/user-image.png"
                        width={64} height={64} alt={'user'}
                        className='rounded-full'
                    />
                    <div className='flex justify-between items-center w-52 ml-3'>
                        <div className='leading-4'>
                            <h4 className='font-semibold text-sm'>{userRole}</h4>
                            <span className='text-xs text-gray-600'>lakinduvirajith@gmail.com</span>
                        </div>
                    </div>
                </div>
                <div className='mx-3 mb-3'>
                    <button className='button-style-1' onClick={logout}>LogOut</button>
                </div>
            </nav>
            
        </aside>
    )
}
