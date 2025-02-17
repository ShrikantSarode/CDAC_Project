import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import projectrouter from './projectrouter';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

 
 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={projectrouter}/>
);

 