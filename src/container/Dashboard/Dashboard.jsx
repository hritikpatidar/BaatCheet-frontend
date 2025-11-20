import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { post1 } from "../../assets"; // update your image import path
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { setChatMessagesClear, setSelectUser } from "../../Redux/features/Chat/chatSlice";
import { useSocket } from "../../context/SocketContext";
import { decryptMessage, formatter } from "../../Utils/Auth";
import dayjs from "dayjs";
import CreatePost from "../../components/createPost";

const DashboardPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const profileData = useSelector((state) => state?.authReducer?.AuthSlice?.profileDetails);
    const { userList, singleConversationList, selectedUser } = useSelector((state) => state?.ChatDataSlice);
    const { socket, fetchMessages, hasMore, setHasMore, setPage, } = useSocket();

    const filteredUsers = userList?.filter(
        (cv) =>
            cv?._id !== profileData?._id && cv.name
    );

    const filteredList = singleConversationList?.filter((cv) => {
        const data = cv?.members?.find((item) => item._id !== profileData?._id)
        return data
    });

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 font-sans px-2 sm:px-4 pt-12 transition-colors duration-300">

            {/* ===== Main Layout ===== */}
            <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 
                gap-4 md:gap-6 mt-6 
                md:h-[calc(100vh-6rem)] 
                md:overflow-hidden 
                "
            >

                {/* ----- Left Sidebar ----- */}
                <aside className="md:col-span-3 order-2 md:order-1 flex flex-col gap-4">

                    {/* Suggested Users */}
                    <div className="bg-white dark:bg-gray-800 h-76 rounded-xl p-4 
          shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">

                        <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">
                            Suggested Users
                        </h2>

                        <ul className="space-y-2 overflow-y-auto flex-1 
            scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
                            {filteredUsers?.length === 0 ? (
                                <li className="flex items-center justify-center h-40 
                text-gray-500 dark:text-gray-400 text-sm">
                                    No user found
                                </li>
                            ) : (
                                filteredUsers.map((cv, i) => (
                                    <li
                                        key={i}
                                        className="cursor-pointer flex items-center gap-3 p-2 rounded-md 
                    hover:bg-gray-300 dark:hover:bg-gray-700 
                    shadow-sm transition"
                                        onClick={() => {
                                            const payload = {
                                                _id: "",
                                                conversationType: "single",
                                                members: [
                                                    { _id: cv?._id, name: cv?.name, email: cv?.email, profile: "" }
                                                ],
                                                status: "sent",
                                                isChatDisabled: false,
                                            };
                                            dispatch(setSelectUser(payload));
                                            dispatch(setChatMessagesClear([]));
                                            fetchMessages(1, payload);
                                            navigate("/chat");
                                        }}
                                    >
                                        <div className="w-10 h-10 flex items-center justify-center rounded-full 
                    bg-gray-400 dark:bg-gray-600 text-white font-semibold">
                                            {cv?.name?.split(" ").map((w) => w[0]).join("").toUpperCase()}
                                        </div>

                                        <div className="flex-1 overflow-hidden">
                                            <p className="font-medium text-gray-800 dark:text-gray-200 truncate">
                                                {cv.name}
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                                This theme is awesome!
                                            </p>
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>

                    {/* Recent Chats */}
                    <div className="bg-white dark:bg-gray-800 h-78 rounded-xl p-4 shadow-sm 
          border border-gray-100 dark:border-gray-700">
                        <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">
                            Recent Chats
                        </h2>

                        <ul className="space-y-2 overflow-y-auto flex-1 
            scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
                            {filteredList?.length === 0 ? (
                                <li className="flex items-center justify-center h-40 
                text-gray-500 dark:text-gray-400 text-sm">
                                    No user found
                                </li>
                            ) : (
                                filteredList.map((cv, i) => {
                                    const data = cv.members.find((m) => m._id !== profileData?._id)
                                    const user = {
                                        senderId: cv?.lastMessageDetails?.isSenderId,
                                        name: data?.name,
                                        profile: data?.image,
                                        message: cv?.lastMessageDetails?.message,
                                        messageType: cv?.lastMessageDetails?.messageType,
                                        time: cv?.lastMessageDetails?.timestamp
                                    }

                                    const isYour = user.senderId === profileData?._id

                                    return (
                                        <li
                                            key={i}
                                            className="cursor-pointer flex items-center gap-3 p-2 rounded-md 
                      hover:bg-gray-300 dark:hover:bg-gray-700 
                      shadow-sm transition"
                                            onClick={() => {
                                                dispatch(setSelectUser(cv));
                                                dispatch(setChatMessagesClear([]));
                                                fetchMessages(1, cv);
                                                navigate("/chat");
                                            }}
                                        >

                                            {/* Profile */}
                                            <div className="w-12 h-12 flex items-center justify-center rounded-full 
                      bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-200 
                      text-2xl font-semibold overflow-hidden">
                                                {user.profile ? (
                                                    <img src={user.profile} className="w-12 h-12 rounded-full object-cover" />
                                                ) : (
                                                    user.name?.split(" ").map((n, idx) =>
                                                        idx < 2 ? n[0] : ""
                                                    ).join("").toUpperCase()
                                                )}
                                            </div>

                                            {/* Name + Message */}
                                            <div className="flex-1 overflow-hidden">
                                                <p className="font-medium text-gray-800 dark:text-gray-200 truncate">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                                    {isYour ? "You: " : ""}
                                                    {user.messageType === "file" ? "File" :
                                                        user.messageType === "audio" ? "Audio" :
                                                            decryptMessage(user.message) || "Start Conversation"}
                                                </p>
                                            </div>

                                            {/* Time */}
                                            <div className="flex flex-col items-end text-xs text-gray-500 dark:text-gray-400">
                                                {cv?.lastMessageDetails?.unReadMessages &&
                                                    cv?._id !== selectedUser?._id ? (
                                                    <span className="inline-block bg-gray-500 dark:bg-gray-600 text-white 
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
                </aside>

                {/* ----- Center Feed ----- */}
                <section className="
                    md:col-span-6 
                    order-1 md:order-2 
                    flex flex-col space-y-6 
                    md:h-full 
                    overflow-visible md:overflow-y-auto 
                    scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700"
                >

                    <CreatePost />

                    {/* Post */}
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm 
        border border-gray-100 dark:border-gray-700 
        max-w-[600px] mx-auto w-full"
                        >
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-9 h-9 rounded-full bg-gray-300 dark:bg-gray-600 
            flex items-center justify-center text-white text-sm">
                                    R
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm">
                                        Ritik Patidar
                                    </h3>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                                        2 hours ago
                                    </p>
                                </div>
                            </div>

                            {/* Text */}
                            <p className="text-gray-700 dark:text-gray-300 mb-2 text-sm leading-snug">
                                This is a sample post content.
                            </p>

                            {/* Image */}
                            <img
                                src={post1}
                                className="w-full rounded-lg mb-2 object-cover max-h-56"
                            />

                            {/* Footer */}
                            <div className="flex justify-between text-xs 
        text-gray-600 dark:text-gray-400 
        pt-2 border-t border-gray-200 dark:border-gray-700">

                                <button className="hover:text-green-600 dark:hover:text-green-400">
                                    👍 Like
                                </button>

                                <button className="hover:text-green-600 dark:hover:text-green-400">
                                    💬 Comment
                                </button>

                                <button className="hover:text-green-600 dark:hover:text-green-400">
                                    ↗ Share
                                </button>

                            </div>
                        </div>
                    ))}

                </section>

                {/* ----- Right Sidebar ----- */}
                <aside className="md:col-span-3 order-3 flex flex-col gap-4">

                    {/* Notifications */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm 
          border border-gray-100 dark:border-gray-700">

                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-semibold text-gray-700 dark:text-gray-200 text-lg">
                                Notifications
                            </h2>
                            <button className="text-green-600 dark:text-green-400 text-sm hover:font-bold">
                                Clear All
                            </button>
                        </div>

                        <ul className="max-h-48 overflow-y-auto 
            scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">

                            {[
                                { icon: "💬", message: "New comment on your post", time: "2m ago" },
                                { icon: "👤", message: "Friend request from Ankit", time: "15m ago" },
                                { icon: "👍", message: "Ritika liked your post", time: "1h ago" },
                                { icon: "🎉", message: "You have a new badge!", time: "3h ago" },
                                { icon: "📢", message: "Update: New features released", time: "1d ago" },
                            ].map((notif, i) => (
                                <li
                                    key={i}
                                    className="flex items-center justify-between p-2 rounded-lg 
                  hover:bg-green-50 dark:hover:bg-green-900/20 
                  transition cursor-pointer"
                                >
                                    <div className="flex items-center">
                                        <span className="text-lg">{notif.icon}</span>
                                        <span className="text-gray-700 dark:text-gray-300 text-sm">
                                            {notif.message}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-400 dark:text-gray-500">
                                        {notif.time}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Trending Topics */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm 
          border border-gray-100 dark:border-gray-700">

                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-semibold text-gray-700 dark:text-gray-200 text-lg">
                                Trending Topics
                            </h2>
                            <button className="text-green-600 dark:text-green-400 text-sm hover:font-bold">
                                View All
                            </button>
                        </div>

                        <ul>
                            {[
                                { tag: "#reactjs", posts: "12.4K posts" },
                                { tag: "#tailwind", posts: "8.9K posts" },
                                { tag: "#uiux", posts: "5.2K posts" },
                                { tag: "#webdev", posts: "3.4K posts" },
                            ].map((topic, i) => (
                                <li
                                    key={i}
                                    className="group flex items-center justify-between p-2 rounded-lg 
                  hover:bg-green-50 dark:hover:bg-green-900/20 
                  transition cursor-pointer"
                                >
                                    <span className="text-green-600 dark:text-green-400 font-medium">
                                        {topic.tag}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {topic.posts}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
            </main>
        </div>

    );
};

export default DashboardPage;
