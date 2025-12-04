import { memo } from "react";

const MessageBubble = memo(({ m, index, messages, userId, adminAvatar }: any) => {
    const isMe = m.senderId === userId;

    const prev = messages[index - 1];
    const next = messages[index + 1];

    const isPrevSame = prev && prev.senderId === m.senderId;
    const isNextSame = next && next.senderId === m.senderId;

    const isFirst = !isPrevSame;
    const isLast = !isNextSame;

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
            className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
            style={{ marginTop: isFirst ? "8px" : "2px" }}
        >
            {!isMe &&
                (isLast ? (
                    <img
                        src={adminAvatar}
                        className="w-7 h-7 rounded-full mr-2 self-end"
                    />
                ) : (
                    <div className="w-7 h-7 mr-2"></div>
                ))}

            <div
                className={`px-4 py-2 text-sm max-w-[75%] text-white shadow-sm 
                transition-all hover:brightness-110 ${bgColor} ${bubbleClass}`}
            >
                {m.messageText}
            </div>
        </div>
    );
});
export default MessageBubble;