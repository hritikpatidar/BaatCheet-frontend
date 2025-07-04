import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { clearChatState, setChatMessagesClear, setSelectedChatType, setSelectUser } from "../../Redux/features/Chat/chatSlice";
import { useSocket } from "../../context/SocketContext";
import { Bell, EllipsisVertical, LifeBuoy, LogOut, MessageSquarePlus, MoveLeft, Search, Settings, SunMoon, User, X } from 'lucide-react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { clearLocalStorage, getItemLocalStorage, setItemLocalStorage } from "../../Utils/browserServices";
import dummyImage from "../../assets/dummyImage.png"
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import LogOutModal from "../../components/logoutModal";

dayjs.extend(utc);
dayjs.extend(timezone);

const ChatSidebar = ({ showSidebar, setShowSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { socket, userListModal, setUserListModal, fetchMessages, setHasMore, setPage } = useSocket();

  // const [isListLoading, setIsListLoading] = useState(false);
  // const userLists = useSelector((state) => state?.ChatDataSlice?.userList);
  const profileData = useSelector((state) => state?.authReducer?.AuthSlice?.profileDetails);
  const { userList, singleConversationList, groupConversationList, selectedChatType, selectedUser } = useSelector((state) => state?.ChatDataSlice);
  // const selectedUserDetails = useSelector((state) => state?.ChatDataSlice?.selectChatUSer);
  // const [searchValue, setSearchValue] = useState("")
  // const [searchConversationUSer, setSearchConversationUSer] = useState("")
  // const filterData = userLists?.filter((resource) => {
  //   const fullName = resource?.full_name?.toLowerCase() || "";
  //   const email = resource?.email?.toLowerCase() || "";
  //   const search = searchValue.toLowerCase();

  //   return fullName.includes(search) || email.includes(search);
  // });
  const [isUserListOpen, setIsUserListOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatter = Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1
  });

  return (
    <>
      <div
        className={`fixed z-20 h-full w-72 bg-gray-200 border-r border-gray-300 p-4 flex flex-col transform transition-transform duration-300 ease-in-out 
              ${showSidebar ? "translate-x-0" : "-translate-x-full"} sm:relative sm:translate-x-0 sm:w-56 md:w-72 xl:w-96`}
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-800 flex justify-between items-center">
          <span className="projectName">
            <span className='text-teal-600'>Baat</span><span className='text-gray-800'>Cheet</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              className="text-xl text-gray-700 hover:bg-gray-400 p-2 cursor-pointer rounded-md"
              onClick={() => setIsUserListOpen(!isUserListOpen)}
            >
              <MessageSquarePlus className="w-5 h-5" />
            </button>
            <button
              className="sm:hidden text-xl hover:bg-gray-400 p-2 text-gray-700 cursor-pointer rounded-md"
              onClick={() => setShowSidebar(false)}
            >
              <X className="w-5 h-5" />
            </button>

            <Menu as="div" className="relative inline-block text-left">
              <div>
                <MenuButton className="rounded-md hover:bg-gray-400 p-2 text-gray-700 cursor-pointer">
                  <EllipsisVertical className="w-5 h-5" aria-hidden="true" />
                </MenuButton>
              </div>

              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                {/* Profile Section */}
                <button
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 transition"
                  onClick={() => console.log("Profile clicked")}
                >
                  <User className="w-5 h-5" />
                  Profile
                </button>
                <button
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 transition"
                  onClick={() => console.log("Account Settings clicked")}
                >
                  <Settings className="w-5 h-5" />
                  Account Settings
                </button>
                <button
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 transition"
                  onClick={() => console.log("Theme Toggle clicked")}
                >
                  <SunMoon className="w-5 h-5" />
                  Theme: Light/Dark
                </button>
                <button
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 transition"
                  onClick={() => console.log("Notifications clicked")}
                >
                  <Bell className="w-5 h-5" />
                  Notifications
                </button>
                <button
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 transition"
                  onClick={() => console.log("Support clicked")}
                >
                  <LifeBuoy className="w-5 h-5" />
                  Support
                </button>

                {/* Logout */}
                <button
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100 transition"
                  onClick={() => console.log("Delete Chat clicked")}
                >
                  <LogOut className="w-5 h-5 text-red-600" />
                  <span className="text-red-600 font-medium">Logout</span>
                </button>
              </MenuItems>
            </Menu>
          </div>
        </h3>
        {/* Search */}
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search or start a new chat"
            className="w-full px-3 py-2 pl-10 rounded-md border border-gray-300 bg-white focus:outline-none text-sm text-gray-800"
          />
        </div>

        {/* Tabs: Group / Single */}
        <div className="flex mb-4 border border-gray-300 rounded-md overflow-hidden">
          <button
            className={`flex-1 py-2 text-sm font-medium ${selectedChatType === "single" ? "bg-gray-300 text-gray-900" : "bg-white text-gray-600 cursor-pointer"}`}
            onClick={() => dispatch(setSelectedChatType("single"))}
          >
            Single
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium ${selectedChatType === "group" ? "bg-gray-300 text-gray-900" : "bg-white text-gray-600 cursor-pointer"}`}
            onClick={() => dispatch(setSelectedChatType("group"))}
          >
            Group
          </button>
        </div>

        {/* Recent Chats */}
        <ul className="space-y-2 overflow-y-auto flex-1">
          {(selectedChatType === "single"
            ? singleConversationList
            : groupConversationList
          )?.length === 0 ? (
            <li className="flex items-center justify-center h-40 text-gray-500 text-sm">
              {selectedChatType === "single" ? "No user found" : "No group found"}
            </li>
          ) : (
            (selectedChatType === "single"
              ? singleConversationList
              : groupConversationList
            )?.map((cv, i) => {
              const data = cv.members.find(item => item._id !== profileData?._id)
              let user = {}
              if (selectedChatType === "single") {
                user.senderId = cv?.lastMessageDetails?.isSenderId
                user.name = data?.name
                user.profile = dummyImage
                user.message = cv?.lastMessageDetails?.message
                user.messageType = cv?.lastMessageDetails?.messageType
                user.time = cv?.lastMessageDetails?.timestamp
              } else {
                user.senderId = cv?.lastMessageDetails?.isSenderId
                user.name = cv.name
                user.profile = dummyImage
                user.message = cv?.lastMessageDetails?.message
                user.messageType = cv?.lastMessageDetails?.messageType
                user.time = cv?.lastMessageDetails?.timestamp
              }
              const isYour = user.senderId === profileData?._id

              return (
                <li
                  key={i}
                  className={`cursor-pointer flex items-center gap-3 p-2 rounded-md ${cv?._id === selectedUser?._id && "bg-gray-300"
                    } hover:bg-gray-300 shadow-sm`}
                  onClick={() => {
                    if (cv?._id === selectedUser?._id) return
                    dispatch(setSelectUser(cv))
                    dispatch(setChatMessagesClear([]))
                    setHasMore(true)
                    setShowSidebar(false)
                    setPage(1)
                    fetchMessages(1, cv)
                  }}
                >
                  {/* Profile circle (initials) */}
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-400 text-white font-semibold overflow-hidden">
                    {user.profile ? (
                      <img
                        src={user.profile}
                        alt={"No Image"}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      user?.name
                        ?.split(" ")
                        .map((word) => word[0])
                        .join("")
                        .toUpperCase()
                    )}
                  </div>

                  {/* Name and message */}
                  <div className="flex-1 overflow-hidden">
                    <p className="font-medium text-gray-800 truncate whitespace-nowrap overflow-hidden text-ellipsis">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-600 truncate whitespace-nowrap overflow-hidden text-ellipsis">
                      {isYour ? t("you") + ": " : ""}
                      {cv?.lastMessageDetails?.messageType === "file"
                        ? "File"
                        : cv?.lastMessageDetails?.message || "Start Conversation"}
                    </p>
                  </div>

                  {/* Time and unread count */}
                  <div className="flex flex-col items-end text-xs text-gray-500">
                    {cv?.lastMessageDetails?.unReadMessages &&
                      cv?._id !== selectedUser?._id ? (
                      <span className="inline-block bg-gray-500 text-white rounded-full px-2 py-0.5 mb-0.5">
                        {formatter.format(cv?.lastMessageDetails?.unReadMessages)}
                      </span>
                    ) : null}
                    <span>{dayjs(user.time).format("hh:mm A")}</span>
                  </div>
                </li>
              )
            })
          )}
        </ul>

      </div>

      <div
        className={`fixed z-20 h-full w-72 sm:w-56 md:w-72 xl:w-96 bg-gray-200 border-r border-gray-300 p-4 flex flex-col transform transition-transform duration-300 ease-in-out 
                ${isUserListOpen ? "translate-x-0" : "-translate-x-100"} `}
      >
        {/* Header */}
        <h3 className="text-lg font-semibold mb-4 text-gray-800 flex justify-between items-center">
          <button
            className="text-xl text-gray-700 hover:bg-gray-400 p-2 cursor-pointer rounded-md"
            onClick={() => setIsUserListOpen(false)}
          >
            <MoveLeft className="w-5 h-5" />
          </button>
        </h3>

        {/* Search */}
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search or start a new chat"
            className="w-full px-3 py-2 pl-10 rounded-md border border-gray-300 bg-white focus:outline-none text-sm text-gray-800"
          />
        </div>

        <h3 className="text-gray-500 font-bold ml-2 mb-3">Connect with us</h3>

        {/* User List */}
        <ul className="space-y-2 overflow-y-auto flex-1">
          {userList?.filter((cv) => cv?._id !== profileData?._id).length === 0 ? (
            <li className="flex items-center justify-center h-40 text-gray-500 text-sm">
              No user found
            </li>
          ) : (
            userList
              ?.filter((cv) => cv?._id !== profileData?._id)
              .map((cv, i) => (
                <li
                  key={i}
                  className="cursor-pointer flex items-center gap-3 p-2 rounded-md hover:bg-gray-300 shadow-sm"
                  onClick={() => {
                    const payload = {
                      _id: "",
                      conversationType: "single",
                      members: [
                        {
                          _id: cv?._id,
                          name: cv?.name,
                          email: cv?.email,
                          profile: "",
                        },
                      ],
                      status: "sent",
                      isChatDisabled: false,
                      conversationType: "single",
                    };
                    dispatch(setSelectUser(payload));
                    setIsUserListOpen(false);
                    dispatch(setChatMessagesClear([]));
                  }}
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-400 text-white font-semibold">
                    {cv?.name
                      ?.split(" ")
                      ?.map((word) => word[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-medium text-gray-800 truncate whitespace-nowrap overflow-hidden text-ellipsis">
                      {cv.name}
                    </p>
                    <p className="text-xs text-gray-600 truncate whitespace-nowrap overflow-hidden text-ellipsis">
                      {"This theme is awesome!"}
                    </p>
                  </div>
                </li>
              ))
          )}
        </ul>

      </div>

      {isLogoutModalOpen && (
        <LogOutModal setIsLogoutModalOpen={setIsLogoutModalOpen} loading={loading} setLoading={setLoading} />
      )}
    </>
  );
};

export default ChatSidebar;
