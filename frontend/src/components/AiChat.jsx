import { useRef, useState } from "react";
import Message from "./Message.jsx";

// Icons as SVG components
const SendIcon = () => (
  <svg
    className="w-4 h-4 transform rotate-45"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
    />
  </svg>
);

const RobotIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H9V3H7C5.9 3 5 3.9 5 5V11C5 12.1 5.9 13 7 13H9V21C9 22.1 9.9 23 11 23H13C14.1 23 15 22.1 15 21V13H17C18.1 13 19 12.1 19 11V5C19 3.9 18.1 3 17 3H15V7L21 9Z" />
  </svg>
);

const SparkleIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2L13.09 6.26L18 7L13.09 7.74L12 12L10.91 7.74L6 7L10.91 6.26L12 2ZM15 14L15.94 16.5L18.5 17.5L15.94 18.5L15 21L14.06 18.5L11.5 17.5L14.06 16.5L15 14Z" />
  </svg>
);

const MinimizeIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20 12H4"
    />
  </svg>
);

// Eye-appealing AI Agent Badge Icon
const AIAgentBadgeIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
    <defs>
      <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="50%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
    {/* AI Brain/Circuit pattern */}
    <circle cx="12" cy="12" r="10" fill="url(#aiGradient)" opacity="0.9" />
    <circle
      cx="12"
      cy="12"
      r="8"
      fill="none"
      stroke="white"
      strokeWidth="0.5"
      opacity="0.6"
    />
    <circle
      cx="12"
      cy="12"
      r="6"
      fill="none"
      stroke="white"
      strokeWidth="0.3"
      opacity="0.4"
    />

    {/* Central AI core */}
    <circle cx="12" cy="12" r="3" fill="white" opacity="0.9" />
    <circle cx="12" cy="12" r="2" fill="url(#aiGradient)" />

    {/* Neural network nodes */}
    <circle cx="8" cy="8" r="1" fill="white" opacity="0.8" />
    <circle cx="16" cy="8" r="1" fill="white" opacity="0.8" />
    <circle cx="8" cy="16" r="1" fill="white" opacity="0.8" />
    <circle cx="16" cy="16" r="1" fill="white" opacity="0.8" />

    {/* Connection lines */}
    <line
      x1="8"
      y1="8"
      x2="12"
      y2="12"
      stroke="white"
      strokeWidth="0.8"
      opacity="0.6"
    />
    <line
      x1="16"
      y1="8"
      x2="12"
      y2="12"
      stroke="white"
      strokeWidth="0.8"
      opacity="0.6"
    />
    <line
      x1="8"
      y1="16"
      x2="12"
      y2="12"
      stroke="white"
      strokeWidth="0.8"
      opacity="0.6"
    />
    <line
      x1="16"
      y1="16"
      x2="12"
      y2="12"
      stroke="white"
      strokeWidth="0.8"
      opacity="0.6"
    />

    {/* Sparkle effects */}
    <path
      d="M6 6l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z"
      fill="white"
      opacity="0.9"
    />
    <path
      d="M18 4l0.5 1 1 0.5-1 0.5-0.5 1-0.5-1-1-0.5 1-0.5 0.5-1z"
      fill="white"
      opacity="0.7"
    />
    <path
      d="M20 18l0.5 1 1 0.5-1 0.5-0.5 1-0.5-1-1-0.5 1-0.5 0.5-1z"
      fill="white"
      opacity="0.8"
    />
  </svg>
);

