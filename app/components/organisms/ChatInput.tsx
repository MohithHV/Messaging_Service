import React from 'react';

interface ChatInputProps {
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ inputValue, setInputValue, handleSendMessage }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="flex items-center">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown} // Handle Enter key
        className="border p-2 rounded-l focus-visible:outline-none focus:border-blue-500"
        placeholder="Type a message..."
      />
      <button onClick={handleSendMessage} className="bg-blue-500 text-white p-2 rounded-r" disabled={!inputValue.trim()}>
        Send
      </button>
    </div>
  );
};

export default ChatInput;
