/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { request } from "../utils/request";
import type { RootState } from "./index";

export interface IMessage {
    messageId: number;
    chatRoomId: number;
    senderId: number;
    messageText: string;
    createdAt: string;
    isBot: boolean;
}

export interface IChatRoom {
    chatRoomId: number;
    userId: number;
    adminId: number | null;
    orderId: number | null;
    createdAt: string;
    status: string;
}

interface IChatState {
    rooms: IChatRoom[];
    messages: IMessage[];
    currentRoom: IChatRoom | null;
    loading: boolean;
    error: string | null;
}

const initialState: IChatState = {
    rooms: [],
    messages: [],
    currentRoom: null,
    loading: false,
    error: null,
};

// 1️⃣ Tạo hoặc lấy room
export const actionGetOrCreateRoom = createAsyncThunk(
    "chat/getOrCreateRoom",
    async (data: { userId: number; orderId: number | null }, { rejectWithValue }) => {
        try {
            const res = await request({
                url: `/chat/room`,
                method: "POST",
                data,
            });
            return res.data;
        } catch (err: any) {
            return rejectWithValue("Lỗi tạo phòng chat");
        }
    }
);

// 2️⃣ Lấy danh sách room của user
export const actionGetUserRooms = createAsyncThunk(
    "chat/getUserRooms",
    async (userId: number, { rejectWithValue }) => {
        try {
            const res = await request({
                url: `/chat/rooms/user/${userId}`,
                method: "GET",
            });
            return res.data;
        } catch {
            return rejectWithValue("Lỗi lấy danh sách phòng chat");
        }
    }
);

export const actionGetAdminRooms = createAsyncThunk(
    "chat/getAdminRooms",
    async (adminId: number, { rejectWithValue }) => {
        try {
            const res = await request({
                url: `/chat/rooms/admin/${adminId}`,
                method: "GET",
            });
            return res.data;
        } catch {
            return rejectWithValue("Lỗi lấy danh sách phòng chat");
        }
    }
);

// 3️⃣ Gửi tin nhắn
export const actionSendMessage = createAsyncThunk(
    "chat/sendMessage",
    async (
        data: { chatRoomId: number; senderId: number; messageText: string },
        { rejectWithValue }
    ) => {
        try {
            const res = await request({
                url: `/Chat/send`,
                method: "POST",
                data,
            });
            return res.data;
        } catch {
            return rejectWithValue("Lỗi gửi tin nhắn");
        }
    }
);

// 4️⃣ Lấy tất cả messages của 1 phòng
export const actionGetMessagesByRoomId = createAsyncThunk(
    "chat/getMessagesByRoomId",
    async (roomId: number, { rejectWithValue }) => {
        try {
            const res = await request({
                url: `/chat/messages/${roomId}`,
                method: "GET",
            });
            return res.data; // list<MessageDTO>
        } catch {
            return rejectWithValue("Lỗi lấy lịch sử tin nhắn");
        }
    }
);


const slice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        addRealtimeMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        clearMessages: (state) => {
            state.messages = [];
        },
    },
    extraReducers: (builder) => {
        builder

            // Get or create room
            .addCase(actionGetOrCreateRoom.fulfilled, (state, action) => {
                state.currentRoom = action.payload;
            })

            // Get user rooms
            .addCase(actionGetUserRooms.fulfilled, (state, action) => {
                state.rooms = action.payload;
            })

            .addCase(actionGetAdminRooms.fulfilled, (state, action) => {
                state.rooms = action.payload;
            })

            // Send message
            .addCase(actionSendMessage.fulfilled, (state, action) => {
                state.messages.push(action.payload);
            })
            .addCase(actionGetMessagesByRoomId.fulfilled, (state, action) => {
                state.messages = action.payload; // Ghi đè toàn bộ tin nhắn từ DB
            })
    },
});

export const { addRealtimeMessage, clearMessages } = slice.actions;
export const selectChat = (state: RootState) => state.chat;
export default slice.reducer;
