import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store";
import { actionGetMessagesByRoomId, actionGetOrCreateRoom, actionSendMessage, addRealtimeMessage, selectChat } from "../../../store/chatSlide";
import { useSelector } from "react-redux";
import { actionGetAllUsers, selectInfoLogin, selectUsers } from "../../../store/authSlide";
import { HubConnectionBuilder } from "@microsoft/signalr";
import chat1 from '../../../assets/images/chat1.png';
import { BASE_URL } from "../../../utils/app";
import MessageBubble from "./MessageBubble";

const ChatWidget = () => {
    const id = useSelector(selectInfoLogin)?.userId;
    const userId = id ? Number(id) : null;
    const [open, setOpen] = useState(false);
    const [connection, setConnection] = useState<any>(null);
    const [text, setText] = useState("");

    const dispatch = useAppDispatch();
    const { currentRoom, messages } = useAppSelector(selectChat);
    const users = useSelector(selectUsers);
    const adminUser = users.find(u => u.userId === currentRoom?.adminId);
    const adminAvatar = `${BASE_URL}${adminUser?.avatar}` || chat1;



    // Ref để auto scroll
    const messageEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };


    // Auto scroll khi messages thay đổi
    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    // 🔌 Khởi tạo SignalR
    useEffect(() => {
        const connect = new HubConnectionBuilder()
            .withUrl(`${BASE_URL}/chatHub`, {
                withCredentials: true
            })
            .withAutomaticReconnect()
            .build();

        connect.start().then(() => {
            setConnection(connect);
        });
    }, []);

    // 🏠 Tạo hoặc lấy room khi mở chat
    useEffect(() => {
        if (open && userId) {
            dispatch(actionGetOrCreateRoom({ userId, orderId: null }));
            dispatch(actionGetAllUsers());
        }
    }, [open]);

    // 🔗 Join vào group + realtime
    useEffect(() => {
        if (connection && currentRoom) {
            connection.invoke("JoinRoom", currentRoom.chatRoomId);

            connection.on("ReceiveMessage", (msg: any) => {
                dispatch(addRealtimeMessage(msg));
            });
        }
    }, [connection, currentRoom]);

    // Load lịch sử chat khi đã có room
    useEffect(() => {
        if (currentRoom) {
            dispatch(actionGetMessagesByRoomId(currentRoom.chatRoomId));
        }
    }, [currentRoom]);


    // 📩 Gửi tin nhắn
    const onSend = () => {
        if (!text.trim() || !currentRoom) return;

        if (!userId) {
            alert("Vui lòng đăng nhập để sử dụng chat hỗ trợ.");
            return;
        }

        dispatch(
            actionSendMessage({
                chatRoomId: currentRoom.chatRoomId,
                senderId: userId,
                messageText: text,
            })
        );

        setText("");
    };

    return (
        <>
            <button
                onClick={() => setOpen(!open)}
                className="chat-button fixed bottom-10 right-10 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-all"
                style={{ zIndex: 9999 }}
            >
                <img
                    src={chat1}
                    alt="Chat"
                    className="w-15 h-15 rounded-full"
                />
            </button>

            {open && (
                <div
                    className="fixed bottom-24 right-10 w-80 h-96 bg-[#1c1c1e] rounded-2xl shadow-2xl flex flex-col border border-[#2c2c2e]"
                    style={{ zIndex: 99999 }}
                >
                    {/* Header */}
                    <div className="flex items-center gap-2 text-white px-4 py-2 rounded-t-2xl 
                border-b border-[#2c2c2e] bg-[#1c1c1e]">

                        <img src={adminAvatar} className="w-8 h-8 rounded-full" />

                        <div className="flex flex-col">
                            <span className="text-sm font-semibold">Hỗ trợ khách hàng</span>
                        </div>

                        <button
                            className="ml-auto text-gray-300 hover:text-white transition"
                            onClick={() => setOpen(false)}
                        >
                            ✕
                        </button>
                    </div>
                    {/* Chat messages */}
                    <div
                        className="flex-1 overflow-y-auto p-3 space-y-0.5 [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#4b4b4b] [&::-webkit-scrollbar-thumb]:rounded-full"
                        style={{
                            scrollbarWidth: "thin",
                            scrollbarColor: "#4b4b4b transparent"
                        }}
                    >
                        {messages.map((m, index) => (
                            <MessageBubble
                                key={m.messageId}
                                m={m}
                                index={index}
                                messages={messages}
                                userId={userId}
                                adminAvatar={adminAvatar}
                            />
                        ))}




                        <div ref={messageEndRef}></div>
                    </div>


                    {/* Input */}
                    <div className="px-3 py-2 flex items-center gap-2 bg-[#1c1c1e] rounded-b-2xl">
                        <input
                            className="flex-1 bg-[#3a3a3c] text-white px-4 py-2 rounded-full 
                   outline-none placeholder-gray-300 text-sm"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Aa"
                        />

                        <button
                            onClick={onSend}
                            className={`w-9 h-9 rounded-full flex items-center justify-center
                    transition-all active:scale-95
                    ${text.trim()
                                    ? "bg-blue-600 text-white"
                                    : "bg-[#3a3a3c] text-gray-400"
                                }`}
                            disabled={!text.trim()}
                        >
                            {/* Icon gửi giống Messenger */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                className="w-5 h-5"
                            >
                                <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
                            </svg>
                        </button>
                    </div>

                </div>
            )}
        </>
    );
};

export default ChatWidget;
