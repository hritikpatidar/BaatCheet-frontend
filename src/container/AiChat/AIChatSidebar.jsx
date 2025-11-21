import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { closeChat } from "../../Redux/features/Chat/chatSlice";
import { useSocket } from "../../context/SocketContext";
import { Ellipsis, Plus, Search, X } from 'lucide-react';
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import GroupCreateModal from "../../components/groupCreateModal";

dayjs.extend(utc);
dayjs.extend(timezone);

const AIChatSidebar = ({ showSidebar, setShowSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { openCreateGroupModle, setOpenCreateGroupModle } = useSocket();
  const profileData = useSelector((state) => state?.authReducer?.AuthSlice?.profileDetails);
  const { userList, singleConversationList, groupConversationList, selectedChatType } = useSelector((state) => state?.ChatDataSlice);
  const [history, setHistory] = useState([
    { id: 1, title: "My first AI chat" },
    { id: 2, title: "Code explanation" },
  ]);
  const [isSearchTerm, setIsSearchTerm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessages, setErrorMessages] = useState({});

  return (
    <>
      <div
        className={`fixed z-30 h-full w-full 
      bg-gray-200 dark:bg-gray-900 
      border-r border-gray-300 dark:border-gray-700 
      p-4 flex flex-col transform transition-transform duration-300 ease-in-out
      ${showSidebar ? "translate-x-0" : "-translate-x-full"} 
      sm:relative sm:translate-x-0 sm:w-56 md:w-72 xl:w-96`}
      >

        {/* TOP */}
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 flex justify-between items-center">

          <span
            className="projectName cursor-pointer"
            onClick={async () => {
              await navigate("/");
              dispatch(closeChat());
            }}
          >
            <span className="text-teal-600">Baat</span>
            <span className="text-gray-800 dark:text-gray-200">Cheet AI</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              className="sm:hidden text-xl hover:bg-gray-300 dark:hover:bg-gray-700 p-2 
          text-gray-700 dark:text-gray-300 cursor-pointer rounded-md"
              onClick={() => setShowSidebar(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </h3>

        {/* BUTTONS */}
        <div className="flex flex-col py-3">

          <button
            className="flex items-center gap-2 w-full px-2 py-2 text-sm font-semibold 
        text-gray-800 dark:text-gray-200 
        rounded-md cursor-pointer 
        hover:bg-gray-300 dark:hover:bg-gray-700 transition"
            onClick={() => console.log('Notifications clicked')}
          >
            <Plus className="w-5 h-5" />
            <span>New Chat</span>
          </button>

          <button
            className="flex items-center gap-2 w-full px-2 py-2 text-sm font-semibold 
        text-gray-800 dark:text-gray-200 
        rounded-md cursor-pointer 
        hover:bg-gray-300 dark:hover:bg-gray-700 transition"
            onClick={() => setIsSearchTerm(true)}
          >
            <Search className="w-5 h-5" />
            <span>Search Chat</span>
          </button>

        </div>

        {/* SECTION TITLE */}
        <h2 className="font-semibold mb-3 px-2 text-gray-700 dark:text-gray-300">
          AI Chat History
        </h2>

        {/* HISTORY LIST */}
        <ul className="space-y-2 overflow-y-auto flex-1">
          {history.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm p-2">
              No chats found
            </p>
          ) : (
            history.map((item) => (
              <li
                key={item.id}
                className="py-2 px-2 rounded-lg shadow cursor-pointer 
            text-sm bg-gray-100 dark:bg-gray-800 
            text-gray-800 dark:text-gray-100
            hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                <div className="flex items-center group">
                  <span>{item.title}</span>

                  <Ellipsis
                    className="w-5 h-5 ml-auto opacity-0 
                text-gray-600 dark:text-gray-300 
                group-hover:opacity-100 transition"
                  />
                </div>
              </li>
            ))
          )}
        </ul>
      </div>


      {
        isSearchTerm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center 
      bg-black/30 dark:bg-black/50 backdrop-blur-sm px-4 sm:px-0 overflow-hidden">

            <div className="w-full max-w-2xl 
        bg-white dark:bg-gray-900 
        rounded-2xl shadow-xl 
        border border-gray-300 dark:border-gray-700 
        max-h-[80vh] overflow-hidden flex flex-col transition">

              {/* Top Bar */}
              <div className="flex justify-between items-center px-6 py-4 
            border-b border-gray-300 dark:border-gray-700">

                <input
                  type="text"
                  placeholder="Search chats..."
                  className="w-full 
              bg-gray-100 dark:bg-gray-800 
              border border-gray-300 dark:border-gray-700 
              text-sm text-gray-800 dark:text-gray-200 
              px-4 py-3 rounded-xl focus:outline-none 
              placeholder-gray-400 dark:placeholder-gray-500"
                />

                <button
                  onClick={() => setIsSearchTerm(false)}
                  className="ml-3 p-2 rounded-full shadow-md  shadow-teal-400 dark:shadow-teal-600  cursor-pointer 
                     text-gray-600 dark:text-gray-200  hover:text-teal-400 dark:hover:text-teal-300  bg-white
                      dark:bg-gray-800 transition-all ease-in-out"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto px-0">

                {/* NEW CHAT */}
                <div className="px-6 pt-4 pb-2">
                  <div className="flex items-center gap-3 px-4 py-3 
              bg-gray-100 dark:bg-gray-800 
              rounded-xl cursor-pointer 
              hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                      New chat
                    </span>
                  </div>
                </div>

                {/* TODAY */}
                <div className="px-6 mt-2">
                  <p className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-2">
                    Today
                  </p>

                  <div className="flex items-center gap-3 px-4 py-3 
              hover:bg-gray-100 dark:hover:bg-gray-800 
              rounded-xl cursor-pointer">
                    <div className="w-2 h-2 bg-gray-800 dark:bg-gray-300 rounded-full"></div>
                    <p className="text-gray-800 dark:text-gray-200 text-sm">
                      Baatcheet AI UI design
                    </p>
                  </div>
                </div>

                {/* YESTERDAY */}
                <div className="px-6 mt-4">
                  <p className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-2">
                    Yesterday
                  </p>

                  <div className="flex items-center gap-3 px-4 py-3 
              hover:bg-gray-100 dark:hover:bg-gray-800 
              rounded-xl cursor-pointer">
                    <div className="w-2 h-2 bg-gray-800 dark:bg-gray-300 rounded-full"></div>
                    <p className="text-gray-800 dark:text-gray-200 text-sm">
                      Functional component conversion
                    </p>
                  </div>
                </div>

                {/* LONG SCROLL LIST */}
                <div className="px-6 mt-4 pb-6">
                  <p className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-2">
                    Previous 7 Days
                  </p>

                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-4 py-3 
                hover:bg-gray-100 dark:hover:bg-gray-800 
                rounded-xl cursor-pointer"
                    >
                      <div className="w-2 h-2 bg-gray-800 dark:bg-gray-300 rounded-full"></div>
                      <p className="text-gray-800 dark:text-gray-200 text-sm">
                        Request for interview feedback
                      </p>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        )
      }

    </>
  )
}

export default AIChatSidebar;
