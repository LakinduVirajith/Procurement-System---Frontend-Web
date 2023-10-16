'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { getUserRole } from '@/services/tokenService'
import toast from 'react-hot-toast'

export default function UpdateItem() {
  const router = useRouter()

  /* UNAUTHORIZED */
  if(getUserRole() !== 'SITE_MANAGER'){
    toast.error('403: You are not authorized to access')
    router.push('/dashboard')
  }

  return (
    <div>UpdateItem</div>
  )
}
