import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router-dom";
import router from './routes/Routes.jsx';
import AOS from 'aos';
import 'aos/dist/aos.css';
AOS.init();
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import AuthProvider from './providers/AuthProvider.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
