'use client'
import { getUserRole } from "@/lib/tokenService"
import { useRouter } from "next/navigation"

const userData = {
  userRole: getUserRole(),
};

export default function Dashboard() {
  const router = useRouter()

  if(userData.userRole === 'ADMIN'){
    router.push("/dashboard/user/create")
  }else if(userData.userRole === 'SITE_MANAGER'){
    router.push("/dashboard/procurement/approval")
  }else{
    router.push("/login")
  }
  
  return (
    <>
    </>
  )
}
