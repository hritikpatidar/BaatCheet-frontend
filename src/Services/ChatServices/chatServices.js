import getUrl from "../../config";
import httpServices from "../httpServices";

export const getUserListService = (role) => {
    return httpServices.get(`${getUrl()}/user-list?role=${role}`);
}

export const uploadFileService = (payload) => {
    return httpServices.post(`/user/upload-img`, payload);
};

export const getDownloadBufferFile = (payload) => {
    return httpServices.post(`/user/download-file`, payload);
}

export const createConversationService = (payload) => {
    return httpServices.post(`${getUrl()}/create-conversation`, payload);
}

export const getConversationService = () => {
    return httpServices.get(`${getUrl()}/get-conversations`);
}

export const getaudioUrl = (url) => {
    return httpServices.get(`${getUrl()}/view-audio/${url}`);
}

export const getImageUrl = (url) => {
    return httpServices.get(`${getUrl()}/view-image/${url}`);
}

export const createGroupService = (data) => {
    return httpServices.post(`${getUrl()}/create-group`, data);
}

export const groupInviteAcceptAndReject = (data) => {
    return httpServices.get(`${getUrl()}/accept-or-decline-group-request?group_id=${data?._id}&status=${data?.type}`);
}