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
          <header className="fixed top-0 left-0 w-full bg-gray-100 md:bg-transparent py-2 px-4 z-10">
            <a
              href="/"
              className="projectName flex items-center space-x-1 font-semibold text-gray-800 hover:text-blue-600 transition-colors"
            >
              {/* <img
                src={logo1}
                alt="BlinkChat Logo"
                className="h-6 sm:h-8 md:h-10 lg:h-12 object-contain"
              /> */}
              <span className="text-teal-600 text-xl sm:text-xl md:text-3xl">Baat</span>
              <span className="text-gray-800 text-lg sm:text-xl md:text-2xl">Cheet</span>
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
