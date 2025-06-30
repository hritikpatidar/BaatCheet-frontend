import { useEffect, useRef, useState } from "react";
import {
  Paperclip,
  EllipsisVertical,
  AlignJustify,
  Phone,
  Video,
  User,
  Archive,
  VolumeX,
  MessageSquareX,
  Trash2,
  X,
  FileArchive,
  ArrowDownToLine,
  CheckCheck,
  Check,
  Clock3,
  Send
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "../../context/SocketContext";
import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { closeChat, setSendMessages, setUpdateMessages } from "../../Redux/features/Chat/chatSlice";
import dummyImage from "../../assets/dummyImage.png"
import dayjs from "dayjs";
import { checkIfImage, detectURLs, isValidURL } from "../../Utils/Auth";


const ChatArea = ({ showSidebar, setShowSidebar }) => {
  const dispatch = useDispatch();
  const typingTimeoutRef = useRef(null);

  const { socket, fetchMessages, page, setPage, messageLoading } = useSocket()
  const fileInputRef = useRef(null);
  const messagesContainerRef = useRef(null)
  const profileData = useSelector((state) => state?.authReducer?.AuthSlice?.profileDetails);
  const { isTyping, selectedUser, ChatMessages, onlineStatus } = useSelector((state) => state?.ChatDataSlice);
  const [isUserAtBottom, setIsUserAtBottom] = useState(false)
  const [message, setMessage] = useState('');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [userDetails, setUserDetails] = useState()
  const [isUserDetailsView, setIsUserDetailsView] = useState(false)
  const [prevScrollHeight, setPrevScrollHeight] = useState(0);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const payload = { ...selectedUser, profile: selectedUser?.image }
    setUserDetails(selectedUser?.conversationType === "single" ? selectedUser?.members?.find(item => item._id !== profileData?._id) : payload)
  }, [selectedUser])


  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      let msgContent = {};
      if (selectedUser?.conversationType === "single") {
        msgContent = {
          conversationId: selectedUser?._id, //684fc66a067a4fc539d38684 
          isSenderId: profileData?._id, // sender's user ID
          isReceiverId: userDetails?._id, //68242db5216d67de02b7f9c0 
          groupId: "", //68500e1faad63c8b915c5ecc 
          message: message,
          fileUrl: "",
          messageType: "text", // "text" | "image" | "video" | "file"
          status: "",      // "sent" | "delivered" | "read"
          timestamp: dayjs().format()
        };
      } else if (selectedUser?.conversationType === "group") {
        msgContent = {
          conversationId: "",
          isSenderId: profileData?._id, // sender's user ID
          isReceiverId: "", //68242db5216d67de02b7f9c0 
          groupId: selectedUser?._id, //68529121c60461b55966150a 
          message: message,
          fileUrl: "",
          messageType: "text", // "text" | "image" | "video" | "file"
          status: "",      // "sent" | "delivered" | "read"
          timestamp: dayjs().format()
        };
      }
      dispatch(setSendMessages(msgContent));
      if (socket) socket.current.emit('sendMessage', msgContent);
      setMessage('');
    }
  };


  const handleEmojiClick = (emojiObject) => {
    setMessage((prevText) => prevText + emojiObject.emoji);
  };

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file:", file);
    }
  };

  const scrollToBottom = async () => {
    const container = messagesContainerRef.current;
    if (container) {
      setPrevScrollHeight(container.scrollHeight);
      container.scrollTop = container.scrollHeight;
    }
  };

  const handleScroll = async () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const atTop = container.scrollTop === 0;
    if (atTop) {
      const nextPage = page + 1;
      await fetchMessages(nextPage, selectedUser);
      setPage(nextPage);
    }

    const nearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    setIsUserAtBottom(nearBottom);
  };

  useEffect(() => {
    if (isUserAtBottom) {
      scrollToBottom();
    } else {
      const container = messagesContainerRef.current;
      if (!container) return;
      setPrevScrollHeight(container.scrollHeight);
      const atTop = container.scrollTop === 0;
      if (atTop) {
        setTimeout(() => {
          const newScrollHeight = container.scrollHeight;
          container.scrollTop = newScrollHeight - prevScrollHeight;
        }, 0);
        return
      }
    }
  }, [ChatMessages]);

  // message container functions
  useEffect(() => {
    if (socket.current) {
      socket.current.emit("conversation", profileData._id);
      socket.current.off("deliveredResult");
      socket.current.off("viewResult");

      socket.current.on("deliveredResult", (data) => {
        const updatedMessages = ChatMessages.map((message) => {
          if (data?.message_id === message?._id) {
            return { ...message, status: "delivered" };
          }
          return message;
        });
        dispatch(setUpdateMessages(updatedMessages));
      });

      socket.current.on("viewResult", (data) => {
        const updatedMessages = ChatMessages.map((message) => {
          if (data?.message_id === message?._id) {
            return { ...message, status: "read" };
          }
          return message;
        });
        dispatch(setUpdateMessages(updatedMessages));
      });
    }
  }, [socket, ChatMessages]);

  const formatDateKey = (date) => {
    const d = dayjs(date);
    if (d.isSame(dayjs(), 'day')) return 'Today';
    if (d.isSame(dayjs().subtract(1, 'day'), 'day')) return 'Yesterday';
    if (d.isSame(dayjs(), 'week')) return d.format('dddd'); // जैसे Monday, ..., Sunday
    return d.format('DD/MM/YYYY');
  };


  const groupMessagesByDate = (messages) => {
    return messages.reduce((acc, message) => {
      if (
        socket.current &&
        message?.status === "sent" &&
        message?.isSenderId !== profileData?._id
      ) {
        socket.current.emit("deliveredMessage", message?._id, selectedUser?.conversationType);
      }

      if (
        socket.current &&
        message?.status === "delivered" &&
        message?.isSenderId !== profileData?._id
      ) {
        socket.current.emit("viewMessage", message?._id, selectedUser?.conversationType);
      }

      const key = formatDateKey(message.createdAt);
      if (!acc[key]) acc[key] = [];
      acc[key].push(message);
      return acc;
    }, {});
  };

  const groupedMessages = groupMessagesByDate(ChatMessages);

  return (
    <>
      {!selectedUser?.members ? (
        <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-gray-200 px-6 py-10">
          <button
            onClick={() => setShowSidebar(true)}
            className="absolute top-4 left-4 sm:hidden p-2 rounded-md hover:bg-gray-400 transition text-gray-700  cursor-pointer"
          >
            <AlignJustify className="w-6 h-6" />
          </button>
          <div className="text-center max-w-md relative z-10">
            <div className="mx-auto w-28 h-28 mb-6 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-300">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png"
                alt="Start Chat"
                className="w-16 h-16 opacity-80"
              />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              No Conversation Selected
            </h2>
            <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed">
              To get started, choose a person from the chat list or begin a new conversation. <br />
              Stay connected, share your thoughts, and collaborate in real-time — all in one place.
            </p>
          </div>
        </div>

      ) : (
        <>
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="bg-gray-300 px-6 py-2 shadow-sm flex justify-between items-center">
              <div className="flex items-center gap-4">
                <button
                  className="sm:hidden text-2xl hover:bg-gray-400 p-2 text-gray-700 cursor-pointer rounded-md"
                  onClick={() => setShowSidebar(true)}
                >
                  <AlignJustify />
                </button>
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-400 text-white font-semibold">
                  {userDetails?.profile ? (
                    <img src={dummyImage} alt={"No Image"} className="w-12 h-12 rounded-full" />
                  ) : userDetails?.name?.split(" ")
                    .map((word) => word[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <div>
                  <h2 className="text-md font-bold text-gray-800">
                    {userDetails?.name?.charAt(0).toUpperCase() + userDetails?.name?.slice(1)}
                  </h2>
                  <p className="text-sm text-green-600">
                    {selectedUser?.conversationType === "single" ?
                      isTyping ? "Typing..."
                        :
                        onlineStatus?.onlineUsers?.includes(userDetails?._id) ? (
                          "Online"
                        ) : (
                          <span className="text-sm text-gray-500 font-normal">
                            {dayjs(onlineStatus?.lastSeen?.[userDetails?._id]).format("DD/MM/YYYY hh:mm A") || "Offline" }
                          </span>
                        )
                      :
                      `${selectedUser?.members.filter(user =>
                        onlineStatus.onlineUsers.includes(user?._id)
                      ).length} members | active now`
                    }

                    {/* "5 members | active now" */}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 px-1 -mr-[10px]">
                <div className="hidden xl:flex items-center gap-3">
                  <button className="rounded-md hover:bg-gray-400 p-2 text-gray-700 cursor-pointer">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="rounded-md hover:bg-gray-400 p-2 text-gray-700 cursor-pointer">
                    <Video className="w-5 h-5" />
                  </button>
                  <button
                    className="rounded-md hover:bg-gray-400 p-2 text-gray-700 cursor-pointer "
                    onClick={() => setIsUserDetailsView(!isUserDetailsView)}
                  >
                    <User className="w-5 h-5" />
                  </button>
                </div>

                <Menu as="div" className="relative inline-block text-left ">
                  <div>
                    <MenuButton className="rounded-md hover:bg-gray-400 p-2 text-gray-700 cursor-pointer">
                      <EllipsisVertical aria-hidden="true" className="w-5 h-5" />
                    </MenuButton>
                  </div>

                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                  >
                    <button
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 transition xl:hidden  "
                      onClick={() => console.log("Archive clicked")}
                    >
                      <Phone className="w-5 h-5" />
                      Voice Call
                    </button>
                    <button
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 transition xl:hidden  "
                      onClick={() => console.log("Archive clicked")}
                    >
                      <Video className="w-5 h-5" />
                      Video Call
                    </button>
                    <button
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 transition xl:hidden  "
                      onClick={() => setIsUserDetailsView(!isUserDetailsView)}
                    >
                      <User className="w-5 h-5" />
                      View details
                    </button>

                    {/* New Options */}
                    <button
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 transition"
                      onClick={() => console.log("Archive clicked")}
                    >
                      <Archive className="w-5 h-5" />
                      Archive
                    </button>

                    <button
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 transition"
                      onClick={() => console.log("Mute clicked")}
                    >
                      <VolumeX className="w-5 h-5" />
                      Mute
                    </button>

                    <button
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 transition"
                      onClick={() => dispatch(closeChat())}
                    >
                      <MessageSquareX className="w-5 h-5" />
                      Clear Conversation
                    </button>

                    <button
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100 transition"
                      onClick={() => console.log("Delete Chat clicked")}
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                      Delete Chat
                    </button>
                  </MenuItems>
                </Menu>
              </div>
            </div>

            {/* Message Container */}
            <div
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 bg-gray-100 space-y-3"
            >
              {Object.keys(groupedMessages).length > 0 ? (
                Object.keys(groupedMessages).map((date, index) => (
                  <div key={index} className="mb-4">
                    <div className="text-center text-sm text-gray-500 font-medium">
                      {dayjs(date, "DD/MM/YYYY").isSame(dayjs(), "day") ? "Today" : date}
                    </div>
                    {groupedMessages[date].map((message, idx) => {
                      const isSender = message.isSenderId === profileData?._id;

                      return (
                        <div
                          key={idx}
                          className={`flex flex-col mb-2 ${isSender ? "items-end" : "items-start"}`}
                        >
                          <div
                            className={`relative px-3 py-2 mb-1 max-w-full sm:max-w-md rounded-xl break-words ${isSender ? "bg-gray-500 text-white self-end" : "bg-white text-gray-800"
                              }`}
                          >
                            {/* Message or Media */}
                            {message.messageType === "file" ? (
                              checkIfImage(message.fileUrl) ? (
                                <div
                                  className="cursor-pointer h-48 w-full sm:w-48 md:w-60 overflow-hidden rounded-lg"
                                  onClick={() => {
                                    dispatch(setViewImages([message.fileUrl]));
                                    setShowImage(true);
                                  }}
                                >
                                  <img
                                    className="h-full w-full object-cover"
                                    src={message.fileUrl}
                                    alt="Sent Image"
                                  />
                                </div>
                              ) : (
                                <div className="flex justify-between items-center p-2 border rounded-lg bg-gray-100 w-full cursor-pointer">
                                  <div className="flex items-center gap-2" onClick={() =>
                                    downloadFile(message.fileUrl, message._id, idx)
                                  }>
                                    <FileArchive className="text-gray-600 text-3xl" />
                                    <span className="text-sm font-medium text-gray-800 truncate max-w-[180px] sm:max-w-[200px]">
                                      {message.fileUrl.split("/").pop()}
                                    </span>
                                  </div>
                                  {!message.isDownload && message.isReceiverId === profileData?._id && (
                                    <span className="bg-sky-200 rounded-full p-1 hover:bg-gray-300">
                                      {Downloading === idx ? (
                                        <span className="text-sm font-medium text-gray-700">
                                          {DownloadProgress}%
                                        </span>
                                      ) : (
                                        <ArrowDownToLine className="text-gray-500" />
                                      )}
                                    </span>
                                  )}
                                </div>
                              )
                            ) : (
                              <p className="pr-14 break-words">
                                {detectURLs(message.message).map((part, i2) =>
                                  isValidURL(part) ? (
                                    <a
                                      key={i2}
                                      href={part}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-500 underline"
                                    >
                                      {part}
                                    </a>
                                  ) : (
                                    part
                                  )
                                )}
                              </p>
                            )}

                            {/* Timestamp and Status Icon inside bubble */}
                            <div className="absolute bottom-1 right-2 flex items-center space-x-1 text-[10px] opacity-80">
                              <span>{dayjs(message.createdAt).format("hh:mm A")}</span>
                              {isSender && (
                                <>
                                  {message.status === "" ? (
                                    <Clock3 size={12} />
                                  ) : message.status === "delivered" ? (
                                    <CheckCheck size={12} />
                                  ) : message.status === "read" ? (
                                    <CheckCheck size={12} className="text-blue-500" />
                                  ) : (
                                    <Check size={12} />
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  {!messageLoading && <p className="text-gray-500 text-center">No Message Found</p>}
                </div>
              )}
            </div>


            {/* Input Box */}
            < form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3 relative" >
              {/* Paperclip Button with Dropdown */}
              <div div className="relative" >
                <button
                  type="button"
                  onClick={handleFileClick}
                  className="rounded-md hover:bg-gray-400 p-2 text-gray-700 transition duration-200 cursor-pointer"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>



              {/* Emoji Button with Picker */}
              {/* <div className="relative">
              <button
                type="button"
                className="rounded-md hover:bg-gray-400 p-2 text-gray-700 cursor-pointer"
                onClick={() => setIsEmojiPickerOpen((prev) => !prev)}
              >
                <Smile className="w-5 h-5" />
              </button>

              {isEmojiPickerOpen && (
                <div className="absolute bottom-full mb-2 -right-30  z-10 w-64 max-w-xs scale-90 origin-bottom-right sm:w-40">
                  <EmojiPicker className="w-5 h-5" onEmojiClick={handleEmojiClick} />
                </div>
              )}
            </div> */}
              {/* <Menu as="div" className="relative inline-block text-left">
              <div>
                <MenuButton className="rounded-md hover:bg-gray-400 p-2 text-gray-700 cursor-pointer"
                  onClick={() => setIsEmojiPickerOpen((prev) => !prev)}
                >
                  <Smile aria-hidden="true" className="w-5 h-5" />
                </MenuButton>
              </div>
              {isEmojiPickerOpen && (
                <MenuItems
                  transition
                  className="absolute -right-40 bottom-10 z-10 w-56 sm:ml-20 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                  <EmojiPicker className="w-5 h-5" onEmojiClick={handleEmojiClick} />
                </MenuItems>
              )}
            </Menu> */}

              <input
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value)
                  socket.current.emit('typing', selectedUser?._id, profileData?._id);

                  // Clear previous timeout if it exists
                  if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                  }

                  // Set new timeout for stopTyping
                  typingTimeoutRef.current = setTimeout(() => {
                    socket.current.emit('stopTyping', selectedUser?._id, profileData?._id);
                  }, 2000);
                }}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 rounded-md border border-gray-500 focus:outline-none text-gray-800"
              />

              <button
                type="submit"
                className="bg-gray-600 text-white px-5 py-2 rounded-md hover:bg-gray-700 cursor-pointer"
              >
                Send
              </button>
            </form>
          </div>
        </>
      )
      }

      {
        isUserDetailsView && (
          <div
            className={`fixed z-20 top-0 right-0 h-full w-96 bg-gray-200 border-l border-gray-300 p-4 overflow-y-auto transform transition-transform duration-300 ease-in-out
            ${isUserDetailsView ? "translate-x-0" : "translate-x-full"} sm:relative sm:translate-x-0`}
          >          <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">User Info</h2>
              <button
                className=" text-xl text-gray-700 cursor-pointer hover:bg-gray-400 p-2 rounded-md"
                onClick={() => setIsUserDetailsView(false)}
              >
                <X />
              </button>
            </div>

            {/* User Avatar */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-3xl text-white font-bold">
                {userDetails?.profile ? (
                  <img src={dummyImage} alt={"No Image"} className="w-24 h-24 rounded-full" />
                ) : userDetails?.name?.split(" ")
                  .map((word) => word[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <h3 className="mt-3 text-xl font-semibold text-gray-800">{userDetails?.name}</h3>
              <p className="text-sm text-gray-500">Online</p>
            </div>

            {/* More Details */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm text-gray-500">Email</h4>
                <p className="text-sm font-medium text-gray-800">{userDetails?.email}</p>
              </div>
              <div>
                <h4 className="text-sm text-gray-500">Location</h4>
                <p className="text-sm font-medium text-gray-800">Indore, MP</p>
              </div>
              <div>
                <h4 className="text-sm text-gray-500">Status Message</h4>
                <p className="text-sm font-medium text-gray-800">"Living the code life!"</p>
              </div>
            </div>
          </div>
        )
      }

    </>
  );
};

export default ChatArea;
