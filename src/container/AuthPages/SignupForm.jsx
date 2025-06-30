import { useRef, useState } from 'react';
import { Mail, Lock, User, Calendar, UserCheck, EyeOff, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { google, facebook, apple } from "../../assets";


export const SignupForm = ({ handleSubmit, loading }) => {
    const navigate = useNavigate()
    const [formDetails, setFormDetails] = useState({
        name: "",
        user_name: "",
        email: "",
        phone_no: "",
        dob: "",
        gender: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newData = { [name]: value }

        setFormDetails(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 font-sans px-4 pt-12">
            <div className="bg-white w-full max-w-xl p-8 rounded-2xl shadow-md border border-gray-300">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                    Create Account 👤
                </h2>

                <form onSubmit={handleSubmit} autoComplete="off" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="relative col-span-2 md:col-span-1">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Full Name"
                            name="name"
                            value={formDetails?.name}
                            onChange={handleChange}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                    </div>

                    {/* Username */}
                    <div className="relative col-span-2 md:col-span-1">
                        <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Username"
                            name="user_name"
                            value={formDetails?.user_name}
                            onChange={handleChange}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                    </div>

                    {/* Email */}
                    <div className="relative col-span-2">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={formDetails?.email}
                            onChange={handleChange}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                    </div>

                    {/* Phone Number */}
                    <div className="relative col-span-2 md:col-span-1">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            name="phone_no"
                            value={formDetails?.phone_no}
                            onChange={handleChange}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                    </div>

                    {/* Date of Birth */}
                    <div className="relative col-span-2 md:col-span-1">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="date"
                            name="dob"
                            value={formDetails?.dob}
                            onChange={handleChange}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer"
                        />
                    </div>

                    {/* Gender */}
                    <div className="relative col-span-2 md:col-span-1">
                        <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <select
                            name="gender"
                            value={formDetails?.gender}
                            onChange={handleChange}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer"
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* Password */}
                    <div className="relative col-span-2 md:col-span-1">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            name="password"
                            value={formDetails?.password}
                            onChange={handleChange}
                            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Sign Up Button spans full width */}
                    <button
                        type="submit"
                        className="col-span-2 md:col-span-2 w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 rounded-md transition duration-200"
                        disabled={loading}
                    >
                        {loading ? "Signing up..." : "Sign Up"}
                    </button>
                    {/* Divider & Social Buttons */}
                    <div className="mb-6 col-span-2 ">
                        <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
                            <hr className="flex-grow border-gray-300" />
                            <span className="mx-2">or sign up with</span>
                            <hr className="flex-grow border-gray-300" />
                        </div>
                        <div className="flex flex-col space-y-3">
                            {/* Google */}
                            <button
                                type="button"
                                // onClick={handleGoogleSignup}
                                className="flex items-center justify-center w-full py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
                            >
                                <img src={google} alt="Google" className="h-5 w-5 mr-2" />
                                <span className="text-sm text-gray-700 font-medium">Sign up with Google</span>
                            </button>

                            {/* Apple */}
                            <button
                                type="button"
                                // onClick={handleAppleSignup}
                                className="flex items-center justify-center w-full py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
                            >
                                <img src={apple} alt="Apple" className="h-5 w-5 mr-2" />
                                <span className="text-sm text-gray-700 font-medium">Sign up with Apple</span>
                            </button>

                            {/* Facebook */}
                            {/* <button
                                type="button"
                                // onClick={handleFacebookSignup}
                                className="flex items-center justify-center w-full py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
                            >
                                <img src={facebook} alt="Facebook" className="h-5 w-5 mr-2" />
                                <span className="text-sm text-gray-700 font-medium">Sign up with Facebook</span>
                            </button> */}
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
                    Already have an account?{" "}
                    <button
                        onClick={() => navigate("/login")}
                        className="text-gray-700 font-semibold hover:underline"
                    >
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
}
