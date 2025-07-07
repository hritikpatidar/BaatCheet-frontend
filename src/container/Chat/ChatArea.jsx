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
  Send,
  Mic,
  Play,
  Pause
} from "lucide-react";
import {
  FaFileAudio,
  FaFileExcel,
  FaFilePdf,
  FaFileWord,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "../../context/SocketContext";
import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { closeChat, setFileDownloadProgress, setFileUploadProgress, setIsDownloading, setIsUploading, setSendMessages, setUpdateMessages } from "../../Redux/features/Chat/chatSlice";
import dummyImage from "../../assets/dummyImage.png"
import dayjs from "dayjs";
import { checkIfImage, detectURLs, isLink, isValidURL } from "../../Utils/Auth";
import { getDownloadBufferFile, uploadFileService } from "../../Services/ChatServices";
import AudioMessagePlayer from "../../components/chatComponent/AudioMessagePlayer";
import AudioRecorderUI from "../../components/chatComponent/AudioRecorderUI";
import WaveSurfer from 'wavesurfer.js';


const ChatArea = ({ showSidebar, setShowSidebar }) => {
  const dispatch = useDispatch();
  const typingTimeoutRef = useRef(null);

  const { socket, fetchMessages, page, setPage, messageLoading } = useSocket()
  const fileInputRef = useRef(null);
  const messagesContainerRef = useRef(null)
  const profileData = useSelector((state) => state?.authReducer?.AuthSlice?.profileDetails);
  const { isTyping, selectedUser, ChatMessages, onlineStatus, Downloading, DownloadProgress } = useSelector((state) => state?.ChatDataSlice);
  const [isUserAtBottom, setIsUserAtBottom] = useState(false)
  const [message, setMessage] = useState('');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [userDetails, setUserDetails] = useState()
  const [isUserDetailsView, setIsUserDetailsView] = useState(false)
  const [prevScrollHeight, setPrevScrollHeight] = useState(0);
  const [file, setFile] = useState([]);
  const [isNewMessage, setIsNewMessage] = useState(false);
  const [showImage, setShowImage] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [recording, setRecording] = useState(false);
  const [isSend, setIsSend] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const isSendDisabled = !message && file.length === 0 && !audioBlob;

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


  const onSendMessage = (newMessage) => {
    dispatch(setSendMessages(newMessage));
    if (socket) socket.current.emit('sendMessage', newMessage);
    setMessage('');
    setFile([]);
    setIsNewMessage(false);
    setIsSend(false)
    setAudioBlob(null);
    setRecording(false);
  }


  const handleSubmit = async (e) => {
    // "text" | "image" | "video" | "file" | "audio" | "link"
    setIsNewMessage(true);
    e.preventDefault();
    if (selectedUser?.conversationType === "single") {
      if (file.length > 0) {
        for (const [index, singleFile] of file.entries()) {
          const newMessage = {
            conversationId: selectedUser?._id,
            isSenderId: profileData?._id,
            isReceiverId: userDetails?._id,
            groupId: "",
            message: index === 0 ? message : "",
            fileUrl: singleFile,
            messageType: "file",
            status: "",
            timestamp: index
          };
          await onSendMessage(newMessage);
        }
      } else if (audioBlob) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Audio = reader.result;
          const newMessage = {
            conversationId: selectedUser?._id,
            isSenderId: profileData?._id,
            isReceiverId: userDetails?._id,
            groupId: "",
            message: "",
            fileUrl: base64Audio,
            messageType: "audio",
            status: "",
            timestamp: dayjs().format()
          };
          await onSendMessage(newMessage);
          setAudioBlob(null);
        };
        reader.readAsDataURL(audioBlob);
      } else {
        const newMessage = {
          conversationId: selectedUser?._id,
          isSenderId: profileData?._id,
          isReceiverId: userDetails?._id,
          groupId: "",
          message: message,
          fileUrl: "",
          messageType: isLink(message) ? "link" : "text",
          status: "",
          timestamp: dayjs().format()
        };
        await onSendMessage(newMessage);
      }
    } else if (selectedUser?.conversationType === "group") {
      if (file.length > 0) {
        for (const [index, singleFile] of file.entries()) {
          const newMessage = {
            conversationId: "",
            isSenderId: profileData?._id,
            isReceiverId: "",
            groupId: selectedUser?._id,
            message: index === 0 ? message : "",
            fileUrl: singleFile,
            messageType: "file",
            status: "",
            timestamp: dayjs().format()
          };
          await onSendMessage(newMessage);
        }
      } else {
        const newMessage = {
          conversationId: "",
          isSenderId: profileData?._id,
          isReceiverId: "",
          groupId: selectedUser?._id,
          message: message,
          fileUrl: "",
          messageType: isLink(message) ? "link" : "text",
          status: "",
          timestamp: dayjs().format()
        };
        await onSendMessage(newMessage);
      }
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

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    try {
      if (files?.length) {
        const formData = new FormData();
        files.forEach((file, index) => {
          formData.append("img", file);
        });
        dispatch(setIsUploading(true));

        const response = await uploadFileService(formData, {
          onUploadProgress: (data) => {
            const progress = Math.round((100 * data.loaded) / data.total);
            dispatch(setFileUploadProgress(progress));
          },
        });
        let result = response?.data?.data;
        setFile((prev) => [...prev, ...result]);
      }
    } catch (error) {
      dispatch(setIsUploading(false));
      console.error({ error });
    } finally {
      dispatch(setIsUploading(false));
      setIsNewMessage(false);
      e.target.value = "";
    }
  };

  const handleRemoveImage = (index) => {
    setFile((prev) => prev.filter((_, i) => i !== index));
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


  const downloadFile = async (url, messageId, index) => {
    try {
      dispatch(setIsDownloading(index));
      dispatch(setFileDownloadProgress(0));

      let fileName = url.split("/").pop();
      let fileExtension = fileName.split(".").pop().toLowerCase();

      // These formats should open in a new tab
      const openInNewTabFormats = ["pdf", "txt", "md", "html", "xml", "mp4"];

      if (openInNewTabFormats.includes(fileExtension)) {
        window.open(url, "_blank"); // Open in a new tab
      } else {
        let link = document.createElement("a");
        link.href = url;
        link.download = fileName || "downloaded_file";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // Simulating download progress
      let simulatedProgress = 0;
      const progressInterval = setInterval(() => {
        simulatedProgress += 10;
        if (simulatedProgress <= 100) {
          dispatch(setFileDownloadProgress(simulatedProgress));
          if (socket.current) socket.current.emit("downloadFile", messageId);
        } else {
          clearInterval(progressInterval);
          dispatch(setFileDownloadProgress(100));
          dispatch(setIsDownloading(null));
        }
      }, 100);
    } catch (error) {
      console.error("Error downloading file:", error);
      dispatch(setIsDownloading(null));
      dispatch(setFileDownloadProgress(0));
    }
  };

  const downloadImages = async (url, index) => {
    dispatch(setIsDownloading(index));
    dispatch(setFileDownloadProgress(0));
    try {
      const payload = {
        img: url,
      };
      const response = await getDownloadBufferFile(payload);

      const byteArray = new Uint8Array(response.data.data.data);
      const blob = new Blob([byteArray], { type: "image/png" });
      const objectURL = URL.createObjectURL(blob);
      let simulatedProgress = 0;
      const progressInterval = setInterval(() => {
        simulatedProgress += 10;
        if (simulatedProgress <= 100) {
          dispatch(setFileDownloadProgress(simulatedProgress));
        } else {
          clearInterval(progressInterval);
          dispatch(setFileDownloadProgress(100));
          dispatch(setIsDownloading(null));
          let link = document.createElement("a");
          link.href = objectURL;
          const fileName = objectURL.split("/").pop();
          link.download = fileName || "downloaded_file";
          link.click();
        }
      }, 100);
    } catch (error) {
      console.error("Error downloading file:", error);
      dispatch(setIsDownloading(null));
      dispatch(setFileDownloadProgress(0));
    }
  };

  const handlePaste = async (e) => {
    const clipboardData = e.clipboardData || window.clipboardData;
    const items = clipboardData.items;
    const pastedImages = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = async (event) => {
            const base64Image = event.target.result;
            pastedImages.push(base64Image);
            const formData = new FormData();
            const fileObject = base64ToFile(
              base64Image,
              `image-${Date.now()}.png`
            );
            formData.append("img", fileObject);
            dispatch(setIsUploading(true));

            const response = await uploadFileService(formData, {
              onUploadProgress: (data) => {
                const progress = Math.round((100 * data.loaded) / data.total);
                dispatch(setFileUploadProgress(progress));
              },
            });
            let result = response?.data?.data;
            setFile((prev) => [...prev, ...result]);
            dispatch(setIsUploading(false));
          };
          reader.readAsDataURL(file);
          e.preventDefault();
        }
      }
    }
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      audioChunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      // Append to existing blob
      if (audioBlob) {
        const combinedBlob = new Blob([audioBlob, blob], { type: "audio/webm" });
        setAudioBlob(combinedBlob);
      } else {
        setAudioBlob(blob);
      }
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const handleDeleteAudio = () => {
    setAudioBlob(null);
    setRecording(false);
  };

  const handlePlayPauseAudio = () => {
    mediaRecorderRef.current.stop();
  }

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
                            {dayjs(onlineStatus?.lastSeen?.[userDetails?._id]).format("DD/MM/YYYY hh:mm A") || "Offline"}
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
              className="flex-1 overflow-y-auto px-4 sm:px-6 py-0 pt-4 bg-gray-100 space-y-3"
            >
              {Object.keys(groupedMessages).length > 0 ? (
                Object.keys(groupedMessages).map((date, index) => (
                  <div key={index} className="mb-4">
                    <div className="text-center text-sm text-gray-500 pb-3 font-medium">
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
                                  className="cursor-pointer h-48 w-full mb-4 sm:w-48 md:w-60 overflow-hidden rounded-lg"
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
                                <div className="flex justify-between items-center p-2 mb-4 border rounded-lg bg-gray-100 w-full cursor-pointer">
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
                            ) :
                              message.messageType === "audio" ? (
                                <div className="flex items-center max-w-xs w-full bg-gray-100 rounded-lg px-3 py-2 mb-4 shadow relative">
                                  <AudioMessagePlayer audioUrl={message.fileUrl} />
                                </div>
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
                              )
                            }

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
            <form
              onSubmit={handleSubmit}
              className="flex items-center justify-end gap-2 px-4 py-3 relative bg-white border-t border-gray-300"
            >

              {/* File Preview Container */}
              {file?.length > 0 && (
                <div
                  className="absolute z-10 -top-[138px] left-0 grid gap-3 bg-white rounded-md shadow-lg p-3 border border-gray-200 max-w-full overflow-y-auto"
                  style={{
                    gridTemplateColumns: `repeat(${Math.min(file.length, 4)}, minmax(0, 1fr))`,
                    width: `${Math.min(file.length, 4) * 8.5}rem`, // 7.5rem ≈ 120px per image box
                    maxHeight: "203px"
                  }}
                >
                  {file.slice(0, 4).map((img, index) => {
                    const fileExtension = img?.split(".").pop().toLowerCase() || "";

                    return (
                      <div
                        key={index}
                        className="relative flex items-center justify-center bg-gray-50 p-2 rounded-md shadow-sm w-24 h-24 sm:w-28 sm:h-28"
                      >
                        {/* File Type Icons */}
                        {fileExtension === "pdf" ? (
                          <FaFilePdf className="w-16 h-16 text-red-500" />
                        ) : fileExtension === "xlsx" || fileExtension === "xls" ? (
                          <FaFileExcel className="w-16 h-16 text-green-500" />
                        ) : fileExtension === "docx" || fileExtension === "doc" ? (
                          <FaFileWord className="w-16 h-16 text-blue-500" />
                        ) : fileExtension === "mp3" ? (
                          <FaFileAudio className="w-16 h-16 text-blue-500" />
                        ) : (
                          <img
                            src={img}
                            alt={`Preview ${index}`}
                            className="w-full h-full object-cover rounded-md border-2 border-gray-300"
                          />
                        )}

                        {/* Overlay for more than 4 */}
                        {index === 3 && file.length > 4 && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 text-white flex items-center justify-center rounded-md text-lg font-semibold">
                            +{file.length - 4}
                          </div>
                        )}

                        {/* Remove Button */}
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-white text-red-500 rounded-full p-1 hover:text-red-700 shadow-md"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {(recording || audioBlob) ? (
                <div className="flex items-center gap-2 w-full max-w-[500px]">
                  {/* Audio Player */}
                  {audioBlob instanceof Blob && (
                    <audio
                      controls
                      src={URL.createObjectURL(audioBlob)}
                      className="flex-1 rounded-md w-0  h-10"
                    />
                  )}

                  {/* Delete Button */}
                  <button
                    type="button"
                    className="rounded-md hover:bg-gray-200 p-2 text-red-600 transition duration-200"
                    onClick={handleDeleteAudio}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  {!audioBlob &&
                    <button
                      type="button"
                      className="rounded-md hover:bg-gray-200 p-2 text-red-600 transition duration-200"
                      onClick={handlePlayPauseAudio}
                    >
                      {recording ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                  }
                </div>

              ) : (
                <>
                  {/* File Upload */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={handleFileClick}
                      className="rounded-md hover:bg-gray-200 p-2 text-gray-700 transition duration-200"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      multiple
                      className="hidden"
                    />
                  </div>
                  <input
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      socket.current.emit("typing", selectedUser?._id, profileData?._id);
                      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                      typingTimeoutRef.current = setTimeout(() => {
                        socket.current.emit("stopTyping", selectedUser?._id, profileData?._id);
                      }, 2000);
                    }}
                    placeholder="Type a message..."
                    className="flex-1 min-w-[150px] px-4 py-2 rounded-md border border-gray-500 focus:outline-none text-gray-800"
                  />
                </>

              )}

              {/* Voice Recorder */}
              <div>
                {
                  isSendDisabled ? (
                    recording ? (
                      <button
                        type="button"
                        className="rounded-md hover:bg-gray-200 p-2 text-red-700 transition duration-200"
                        onClick={stopRecording}
                      >
                        <Mic className="w-5 h-5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="rounded-md hover:bg-gray-200 p-2 text-gray-700 transition duration-200"
                        onClick={startRecording}
                      >
                        <Mic className="w-5 h-5" />
                      </button>
                    )) : (
                    <button
                      type="submit"
                      className="rounded-md hover:bg-gray-200 p-2 text-gray-700 transition duration-200"
                      disabled={isSendDisabled}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  )
                }
              </div>
            </form>
          </div >
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
