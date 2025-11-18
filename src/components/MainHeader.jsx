import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AirVent, Bell, EllipsisVertical, Grip, Image, LifeBuoy, LogOut, MessageCircle, Phone, Settings, SunMoon, User, Video, Brain } from 'lucide-react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { dummyImage } from '../assets';
import LogOutModal from './LogOutModalPage';
import { useSelector } from 'react-redux';
import { formatter } from '../Utils/Auth';

const MainHeader = () => {
    const navigate = useNavigate();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { singleConversationList, groupConversationList } = useSelector((state) => state?.ChatDataSlice);

    // Dummy counts for demo
    const singleMessageCount = singleConversationList?.filter(i => i?.lastMessageDetails?.unReadMessages > 0) || []
    const groupMessageCount = groupConversationList?.filter(i => i?.lastMessageDetails?.unReadMessages > 0) || []
    const unreadMessages = singleMessageCount.length + groupMessageCount.length;
    const unreadNotifications = 5;
    return (
        <header className="fixed top-0 left-0 w-full bg-white py-2 px-4 z-10 shadow flex items-center justify-between">
            {/* Left side: Logo */}
            <a
                href="/"
                className="projectName flex items-center space-x-1 font-semibold text-gray-800 hover:text-blue-600 transition-colors"
            >
                <span className="text-teal-600 text-xl sm:text-xl md:text-3xl">Baat</span>
                <span className="text-gray-800 text-lg sm:text-xl md:text-2xl">Cheet</span>
            </a>

            {/* Center: Home & Post */}
            <div className="hidden md:flex gap-2 text-gray-800 font-semibold text-base">
                <button onClick={() => navigate('/')} className="text-xl text-gray-700 hover:bg-gray-200 p-2 cursor-pointer rounded-md"><Grip className="w-5 h-5" /></button>
                <button onClick={() => navigate('/posts')} className="text-xl text-gray-700 hover:bg-gray-200 p-2 cursor-pointer rounded-md"><Image className="w-5 h-5" /></button>
            </div>

            {/* Right side: Icons + Profile */}
            <div className="flex items-center relative">
                <div className="hidden md:flex items-center gap-2">

                    {/* AI Chat Icon */}
                    <div className="relative">
                        <button
                            onClick={() => navigate("/ai-chat")}
                            className="p-2 rounded-md hover:bg-gray-200 text-gray-700"
                        >
                            <Brain className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Chat Messages Icon */}
                    <div className="relative">
                        <button
                            onClick={() => navigate("/chat")}
                            className="p-2 rounded-md hover:bg-gray-200 text-gray-700"
                        >
                            <MessageCircle className="w-5 h-5" />
                        </button>

                        {unreadMessages > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full">
                                {formatter.format(unreadMessages)}
                            </span>
                        )}
                    </div>

                    {/* Notification Icon */}
                    <div className="relative">
                        <button
                            className="p-2 rounded-md hover:bg-gray-200 text-gray-700"
                        >
                            <Bell className="w-5 h-5" />
                        </button>

                        {unreadNotifications > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full">
                                {formatter.format(unreadNotifications)}
                            </span>
                        )}
                    </div>

                </div>

                {/* Profile Dropdown */}
                <Menu as="div" className="relative inline-block text-left pl-4">
                    <div>
                        <MenuButton className="rounded-md text-gray-700 cursor-pointer">
                            <img
                                src={dummyImage}
                                alt="Profile"
                                className="w-10 h-10 rounded-full cursor-pointer border-2 border-gray-300"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                aria-hidden="true"
                            />
                        </MenuButton>
                    </div>

                    <MenuItems
                        transition
                        className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                    >
                        {/* Profile Section */}
                        <button
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 transition md:hidden  "
                            onClick={() => console.log("Archive clicked")}
                        >
                            <Grip className="w-5 h-5" />
                            Home
                        </button>
                        <button
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 transition md:hidden  "
                            onClick={() => console.log("Archive clicked")}
                        >
                            <Image className="w-5 h-5" />
                            Post
                        </button>
                        <button
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 transition md:hidden  "
                            onClick={() => navigate("/ai-chat")}
                        >
                            <Brain className="w-5 h-5" />
                            AI Chat
                        </button>
                        <button
                            className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 transition md:hidden"
                            onClick={() => navigate("/chat")}
                        >
                            <span className="flex items-center gap-3">
                                <MessageCircle className="w-5 h-5" />
                                Chat
                            </span>
                            {unreadMessages > 0 &&
                                <span className="bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                    {formatter.format(unreadMessages)}
                                </span>
                            }
                        </button>
                        <button
                            className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 transition md:hidden"
                            onClick={() => console.log("Notification clicked")}
                        >
                            <span className="flex items-center gap-3">
                                <Bell className="w-5 h-5" />
                                Notification
                            </span>
                            {unreadNotifications > 0 &&
                                <span className="bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                    {formatter.format(unreadNotifications)}
                                </span>
                            }
                        </button>

                        <button
                            className=" flex items-center  gap-3 w-full px-4 py-2 text-sm hover:bg-gray-200 text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                            onClick={() => console.log("Profile clicked")}
                        >
                            <User className="w-5 h-5 text-gray-700" />
                            Profile
                        </button>
                        <button
                            className=" flex items-center  gap-3 w-full px-4 py-2 text-sm hover:bg-gray-200 text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                            onClick={() => console.log("Account Settings clicked")}
                        >
                            <Settings className="w-5 h-5 text-gray-700" />
                            Account Settings
                        </button>
                        <button
                            className=" flex items-center  gap-3 w-full px-4 py-2 text-sm hover:bg-gray-200 text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                            onClick={() => console.log("Theme Toggle clicked")}
                        >
                            <SunMoon className="w-5 h-5 text-gray-700" />
                            Theme: Light/Dark
                        </button>
                        <button
                            className=" flex items-center  gap-3 w-full px-4 py-2 text-sm hover:bg-gray-200 text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                            onClick={() => console.log("Notifications clicked")}
                        >
                            <Bell className="w-5 h-5 text-gray-700" />
                            Notifications
                        </button>
                        <button
                            className=" flex items-center  gap-3 w-full px-4 py-2 text-sm hover:bg-gray-200 text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                            onClick={() => console.log("Support clicked")}
                        >
                            <LifeBuoy className="w-5 h-5 text-gray-700" />
                            Support
                        </button>

                        {/* Logout */}
                        <button
                            className=" flex items-center  gap-3 w-full px-4 py-2 text-sm hover:bg-red-200 text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                            onClick={() => setIsLogoutModalOpen(true)}
                        >
                            <LogOut className="w-5 h-5 text-red-600" />
                            <span className="text-red-600 font-medium">Logout</span>
                        </button>
                    </MenuItems>
                </Menu>
            </div>

            {isLogoutModalOpen && (
                <LogOutModal setIsLogoutModalOpen={setIsLogoutModalOpen} loading={loading} setLoading={setLoading} />
            )}
        </header>
    )
}

export default MainHeader
