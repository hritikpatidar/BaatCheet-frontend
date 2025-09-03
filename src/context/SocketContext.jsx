import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  clearChatState,
  closeChat,
  onlineStatusData,
  setChatMessagesClear,
  setGroupConversationList,
  setGroupCreateLoading,
  setInviteUserLoading,
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
import { decryptMessage } from "../Utils/Auth";

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
  const [addMembersGroupModle, setAddMembersGroupModle] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteGroupModalOpen, setIsDeleteGroupModalOpen] = useState(false)
  const [isLeaveGroupModalOpen, setIsLeaveGroupModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState(null);

  useEffect(() => {
    if (profileData && !socket.current) {
      socket.current = io(import.meta.env.VITE_SOCKET_URL, {
        withCredentials: true,
        query: { userId: profileData._id },
        transports: ["websocket", "polling"],
      });

      socket.current.on("connect", () => {
        console.log("✅ Socket connected");
        socket.current.emit("deliveredAllMessages", profileData._id,)
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
      socket.current.off("userGroupInviteResponse");
      socket.current.off("groupMessagesCleared");
      socket.current.off("groupMessagesError");
      socket.current.off("groupLeaved");
      socket.current.off("groupLeavedError");
      socket.current.off("AcceptAndRejectInviteResult");
      socket.current.off("AcceptAndRejectInviteResultError");
      socket.current.off("exportChatSuccess");
      socket.current.off("exportChatError");

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


      socket.current.on("groupCreated", async (groupData) => {
        dispatch(setNewGroupConversation(groupData.data));
        await dispatch(setGroupCreateLoading(false));
        setOpenCreateGroupModle(false);
        if (groupData.data.admin?._id === profileData?._id) toast.success(groupData?.message || "Group created successfully");
      });

      socket.current.on("groupCreationFailed", async (message) => {
        await dispatch(setGroupCreateLoading(false));
        toast.success(message || "Internal server error");
      });

      socket.current.on("userGroupInviteResponse", async (groupData) => {
        socket.current.emit("groupConversation", profileData._id);
        if (groupData.data?._id === selectedUser?._id) {
          dispatch(setSelectUser(groupData.data));
          await dispatch(setInviteUserLoading(false));
          setAddMembersGroupModle(false);
        }
      });

      socket.current.on("groupConversationResults", (groupConversation) => {
        if (groupConversation?.value?.length > 0) {
          dispatch(setGroupConversationList(groupConversation?.value));
        } else {
          dispatch(setGroupConversationList([]));
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
        const chatType = messages?.groupId ? "group" : "single"
        const payload = { ...selectedUser, profile: selectedUser?.image }
        const receiverDetails = selectedUser?.conversationType === "single" ? selectedUser?.members?.find(item => item._id !== profileData?._id) : payload
        if (messages?.isSenderId?._id === profileData?._id) {//sender ka message set karne ke liye
          dispatch(setSendMessageUpdate(messages));
        }
        if (messages?.isSenderId?._id !== profileData?._id) {
          if (chatType === "single") {
            const usersId = [messages?.isSenderId?._id]
            if (onlineStatus?.onlineUsers?.includes(messages?.isReceiverId) && messages?.conversation_id !== selectedUser?._id) {
              socket.current.emit("deliveredMessage", messages?._id, chatType, usersId, profileData?._id);
            } else if (messages?.isSenderId?._id === receiverDetails?._id && messages?.conversation_id === selectedUser?._id) {
              dispatch(setSendMessages(messages));
              socket.current.emit("viewMessage", messages?._id, chatType, usersId, profileData?._id);
            }
          } else if (chatType === "group") {
            const membersId = messages.members
            if (onlineStatus?.onlineUsers?.includes(messages?.isReceiverId) && messages?.groupId !== selectedUser?._id) {
              socket.current.emit("deliveredMessage", messages?._id, chatType, membersId, profileData?._id);
            } else if (messages?.groupId === receiverDetails?._id && messages?.isSenderId?._id !== profileData?._id) { // receiver ka message set karne ke liye
              dispatch(setSendMessages(messages));
              socket.current.emit("viewMessage", messages?._id, chatType, membersId, profileData?._id);
            }
          }
        }
        socket.current.emit("groupConversation", profileData._id);
        socket.current.emit("conversation", profileData._id);
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
        if (data?.conversationType === "single") {
          if (data.conversation_id === selectedUser?._id && data.userId !== profileData?._id) {
            dispatch(setIsTyping([data.userId]));
          }
        } else if (data?.conversationType === "group") {
          if (data.conversation_id === selectedUser?._id) {
            dispatch(setIsTyping(data.userId));
          }
        }
      });

      socket.current.on("userStopTyping", (data) => {
        if (data?.conversationType === "single") {
          if (data.conversation_id === selectedUser?._id && data.userId !== profileData?._id) {
            dispatch(setIsTyping([]));
          }
        } else if (data?.conversationType === "group") {
          if (data.conversation_id === selectedUser?._id) {
            dispatch(setIsTyping(data.userId));
          }
        }
      });

      socket.current.on("AcceptAndRejectInviteResult", (result) => {
        if ((result?.status === "accepted") && result?.data?._id === selectedUser?._id) {
          dispatch(setSelectUser(result?.data))
        } else if (result?.status === "declined" && result?.data?._id === selectedUser?._id) {
          const isUser = result?.data?.members.find(i => i._id === profileData?._id)
          if (!isUser) {
            dispatch(closeChat())
          } else {
            dispatch(setSelectUser(result?.data))
          }
        }
        socket.current.emit("groupConversation", profileData._id);
        setLoadingType(null)
      });

      socket.current.on("AcceptAndRejectInviteResultError", (result) => {
        socket.current.emit("groupConversation", profileData._id);
        dispatch(closeChat())
        setLoadingType(null)
      });

      socket.current.on("groupMessagesCleared", (response) => {
        if (response.messages.length === 0 && selectedUser?._id === response?.groupId) {
          dispatch(setChatMessagesClear(response?.messages))
        }
        setIsLoading(false)
        setIsModalOpen(false)
      })

      socket.current.on("groupMessagesError", (response) => {
        console.log("groupMessagesError", response)
        setIsModalOpen(false)
      })

      socket.current.on("groupLeaved", (groupData) => {
        const isUser = groupData.members.find(i => i._id === profileData?._id)
        if (selectedUser?._id === groupData?._id && !isUser) {
          dispatch(setSelectUser({}))
        } else if (selectedUser?._id === groupData?._id) {
          dispatch(setSelectUser(groupData))
        }
        socket.current.emit("groupConversation", profileData._id);
        setIsLeaveGroupModalOpen(false)
        setIsLoading(false)

      })

      socket.current.on("groupLeavedError", (groupId) => {
        setIsLeaveGroupModalOpen(false)
        setIsLoading(false)
      })

      socket.current.on("groupDeleted", (groupData) => {
        socket.current.emit("groupConversation", profileData._id);
        if (selectedUser?._id === groupData?.groupId) {
          dispatch(setSelectUser({}))
        }
        setIsDeleteGroupModalOpen(false)
        setIsLoading(false)

      })

      socket.current.on("groupDeletedError", (groupId) => {
        setIsDeleteGroupModalOpen(false)
        setIsLoading(false)
      })

      socket.current.on("exportChatSuccess", (data) => {
        console.log("export chat success", data)
        if (data.chatData && data.chatData.length) {
          // Format date to readable Indian time
          const formatDate = (isoDate) => {
            const date = new Date(isoDate);
            const options = {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
              timeZone: 'Asia/Kolkata'
            };
            return date.toLocaleString('en-GB', options).replace(',', '');
          };

          // Format messages
          const formattedMessages = data.chatData.map(msg => {
            const sender = msg.isSenderId?._id === profileData?._id ? "You" : msg.isSenderId?.name || "Unknown";
            const content = msg.messageType === "text" ? decryptMessage(msg.message) : `[File] ${decryptMessage(msg.fileUrl)}`;
            const timestamp = formatDate(msg.createdAt);
            return `[${timestamp}] - ${sender}: ${content} `;
          }).join('\n');
          // Download as .txt
          const blob = new Blob([formattedMessages], { type: "text/plain;charset=utf-8" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "chat.txt";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setIsViewChatLoading(false);
        } else {
          toast.error(t("no_data_found"));
        }
      })

      socket.current.on("exportChatError", (data) => {
        console.log("export chat error", data?.message)
      })

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
        setOpenCreateGroupModle,
        addMembersGroupModle,
        setAddMembersGroupModle,
        isLoading,
        setIsLoading,
        isModalOpen,
        setIsModalOpen,
        isDeleteGroupModalOpen,
        setIsDeleteGroupModalOpen,
        loadingType,
        setLoadingType,
        isLeaveGroupModalOpen,
        setIsLeaveGroupModalOpen
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
