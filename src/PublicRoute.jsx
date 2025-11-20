import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { isLogin } from './Utils/Auth'
import { useEffect } from 'react';
import { logo1 } from './assets';

export const PublicRoute = () => {
  const adminLogin = isLogin()
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      {(!adminLogin) ? (
        <>
          {/* Fixed Transparent Header */}
          <header
            className="fixed top-0 left-0 w-full 
    bg-gray-100 dark:bg-gray-900 
    md:bg-transparent md:dark:bg-transparent
    backdrop-blur-sm
    py-2 px-4 z-10 transition-colors duration-300"
          >
            <a
              href="/"
              className="projectName flex items-center space-x-1 font-semibold 
      text-gray-800 dark:text-gray-200 
      hover:text-blue-600 dark:hover:text-blue-400 
      transition-colors"
            >
              <span className="text-teal-600 dark:text-teal-400 text-xl sm:text-xl md:text-3xl">
                Baat
              </span>

              <span className="text-gray-800 dark:text-gray-200 text-lg sm:text-xl md:text-2xl">
                Cheet
              </span>
            </a>
          </header>

          <Outlet />
        </>
      ) : (
        <Navigate replace to="/" />
      )}
    </>
  )
}
