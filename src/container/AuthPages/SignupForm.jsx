import { useState } from 'react';
import { Mail, Lock, User, Calendar, UserCheck, EyeOff, Eye, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { google, facebook, apple } from "../../assets";
import { SignUpFormValidation } from '../../Utils/validation';
import PhoneInput from 'react-phone-input-2';
import "react-phone-input-2/lib/style.css";
import { handleVerifyOtpService, SignupService } from '../../Services/AdminServices';
import toast from 'react-hot-toast';
import OtpInput from "react-otp-input";
import { setItemLocalStorage } from '../../Utils/browserServices';

export const SignupForm = () => {
    const navigate = useNavigate()
    const [formDetails, setFormDetails] = useState({
        name: "",
        user_name: "",
        email: "",
        phone_no: "",
        dob: "",
        gender: "",
        password: "",
        confirm_password: ""
    });
    const [showPassword, setShowPassword] = useState({
        password: false,
        confirm_password: false
    });

    const [errorMessages, setErrorMessages] = useState({});
    const [loading, setLoading] = useState(false);
    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpErrorMessage, setOtpErrorMessage] = useState("");
    const [resendCooldown, setResendCooldown] = useState(0);
    const [focusedInput, setFocusedInput] = useState(null);

    const handleChange = (e) => {
        let { name, value } = e.target;
        let newData;
        if (name === "password" && formDetails.confirm_password) {
            newData = {
                ...newData,
                [name]: value,
                ["confirm_password"]: formDetails.confirm_password,
            };
        } else if (name === "confirm_password") {
            newData = { ...newData, [name]: value, ["password"]: formDetails.password };
        } else if (name === "name") {
            const patterns = /^[A-Za-z\s]*$/; // Allows only letters and spaces
            if (patterns && !patterns.test(value)) {
                return;
            } else {
                newData = { [name]: value };
            }
        } else if (name === "user_name") {
            newData = { [name]: value.replace(/\s+/g, "") };
        } else {
            newData = { [name]: value };
        }

        setFormDetails((prevDetails) => ({
            ...prevDetails,
            ...newData,
        }));

        const { errors } = SignUpFormValidation(newData);
        setErrorMessages({
            ...errorMessages,
            ...errors,
        });
    };

    const handlePhoneChange = (value, country) => {
        const e = {
            target: {
                value: value,
                name: "phone_no",
            },
        };
        handleChange(e);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { errors, isValid } = SignUpFormValidation(formDetails);
        setErrorMessages({
            ...errorMessages,
            ...errors,
        });
        if (!isValid) return;
        try {
            setLoading(true);
            const payload = {
                name: formDetails?.name,
                user_name: formDetails?.user_name,
                email: formDetails?.email,
                phone_no: `+${formDetails?.phone_no}`,
                dob: formDetails?.dob,
                gender: formDetails?.gender,
                password: formDetails?.password,
            };
            const response = await SignupService(payload);
            if (response?.status === 200) {
                toast.success(response?.data?.message);
                setOtp("")
                setIsOtpModalOpen(true)
            } else {
                toast.error(response?.data?.message);
            }
        } catch (error) {
            console.error("error", error);
        } finally {
            setLoading(false);
        }
    }

    const handleVerifyOtp = async () => {
        if (!otp) {
            setOtpErrorMessage("Incorrect code, try again")
            return
        }
        if (otp.length < 4) return;
        try {
            setLoading(true)
            const payload = {
                email: formDetails?.email,
                otp: otp
            }
            const response = await handleVerifyOtpService(payload)
            if (response?.status === 200) {
                toast.success(response?.data?.message)
                setItemLocalStorage("token", response?.data?.token)
                navigate('/')
            } else {
                toast.success(response?.data?.message)
            }
        } catch (error) {
            console.error("error", error)
        } finally {
            setLoading(false)
        }
    };

    const handleResendOtp = () => {
        if (resendCooldown > 0) return;
        setResendCooldown(60);
        const timer = setInterval(() => {
            setResendCooldown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };


    const handleChangeOtp = (otp) => {
        if (otp.length < 4) setOtpErrorMessage("Incorrect code, try again")
        else setOtpErrorMessage("")
        setOtp(otp);
    };

    const handleInputFocus = (index) => {
        setFocusedInput(index);
    };

    const handleInputBlur = () => {
        setFocusedInput(null);
    };


    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 font-sans px-4 pt-12">
            <div className="bg-white w-full max-w-xl p-8 rounded-2xl shadow-md border border-gray-300">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                    Create Account 👤
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div className="relative col-span-2 md:col-span-1">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Full Name"
                            name="name"
                            value={formDetails?.name}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-3 py-2 ${errorMessages?.name ? "border border-red-500" : "border border-gray-300"} rounded-md bg-gray-50 text-sm text-gray-800 focus:outline-none`}
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
                            className={`w-full pl-10 pr-3 py-2 ${errorMessages?.user_name ? "border border-red-500" : "border border-gray-300"} rounded-md bg-gray-50 text-sm text-gray-800 focus:outline-none`}
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
                            className={`w-full pl-10 pr-3 py-2 ${errorMessages?.email ? "border border-red-500" : "border border-gray-300"} rounded-md bg-gray-50 text-sm text-gray-800 focus:outline-none`}
                        />
                    </div>

                    {/* Phone Number */}
                    <div className="relative col-span-2 md:col-span-1">
                        <PhoneInput
                            country={"gb"}
                            defaultCountry="gb"
                            value={formDetails.phone_no}
                            onChange={handlePhoneChange}
                            countryCodeEditable={false}
                            containerClass="input"
                            inputClass={` pl-10 pr-3 py-4.5 !w-full md:!w-[245px] ${errorMessages?.phone_no ? "!border !border-red-500" : "border border-gray-300"} rounded-lg bg-gray-50 text-sm text-gray-800 focus:outline-none`}
                            inputProps={{
                                placeholder: "Phone Number",
                            }}
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
                            className={`w-full pl-10 pr-3 py-2 ${errorMessages?.dob ? "!border !border-red-500" : "border border-gray-300"} rounded-md bg-gray-50 text-sm text-gray-800 focus:outline-none cursor-pointer`}
                        />
                    </div>

                    {/* Gender */}
                    <div className="relative col-span-2">
                        <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <select
                            name="gender"
                            value={formDetails?.gender}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-3 py-2 ${errorMessages?.gender ? "!border !border-red-500" : "border border-gray-300"} rounded-md bg-gray-50 text-sm text-gray-800 focus:outline-none cursor-pointer`}
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
                            type={showPassword.password ? "text" : "password"}
                            placeholder="Password"
                            name="password"
                            value={formDetails?.password}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-10 py-2 ${errorMessages?.password ? "!border !border-red-500" : "border border-gray-300"} rounded-md bg-gray-50 text-sm text-gray-800 focus:outline-none`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword({
                                password: !showPassword.password,
                                confirm_password: showPassword?.confirm_password
                            })}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                        >
                            {showPassword.password ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    {/*Confirm Password */}
                    <div className="relative col-span-2 md:col-span-1">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type={showPassword.confirm_password ? "text" : "password"}
                            placeholder="Confirm Password"
                            name="confirm_password"
                            value={formDetails?.confirm_password}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-10 py-2 ${errorMessages?.confirm_password ? "!border !border-red-500" : "border border-gray-300"} rounded-md bg-gray-50 text-sm text-gray-800 focus:outline-none`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword({
                                password: showPassword.password,
                                confirm_password: !showPassword?.confirm_password
                            })}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                        >
                            {showPassword?.confirm_password ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
                    Already have an account?{" "}
                    <button
                        onClick={() => navigate("/login")}
                        className="text-gray-700 font-semibold hover:underline"
                    >
                        Login
                    </button>
                </p>
            </div>

            {isOtpModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4 sm:px-0">
                    <div className="bg-gray-100 border border-gray-300 shadow-2xl rounded-xl w-full max-w-sm sm:max-w-md p-5 sm:p-6 transition-all duration-300">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                            Verify One‑Time Password
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 mb-6">
                            Please enter the OTP sent to your phone/email.
                        </p>

                        <div className="flex justify-center mb-6 space-x-2">
                            <OtpInput
                                value={otp}
                                onChange={handleChangeOtp}
                                numInputs={4}
                                shouldAutoFocus
                                inputType="tel"
                                containerStyle="flex justify-center space-x-2"
                                inputStyle="w-12 h-12 border rounded text-center text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                renderInput={(props, index) => (
                                    <input
                                        {...props}
                                        className={`!w-14 h-14 text-lg !text-gray-600 font-medium text-center rounded-md border ${otpErrorMessage ? "border-red-500" : "border-gray-300 focus:border-gray-300"
                                            } focus:outline-none focus:ring-2 focus:ring-gray-300 transition`}
                                        onFocus={() => handleInputFocus(index)}
                                        onBlur={handleInputBlur}
                                    />
                                )}
                            />
                        </div>

                        <div className="flex justify-between items-center mb-6">
                            <button
                                disabled={resendCooldown > 0}
                                onClick={handleResendOtp}
                                className={`text-sm text-indigo-600 hover:underline focus:outline-none ${resendCooldown > 0 ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                            >
                                {resendCooldown > 0
                                    ? `Resend OTP in ${resendCooldown}s`
                                    : "Resend OTP"}
                            </button>
                            <button
                                onClick={handleVerifyOtp}
                                disabled={loading || otp.length < 4}
                                className={`px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition ${loading || otp.length < 4
                                    ? "opacity-60 cursor-not-allowed"
                                    : ""
                                    }`}
                            >
                                {loading ? "Verifying..." : "Verify OTP"}
                            </button>
                        </div>

                        {/* <button
                            onClick={() => setIsOtpModalOpen(false)}
                            className="w-full text-center text-sm text-gray-600 hover:underline focus:outline-none"
                        >
                            Cancel
                        </button> */}
                    </div>
                </div>
            )}

        </div>
    );
}
