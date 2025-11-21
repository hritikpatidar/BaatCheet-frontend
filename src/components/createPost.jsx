import React, { useState } from "react";

const CreatePost = () => {
    const [postText, setPostText] = useState("");
    const [media, setMedia] = useState(null);

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMedia({
                file,
                preview: URL.createObjectURL(file),
            });
        }
    };

    const handleRemoveMedia = () => {
        setMedia(null);
    };

    const handlePost = () => {
        // Your post submit logic here
        console.log("Text:", postText);
        console.log("Media:", media);
        setPostText("");
        setMedia(null);
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm 
    border border-gray-100 dark:border-gray-700 
    max-w-[600px] w-full mx-auto">

    <textarea
        placeholder="What's on your mind?"
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
        className="w-full border-none focus:ring-0 outline-none 
        text-gray-700 dark:text-gray-100 
        bg-transparent text-sm resize-none"
        rows="2"
    />

    {/* Media Preview */}
    {media && (
        <div className="relative mt-2">
            {media.file.type.startsWith("image/") ? (
                <img
                    src={media.preview}
                    alt="preview"
                    className="w-full rounded-lg max-h-48 object-cover"
                />
            ) : (
                <video
                    src={media.preview}
                    controls
                    className="w-full rounded-lg max-h-48 object-cover"
                />
            )}

            <button
                onClick={handleRemoveMedia}
                className="absolute top-2 right-2 bg-black/60 
                text-white rounded-full px-2 py-1 text-xs"
            >
                ✕
            </button>
        </div>
    )}

    {/* Bottom Buttons */}
    <div className="flex justify-between items-center mt-3 gap-2 
        border-t border-gray-200 dark:border-gray-700 pt-2">

        {/* Upload */}
        <label className="flex items-center gap-2 cursor-pointer group">
            <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 
                group-hover:bg-teal-100 dark:group-hover:bg-teal-900/30 transition">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 text-teal-600 dark:text-teal-400"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
            </div>
            <span className="text-gray-700 dark:text-gray-300 text-xs font-medium">
                Add Media
            </span>
            <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={handleFileChange}
            />
        </label>

        {/* Post Button */}
        <button
            onClick={handlePost}
            className="flex items-center gap-1 bg-teal-500 hover:bg-teal-600 
            text-white px-4 py-1.5 rounded-md text-sm active:scale-95 transition"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 12l16-8-7 8 7 8-16-8z" />
            </svg>
            Post
        </button>
    </div>
</div>


    );
};

export default CreatePost;