const AiChat = ({ getAiResponse, modifyText, insertText }) => {
  const initialMessage = {
    content:
      "Hello! I'm your AI assistant. How can I help you with your document?",
    isUser: false,
    id: 1,
  };

  const [chats, setChats] = useState([initialMessage]);
  const [method, setMethod] = useState("ask");
  const [useSelectedTextOnly, setUseSelectedTextOnly] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);

  const handleMethodChange = (newMethod) => {
    setMethod(newMethod);
    setChats([initialMessage]); // Reset chats to initial message
  };

  // Empty callback functions for insert and edit actions
  const handleInsert = (message) => {
    insertText(message.content);
  };

  const handleEdit = (message) => {
    modifyText(message.content);
  };

  const handleSendMessage = async () => {
    if (!prompt.trim()) return;

    // Add user message
    const newUserMessage = {
      content: prompt,
      isUser: true,
      id: Date.now(),
    };

    setChats((prev) => [...prev, newUserMessage]);
    setPrompt("");
    setIsLoading(true);

    try {
      // Get AI response
      const response = await getAiResponse(
        method,
        newUserMessage.content,
        useSelectedTextOnly
      );
      if (response.trim() === "") throw new Error();
      const aiResponse = {
        content: response,
        isUser: false,
        id: Date.now() + 1,
      };
      setChats((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorResponse = {
        content: "Sorry, I encountered an error. Please try again.",
        isUser: false,
        id: Date.now() + 1,
      };
      setChats((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Circular Badge when minimized */}
      {isMinimized && (
        <button
          onClick={() => setIsMinimized(false)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 rounded-full shadow-2xl hover:shadow-3xl z-50 flex items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-110 active:scale-95 group"
          aria-label="Open AI Assistant"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
          <div className="relative z-10 text-white drop-shadow-lg">
            <AIAgentBadgeIcon />
          </div>

          {/* Static ring effect */}
          <div className="absolute inset-2 rounded-full border border-white/50"></div>
        </button>
      )}

      {/* Full Chat Interface */}
      {!isMinimized && (
        <div className="fixed bottom-6 right-6 w-96 h-[550px] bg-white/95 border border-indigo-200 rounded-2xl shadow-2xl z-50 flex flex-col transition-all duration-300 ease-in-out backdrop-blur-sm animate-in slide-in-from-bottom-4 fade-in-0">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white p-4 rounded-t-2xl flex-shrink-0 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-full">
                <RobotIcon />
              </div>
              <div>
                <h3 className="text-base font-bold">AI Assistant</h3>
                <p className="text-xs text-indigo-100">Ready to help you</p>
              </div>
            </div>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
              aria-label="Minimize AI Assistant"
            >
              <MinimizeIcon />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-slate-50 to-gray-100 space-y-3">
            {chats.map((chat) => (
              <Message
                key={chat.id}
                message={chat}
                isUser={chat.isUser}
                method={method}
                onInsert={handleInsert}
                onEdit={handleEdit}
              />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-white text-gray-600 px-4 py-3 rounded-2xl rounded-bl-md shadow-md border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <SparkleIcon />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Controls */}
          <div className="p-4 border-t border-indigo-100 bg-white rounded-b-2xl flex-shrink-0">
            {/* Method Selection */}
            <div className="mb-3">
              <select
                value={method}
                onChange={(e) => handleMethodChange(e.target.value)}
                className="w-full px-4 py-3 text-sm border-2 border-indigo-200 rounded-xl bg-gradient-to-r from-white via-indigo-50 to-purple-50 hover:from-indigo-50 hover:to-purple-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 font-medium text-gray-700 shadow-sm hover:shadow-md cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236366f1' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: "right 0.75rem center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "1.5em 1.5em",
                  paddingRight: "2.5rem",
                  appearance: "none",
                }}
              >
                <option value="ask">
                  💬 Ask - Get answers about the document
                </option>
                <option value="edit">✏️ Edit - Modify selected content</option>
                <option value="generate">
                  ✨ Generate - Create new content
                </option>
              </select>
            </div>

            {/* Checkbox */}
            <div className="mb-4">
              <label className="flex items-center space-x-3 text-sm text-gray-700 p-3 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 cursor-pointer border border-transparent hover:border-indigo-200">
                <input
                  type="checkbox"
                  checked={useSelectedTextOnly}
                  onChange={(e) => setUseSelectedTextOnly(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-2 border-indigo-300 rounded-md focus:ring-indigo-500 focus:ring-2 transition-all duration-200"
                />
                <span className="font-medium">Use selected text only</span>
              </label>
            </div>

            {/* Input and Send */}
            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your document..."
                  rows="1"
                  className="w-full px-3 py-2 text-sm border-2 border-indigo-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gradient-to-br from-white to-indigo-50 placeholder-gray-500 text-black"
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!prompt.trim() || isLoading}
                className="group relative px-4 py-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-xl hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 focus:outline-none focus:ring-4 focus:ring-emerald-300 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-sm font-bold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 shadow-lg hover:shadow-2xl flex items-center justify-center min-w-[50px] overflow-hidden"
              >
                {/* Shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>

                {isLoading ? (
                  <div className="relative">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="relative">
                    <SendIcon />
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AiChat;
