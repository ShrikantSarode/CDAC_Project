import React from 'react'
import StaffHeader from './StaffHeader'
import { Outlet } from 'react-router-dom'

export default function Staff() {
  return (
   <>
    <StaffHeader/>
    <Outlet/>
   </>
  )
}
