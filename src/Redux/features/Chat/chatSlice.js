import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createGroupService, getUserListService, groupInviteAcceptAndReject } from "../../../Services/ChatServices";

// Initial state
const initialState = {
  userList: [],//userList ke liye
  singleConversationList: [], // conversationList ke liye
  groupConversationList: [], // conversationList ke liye
  selectedChatType: "single", // selectedChatType ke liye (individual/group)
  selectedUser: null, // selectChatUSer ke liye
  ChatMessages: [],
  onlineStatus: [],
  isTyping: [],
  selectedFiles: [], // selectedFile ke liye
  isUploading: false,
  isDownloading: false,
  fileUploadProgress: 0,
  fileDownloadProgress: 0,
  viewImages: [],
  loading: false,
  error: null,
  isFirstLoad: true,
  isUserDetails: false,
  filesList: [],
  linksList: [],
  groupCreateLoading: false,
  inviteUserLoading:false
};

export const getUserList = createAsyncThunk(
  "chat/getUserList",
  async (role) => {
    const response = await getUserListService(role);
    return response.data || [];
  }
);

export const createGroup = createAsyncThunk(
  "chat/createGroup",
  async (data) => {
    const response = await createGroupService(data);
    return response.data || [];
  }
);

export const acceptAndRejectInvite = createAsyncThunk(
  "chat/acceptAndReject",
  async (data) => {
    const response = await groupInviteAcceptAndReject(data);
    return response.data || [];
  }
);


// Create chat slice using createSlice
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setUserList: (state, action) => {
      state.userList = action.payload
    },
    setSelectUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setSelectedChatType: (state, action) => {
      state.selectedChatType = action.payload;
    },
    setSingleConversationList: (state, action) => {
      state.singleConversationList = action.payload;
    },
    setGroupConversationList: (state, action) => {
      state.groupConversationList = action.payload;
    },
    setNewGroupConversation: (state, action) => {
      const newGroup = action.payload;
      state.groupConversationList = [newGroup, ...state.groupConversationList];
    },
    setGroupCreateLoading: (state, action) => {
      state.groupCreateLoading = action.payload;
    },
    setInviteUserLoading :(state, action)=>{
      state.inviteUserLoading = action.payload
    },
    setSelectedChatMessages: (state, action) => { // all messages
      state.ChatMessages = [...action.payload, ...state.ChatMessages];
    },
    setSendMessages: (state, action) => { //send messages
      state.ChatMessages = [...state.ChatMessages, action.payload];
    },

    setSendMessageUpdate: (state, action) => { //send message update after receive
      const { id, timestamp } = action.payload;
      state.ChatMessages = state.ChatMessages.map(msg =>
        msg.timestamp === timestamp
          ? action.payload // update timestamp for the matching message
          : msg                     // leave other messages unchanged
      );
    },

    setUpdateMessages: (state, action) => {
      state.ChatMessages = action.payload;
    },
    setChatMessagesClear: (state, action) => {
      state.ChatMessages = action.payload
    },

    setIsTyping: (state, action) => {
      state.isTyping = action.payload
    },
    setSelectedFiles: (state, action) => {
      state.selectedFiles = [...state.selectedFiles, ...action.payload];
    },
    setRemoveSelectedFiles: (state, action) => {
      const index = action.payload;
      state.selectedFiles = state.selectedFiles.filter((_, i) => i !== index);
    },
    setupdateOneMessage: (state, action) => {
      const { _id } = action.payload;
      const message = state.ChatMessages.find(msg => msg._id === _id);
      if (message) {
        message.isDownload = true; // Directly update without reassigning array
      }
    },

    setIsUploading: (state, action) => {
      state.isUploading = action.payload;
    },
    setIsDownloading: (state, action) => {
      state.isDownloading = action.payload;
    },
    setFileDownloadProgress: (state, action) => {
      state.fileDownloadProgress = action.payload;
    },
    setFileUploadProgress: (state, action) => {
      state.fileUploadProgress = action.payload;
    },
    setViewImages: (state, action) => {
      state.viewImages = action.payload
    },
    closeChat: (state) => {
      state.selectedUser = {};
      state.ChatMessages = [];
    },
    addMessage: (state, action) => {
      state.ChatMessages.push(action.payload);
    },
    onlineStatusData: (state, action) => {
      state.onlineStatus = action.payload;
    },
    setIsUserDetails: (state, action) => {
      state.isUserDetails = action.payload
    },
    setFilesList: (state, action) => {
      state.filesList = action.payload
    },
    updateFilesList: (state, action) => {
      state.filesList = [action.payload, ...state.filesList]
    },
    setLinksList: (state, action) => {
      state.linksList = action.payload
    },
    updatelinksList: (state, action) => {
      state.linksList = [action.payload, ...state.linksList]
    },

    clearChatState: (state, action) => {
      // state.userList = [];
      state.isUserDetails = false
      state.selectedUser = null;
      // state.conversationList = [];
      state.selectedChatType = "single";
      state.ChatMessages = [];
      state.filesList = []
      state.linksList = []
      // state.onlineStatus = [];
      // state.isUploading = false;
      // state.isDownloading = false;
      // state.fileUploadProgress = 0;
      // state.fileDownloadProgress = 0;
      // state.loading = false;
      // state.error = null;
      // state.isFirstLoad = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserList.fulfilled, (state, action) => {
        state.loading = false;
        state.userList = action.payload.data || [];
        state.error = "";
      })
      .addCase(getUserList.rejected, (state, action) => {
        state.loading = false;
        state.userList = [];
        state.error = action.error.message;
      })
      //---------------------------------------------------
      .addCase(createGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.loading = false;
        if(action.payload.data){
          state.groupConversationList = [action.payload.data, ...state.groupConversationList] || [];
        } else {
          state.groupConversationList = state.groupConversationList || [];
        }
        state.error = "";
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.loading = false;
        state.groupConversationList = [];
        state.error = action.error.message;
      })
      //---------------------------------------------------
      .addCase(acceptAndRejectInvite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptAndRejectInvite.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload.data || {};
        state.error = "";
      })
      .addCase(acceptAndRejectInvite.rejected, (state, action) => {
        state.loading = false;
        state.selectedUser = {};
        state.error = action.error.message;
      })
    //---------------------------------------------------
  },
});

// Export actions and reducer
export const {
  setUserList,
  setSelectUser,
  setSelectedChatType,
  setSingleConversationList,
  setGroupConversationList,
  setNewGroupConversation,
  setGroupCreateLoading,
  setInviteUserLoading,
  setChatMessagesClear,
  setSendMessages,
  setSelectedChatMessages,
  setSendMessageUpdate,
  setUpdateMessages,
  setupdateMessageValue,
  setupdateOneMessage,
  setIsUploading,
  setIsDownloading,
  setFileDownloadProgress,
  setFileUploadProgress,
  setViewImages,
  closeChat,
  addMessage,
  onlineStatusData,
  setIsTyping,
  setSelectedFiles,
  setRemoveSelectedFiles,
  setIsUserDetails,
  setFilesList,
  updateFilesList,
  setLinksList,
  updatelinksList,
  clearChatState
} = chatSlice.actions;

export default chatSlice.reducer;
