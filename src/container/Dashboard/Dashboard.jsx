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
        <div className="min-h-screen bg-gray-100 font-sans px-2 sm:px-4 pt-12">
            {/* ===== Main Layout ===== */}
            <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 mt-6 h-[calc(100vh-6rem)] overflow-hidden ">
                {/* ----- Left Sidebar ----- */}
                <aside className="md:col-span-3 order-2 md:order-1 flex flex-col gap-4">
                    {/* Suggested Users */}
                    <div className="bg-white h-76 rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col">
                        <h2 className="font-semibold text-gray-700 mb-3">Suggested Users</h2>
                        {/* User List */}
                        <ul className="space-y-2 overflow-y-auto flex-1">
                            {filteredUsers?.length === 0 ? (
                                <li className="flex items-center justify-center h-40 text-gray-500 text-sm">
                                    No user found
                                </li>
                            ) : (
                                filteredUsers.map((cv, i) => (
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
                                            };
                                            dispatch(setSelectUser(payload));
                                            dispatch(setChatMessagesClear([]));
                                            fetchMessages(1, payload);
                                            navigate("/chat")
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

                    {/* Recent Chats */}
                    <div className="bg-white h-78 rounded-xl p-4 shadow-sm border border-gray-100">
                        <h2 className="font-semibold text-gray-700 mb-3">Recent Chats</h2>
                        {/* 🔹 Recent Chats */}
                        <ul className="space-y-2 overflow-y-auto flex-1">
                            {filteredList?.length === 0 ? (
                                <li className="flex items-center justify-center h-40 text-gray-500 text-sm">
                                    No user found
                                </li>
                            ) : (
                                filteredList?.map((cv, i) => {
                                    const data = cv?.members?.find(
                                        (item) => item._id !== profileData?._id
                                    );

                                    let user = {};
                                    user.senderId = cv?.lastMessageDetails?.isSenderId;
                                    user.name = data?.name;
                                    user.profile = data?.image;
                                    user.message = cv?.lastMessageDetails?.message;
                                    user.messageType = cv?.lastMessageDetails?.messageType;
                                    user.time = cv?.lastMessageDetails?.timestamp;


                                    const isYour = user.senderId === profileData?._id;
                                    const invite = cv?.invites?.find(
                                        (invite) => invite?.invitedUser?._id === profileData?._id
                                    );

                                    return (
                                        <li
                                            key={i}
                                            className={`cursor-pointer flex items-center gap-3 p-2 rounded-md hover:bg-gray-300 shadow-sm`}
                                            onClick={() => {
                                                if (hasMore) return;
                                                dispatch(setSelectUser(cv));
                                                dispatch(setChatMessagesClear([]));
                                                setHasMore(true);
                                                setPage(1);
                                                fetchMessages(1, cv);
                                                navigate("/chat")
                                            }}
                                        >
                                            {/* Profile */}
                                            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 text-2xl sm:text-2xl font-semibold text-gray-600 overflow-hidden">
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
                                                <p className="font-medium truncate">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs truncate">
                                                    <>
                                                        {isYour ? t("you") + ": " : ""}
                                                        {cv?.lastMessageDetails?.messageType === "file" || cv?.lastMessageDetails?.messageType === "audio"
                                                            ? cv?.lastMessageDetails?.messageType === "file" ? "File" : "Audio"
                                                            : decryptMessage(user?.message) || "Start Conversation"}
                                                    </>
                                                </p>
                                            </div>

                                            {/* Time + unread count */}
                                            <div className="flex flex-col items-end text-xs text-gray-500">
                                                {cv?.lastMessageDetails?.unReadMessages &&
                                                    cv?._id !== selectedUser?._id &&
                                                    !invite ? (
                                                    <span className="inline-block bg-gray-500 text-white rounded-full px-2 py-0.5 mb-0.5">
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
                <section className="  md:col-span-6 order-1 md:order-2 flex flex-col space-y-6  h-full overflow-y-auto pr-2">
                    {/* Create Post */}
                    <CreatePost />

                    {/* Posts */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold">
                                R
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-700 text-sm sm:text-base">
                                    Ritik Patidar
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-500">2 hours ago</p>
                            </div>
                        </div>

                        <p className="text-gray-700 mb-3 text-sm sm:text-base">
                            This is a sample post content. You can customize this section to show
                            user posts with or without images.
                        </p>
                        <img src={post1} alt="post" className="w-full rounded-lg mb-3 object-cover max-h-80 sm:max-h-72 md:max-h-64" />
                        <div className="flex justify-between text-xs sm:text-sm text-gray-600 pt-2 border-t border-gray-100">
                            <button className="hover:text-green-600 transition">👍 Like</button>
                            <button className="hover:text-green-600 transition">💬 Comment</button>
                            <button className="hover:text-green-600 transition">↗ Share</button>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold">
                                R
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-700 text-sm sm:text-base">
                                    Ritik Patidar
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-500">2 hours ago</p>
                            </div>
                        </div>

                        <p className="text-gray-700 mb-3 text-sm sm:text-base">
                            This is a sample post content. You can customize this section to show
                            user posts with or without images.
                        </p>
                        <img src={post1} alt="post" className="w-full rounded-lg mb-3 object-cover max-h-80 sm:max-h-72 md:max-h-64" />
                        <div className="flex justify-between text-xs sm:text-sm text-gray-600 pt-2 border-t border-gray-100">
                            <button className="hover:text-green-600 transition">👍 Like</button>
                            <button className="hover:text-green-600 transition">💬 Comment</button>
                            <button className="hover:text-green-600 transition">↗ Share</button>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold">
                                R
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-700 text-sm sm:text-base">
                                    Ritik Patidar
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-500">2 hours ago</p>
                            </div>
                        </div>

                        <p className="text-gray-700 mb-3 text-sm sm:text-base">
                            This is a sample post content. You can customize this section to show
                            user posts with or without images.
                        </p>
                        <img src={post1} alt="post" className="w-full rounded-lg mb-3 object-cover max-h-80 sm:max-h-72 md:max-h-64" />
                        <div className="flex justify-between text-xs sm:text-sm text-gray-600 pt-2 border-t border-gray-100">
                            <button className="hover:text-green-600 transition">👍 Like</button>
                            <button className="hover:text-green-600 transition">💬 Comment</button>
                            <button className="hover:text-green-600 transition">↗ Share</button>
                        </div>
                    </div>
                    {/* ...more posts */}
                </section>

                {/* ----- Right Sidebar ----- */}
                <aside className="md:col-span-3 order-3 flex flex-col gap-4" >
                    {/* 🔔 Notifications Section */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-semibold text-gray-700 text-lg">Notifications</h2>
                            <button className="text-green-600 text-sm hover:font-bold">
                                Clear All
                            </button>
                        </div>

                        <ul className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                            {[
                                { icon: "💬", message: "New comment on your post", time: "2m ago" },
                                { icon: "👤", message: "Friend request from Ankit", time: "15m ago" },
                                { icon: "👍", message: "Ritika liked your post", time: "1h ago" },
                                { icon: "🎉", message: "You have a new badge!", time: "3h ago" },
                                { icon: "📢", message: "Update: New features released", time: "1d ago" },
                            ].map((notif, i) => (
                                <li
                                    key={i}
                                    className="flex items-center justify-between p-2 rounded-lg hover:bg-green-50 transition cursor-pointer"
                                >
                                    <div className="flex items-center">
                                        <span className="text-lg">{notif.icon}</span>
                                        <span className="text-gray-700 text-sm">{notif.message}</span>
                                    </div>
                                    <span className="text-xs text-gray-400">{notif.time}</span>
                                </li>
                            ))}
                        </ul>
                    </div>


                    {/* 🔥 Trending Topics Section */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-semibold text-gray-700 text-lg">Trending Topics</h2>
                            <button className="text-green-600 text-sm hover:font-bold">
                                View All
                            </button>
                        </div>

                        <ul className="">
                            {/* Topic Item */}
                            {[
                                { tag: "#reactjs", posts: "12.4K posts" },
                                { tag: "#tailwind", posts: "8.9K posts" },
                                { tag: "#uiux", posts: "5.2K posts" },
                                { tag: "#webdev", posts: "3.4K posts" },
                            ].map((topic, i) => (
                                <li
                                    key={i}
                                    className="group flex items-center justify-between p-2 rounded-lg hover:bg-green-50 transition cursor-pointer "
                                >
                                    <div className="flex items-center">
                                        <span className="text-green-600 font-medium group-hover:text-green-700">
                                            {topic.tag}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-500">{topic.posts}</span>
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
