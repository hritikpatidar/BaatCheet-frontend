import { Mail, Lock, EyeOff, Eye } from "lucide-react";
import { LoginFormValidation } from "../../Utils/validation";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { setLanguage } from "../../Redux/features/Language/languageSlice";
import toast from "react-hot-toast";
import { loginFormData, profileDetails } from "../../Redux/features/adminAuth/authSlice";
import { setItemLocalStorage } from "../../Utils/browserServices";
import { jwtDecode } from "jwt-decode";
import { apple, facebook, google } from "../../assets";

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = useState(false);
  const [loginFormDetails, setLoginFormDetails] = useState({
    email: "",
    password: "",
  });

  const [errorMessages, setErrorMessages] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);


  const toggleShowPassword = (e) => {
    setShowPassword((prevState) => !prevState);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newData = { [name]: value };

    setLoginFormDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));

    const { errors } = LoginFormValidation(newData, t);
    setErrorMessages({
      ...errorMessages,
      ...errors,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const { errors, isValid } = LoginFormValidation(loginFormDetails, t);
    setErrorMessages({
      ...errorMessages,
      ...errors,
    });
    if (!isValid) return;
    setLoading(true);
    try {
      const response = await dispatch(loginFormData(loginFormDetails));
      if (response?.payload?.status === true) {
        toast.success(response?.payload?.message);
        const decodedToken = jwtDecode(response?.payload?.token);
        setItemLocalStorage("userRole", "User");
        setItemLocalStorage("token", response?.payload?.token);
        await dispatch(profileDetails());
        navigate("/");
      } else {
        toast.error(
          response.payload?.message || "Email or Password Does Not Exist"
        );
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 font-sans px-4">
      <div className="bg-white w-full max-w-xl p-8 rounded-2xl shadow-md border border-gray-300">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Welcome Back 👋</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Email */}
          <div className="relative col-span-2">
            <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400`} />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={loginFormDetails?.email}
              onChange={handleChange}
              className={`w-full pl-10 pr-3 py-2 ${errorMessages?.email ? "border border-red-500" : "border border-gray-300"}  rounded-md bg-gray-50 text-sm text-gray-800 focus:outline-none`}
            />
          </div>

          {/* Password */}
          <div className="relative col-span-2">
            <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400`} />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              value={loginFormDetails?.password}
              onChange={handleChange}
              className={`w-full pl-10 pr-10 py-2 ${errorMessages?.password ? "border border-red-500" : "border border-gray-300"} rounded-md bg-gray-50 text-sm text-gray-800 focus:outline-none`}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <button
            type="submit"
            className="col-span-2 md:col-span-2 w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 rounded-md transition duration-200"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Divider & Social Buttons */}
          <div className="mb-6 col-span-2 ">
            <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
              <hr className="flex-grow border-gray-300" />
              <span className="mx-2">or sign up with</span>
              <hr className="flex-grow border-gray-300" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center w-full py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
              >
                <img src={google} alt="Google" className="h-5 w-5 mr-2" />
                <span className="text-sm text-gray-700 font-medium">Google</span>
              </button>

              <button
                type="button"
                className="flex items-center justify-center w-full py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
              >
                <img src={apple} alt="Apple" className="h-5 w-5 mr-2" />
                <span className="text-sm text-gray-700 font-medium">Apple</span>
              </button>
            </div>
          </div>
        </form>

        {/* Divider */}
        <div className="mb-6 flex items-center justify-between text-sm text-gray-500">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/sign-up")}
            className="text-gray-700 font-semibold hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
