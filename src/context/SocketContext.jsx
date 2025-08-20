import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  clearChatState,
  onlineStatusData,
  setGroupConversationList,
  setGroupCreateLoading,
  setIsTyping,
  setNewGroupConversation,
  setSelectedChatMessages,
  setSelectUser,
  setSendMessages,
  setSendMessageUpdate,
  setSingleConversationList,
  setUserList,
  updateFilesList,
  updatelinksList
} from "../Redux/features/Chat/chatSlice";
import toast from "react-hot-toast";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef(null);
  const dispatch = useDispatch();
  const location = useLocation();
  const [pageSize, setPageSize] = useState(20);
  const [userListModal, setUserListModal] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const profileData = useSelector(state => state?.authReducer?.AuthSlice?.profileDetails)
  const { selectedUser, ChatMessages, onlineStatus, selectedChatType } = useSelector((state) => state?.ChatDataSlice);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [openCreateGroupModle, setOpenCreateGroupModle] = useState(false)

  useEffect(() => {
    if (profileData && !socket.current) {
      socket.current = io(import.meta.env.VITE_SOCKET_URL, {
        withCredentials: true,
        query: { userId: profileData._id },
        transports: ["websocket", "polling"],
      });

      socket.current.on("connect", () => {
        console.log("✅ Socket connected");
        socket.current.emit("registerUser", profileData._id);
        // if (profileData._id && location.pathname === "/chat") {
        socket.current.emit("conversation", profileData._id);
        socket.current.emit("groupConversation", profileData._id);
        socket.current.emit("getUserList");
        // }
      });

      socket.current.on("disconnect", () => {
        console.log("❌ Socket disconnected");
      });
    }

    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
        console.log("🧹 Socket cleanup");
      }
    };
  }, [profileData]);

  useEffect(() => {
    if (profileData?._id && socket.current) {
      socket.current.emit("conversation", profileData._id);
      socket.current.emit("groupConversation", profileData._id);
      socket.current.emit("getUserList");
    }
  }, [socket]);


  useEffect(() => {
    if (!socket.current || !profileData) return;
    if (socket.current) {
      socket.current.off("userList");
      socket.current.off("conversationCreateResult");
      socket.current.off("groupCreated");
      socket.current.off("groupCreationFailed");
      socket.current.off("groupConversationResults");
      socket.current.off("conversationResults");
      socket.current.off("receiveMessage");
      socket.current.off("getMessageResults");
      socket.current.off("updateUserStatus");
      socket.current.off("downloadFileResult");
      socket.current.off("getFilesResults");
      socket.current.off("userTyping");
      socket.current.off("userStopTyping");

      socket.current.on("userList", (userList) => {
        if (userList) {
          dispatch(setUserList(userList))
        }
      });

      socket.current.on("conversationCreateResult", (userData) => {
        if (selectedUser !== null && userData?._id === selectedUser?._id) {
          dispatch(setSelectUser(userData));
        }
      });


      socket.current.on("groupCreated", async (groupData, message) => {
        dispatch(setNewGroupConversation(groupData));
        await dispatch(setGroupCreateLoading(false));
        setOpenCreateGroupModle(false);
        if (groupData.admin === profileData?._id) toast.success(message || "Group created successfully");
      });

      socket.current.on("groupCreationFailed", async (message) => {
        await dispatch(setGroupCreateLoading(false));
        toast.success(message || "Internal server error");
      });

      socket.current.on("groupConversationResults", (groupConversation) => {
        if (groupConversation?.value?.length > 0) {
          dispatch(setGroupConversationList(groupConversation?.value));
        }
      });

      socket.current.on("conversationResults", (singleConversation) => {
        if (singleConversation?.value?.length > 0) {
          dispatch(setSingleConversationList(singleConversation?.value));
        } else {
          dispatch(setSingleConversationList([]));
        }
      });

      socket.current.on("receiveMessage", (messages) => {
        socket.current.emit("groupConversation", profileData._id);
        socket.current.emit("conversation", profileData._id);
        const payload = { ...selectedUser, profile: selectedUser?.image }
        const receiverDetails = selectedUser?.conversationType === "single" ? selectedUser?.members?.find(item => item._id !== profileData?._id) : payload
        if (messages?.isSenderId?._id === profileData?._id) {//sender ka message set karne ke liye
          dispatch(setSendMessageUpdate(messages));
        }

        if (selectedUser?.conversationType === "single") {
          if (messages?.isSenderId?._id === receiverDetails?._id && messages?.conversation_id === selectedUser?._id) { // receiver ka message set karne ke liye
            dispatch(setSendMessages(messages));
            socket.current.emit("viewMessage", messages?._id, selectedUser?.conversationType);
          }
          if (onlineStatus?.onlineUsers?.includes(messages?.isReceiverId)) socket.current.emit("deliveredMessage", messages?._id, selectedUser?.conversationType);
        } else if (selectedUser?.conversationType === "group") {
          if (messages?.groupId === receiverDetails?._id && messages?.isSenderId?._id !== profileData?._id) { // receiver ka message set karne ke liye
            dispatch(setSendMessages(messages));
            socket.current.emit("viewMessage", messages?._id, selectedUser?.conversationType);
          }
          socket.current.emit("deliveredMessage", messages?._id, selectedUser?.conversationType);
        }

        if (messages?.messageType === "file") dispatch(updateFilesList(messages))
        if (messages?.messageType === "link") dispatch(updatelinksList(messages))
      });

      socket.current.on("getMessageResults", (messages) => {
        if (messages.length > 0) {
          dispatch(setSelectedChatMessages(messages));
          if (messages.length < pageSize) setHasMore(false)
        } else if (messages?.length === 0) {
          setHasMore(false)
        }
        setMessageLoading(false)
      });

      socket.current.on("updateUserStatus", (data) => {
        dispatch(onlineStatusData(data));
      });

      socket.current.on("userTyping", (data) => {
        if (data.conversation_id === selectedUser?._id && data.userId !== profileData?._id) {
          dispatch(setIsTyping(true));
        }
      });

      socket.current.on("userStopTyping", (data) => {
        if (data.conversation_id === selectedUser?._id && data.userId !== profileData?._id) {
          dispatch(setIsTyping(false));
        }
      });

      // socket.current.on("downloadFileResult", (MessageData) => {
      //   try {
      //     if (!MessageData?.message?._id) return;
      //     dispatch(setupdateOneMessage(MessageData.message));
      //   } catch (error) {

      //   }
      // })

      // socket.current.on("getFilesResults", (allFiles, allLinks) => {
      //   try {
      //     if (allFiles?.length > 0) dispatch(setFilesList(allFiles))
      //     else dispatch(setFilesList(allFiles))

      //     if (allLinks?.length > 0) dispatch(setLinksList(allLinks))
      //   } catch (error) {

      //   }
      // })

    }
  }, [selectedUser, profileData, dispatch]);

  const fetchMessages = async (pageNum, contact) => {
    setMessageLoading(true);
    if (socket.current) {
      const conversation_id = contact?._id
      const senderId = profileData?._id
      const receiverId = contact?.members?.find(item => item._id !== senderId)?._id
      if (conversation_id || (senderId && receiverId)) {
        if (socket.current) {
          socket.current.emit("getuserFiles", conversation_id);
          socket.current.emit("getMessages", conversation_id, senderId, receiverId, pageNum, pageSize, contact?.conversationType);
        }
      } else {
        setMessageLoading(false);
      }
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket: socket,
        userListModal,
        setUserListModal,
        fetchMessages,
        messageLoading,
        setMessageLoading,
        hasMore,
        setHasMore,
        page,
        setPage,
        pageSize,
        openCreateGroupModle,
        setOpenCreateGroupModle
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
