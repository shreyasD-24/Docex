import React from "react";

// User Avatar Icon
const UserIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

// AI Avatar Icon
const AIIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H9V3H7C5.9 3 5 3.9 5 5V11C5 12.1 5.9 13 7 13H9V21C9 22.1 9.9 23 11 23H13C14.1 23 15 22.1 15 21V13H17C18.1 13 19 12.1 19 11V5C19 3.9 18.1 3 17 3H15V7L21 9Z" />
  </svg>
);

// Action Icons
const InsertIcon = () => (
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
      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
    />
  </svg>
);

const EditIcon = () => (
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
      d="M11 7l-9 9v4h4l9-9-4-4zm0 0l4-4 3 3-4 4"
    />
  </svg>
);

const Message = ({ message, isUser, method, onInsert, onEdit }) => {
  const shouldShowActions =
    !isUser && (method === "generate" || method === "edit");

  return (
    <div
      className={`flex items-start space-x-3 mb-4 ${
        isUser ? "flex-row-reverse space-x-reverse" : ""
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg"
            : "bg-gradient-to-br from-emerald-400 to-cyan-500 text-white shadow-lg"
        }`}
      >
        {isUser ? <UserIcon /> : <AIIcon />}
      </div>

      {/* Message Bubble */}
      <div
        className={`max-w-[75%] ${
          isUser ? "items-end" : "items-start"
        } flex flex-col`}
      >
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-md transition-all duration-200 hover:shadow-lg ${
            isUser
              ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-br-md"
              : "bg-white text-gray-800 border border-gray-200 rounded-bl-md"
          }`}
        >
          {message.content}
        </div>

        {/* Action Buttons for AI messages */}
        {shouldShowActions && (
          <div className="flex items-center space-x-2 mt-2 px-2">
            {method === "generate" && (
              <button
                onClick={() => onInsert && onInsert(message)}
                className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-all duration-200 hover:shadow-sm"
              >
                <InsertIcon />
                <span>Insert</span>
              </button>
            )}
            {method === "edit" && (
              <button
                onClick={() => onEdit && onEdit(message)}
                className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-all duration-200 hover:shadow-sm"
              >
                <EditIcon />
                <span>Apply Edit</span>
              </button>
            )}
          </div>
        )}

        {/* Timestamp */}
        <div
          className={`text-xs text-gray-500 mt-1 px-2 ${
            isUser ? "text-right" : "text-left"
          }`}
        >
          {new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
};

export default Message;
