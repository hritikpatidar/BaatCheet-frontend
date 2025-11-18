import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { isLogin } from "./Utils/Auth";
import { useDispatch } from "react-redux";
import MainHeader from "./components/MainHeader";

export const PrivateRoute = () => {
  const adminLogin = isLogin();
  const location = useLocation();
  const dispatch = useDispatch();
  const pathname = location?.pathname;
  const navigate = useNavigate();

  // useEffect(() => {
  //   window.scrollTo({ top: 0, behavior: "auto" });
  //   dispatch(setSearchValue(""));
  // }, [pathname]);

  return (
    <>
      {adminLogin ? (
        <>
          {(pathname !== "/chat" && pathname !== "/ai-chat") && <MainHeader />}
          <Outlet />
        </>
      ) : (
        <Navigate to={"/login"} />
      )}
    </>
  );
};
