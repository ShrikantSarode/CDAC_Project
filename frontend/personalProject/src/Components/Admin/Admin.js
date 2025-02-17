import React from 'react'
import AdminHeader from './AdminHeader'
import { Outlet } from 'react-router-dom'

export default function Admin() {
  return (
    <>
      <AdminHeader/>
      <Outlet/>
      
    </>
  )
}
