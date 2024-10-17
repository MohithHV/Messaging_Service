
import React from "react";

interface MessageBubbleProps {
  message: string;
  timestamp: string;
  isSent: boolean;
  onDelete: () => void; // Add onDelete prop
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, timestamp, isSent, onDelete }) => {
  return (
    <div className={`flex ${isSent ? "justify-end" : "justify-start"}`}>
      <div className={`p-4 rounded-lg ${isSent ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
        <p>{message}</p>
        <span className="text-xs text-gray-600">{timestamp}</span>
        <button onClick={onDelete} className="ml-2 text-red-500">Delete</button> {/* Delete button */}
      </div>
    </div>
  );
};

export default MessageBubble;
