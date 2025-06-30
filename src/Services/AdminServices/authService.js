import getUrl from "../../config";
import httpServices from "../httpServices";

export const LoginService = (payload) => {
    return httpServices.post(`${getUrl()}/login`, payload);
}

export const SignupService = (payload) => {
    return httpServices.post(`${getUrl()}/signup`, payload);
}

export const resendOTPService = (payload) => {
    return httpServices.post(`${getUrl()}/resend-otp`, payload)
}

export const profileDetailsService = () => {
    return httpServices.get(`${getUrl()}/profile`);
}

export const metchPasswordService = (payload) => {
    return httpServices.post(`${getUrl()}/check-password`, payload)
}

export const resetPasswordService = (payload) => {
    return httpServices.post(`${getUrl()}/reset-password`, payload)
}

export const profileUpdateService = (payload) => {
    return httpServices.put(`${getUrl()}/profile-update`, payload)
}

export const handleSendOtpService = (payload) => {
    return httpServices.post(`${getUrl()}/forget-password`, payload)
}

export const handleVerifyOtpService = (payload) => {
    return httpServices.post(`${getUrl()}/verify-otp`, payload)
}



