'use client'
import { getUserRole } from '@/services/tokenService'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const userData = {
  userRole: getUserRole(),
}

export default function Dashboard() {
  const router = useRouter()

  if(userData.userRole === 'ADMIN'){
    router.push("/dashboard/user/create")
  }else if(userData.userRole === 'PROCUREMENT_MANAGER'){
    router.push("/dashboard/procurement/approval")
  }else{
    toast.error('403: You are not authorized to access')
    router.push("/login")
  }
  
  return (
    <>
    </>
  )
}
