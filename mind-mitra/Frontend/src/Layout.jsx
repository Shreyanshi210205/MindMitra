import { Outlet } from 'react-router-dom';
import NavBar from './components/NavBar';
import gsap from 'gsap';

import { Toaster } from 'react-hot-toast';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP);
const Layout = () => {
  return (
    <>
      <NavBar />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <Outlet />
      <Footer></Footer>
    </>
  );
};

export default Layout;
