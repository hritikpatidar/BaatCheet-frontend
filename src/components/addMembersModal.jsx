import { Search } from 'lucide-react';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { groupCreateValidation } from '../Utils/validation';
import { useSocket } from '../context/SocketContext';
import { setInviteUserLoading } from '../Redux/features/Chat/chatSlice';

const AddMembersModal = () => {
  const dispatch = useDispatch()
  const { socket, setAddMembersGroupModle } = useSocket()
  const [searchTerm, setSearchTerm] = useState("");
  const { userList } = useSelector((state) => state?.ChatDataSlice);
  const profileData = useSelector((state) => state?.authReducer?.AuthSlice?.profileDetails);
  const { selectedUser, inviteUserLoading } = useSelector((state) => state?.ChatDataSlice);
  const memberIds = selectedUser?.members?.map(member => member?._id);
  const invitedUserIds = selectedUser?.invites?.map(invite => invite?.invitedUser?._id);
  const allMemberIds = [...memberIds, ...invitedUserIds];

  const [formData, setFormData] = useState({
    invites: [],
  });

  const filteredUsers = userList?.filter(
    (cv) =>
      cv?._id !== profileData?._id &&
      cv?.name?.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  // Function to highlight search text
  const highlightText = (text, search) => {
    const regex = new RegExp(`(${search.trim()})`, "gi");
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === search.toLowerCase().trim() ? (
            <span key={i} className="text-green-500 font-semibold">
              {part}
            </span>
          ) : (
            <span key={i} className="text-gray-800">
              {part}
            </span>
          )
        )}
      </>
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newData = { [name]: value };

    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

  const handleAddMembers = async (e) => {
    e.preventDefault();
    if (formData?.invites.length === 0) return
    dispatch(setInviteUserLoading(true))
    const inviteUser = {
      user_id: profileData?._id,
      group_id: selectedUser?._id,
      friends_id: formData?.invites
    }
    if (socket) socket.current.emit('UserGroupInvite', inviteUser);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-2 sm:px-4">
      <form
        onSubmit={handleAddMembers}
        className="bg-white w-full max-w-lg
               p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 font-sans 
               flex flex-col max-h-[75vh]"
      >
        {/* Heading */}
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 text-center mb-4">
          Add Members 👥
        </h2>

        {/* Search Box */}
        <div className="mb-3 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search members"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 pl-9 rounded-md border border-gray-300 
                   bg-white focus:outline-none text-sm text-gray-800"
          />
        </div>

        {/* User List */}
        <ul className="space-y-2 overflow-y-auto flex-1 pr-1">
          {filteredUsers?.map((user, i) => {
            const isSelected = formData.invites.some((u) => u === user._id);
            const userAlreadyAdded = allMemberIds.includes(user?._id)

            return (
              <li
                key={i}
                className={`cursor-pointer flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 ${(isSelected || userAlreadyAdded) && "bg-gray-200"}` }
                onClick={() => handleInviteSelect(user)}
              >
                {/* Profile */}
                <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center 
                            rounded-full bg-gray-400 text-white font-semibold overflow-hidden text-xs sm:text-sm">
                  {user.profile ? (
                    <img
                      src={user.profile}
                      alt={"No Image"}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    user?.name
                      ?.split(" ")
                      .filter((_, index) => index < 2)
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  )}
                </div>

                {/* Name & status */}
                <div className="flex-1 overflow-hidden">
                  <p className="font-medium text-gray-800 truncate text-sm">
                    {highlightText(user.name, searchTerm)}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {user?.status || "Available"}
                  </p>
                </div>

                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={isSelected || userAlreadyAdded}
                  onChange={() => handleInviteSelect(user)}
                  onClick={(e) => e.stopPropagation()}
                  className="custom-checkbox"
                  disabled={userAlreadyAdded}
                />
              </li>
            );
          })}
        </ul>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => {
              dispatch(setInviteUserLoading(false))
              setAddMembersGroupModle(false)
            }
            }
            className="px-4 py-2 rounded-md border border-gray-400 text-gray-800 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="col-span-2 md:col-span-2 w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 rounded-md transition duration-200"
            disabled={inviteUserLoading}
          >
            {inviteUserLoading ? "Adding..." : "Add Members"}
          </button>
        </div>
      </form>
    </div>


  )
}

export default AddMembersModal
