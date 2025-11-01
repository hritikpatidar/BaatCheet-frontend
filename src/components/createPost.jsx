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
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <textarea
                placeholder="What's on your mind?"
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                className="w-full border-none focus:ring-0 outline-none text-gray-700 bg-transparent text-sm sm:text-base resize-none"
                rows="2"
            />

            {/* Media Preview */}
            {media && (
                <div className="relative mt-3">
                    {media.file.type.startsWith("image/") ? (
                        <img
                            src={media.preview}
                            alt="preview"
                            className="w-full rounded-lg max-h-64 object-cover"
                        />
                    ) : (
                        <video
                            src={media.preview}
                            controls
                            className="w-full rounded-lg max-h-64 object-cover"
                        />
                    )}

                    <button
                        onClick={handleRemoveMedia}
                        className="absolute top-2 right-2 bg-gray-800 bg-opacity-60 text-white rounded-full px-2 py-1 text-xs hover:bg-opacity-80"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Bottom Buttons */}
            <div className="flex flex-wrap justify-between items-center mt-4 gap-3 border-t border-gray-100 pt-3">
                {/* Upload Button */}
                <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <div className="p-2 rounded-full bg-gray-100 group-hover:bg-green-100 transition">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-5 h-5 text-green-600 group-hover:text-green-700"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                        </div>
                        <span className="text-gray-700 font-medium text-sm group-hover:text-green-700 transition">
                            Add Photo / Video
                        </span>
                        <input
                            type="file"
                            accept="image/*,video/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </label>
                </div>

                {/* Post Button */}
                <button
                    onClick={handlePost}
                    className="flex items-center gap-2 bg-green-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-green-600 active:scale-95 transition-transform"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 12l16-8-7 8 7 8-16-8z"
                        />
                    </svg>
                    Post
                </button>
            </div>

        </div>
    );
};

export default CreatePost;
