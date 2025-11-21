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
  Pause,
  ChevronsDown,
  Lock,
  Users,
  Plus,
  Info,
  PlusCircle,
  CircleCheck,
  CircleX,
  CircleMinus,
  LogOut,
  Share
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
import { closeChat, setFileDownloadProgress, setFileUploadProgress, setIsDownloading, setIsUploading, setSendMessages, setUpdateMessages, setViewImages } from "../../Redux/features/Chat/chatSlice";
import dummyImage from "../../assets/dummyImage.png"
import dayjs from "dayjs";
import { base64ToFile, checkIfImage, decryptMessage, detectURLs, encryptMessage, isLink, isValidURL } from "../../Utils/Auth";
import { getDownloadBufferFile, uploadFileService } from "../../Services/ChatServices";
import AudioMessagePlayer from "../../components/chatComponent/AudioMessagePlayer";
import ImageLightbox from "../../components/imagePreview";
import WaveSurfer from "wavesurfer.js";
import MicrophonePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.microphone.min.js'
import AddMembersModal from "../../components/addMembersModal";
import CustomizeModal from "../../components/CustomizeModal";


const AIChatArea = ({ showSidebar, setShowSidebar }) => {
  const dispatch = useDispatch();
  //global states
  const {
    socket,
    fetchMessages,
    page,
    setPage,
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
    setIsLeaveGroupModalOpen } = useSocket()
  const profileData = useSelector((state) => state?.authReducer?.AuthSlice?.profileDetails);
  const { selectedUser, ChatMessages, Downloading, DownloadProgress, isTyping, onlineStatus } = useSelector((state) => state?.ChatDataSlice);
  const invite = selectedUser?.invites?.find(invite => invite?.invitedUser?._id === profileData?._id);
  //header states
  const [isUserDetailsView, setIsUserDetailsView] = useState(false)
  const [userDetails, setUserDetails] = useState()
  //message container states
  const messagesContainerRef = useRef(null)
  const [prevScrollHeight, setPrevScrollHeight] = useState(0);
  const [isUserAtBottom, setIsUserAtBottom] = useState(true)
  const [showImage, setShowImage] = useState(false);

  //form states
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [message, setMessage] = useState('');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [file, setFile] = useState([]);
  const [blobFiles, setBlobFiles] = useState([]);

  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const mediaRecorder = useRef(null);
  const [audioChunks, setAudioChunks] = useState([]);//store old audio
  const [isFinish, setIsFinish] = useState(true);
  const [isPlayButton, setIsPlayButton] = useState(true);
  const [isPlay, setIsPlay] = useState(false)
  const [recordedBlob, setRecordedBlob] = useState(null);
  const isSendDisabled = (!message && file.length === 0 && !recordedBlob) ? true : false;


  const [history, setHistory] = useState([
    { id: 1, title: "My first AI chat" },
    { id: 2, title: "Code explanation" },
  ]);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: input },
      { role: "assistant", text: "Thinking..." },
    ]);

    setInput("");
  };

  return (
    <>
      {/* RIGHT PANEL */}
      <main className="flex-1 flex flex-col items-center justify-center relative px-4 
    bg-gray-100 dark:bg-gray-900 transition-colors">

        {/* EMPTY STATE → ChatGPT Home Screen Style */}
        {messages.length === 0 && (
          <div className="w-full max-w-3xl mx-auto text-center">

            {/* Heading */}
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-10">
              What’s on your mind today?
            </h1>

            {/* Input Bar */}
            <div className="flex items-center 
                bg-white dark:bg-gray-800 
                shadow-lg rounded-full px-6 py-4 gap-1 
                border border-gray-200 dark:border-gray-700 transition">

              {/* + Icon */}
              <button className="text-gray-600 dark:text-gray-300 p-2 rounded-xl 
                    hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                <Plus className="w-5 h-5" />
              </button>

              {/* Text Input */}
              <input
                type="text"
                placeholder="Ask anything"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 outline-none 
                        text-gray-700 dark:text-gray-200 
                        bg-transparent text-lg"
              />

              {/* Mic Icon */}
              <button className="text-gray-600 dark:text-gray-300 p-2 rounded-xl 
                    hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                <Mic className="w-5 h-5" />
              </button>

              {/* Send */}
              <button
                onClick={handleSend}
                className="bg-gray-600 dark:bg-teal-600 
                        text-white p-2 rounded-xl 
                        hover:bg-gray-700 dark:hover:bg-teal-700 transition"
              >
                <Send className="w-5 h-5" />
              </button>

            </div>
          </div>
        )}

        {/* CHAT WINDOW (When messages exist) */}
        {messages.length > 0 && (
          <>
            <div className="flex-1 w-full overflow-y-auto p-6 space-y-4">

              {messages.map((m, index) => (
                <div
                  key={index}
                  className={`p-3 max-w-2xl rounded-2xl shadow 
                            transition-all duration-200
                            ${m.role === "user"
                      ? "bg-teal-600 text-white ml-auto"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                    }
                        `}
                >
                  {m.text}
                </div>
              ))}

            </div>

            {/* INPUT BOX (Chat Mode) */}
            <div className="flex items-center 
                bg-white dark:bg-gray-800 
                shadow-lg rounded-full px-6 py-4 gap-4 
                border border-gray-200 dark:border-gray-700 transition">

              {/* + Icon */}
              <button className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">
                <Plus className="w-5 h-5" />
              </button>

              {/* Text Input */}
              <input
                type="text"
                placeholder="Ask anything"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 outline-none 
                        text-gray-700 dark:text-gray-200 
                        bg-transparent text-lg"
              />

              {/* Mic Icon */}
              <button className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">
                <Mic className="w-5 h-5" />
              </button>

              {/* Send */}
              <button
                onClick={handleSend}
                className="bg-gray-700 dark:bg-teal-600 
                        text-white px-6 rounded-xl 
                        hover:bg-gray-800 dark:hover:bg-teal-700 
                        transition"
              >
                <Send className="w-5 h-5" />
              </button>

            </div>
          </>
        )}

      </main>


      {
        isUserDetailsView && (
          <div
            className={`fixed z-20 top-0 right-0 h-full  w-full sm:w-96 bg-gray-200 border-l border-gray-300 p-4 overflow-y-auto transform transition-transform duration-300 ease-in-out
            ${isUserDetailsView ? "translate-x-0" : "translate-x-full"} sm:relative sm:translate-x-0`}
          >          <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">User Info</h2>
              <button
                type="button"
                className=" text-xl text-gray-700 cursor-pointer hover:bg-gray-200 p-2 rounded-md"
                onClick={() => setIsUserDetailsView(false)}
              >
                <X />
              </button>
            </div>

            {/* User Avatar */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className=" rounded-full bg-gray-100 flex items-center justify-center text-2xl sm:text-2xl font-semibold text-gray-600">
                {userDetails?.profile ? (
                  <img src={userDetails?.profile || dummyImage} alt={"No Image"} className="w-24 h-24 rounded-full object-cover" />
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

      {
        showImage &&
        <ImageLightbox
          setShowImage={setShowImage}
          downloadImages={downloadImages}
        />
      }

      {
        addMembersGroupModle &&
        <AddMembersModal />
      }
      {
        isModalOpen &&
        <CustomizeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleClearChat}
          title="Clear this Chat?"
          description="This will remove chat history from your device."
          confirmText="Clear"
          cancelText="Cancel"
          loading={isLoading}
        />
      }

      {
        isLeaveGroupModalOpen &&
        <CustomizeModal
          isOpen={isLeaveGroupModalOpen}
          onClose={() => setIsLeaveGroupModalOpen(false)}
          onConfirm={handleLeave}
          title={`Leave group: "${selectedUser?.name}" ?`}
          description="Only admins are notified when you leave a group."
          confirmText="Leave"
          cancelText="Cancel"
          danger={true}
          loading={isLoading}
        />
      }
      {
        isDeleteGroupModalOpen &&
        <CustomizeModal
          isOpen={isDeleteGroupModalOpen}
          onClose={() => setIsDeleteGroupModalOpen(false)}
          onConfirm={handleDelete}
          title={`Delete group: "${selectedUser?.name}" ?`}
          description="This group has been deleted permanently"
          confirmText="Delete"
          cancelText="Cancel"
          danger={true}
          loading={isLoading}
        />
      }
    </>
  );
};

export default AIChatArea;