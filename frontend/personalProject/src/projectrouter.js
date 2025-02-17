import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Admin from "./Components/Admin/Admin";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import Home from "./Components/Home";
import About from "./Components/About";
import Contact from "./Components/Contact";
import StaffManagement from "./Components/Admin/StaffManagement";
import Login from "./Components/Login";
import AdminLogin from "./Components/AdminLogin";
import StaffLogin from "./Components/StaffLogin";
import AppointmentManagement from "./Components/Admin/AppointmentManagement";
import Staff from "./Components/Staff/Staff";
import Dashboard from "./Components/Staff/Dashboard";
import AppointmentStaff from "./Components/Staff/AppointmentStaff";
import ServiceManagement from "./Components/Admin/ServiceManagement";
import StaffProfile from "./Components/Staff/StaffProfile";
import AssignServices from "./Components/Admin/AssignServices";
import User from "./Components/User/User";
import MyAppointment from "./Components/User/MyAppointment";
import FavoriteService from "./Components/User/FavoriteService";
 
import SignUp from "./Components/SignUp";
import ForgetPassword from "./ForgetPassword";
import Payment from "./Components/Staff/Payment";
import AdminSignUp from "./Components/AdminSignUp";
import StaffSignUp from "./Components/StaffSignUp";
import Profile from "./Components/User/Profile";
import UserOrders from "./Components/User/UserOrders";
 
 

const projectrouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "/login",
        element: <Login />,
      },

      {
        path: "/admin-login",
        element: <AdminLogin />,
      },
      {
        path: "/staff-login",
        element: <StaffLogin />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/admin-signup",
        element: <AdminSignUp />,
      },
      {
        path: "/staff-signup",
        element: <StaffSignUp />,
      },
      {
        path: "/forgot-password",
        element: <ForgetPassword />,
      },
    ],
  },
  {
    path: "admin",
    element: <Admin />,
    children: [
      {
        path: "staff-management",
        element: <StaffManagement />,
      },
      {
        path: "services-management",
        element: <ServiceManagement />,
      },
      {
        path: "appointments-management",
        element: <AppointmentManagement />,
      },
      {
        path: "admin-dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "admin-assign",
        element: <AssignServices />,
      },
    ],
  },

  {
    path: "staff",
    element: <Staff />,
    children: [
      {
        path: "staff-dashboard",
        element: <Dashboard />,
      },
      {
        path: "staff-appointments",
        element: <AppointmentStaff />,
      },
      {
        path: "staff-profile",
        element: <StaffProfile />,
      },
      {
        path: "staff-payment",
        element: <Payment />,
      },
    ],
  },
  {
    path: "user",
    element: <User />,
    children: [
      {
        path: "user-fav",
        element: <FavoriteService />,
      },
      {
        path: "user-appointment",
        element: <MyAppointment />,
      },
      {
        path: "user-profile",
        element: <Profile />,
      },
      {
        path: "user-order",
        element: <UserOrders />,
      },
    ],
  },
]);

export default projectrouter;
