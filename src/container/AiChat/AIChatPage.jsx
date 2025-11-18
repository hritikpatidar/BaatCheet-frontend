import React, { useState } from "react";
import { Bell, Bot, Ellipsis, EllipsisVertical, LifeBuoy, MessageSquarePlus, Mic, Plus, Search, Send, User } from "lucide-react";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

export default function AIChatPage() {
    const [history, setHistory] = useState([
        { id: 1, title: "My first AI chat" },
        { id: 2, title: "Code explanation" },
    ]);

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;

        setMessages((prev) => [
            ...prev,
            { role: "user", text: input },
            { role: "assistant", text: "Thinking..." },
        ]);

        setInput("");
    };

    return (
        <div className="flex h-screen bg-[#e7e9ef]">

            {/* LEFT SIDEBAR */}
            <aside className="w-80 bg-[#e7e9ef] border-r border-gray-300 p-4 flex flex-col">
                {/* BRAND */}
                <span
                    className="projectName cursor-pointer mb-5"
                    onClick={async () => {
                        await navigate("/")
                        dispatch(closeChat())
                    }}
                >
                    <span className='text-teal-600 font-semibold text-xl'>Baat</span>
                    <span className='text-gray-800 font-semibold text-xl'>Cheet AI</span>
                </span>
                <div className="flex flex-col py-3">

                    <button
                        className="flex items-center gap-3 w-full px-2  py-2 text-sm text-gray-800 cursor-pointer rounded-md hover:bg-gray-300 transition"
                        onClick={() => {
                            console.log("Notifications clicked");
                            close();
                        }}
                    >
                        <Plus className="w-5 h-5" />
                        <span>New Chat</span>
                    </button>

                    <button
                        className="flex items-center gap-3 w-full px-2 py-2 text-sm text-gray-800 cursor-pointer rounded-md hover:bg-gray-300 transition"
                        onClick={() => {
                            console.log("Support clicked");
                            close();
                        }}
                    >
                        <Search className="w-5 h-5" />
                        <span>Search Chat</span>
                    </button>

                </div>


                {/* Chat History */}
                <h2 className="font-semibold text-gray-700 mb-3 px-2">AI Chat History</h2>

                <ul className="space-y-2 overflow-y-auto flex-1">
                    {history.length === 0 ? (
                        <p className="text-gray-500 mt-2 text-sm ">No chats found</p>
                    ) : (
                        history.map((item) => (
                            <li
                                key={item.id}
                                className="bg-gray py-2 px-2 rounded-lg shadow cursor-pointer hover:bg-gray-100 text-sm"
                            >
                                <div className="flex items-center group">
                                    <span>{item.title}</span>
                                    <Ellipsis className="w-5 h-5 ml-auto text-gray-600 opacity-0 group-hover:opacity-100 transition"/>
                                </div>
                                
                            </li>
                        ))
                    )}
                </ul>
            </aside>

            {/* RIGHT PANEL */}
            <main className="flex-1 flex flex-col items-center justify-center relative px-4">

                {/* EMPTY STATE → ChatGPT Home Screen Style */}
                {messages.length === 0 && (
                    <div className="w-full max-w-3xl mx-auto text-center">

                        {/* Heading */}
                        <h1 className="text-3xl font-semibold text-gray-800 mb-10">
                            What’s on your mind today?
                        </h1>

                        {/* Input Bar */}
                        <div className="flex items-center bg-white shadow-lg rounded-full px-6 py-4 gap-1 border border-gray-200">

                            {/* + Icon */}
                            <button className=" text-gray p-2 rounded-xl hover:bg-gray-400">
                                <Plus className="w-5 h-5" />
                            </button>
                            {/* Text Input */}
                            <input
                                type="text"
                                placeholder="Ask anything"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                className="flex-1 outline-none text-gray-700 bg-transparent text-lg"
                            />

                            {/* Mic Icon */}
                            <button className=" text-gray p-2 rounded-xl hover:bg-gray-200">
                                <Mic className="w-5 h-5" />
                            </button>

                            <button
                                onClick={handleSend}
                                className="bg-gray-400 text-white p-2 rounded-xl hover:bg-gray-400"
                            >
                                <Send className="w-5 h-5" />
                            </button>

                        </div>
                    </div>
                )}

                {/* CHAT WINDOW (When messages exist) */}
                {messages.length > 0 && (
                    <>
                        <div className="flex-1 w-full overflow-y-auto p-6 space-y-4">
                            {messages.map((m, index) => (
                                <div
                                    key={index}
                                    className={`p-3 max-w-2xl rounded-2xl shadow 
                        ${m.role === "user"
                                            ? "bg-gray-600 text-white ml-auto"
                                            : "bg-white text-gray-700"
                                        }
                    `}
                                >
                                    {m.text}
                                </div>
                            ))}
                        </div>

                        {/* INPUT BOX (Chat Mode) */}
                        <div className="flex items-center bg-white shadow-lg rounded-full px-6 py-4 gap-4 border border-gray-200">

                            {/* + Icon */}
                            <button className="text-gray-600 hover:text-gray-800">
                                <span className="text-2xl font-bold">+</span>
                            </button>

                            {/* Text Input */}
                            <input
                                type="text"
                                placeholder="Ask anything"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                className="flex-1 outline-none text-gray-700 bg-transparent text-lg"
                            />

                            {/* Mic Icon */}
                            <button className="text-gray-600 hover:text-gray-800">
                                <Mic className="w-5 h-5" />
                            </button>

                            <button
                                onClick={handleSend}
                                className="bg-gray-600 text-white px-6 rounded-xl hover:bg-gray-700"
                            >
                                <Send className="w-5 h-5" />
                            </button>

                        </div>
                    </>
                )}

            </main>

        </div>
    );
}
