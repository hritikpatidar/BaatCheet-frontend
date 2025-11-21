import { Edit, Facebook, Grip, Image, Instagram, Linkedin, Pencil, Twitter } from "lucide-react";
import { dummyImage, profileBanner } from "../../assets";
import { useSelector } from "react-redux";


const Profile = () => {
    const { profileDetails } = useSelector((state) => state?.authReducer?.AuthSlice);
    const posts = [1,2,3,4,5,6]
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 font-sans px-2 sm:px-4 pt-20 transition-colors duration-300">

            <div className="w-full max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">

                {/* HERO BANNER */}
                <div className="relative h-40 sm:h-56 bg-gradient-to-r from-sky-300 to-indigo-300">
                    <img
                        src={profileBanner}
                        alt="banner"
                        className="absolute inset-0 w-full h-full object-cover opacity-70"
                    />
                    <button
                        aria-label="Edit banner"
                        className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white/80 dark:bg-gray-200/80 p-2 rounded-full shadow hover:bg-white dark:hover:bg-gray-200 transition"
                    >
                        <Pencil className="w-5 h-5" />
                    </button>
                </div>

                {/* CONTENT GRID */}
                <div className="p-4 sm:p-8 md:p-10 grid grid-cols-1 sm:grid-cols-3 gap-8">

                    {/* LEFT SECTION */}
                    <div className="sm:col-span-1 flex flex-col items-center sm:items-start">

                        {/* Avatar */}
                        <div className="-mt-20 sm:-mt-24 relative z-20">
                            <img
                                src={!profileDetails?.profile ? profileDetails.profile : dummyImage}
                                alt="avatar"
                                className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl border-4 border-white dark:border-gray-700 shadow-lg object-cover"
                            />
                        </div>

                        {/* USER INFO */}
                        <div className="mt-4 text-center sm:text-left">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                                {profileDetails.name}
                            </h2>

                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{profileDetails.email}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{profileDetails.phone_no}</p>

                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                                ▌│█║▌║▌║ 🎀 🎒 𝒲😍𝓇𝓁𝒹 𝒷𝒶𝒸𝓀𝓅𝒶𝒸𝓀𝑒𝓇
                                𝒞𝓇𝒶𝒻𝓉 𝒸🌺𝒸𝓀𝓉𝒶𝒾𝓁 𝓂𝒾𝓍💍𝓁🍬𝑔𝒾𝓈𝓉 🍹
                                𝐿𝒾𝓋𝒾𝓃𝑔 𝒻🌞𝓇 𝓉𝒽𝑒 𝓃𝑒𝓍𝓉 𝒶𝒹𝓋𝑒𝓃𝓉𝓊𝓇𝑒 🎀 ║▌║▌║█│▌
                            </p>

                            {/* Stats */}
                            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                                {[
                                    { label: "Followers", value: "4,073" },
                                    { label: "Following", value: "372" },
                                    { label: "Attraction", value: "286,032" }
                                ].map((item, i) => (
                                    <div key={i}>
                                        <div className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-200">
                                            {item.value}
                                        </div>
                                        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                            {item.label}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Social Links */}
                            <div className="mt-6 flex gap-3 flex-wrap justify-center sm:justify-start">
                                {[Facebook, Linkedin, Instagram, Twitter].map((Icon, i) => (
                                    <button
                                        key={i}
                                        className="rounded-full p-2 shadow-md shadow-teal-400 dark:shadow-teal-600 
                cursor-pointer text-gray-600 dark:text-gray-200 hover:text-teal-400 
                dark:hover:text-teal-300 bg-white dark:bg-gray-800 transition-all"
                                    >
                                        <Icon className="w-5 h-5" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SECTION */}
                    <div className="sm:col-span-2">

                        {/* Tabs */}
                        <div className="flex flex-wrap items-center justify-between mb-6">
                            <div className="flex gap-4 sm:gap-6 uppercase text-xs sm:text-sm tracking-wide text-gray-500 dark:text-gray-400 overflow-x-auto">
                                <span className="text-sky-600 dark:text-sky-400 font-semibold cursor-pointer whitespace-nowrap">
                                    Photo
                                </span>
                                <span className="cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 whitespace-nowrap">
                                    Galleries
                                </span>
                                <span className="cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 whitespace-nowrap">
                                    Groups
                                </span>
                                <span className="cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 whitespace-nowrap">
                                    About
                                </span>
                            </div>
                        </div>

                        {/* POSTS GRID */}
                        {posts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 opacity-70">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        strokeWidth={1.5} stroke="currentColor"
                                        className="w-8 h-8 sm:w-10 sm:h-10 text-gray-500 dark:text-gray-300"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-18 0l4.72-4.72a2.25 2.25 0 013.18 0L21 16.5m-18 0V7.5A2.25 2.25 0 015.25 5.25h13.5A2.25 2.25 0 0121 7.5v9m-9-3.75a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                                        />
                                    </svg>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mt-4 text-sm sm:text-base">
                                    No posts yet
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                                {posts.map((post, i) => (
                                    <div key={i} className="h-28 sm:h-32 lg:h-40 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                                        <img src={post.image} alt={`photo-${i}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Load More */}
                        {posts.length > 0 && (
                            <div className="mt-8 flex justify-center">
                                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm 
              text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                                    Load more
                                </button>
                            </div>
                        )}

                    </div>

                </div>
            </div>
        </div>

    );
}

export default Profile;
