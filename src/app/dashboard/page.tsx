import SideNav from '@/components/SideNav'
import React from 'react'

export default function Dashboard() {
  return (
    <div className="page-style flex-row p-0">
      <SideNav />
      <div className='w-full'>
        <h1>Dashboard</h1>
      </div>
    </div>
  )
}
