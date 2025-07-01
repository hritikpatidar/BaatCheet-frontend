import React from 'react'
import { useNavigate } from 'react-router-dom';
import { post1 } from '../../assets';

const DashboardPage = () => {
    const navigate = useNavigate();
    return (
        <div className="flex min-h-screen  bg-gray-100 font-sans px-4 pt-12">
            <main className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 max-w-7xl mx-auto">
                {/* Left Sidebar */}
                <aside className="hidden md:block md:col-span-1 space-y-4">
                    <div className="bg-white rounded-xl p-4 shadow">
                        <h2 className="text-lg font-semibold mb-2">Suggested Users</h2>
                        <ul className="space-y-2">
                            <li className="text-sm text-blue-600 hover:underline cursor-pointer">User 1</li>
                            <li className="text-sm text-blue-600 hover:underline cursor-pointer">User 2</li>
                            <li className="text-sm text-blue-600 hover:underline cursor-pointer">User 3</li>
                        </ul>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow">
                        <h2 className="text-lg font-semibold mb-2">Recent Chats</h2>
                        <ul className="text-sm space-y-2">
                            <li>Ritik 👋</li>
                            <li>Patidar 🔥</li>
                        </ul>
                    </div>
                </aside>

                {/* Center Section */}
                <section className="md:col-span-2 space-y-4">
                    {[1, 2, 3].map((post, index) => (
                        <div key={index} className="bg-white p-4 rounded-xl shadow">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center font-semibold text-white">
                                    R
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">Ritik Patidar</p>
                                    <p className="text-xs text-gray-500">2 hours ago</p>
                                </div>
                            </div>

                            <p className="text-gray-700 mb-2">
                                This is a sample post content. You can customize this section to show user posts with or without images.
                            </p>

                            {/* 📸 Image (optional) */}
                            <div className="rounded-lg overflow-hidden">
                                <img
                                    src={post1}
                                    alt="Post"
                                    className="w-full h-96 object-cover rounded-lg"
                                />
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center gap-4 text-sm mt-3 text-gray-600">
                                <button>👍 Like</button>
                                <button>💬 Comment</button>
                                <button>🔁 Share</button>
                            </div>
                        </div>
                    ))}
                </section>


                {/* Right Sidebar */}
                <aside className="hidden md:block md:col-span-1 space-y-4">
                    <div className="bg-white rounded-xl p-4 shadow">
                        <h2 className="text-lg font-semibold mb-2">Notifications</h2>
                        <ul className="text-sm space-y-2">
                            <li>New comment on your post</li>
                            <li>Friend request from Ankit</li>
                        </ul>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow">
                        <h2 className="text-lg font-semibold mb-2">Trending Topics</h2>
                        <ul className="text-sm text-blue-600 space-y-2">
                            <li>#reactjs</li>
                            <li>#tailwind</li>
                            <li>#uiux</li>
                        </ul>
                    </div>
                </aside>
            </main>
        </div>
    )
}

export default DashboardPage
