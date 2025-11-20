import React, { useState } from 'react';
import { Users, Image as ImageIcon, UserCheck, ChevronDown, X } from 'lucide-react';
import { groupCreateValidation } from '../Utils/validation';
import { createGroup, setGroupCreateLoading } from '../Redux/features/Chat/chatSlice';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useSocket } from '../context/SocketContext';
import { uploadFileService } from '../Services/ChatServices';

const usersList = [
    { id: 1, name: 'Ritik Patidar bheelawat', status: 'Code करता हूँ, coffee के साथ ☕' },
    { id: 2, name: 'John Doe', status: 'Living life one bug at a time 🐞' },
    { id: 3, name: 'Priya Sharma', status: 'सपनों को पंख लगा रही हूँ ✨' },
    { id: 4, name: 'Ankit Meena', status: 'Be humble. Be hungry. 🚀' },
    { id: 5, name: 'Neha Verma', status: 'हर दिन कुछ नया सीखना है 📚' },
    { id: 6, name: 'Amit Joshi', status: 'Gym, Code, Sleep, Repeat 💪' },
    { id: 7, name: 'Sneha Gupta', status: 'Shining like the whole universe is mine ✨' },
    { id: 8, name: 'Rahul Singh', status: 'चलो कुछ अलग करते हैं आज 🔥' },
    { id: 9, name: 'Pooja Kumari', status: 'Smile. It confuses people 😄' },
    { id: 10, name: 'Vikas Dubey', status: 'Mindset is everything 🧠' },
];

