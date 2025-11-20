import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AirVent, Bell, EllipsisVertical, Grip, Image, LifeBuoy, LogOut, MessageCircle, Phone, Settings, SunMoon, User, Video, Brain } from 'lucide-react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { dummyImage } from '../assets';
import LogOutModal from './LogOutModalPage';
import { useSelector } from 'react-redux';
import { formatter } from '../Utils/Auth';
import Themetoggle from './themetoggle/Themetoggle';

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
        <header className="fixed top-0 left-0 w-full bg-white dark:bg-gray-800 py-2 px-4 z-10 shadow flex items-center justify-between">
            {/* Left side: Logo */}
            <a
                href="/"
                className="projectName flex items-center space-x-1 font-semibold text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
                <span className="text-teal-600 text-xl sm:text-xl md:text-3xl">Baat</span>
                <span className="text-gray-800 dark:text-gray-100 text-lg sm:text-xl md:text-2xl">Cheet</span>
            </a>

            {/* Center Buttons */}
            <div className="hidden md:flex gap-2 text-gray-800 dark:text-gray-100 font-semibold text-base">
                <button
                    onClick={() => navigate('/')}
                    className="rounded-full p-2 shadow-md  shadow-teal-400 dark:shadow-teal-600  cursor-pointer 
                     text-gray-600 dark:text-gray-200  hover:text-teal-400 dark:hover:text-teal-300  bg-white
                      dark:bg-gray-800 transition-all ease-in-out "
                >
                    <Grip className="w-5 h-5" />
                </button>
                <button
                    onClick={() => navigate('/posts')}
                    className="rounded-full p-2 shadow-md  shadow-teal-400 dark:shadow-teal-600  cursor-pointer 
                     text-gray-600 dark:text-gray-200  hover:text-teal-400 dark:hover:text-teal-300  bg-white
                      dark:bg-gray-800 transition-all ease-in-out "
                >
                    <Image className="w-5 h-5" />
                </button>
            </div>

            {/* Right Side */}
            <div className="flex items-center relative">
                <div className="hidden md:flex items-center gap-2">

                    {/* Theme Toggle */}
                    <div className="relative">
                        <div >
                            <Themetoggle />
                        </div>
                    </div>

                    {/* AI Chat */}
                    <div className="relative">
                        <button
                            onClick={() => navigate("/ai-chat")}
                            className="rounded-full p-2 shadow-md  shadow-teal-400 dark:shadow-teal-600  cursor-pointer 
                     text-gray-600 dark:text-gray-200  hover:text-teal-400 dark:hover:text-teal-300  bg-white
                      dark:bg-gray-800 transition-all ease-in-out "
                        >
                            <Brain className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div className="relative">
                        <button
                            onClick={() => navigate("/chat")}
                            className="rounded-full p-2 shadow-md  shadow-teal-400 dark:shadow-teal-600  cursor-pointer 
                     text-gray-600 dark:text-gray-200  hover:text-teal-400 dark:hover:text-teal-300  bg-white
                      dark:bg-gray-800 transition-all ease-in-out "
                        >
                            <MessageCircle className="w-5 h-5" />
                        </button>

                        {unreadMessages > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full">
                                {formatter.format(unreadMessages)}
                            </span>
                        )}
                    </div>

                    {/* Notification Bell */}
                    <div className="relative">
                        <button className="rounded-full p-2 shadow-md  shadow-teal-400 dark:shadow-teal-600  cursor-pointer 
                     text-gray-600 dark:text-gray-200  hover:text-teal-400 dark:hover:text-teal-300  bg-white
                      dark:bg-gray-800 transition-all ease-in-out "
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

                <div className="md:hidden  items-center gap-2">

                    {/* Theme Toggle */}
                    <div className="relative">
                        <div >
                            <Themetoggle />
                        </div>
                    </div>
                </div>
                {/* Profile Dropdown */}
                <Menu as="div" className="relative inline-block text-left pl-4 h-9">
                    <div>
                        <MenuButton className="rounded-md text-gray-700 dark:text-gray-200 cursor-pointer">
                            <img
                                src={dummyImage}
                                alt="Profile"
                                className="w-10 h-10 rounded-full cursor-pointer border-2 border-gray-300 dark:border-gray-500"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                aria-hidden="true"
                            />
                        </MenuButton>
                    </div>

                    <MenuItems
                        transition
                        className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y 
                divide-gray-100 dark:divide-gray-700 rounded-md bg-white dark:bg-gray-800 
                shadow-lg ring-1 ring-black/5 dark:ring-white/10 transition 
                focus:outline-hidden data-closed:scale-95 data-closed:opacity-0"
                    >
                        {/* MOBILE ITEMS */}
                        <button
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition md:hidden"
                            onClick={() => navigate("/")}
                        >
                            <Grip className="w-5 h-5" />
                            Home
                        </button>

                        <button
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition md:hidden"
                            onClick={() => navigate("/posts")}
                        >
                            <Image className="w-5 h-5" />
                            Post
                        </button>

                        <button
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition md:hidden"
                            onClick={() => navigate("/ai-chat")}
                        >
                            <Brain className="w-5 h-5" />
                            AI Chat
                        </button>

                        <button
                            className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition md:hidden"
                            onClick={() => navigate("/chat")}
                        >
                            <span className="flex items-center gap-3">
                                <MessageCircle className="w-5 h-5" />
                                Chat
                            </span>
                            {unreadMessages > 0 && (
                                <span className="bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                    {formatter.format(unreadMessages)}
                                </span>
                            )}
                        </button>

                        <button
                            className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition md:hidden"
                            onClick={() => console.log("Notification clicked")}
                        >
                            <span className="flex items-center gap-3">
                                <Bell className="w-5 h-5" />
                                Notification
                            </span>
                            {unreadNotifications > 0 && (
                                <span className="bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                    {formatter.format(unreadNotifications)}
                                </span>
                            )}
                        </button>

                        {/* MAIN MENU OPTIONS */}
                        <button
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                        >
                            <User className="w-5 h-5" />
                            Profile
                        </button>

                        <button
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                        >
                            <Settings className="w-5 h-5" />
                            Account Settings
                        </button>

                        <button
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                        >
                            <SunMoon className="w-5 h-5" />
                            Theme: Light/Dark
                        </button>

                        <button
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                        >
                            <Bell className="w-5 h-5" />
                            Notifications
                        </button>

                        <button
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                        >
                            <LifeBuoy className="w-5 h-5" />
                            Support
                        </button>

                        {/* LOGOUT */}
                        <button
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-red-200 dark:hover:bg-red-700/30 text-red-600 dark:text-red-400"
                            onClick={() => setIsLogoutModalOpen(true)}
                        >
                            <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
                            <span className="font-medium">Logout</span>
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
