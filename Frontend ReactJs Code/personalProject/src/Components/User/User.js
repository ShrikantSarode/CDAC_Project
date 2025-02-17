import React from "react";
import UserHeader from "./UserHeader";
import { Outlet } from "react-router-dom";

export default function User() {
  return (
    <>
      <UserHeader />
      <Outlet />
    </>
  );
}
