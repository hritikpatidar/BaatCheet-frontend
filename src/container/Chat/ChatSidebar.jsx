import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { clearChatState, closeChat, setChatMessagesClear, setSelectedChatType, setSelectUser } from "../../Redux/features/Chat/chatSlice";
import { useSocket } from "../../context/SocketContext";
import { Bell, EllipsisVertical, LifeBuoy, LogOut, MessageSquarePlus, MoveLeft, Plus, Search, Settings, SunMoon, User, Users, X } from 'lucide-react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { clearLocalStorage, getItemLocalStorage, setItemLocalStorage } from "../../Utils/browserServices";
import dummyImage from "../../assets/dummyImage.png"
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import LogOutModal from "../../components/LogOutModalPage";
import GroupCreateModal from "../../components/groupCreateModal";
import { decryptMessage, formatter } from "../../Utils/Auth";

dayjs.extend(utc);
dayjs.extend(timezone);

const ChatSidebar = ({ showSidebar, setShowSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { socket, userListModal, setUserListModal, fetchMessages, hasMore, setHasMore, setPage, openCreateGroupModle, setOpenCreateGroupModle } = useSocket();
  const profileData = useSelector((state) => state?.authReducer?.AuthSlice?.profileDetails);
  const { userList, singleConversationList, groupConversationList, selectedChatType, selectedUser } = useSelector((state) => state?.ChatDataSlice);

  const [searchTerm, setSearchTerm] = useState("");
  const [isUserListOpen, setIsUserListOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const singleMessageCount = singleConversationList.filter(i => i?.lastMessageDetails?.unReadMessages > 0) || []
  const groupMessageCount = groupConversationList.filter(i => i?.lastMessageDetails?.unReadMessages > 0) || []

  const filteredUsers = userList?.filter(
    (cv) =>
      cv?._id !== profileData?._id &&
      cv?.name?.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  // 🔹 Filter list according to search
  const chatList =
    selectedChatType === "single"
      ? singleConversationList
      : groupConversationList;

  const filteredList = chatList?.filter((cv) => {
    const data =
      selectedChatType === "single"
        ? cv?.members?.find((item) => item._id !== profileData?._id)
        : cv;
    const name = selectedChatType === "single" ? data?.name : cv?.name;
    return name?.toLowerCase().includes(searchTerm.toLowerCase().trim());
  });

  // Function to highlight search text
  const highlightText = (text, search) => {
    if (!search || search.trim() === "") {
      return <span className="text-gray-800 dark:text-gray-100">{text}</span>;
    }

    const regex = new RegExp(`(${search.trim()})`, "gi");
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === search.toLowerCase().trim() ? (
            <span key={i} className="text-green-600 dark:text-green-400 font-semibold">
              {part}
            </span>
          ) : (
            <span key={i} className="text-gray-800 dark:text-gray-100">
              {part}
            </span>
          )
        )}
      </>
    );
  };


  return (
    <>
      <div
        className={`fixed z-30 h-full w-full 
        bg-gray-100 dark:bg-gray-900 
        border-r border-gray-300 dark:border-gray-700
        p-4 flex flex-col transform transition-transform duration-300 ease-in-out 
        ${showSidebar ? "translate-x-0" : "-translate-x-full"}
        sm:relative sm:translate-x-0 sm:w-56 md:w-72 xl:w-96`}
      >
        <h3 className="text-lg font-semibold mb-4 
        text-gray-800 dark:text-gray-100 
        flex justify-between items-center"
        >
          <span className="projectName cursor-pointer" onClick={async () => {
            await navigate("/")
            dispatch(closeChat())
          }}>
            <span className="text-teal-600">Baat</span>
            <span className="text-gray-800 dark:text-gray-100">Cheet</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              className="hidden xl:flex relative rounded-full p-2 shadow-md  shadow-teal-400 dark:shadow-teal-600  cursor-pointer 
                     text-gray-600 dark:text-gray-200  hover:text-teal-400 dark:hover:text-teal-300  bg-white
                      dark:bg-gray-800 transition-all ease-in-out "
              onClick={() => {
                setIsUserListOpen(!isUserListOpen)
                setSearchTerm("");
              }}
            >
              <MessageSquarePlus className="w-5 h-5" />

              {/* Tooltip */}
              <span className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap 
              bg-gray-300 dark:bg-gray-700 
              text-gray-700 dark:text-gray-200 
              text-xs px-2 py-1 rounded opacity-0 
              group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                Add user
              </span>
            </button>

            {selectedChatType === "group" &&
              <button
                className="hidden xl:flex relative rounded-full p-2 shadow-md  shadow-teal-400 dark:shadow-teal-600  cursor-pointer 
                     text-gray-600 dark:text-gray-200  hover:text-teal-400 dark:hover:text-teal-300  bg-white
                      dark:bg-gray-800 transition-all ease-in-out "
                onClick={() => setOpenCreateGroupModle(true)}
              >
                <Users className="w-5 h-5" />
                <Plus className="w-3 h-3 absolute top-2 -right-0 
                 hover:text-teal-400 dark:hover:text-teal-300" />

                {/* Tooltip */}
                <span className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap 
                bg-gray-300 dark:bg-gray-700 
                text-gray-700 dark:text-gray-200 
                text-xs px-2 py-1 rounded opacity-0 
                group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  Create group
                </span>
              </button>
            }

            <Menu as="div" className="relative inline-block text-left z-10">
              {({ close }) => (
                <>
                  <div>
                    <MenuButton
                      className="rounded-full p-2 shadow-md  shadow-teal-400 dark:shadow-teal-600  cursor-pointer 
                     text-gray-600 dark:text-gray-200  hover:text-teal-400 dark:hover:text-teal-300  bg-white
                      dark:bg-gray-800 transition-all ease-in-out"
                    >
                      {/* <EllipsisVertical className="w-5 h-5" aria-hidden=" " /> */}
                      {/* <div
                        className="relative text-xl text-gray-700 hover:bg-gray-200  cursor-pointer rounded-md group"
                      > */}
                      <EllipsisVertical className="w-5 h-5" />

                      {/* Tooltip */}
                      <span className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-300 text-gray-700 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                        Manu
                      </span>
                      {/* </div> */}
                    </MenuButton>
                  </div>

                  <MenuItems
                    transition
                    className="absolute -right-4 z-10 mt-2 w-56 origin-top-right 
                    divide-y divide-gray-100 dark:divide-gray-700
                    rounded-md bg-white dark:bg-gray-800
                    shadow-lg ring-1 ring-black/5 transition"
                  >
                    {/* Profile Section */}
                    <button
                      type="button"
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm 
                      text-gray-800 dark:text-gray-200 
                      hover:bg-gray-200 dark:hover:bg-gray-700"
                      onClick={() => {
                        console.log("Profile clicked")
                        close();
                      }}
                    >
                      <User className="w-5 h-5" />
                      User profile
                    </button>

                    <button
                      type="button"
                      className="xl:hidden flex items-center gap-3 w-full px-4 py-2 text-sm 
                      text-gray-800 dark:text-gray-200 
                      hover:bg-gray-200 dark:hover:bg-gray-700"
                      onClick={() => {
                        setIsUserListOpen(!isUserListOpen)
                        setSearchTerm("");
                        close();
                      }}
                    >
                      <MessageSquarePlus className="w-5 h-5" />
                      Add users
                    </button>
                    <button
                      type="button"
                      className="xl:hidden flex items-center gap-3 w-full px-4 py-2 text-sm 
                      text-gray-800 dark:text-gray-200 
                      hover:bg-gray-200 dark:hover:bg-gray-700"
                      onClick={() => {
                        setOpenCreateGroupModle(true)
                        close();
                      }}
                    >
                      {/* Users Icon with Plus on top-right */}
                      <span className="relative">
                        <Users className="w-5 h-5" />
                        <Plus className="w-3 h-3 absolute top-0 -right-2 text-gray-700 dark:text-gray-300" />
                      </span>

                      Create group
                    </button>


                    <button
                      type="button"
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm 
                      text-gray-800 dark:text-gray-200 
                      hover:bg-gray-200 dark:hover:bg-gray-700"
                      onClick={() => {
                        console.log("Account Settings clicked")
                        close();
                      }}
                    >
                      <Settings className="w-5 h-5" />
                      Account settings
                    </button>
                    <button
                      type="button"
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm 
                      text-gray-800 dark:text-gray-200 
                      hover:bg-gray-200 dark:hover:bg-gray-700"
                      onClick={() => {
                        console.log("Theme Toggle clicked")
                        close();
                      }}
                    >
                      <SunMoon className="w-5 h-5" />
                      Theme: light/dark
                    </button>
                    <button
                      type="button"
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm 
                      text-gray-800 dark:text-gray-200 
                      hover:bg-gray-200 dark:hover:bg-gray-700"
                      onClick={() => {
                        console.log("Notifications clicked")
                        close();
                      }}
                    >
                      <Bell className="w-5 h-5" />
                      Notifications
                    </button>
                    <button
                      type="button"
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm 
                      text-gray-800 dark:text-gray-200 
                      hover:bg-gray-200 dark:hover:bg-gray-700"
                      onClick={() => {
                        console.log("Support clicked")
                        close();
                      }}
                    >
                      <LifeBuoy className="w-5 h-5" />
                      Support
                    </button>

                    {/* Logout */}
                    <button
                      type="button"
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm 
                      text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                      onClick={() => {
                        setIsLogoutModalOpen(true)
                        close();
                      }}
                    >
                      <LogOut className="w-5 h-5 text-red-600" />
                      <span className="text-red-600 font-medium">Logout</span>
                    </button>
                  </MenuItems>
                </>
              )}

            </Menu>

            <button
              className="sm:hidden rounded-full p-2 shadow-md  shadow-teal-400 dark:shadow-teal-600  cursor-pointer 
                     text-gray-600 dark:text-gray-200  hover:text-teal-400 dark:hover:text-teal-300  bg-white
                      dark:bg-gray-800 transition-all ease-in-out "
              onClick={() => setShowSidebar(false)}
            >
              <X className="w-5 h-5" />
            </button>

          </div>
        </h3>
        {/* Search */}
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 
          text-gray-500 dark:text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search or start a new chat"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 pl-10 rounded-md border
            border-gray-300 dark:border-gray-700
            bg-white dark:bg-gray-800
            text-gray-800 dark:text-gray-200
            focus:outline-none text-sm"
          />
        </div>

        {/* Tabs: Group / Single */}
        <div className="flex mb-4 border 
        border-gray-300 dark:border-gray-700 
        rounded-md overflow-hidden">

          <button
            className={`flex-1 py-2 text-sm font-medium 
            ${selectedChatType === "single"
                ? "bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400"}`}
            onClick={() => {
              setSearchTerm("");
              dispatch(setSelectedChatType("single"));
              socket.current.emit("conversation", profileData._id);
            }}
          >
            Single
          </button>

          <button
            className={`flex-1 py-2 text-sm font-medium 
            ${selectedChatType === "group"
                ? "bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400"}`}
            onClick={() => {
              dispatch(setSelectedChatType("group"));
              setSearchTerm("");
              socket.current.emit("groupConversation", profileData._id);
            }}
          >
            Group
          </button>

        </div>

        {/* 🔹 Recent Chats */}
        <ul className="space-y-2 overflow-y-auto flex-1">
          {filteredList?.length === 0 ? (
            <li className="flex items-center justify-center h-40 text-gray-500 dark:text-gray-400 text-sm">
              {selectedChatType === "single" ? "No user found" : "No group found"}
            </li>
          ) : (
            filteredList?.map((cv, i) => {
              const data = cv?.members?.find(
                (item) => item._id !== profileData?._id
              );

              let user = {};
              if (selectedChatType === "single") {
                user.senderId = cv?.lastMessageDetails?.isSenderId;
                user.name = data?.name;
                user.profile = data?.image;
                user.message = cv?.lastMessageDetails?.message;
                user.messageType = cv?.lastMessageDetails?.messageType;
                user.time = cv?.lastMessageDetails?.timestamp;
              } else if (selectedChatType === "group") {
                user.senderId = cv?.lastMessageDetails?.isSenderId?._id;
                user.name = cv.name;
                user.profile = cv?.image;
                user.message = cv?.lastMessageDetails?.message;
                user.messageType = cv?.lastMessageDetails?.messageType;
                user.time = cv?.lastMessageDetails?.timestamp;
              }

              const isYour = user.senderId === profileData?._id;
              const invite = cv?.invites?.find(
                (invite) => invite?.invitedUser?._id === profileData?._id
              );

              return (
                <li
                  key={i}
                  className={`cursor-pointer flex items-center gap-3 p-2 rounded-md 
    ${cv?._id === selectedUser?._id ? "bg-gray-300 dark:bg-gray-700" : ""}
    hover:bg-gray-300 dark:hover:bg-gray-700 shadow-sm`}
                  onClick={() => {
                    if (hasMore) return;
                    setShowSidebar(false);
                    dispatch(setSelectUser(cv));
                    dispatch(setChatMessagesClear([]));
                    setHasMore(true);
                    setPage(1);
                    fetchMessages(1, cv);
                  }}
                >
                  {/* Profile */}
                  <div className="w-12 h-12 flex items-center justify-center rounded-full 
      bg-gray-200 dark:bg-gray-500 
      text-2xl font-semibold text-gray-600 dark:text-gray-300 overflow-hidden">
                    {user.profile ? (
                      <img
                        src={user.profile}
                        alt={"No Image"}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      user?.name
                        ?.split(" ")
                        .filter((_, index) => index === 0 || index === 1)
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    )}
                  </div>

                  {/* Name + Message */}
                  <div className="flex-1 overflow-hidden">
                    <p className="font-medium text-gray-800 dark:text-gray-100 truncate">
                      {highlightText(user.name, searchTerm)}
                    </p>

                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {selectedChatType === "single" ? (
                        <>
                          {isYour ? t("you") + ": " : ""}
                          {cv?.lastMessageDetails?.messageType === "file" ||
                            cv?.lastMessageDetails?.messageType === "audio"
                            ? cv?.lastMessageDetails?.messageType === "file"
                              ? "File"
                              : "Audio"
                            : decryptMessage(user?.message) || "Start Conversation"}
                        </>
                      ) : invite ? (
                        "Invite You to join group"
                      ) : (
                        <>
                          {isYour
                            ? "you: "
                            : cv?.lastMessageDetails
                              ? cv?.lastMessageDetails?.isSenderId?.name + ": "
                              : ""}
                          {cv?.lastMessageDetails?.messageType === "file" ||
                            cv?.lastMessageDetails?.messageType === "audio"
                            ? cv?.lastMessageDetails?.messageType === "file"
                              ? "File"
                              : "Audio"
                            : decryptMessage(user?.message) || "Starts Conversation"}
                        </>
                      )}
                    </p>
                  </div>

                  {/* Time + Unread Count */}
                  <div className="flex flex-col items-end text-xs text-gray-500 dark:text-gray-400">
                    {cv?.lastMessageDetails?.unReadMessages &&
                      cv?._id !== selectedUser?._id &&
                      !invite ? (
                      <span className="inline-block bg-gray-500 dark:bg-gray-700 
          text-white dark:text-gray-200 
          rounded-full px-2 py-0.5 mb-0.5">
                        {formatter.format(cv?.lastMessageDetails?.unReadMessages)}
                      </span>
                    ) : null}

                    <span>{dayjs(user.time).format("hh:mm A")}</span>
                  </div>
                </li>

              );
            })
          )}
        </ul>
      </div>

      <div
        className={`fixed z-50 h-full w-full sm:w-56 md:w-72 xl:w-96 
         bg-gray-200 dark:bg-gray-800 
        border-r border-gray-300 dark:border-gray-700 
        p-4 flex flex-col transform transition-transform duration-300 ease-in-out 
        ${isUserListOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100 flex justify-between items-center">
          <button
            className="rounded-full p-2 shadow-md  shadow-teal-400 dark:shadow-teal-600  cursor-pointer 
                     text-gray-600 dark:text-gray-200  hover:text-teal-400 dark:hover:text-teal-300  bg-white
                      dark:bg-gray-800 transition-all ease-in-out "
            onClick={() => {
              setIsUserListOpen(false);
              setSearchTerm("");
            }}
          >
            <MoveLeft className="w-5 h-5" />
          </button>
        </h3>

        {/* Search */}
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 
        text-gray-500 dark:text-gray-400 w-5 h-5" />

          <input
            type="text"
            placeholder="Search or start a new chat"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 pl-10 rounded-md 
              border border-gray-300 dark:border-gray-600 
             bg-white dark:bg-gray-700 
              focus:outline-none 
              text-sm text-gray-800 dark:text-gray-100"
          />
        </div>

        <h3 className="text-gray-500 dark:text-gray-400 font-bold ml-2 mb-3">
          Connect with us
        </h3>

        {/* User List */}
        <ul className="space-y-2 overflow-y-auto flex-1">
          {filteredUsers?.length === 0 ? (
            <li className="flex items-center justify-center h-40 text-gray-500 dark:text-gray-400 text-sm">
              No user found
            </li>
          ) : (
            filteredUsers.map((cv, i) => (
              <li
                key={i}
                className="cursor-pointer flex items-center gap-3 p-2 rounded-md 
            hover:bg-gray-300 dark:hover:bg-gray-700 
            shadow-sm"
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
                  };
                  dispatch(setSelectUser(payload));
                  setIsUserListOpen(false);
                  setShowSidebar(false);
                  dispatch(setChatMessagesClear([]));
                  fetchMessages(1, payload);
                }}
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-full 
            bg-gray-400 dark:bg-gray-600 
            text-white dark:text-gray-200 font-semibold">
                  {cv?.name
                    ?.split(" ")
                    ?.map((word) => word[0])
                    .join("")
                    .toUpperCase()}
                </div>

                <div className="flex-1 overflow-hidden">
                  <p className="font-medium text-gray-800 dark:text-gray-100 truncate whitespace-nowrap overflow-hidden text-ellipsis">
                    {highlightText(cv.name, searchTerm)}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate whitespace-nowrap overflow-hidden text-ellipsis">
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

      {
        openCreateGroupModle && (
          <GroupCreateModal setOpenCreateGroupModle={setOpenCreateGroupModle} />
        )
      }
    </>
  );
};

export default ChatSidebar;
