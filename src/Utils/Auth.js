import { getImageUrl } from "../Services/ChatServices/chatServices"
import { getItemLocalStorage } from "./browserServices"

export const isLogin = () => {
    const token = getItemLocalStorage("token")
    if (token) return true
    else return false
}

export const statusColors = {
    Open: { color: "text-[#496677]", label: "Open" },
    In_Process: { color: "text-[#9FB2CD]", label: "In Process" },
    Resolved: { color: "text-[#ABAC5A]", label: "Resolved" },
};

export const detectURLs = (message) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return message.split(urlRegex);
};

export const isValidURL = (string) => {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
};

export const checkIfImage = (filePath) => {
    const imageRegex =
        /\.(jpg|jpeg|png|gif|bmp|webp|svg|ico|heic|heif||jfif)$/i;
    return imageRegex.test(filePath);
};

export const isLink = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/gi;
    return urlRegex.test(text);
};

export const base64ToFile = (base64Data, fileName) => {
    const arr = base64Data.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
};


const convertBlobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export const getImage = async (fileUrl) => {
    if (!fileUrl) return null;
    try {
        const response = await getImageUrl(fileUrl);
        // const contentType = response.headers['content-type'] || 'image/png';
        // const blob = new Blob([response.data], { type: contentType });
        // console.log("blob", blob)
        // const base64 = await convertBlobToBase64(blob);
        // return base64; // ready to use in <img src={...} />
        return response.data; 
    } catch (error) {
        console.error("Error fetching image:", error);
        return null; // Handle error gracefully
    }
}