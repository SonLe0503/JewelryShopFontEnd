import { useEffect, useState, useRef } from "react";
import chat1 from "../../../../assets/images/chat1.png";
import { useAppDispatch, useAppSelector } from "../../../../store";
import {
    addRealtimeMessage,
    actionSendMessage,
    selectChat,
    actionGetMessagesByRoomId,
    actionGetAdminRooms
} from "../../../../store/chatSlide";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { useSelector } from "react-redux";
import { selectInfoLogin, selectUsers } from "../../../../store/authSlide";
import { BASE_URL } from "../../../../utils/app";

const ChatBar = () => {
    const [open, setOpen] = useState(false);
    const [connection, setConnection] = useState<any>(null);
    const [showRoomList, setShowRoomList] = useState(true);

    const { rooms, messages } = useAppSelector(selectChat);
    const [selectedRoom, setSelectedRoom] = useState<any>(null);
    const [text, setText] = useState("");

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const id = useSelector(selectInfoLogin)?.userId;
    const userId = id ? Number(id) : null;

    const dispatch = useAppDispatch();
    const users = useSelector(selectUsers);
    const user = users.find(u => u.userId === selectedRoom?.userId);
    const userAvatar = `${BASE_URL}${user?.avatar}` || chat1;

    // Load danh sách phòng admin
    useEffect(() => {
        if (userId) {
            dispatch(actionGetAdminRooms(userId));
        }
    }, [userId]);

    // Kết nối SignalR
    useEffect(() => {
        const conn = new HubConnectionBuilder()
            .withUrl(`${BASE_URL}/chatHub`)
            .withAutomaticReconnect()
            .build();

        conn.start().then(() => setConnection(conn));
    }, []);

    // Nhận tin nhắn realtime
    useEffect(() => {
        if (connection) {
            connection.on("ReceiveMessage", (msg: any) => {
                dispatch(addRealtimeMessage(msg));
            });
        }
    }, [connection]);

    // Auto scroll khi có tin nhắn
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, selectedRoom]);


    // Gửi tin nhắn
    const onSend = () => {
        if (!text.trim() || !selectedRoom) return;

        dispatch(
            actionSendMessage({
                chatRoomId: selectedRoom.chatRoomId,
                senderId: userId!,
                messageText: text
            })
        );

        setText("");
    };


    return (
        <>
            {/* Nút mở chat */}
            <button
                onClick={() => setOpen(!open)}
                className="chat-button fixed bottom-10 right-10 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-all"
                style={{ zIndex: 9999 }}
            >
                <img src={chat1} alt="Chat" className="w-15 h-15 rounded-full" />
            </button>

            {/* ====== HỘP CHAT ====== */}
            {open && (
                <div className="fixed bottom-24 right-10 w-[380px] h-[520px] bg-[#1c1c1e] rounded-2xl shadow-2xl flex flex-col border border-[#2c2c2e]"
                    style={{ zIndex: 99999 }}>

                    {/* ===== Danh sách phòng ===== */}
                    {showRoomList && (
                        <div className="flex flex-col p-3 overflow-y-auto text-white">
                            <h2 className="text-center text-lg font-semibold mb-3">Danh sách phòng</h2>

                            {rooms.map(room => (
                                <div
                                    key={room.chatRoomId}
                                    onClick={() => {
                                        setSelectedRoom(room);
                                        setShowRoomList(false);
                                        dispatch(actionGetMessagesByRoomId(room.chatRoomId));
                                    }}
                                    className="p-3 mb-2 bg-[#2c2c2e] rounded-xl hover:bg-[#3a3a3c] cursor-pointer transition-all"
                                >
                                    <div className="font-medium">Phòng #{room.chatRoomId}</div>
                                    <div className="text-xs text-gray-400">
                                        User: {room.userId} • Order: {room.orderId ?? "Không"}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ===== Màn chat tin nhắn ===== */}
                    {!showRoomList && selectedRoom && (
                        <div className="flex flex-col h-full">

                            {/* Header */}
                            <div className="flex items-center gap-2 px-4 py-3 text-white border-b border-[#2c2c2e]">
                                <button
                                    onClick={() => setShowRoomList(true)}
                                    className="text-gray-300 hover:text-white"
                                >
                                    ←
                                </button>
                                <img src={userAvatar} className="w-8 h-8 rounded-full" />
                                <div className="text-sm font-semibold">
                                    {user?.email || `Phòng ${selectedRoom.chatRoomId}`}
                                </div>
                                <button
                                    className="ml-auto text-gray-300 hover:text-white transition"
                                    onClick={() => setOpen(false)}
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-3 space-y-0.5">

                                {messages
                                    .filter(m => m.chatRoomId === selectedRoom.chatRoomId)
                                    .map((m, index, arr) => {
                                        const isMe = m.senderId === userId;

                                        const prev = arr[index - 1];
                                        const next = arr[index + 1];

                                        const isPrevSame = prev && prev.senderId === m.senderId;
                                        const isNextSame = next && next.senderId === m.senderId;

                                        const isFirst = !isPrevSame;
                                        const isLast = !isNextSame;

                                        // Bong bóng Messenger
                                        let bubbleClass = "";

                                        if (isMe) {
                                            if (isFirst && isLast) bubbleClass = "rounded-2xl rounded-br-none";
                                            else if (isFirst) bubbleClass = "rounded-2xl rounded-br-none rounded-b-none";
                                            else if (isLast) bubbleClass = "rounded-2xl rounded-tr-none";
                                            else bubbleClass = "rounded-2xl rounded-tr-none rounded-br-none";
                                        } else {
                                            if (isFirst && isLast) bubbleClass = "rounded-2xl rounded-bl-none";
                                            else if (isFirst) bubbleClass = "rounded-2xl rounded-bl-none rounded-b-none";
                                            else if (isLast) bubbleClass = "rounded-2xl rounded-tl-none";
                                            else bubbleClass = "rounded-2xl rounded-tl-none rounded-bl-none";
                                        }

                                        const bgColor = isMe
                                            ? "bg-gradient-to-r from-[#8A3FFC] to-[#6B5BFF]"
                                            : "bg-[#3E3E3E]";

                                        return (
                                            <div
                                                key={m.messageId}
                                                className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
                                                style={{ marginTop: isFirst ? "8px" : "2px" }}
                                            >
                                                {/* Avatar user — chỉ hiển thị cuối cụm */}
                                                {!isMe && (
                                                    isLast ? (
                                                        <img
                                                            src={userAvatar}
                                                            className="w-7 h-7 rounded-full mr-2 self-end"
                                                        />
                                                    ) : (
                                                        <div className="w-7 h-7 mr-2"></div>
                                                    )
                                                )}

                                                {/* Bong bóng */}
                                                <div
                                                    className={`px-4 py-2 text-sm max-w-[75%] text-white shadow-sm transition-all hover:brightness-110 ${bgColor} ${bubbleClass}`}
                                                >
                                                    {m.messageText}
                                                </div>
                                            </div>
                                        );
                                    })}

                                <div ref={messagesEndRef}></div>
                            </div>

                            {/* Input */}
                            <div className="px-3 py-2 flex items-center gap-2 bg-[#1c1c1e] border-t border-[#2c2c2e]">
                                <input
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && onSend()}
                                    placeholder="Aa"
                                    className="flex-1 bg-[#3a3a3c] text-white px-4 py-2 rounded-full outline-none text-sm"
                                />

                                <button
                                    onClick={onSend}
                                    disabled={!text.trim()}
                                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all
                                        ${text.trim() ? "bg-blue-600 text-white" : "bg-[#3a3a3c] text-gray-400"}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                        className="w-5 h-5" viewBox="0 0 24 24">
                                        <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
                                    </svg>
                                </button>
                            </div>

                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default ChatBar;