const GroupCreateModal = ({ setOpenCreateGroupModle }) => {
    const dispatch = useDispatch()
    const { socket } = useSocket()
    const { groupCreateLoading, userList } = useSelector((state) => state?.ChatDataSlice);
    const profileData = useSelector((state) => state?.authReducer?.AuthSlice?.profileDetails);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [errorMessages, setErrorMessages] = useState({});

    const [formData, setFormData] = useState({
        groupName: '',
        invites: [],
        image: null,
        toggles: {
            edit_group_setting: false,
            send_msg: false,
            add_member: false,
            invite_via_link: false,
            approve_new_member: false,
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newData = { [name]: value };
        if (name === "groupName" && value.length > 30) return

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        const { errors } = groupCreateValidation(newData);
        setErrorMessages({
            ...errorMessages,
            ...errors,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData((prev) => ({
            ...prev,
            image: file,
        }));
    };

    const handleToggleChange = (key) => {
        setFormData((prev) => ({
            ...prev,
            toggles: {
                ...prev.toggles,
                [key]: !prev.toggles[key],
            },
        }));
    };

    const handleInviteSelect = (selectedUser) => {
        const alreadyInvited = formData.invites.some((u) => u === selectedUser._id);
        const updatedInvites = alreadyInvited
            ? formData.invites.filter((u) => u !== selectedUser._id)
            : [...formData.invites, selectedUser?._id];
        const e = {
            target: {
                name: "invites",
                value: updatedInvites
            }
        }
        handleChange(e)
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const { errors, isValid } = groupCreateValidation(formData);
        setErrorMessages({
            ...errorMessages,
            ...errors,
        });
        if (!isValid) return;
        dispatch(setGroupCreateLoading(true));
        try {
            const data = new FormData();
            data.append("file", formData.image); // Append the file to the FormData
            const imageUrl = await uploadFileService(data);
            debugger
            socket.current.emit("createGroup", {
                name: formData.groupName,
                invites: formData.invites,
                image: imageUrl?.data?.data, // or base64 string or URL
                edit_group_setting: formData.toggles.edit_group_setting,
                send_msg: formData.toggles.send_msg,
                add_member: formData.toggles.add_member,
                invite_via_link: formData.toggles.invite_via_link,
                approve_new_member: formData.toggles.approve_new_member,
                user_id: profileData?._id,
            });
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4 sm:px-0">
            <form
                onSubmit={handleSubmit}
                className="bg-white dark:bg-gray-800 
        w-full max-w-lg p-8 rounded-2xl shadow-md 
        border border-gray-300 dark:border-gray-700 
        font-sans"
            >
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 text-center mb-6">
                    Create Group
                </h2>

                {/* Group Name */}
                <div className="relative mb-4">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                        Group Name
                    </label>
                    <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300" />
                        <input
                            type="text"
                            placeholder="Enter group name"
                            name="groupName"
                            value={formData.groupName}
                            maxLength={30}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-12 py-2 
            ${errorMessages?.groupName ? "border border-red-500" : "border border-gray-300 dark:border-gray-600"} 
            rounded-md bg-gray-50 dark:bg-gray-700 
            text-sm text-gray-800 dark:text-gray-100 
            focus:outline-none`}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 dark:text-gray-400">
                            {formData.groupName.length}/30
                        </span>
                    </div>
                </div>

                {/* Group Image */}
                <div className="relative mb-4">
                    <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300" />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full pl-10 pr-3 py-2 
            border border-gray-300 dark:border-gray-600 
            rounded-md 
            bg-gray-50 dark:bg-gray-700 
            text-sm text-gray-800 dark:text-gray-100 
            cursor-pointer"
                    />
                </div>

                {/* Invites Dropdown */}
                <div className="relative mb-4">
                    <UserCheck className="absolute left-3 top-1/3 transform -translate-y-1/2 text-gray-400 dark:text-gray-300" />

                    <div
                        className={`w-full pl-10 pr-3 py-2 ${errorMessages?.invites
                            ? "border border-red-500"
                            : "border border-gray-300 dark:border-gray-600"
                            } rounded-md 
          bg-gray-50 dark:bg-gray-700 
          text-sm text-gray-800 dark:text-gray-100 
          focus:outline-none cursor-pointer`}
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        Invite Members
                        <ChevronDown
                            className="absolute right-2 top-1/3 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                            size={18}
                        />
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-1">
                        {formData.invites.length} member
                        {formData.invites.length !== 1 ? "s" : ""} selected
                    </p>

                    {dropdownOpen && (
                        <div className="absolute z-10 mt-1 w-full 
              bg-white dark:bg-gray-800 
              border border-gray-300 dark:border-gray-700 
              rounded-md shadow-lg max-h-60 overflow-y-auto text-sm">
                            {userList?.filter((cv) => cv?._id !== profileData?._id).length === 0 ? (
                                <p className="p-2 text-gray-500 dark:text-gray-400">No users available</p>
                            ) : (
                                userList
                                    ?.filter((cv) => cv?._id !== profileData?._id)
                                    .map((user) => {
                                        const isSelected = formData.invites.some((u) => u === user._id);
                                        return (
                                            <div
                                                key={user._id}
                                                onClick={() => handleInviteSelect(user)}
                                                className={`flex items-center justify-between gap-3 px-3 py-2 cursor-pointer 
                      ${isSelected
                                                        ? "bg-gray-100 dark:bg-gray-700"
                                                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className="w-8 h-8 flex items-center justify-center rounded-full 
                        bg-gray-400 dark:bg-gray-600 
                        text-white dark:text-gray-100 
                        text-xs font-semibold overflow-hidden">
                                                        {user.profile ? (
                                                            <img
                                                                src={user.profile}
                                                                alt="Profile"
                                                                className="w-8 h-8 rounded-full object-cover"
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

                                                    <div className="flex flex-col overflow-hidden">
                                                        <p className="font-medium text-gray-800 dark:text-gray-100 truncate">
                                                            {user?.name}
                                                        </p>
                                                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                                            {user?.status}
                                                        </p>
                                                    </div>
                                                </div>

                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handleInviteSelect(user)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="custom-checkbox"
                                                />
                                            </div>
                                        );
                                    })
                            )}
                        </div>
                    )}
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-1 gap-3 mb-6">
                    {Object.entries(formData.toggles).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                            <label className="text-sm capitalize text-gray-700 dark:text-gray-300">
                                {key.replace(/_/g, " ")}
                            </label>
                            <button
                                type="button"
                                onClick={() => handleToggleChange(key)}
                                className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${value ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                                    }`}
                            >
                                <div
                                    className={`bg-white dark:bg-gray-200 w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${value ? "translate-x-6" : ""
                                        }`}
                                ></div>
                            </button>
                        </div>
                    ))}
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => setOpenCreateGroupModle(false)}
                        className="px-4 py-2 rounded-md 
          border border-gray-400 dark:border-gray-600 
          text-gray-800 dark:text-gray-100 
          hover:bg-gray-100 dark:hover:bg-gray-700 
          transition"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="col-span-2 md:col-span-2 w-full 
          bg-gray-700 dark:bg-green-600 
          hover:bg-gray-800 dark:hover:bg-green-700 
          text-white font-semibold py-2 
          rounded-md transition duration-200"
                        disabled={groupCreateLoading}
                    >
                        {groupCreateLoading ? "Logging in..." : "Create Group"}
                    </button>
                </div>
            </form>
        </div>

    );
};

export default GroupCreateModal;
