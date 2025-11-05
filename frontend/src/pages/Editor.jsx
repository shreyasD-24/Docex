import { useState, useEffect, useRef, useMemo } from "react";
import { ACTIONS } from "../../socket.js";
import TipTap from "../components/TipTap.jsx";
import AiChat from "../components/AiChat.jsx";
import * as Y from "yjs";
import {
  askAiApi,
  editAiApi,
  generateAiApi,
  getIceServers,
} from "../apiCommunicator.js";
import { useLocation, useNavigate } from "react-router-dom";
import UserList from "../components/UserList.jsx";
import Loader from "../components/Loader.jsx";
import SaveFile from "../components/SaveFile.jsx";

const Editor = ({ socket }) => {
  let [userList, setUserList] = useState([]);
  let [loading, setLoading] = useState(true);
  let [copied, setCopied] = useState(false);
  const ydoc = useMemo(() => new Y.Doc(), []);
  let editor = useRef();
  let location = useLocation();
  let { userName, roomId } = location.state || {};
  let iceServers = useRef(null);

  let navigate = useNavigate();

  // Copy room ID to clipboard
  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy room ID:", err);
    }
  };

  async function getAiResponse(method, prompt, useSelectedTextOnly) {
    let { doc } = editor.current.state;
    let context = useSelectedTextOnly
      ? getSelectedText()
      : doc.textBetween(0, doc.content.size, "\n");
    if (context === "" && method !== "generate")
      return "No text available in the editor.";

    let response;

    switch (method) {
      case "ask":
        response = await askAiApi(context, prompt);
        break;
      case "edit":
        response = await editAiApi(context, prompt);
        break;
      case "generate":
        response = await generateAiApi(prompt);
        break;
    }

    return response;
  }

  function getSelectedText() {
    if (!editor.current) return "";
    const { from, to, empty } = editor.current.state.selection;
    if (empty) return "";
    return editor.current.state.doc.textBetween(from, to, "\n");
  }

  function insertText(text) {
    if (!editor.current) return;
    const docSize = editor.current.state.doc.content.size;
    editor.current.chain().focus().insertContentAt(docSize, text).run();
  }

  function modifyText(text) {
    if (!editor.current) return;
    const { from, to } = editor.current.state.selection;
    editor.current
      .chain()
      .focus()
      .deleteRange({ from, to })
      .insertContentAt(from, text)
      .run();
  }

  useEffect(() => {
    if (!userName || !roomId) {
      alert("Username or Room ID missing. Please join a room first.");
      navigate("/join-room");
      return;
    }

    joinRoom();
    socket.on("connect", () => {
      console.log("Connected to socket");
    });

    ydoc.on("update", (update) => {
      socket.emit(ACTIONS.UPDATE, { data: update, roomId });
    });

    socket.on(ACTIONS.JOINED, ({ userName, socketId }) => {
      setUserList((prev) => [...prev, { userName, socketId, isMuted: true }]);

      setUserList((prev) => {
        if (socket.id === prev[0]?.socketId) {
          socket.emit(ACTIONS.SYNC_CODE, {
            data: Y.encodeStateAsUpdate(ydoc),
            socketId,
            userList: prev,
          });
        }
        return prev;
      });
    });

    socket.on(ACTIONS.DISCONNECTED, ({ socketId }) => {
      setUserList((prev) => prev.filter(({ socketId: id }) => socketId !== id));
    });

    socket.on(ACTIONS.UPDATE, ({ data }) => {
      if (data) {
        Y.applyUpdate(ydoc, new Uint8Array(data));
      }
    });

    socket.on(ACTIONS.GETUSERS, ({ users }) => {
      console.log("Received user list:", users);
      setUserList(users);
    });

    socket.on(ACTIONS.MUTE, ({ socketId }) => {
      setUserList((prev) =>
        prev.map((user) =>
          user.socketId === socketId ? { ...user, isMuted: true } : user
        )
      );
    });

    socket.on(ACTIONS.UNMUTE, ({ socketId }) => {
      setUserList((prev) =>
        prev.map((user) =>
          user.socketId === socketId ? { ...user, isMuted: false } : user
        )
      );
    });

    return () => {
      socket.off("connect");
      socket.off(ACTIONS.JOINED);
      socket.off(ACTIONS.DISCONNECTED);
      socket.off(ACTIONS.UPDATE);
      socket.off(ACTIONS.GETUSERS);
      socket.off(ACTIONS.MUTE);
      socket.off(ACTIONS.UNMUTE);
      ydoc.off("update");
      socket.emit(ACTIONS.LEAVEROOM, { roomId });
    };
  }, [socket]);

  async function joinRoom() {
    iceServers.current = await getIceServers();
    socket.emit(ACTIONS.JOIN, { roomId, userName });
    setUserList([{ socketId: socket.id, userName, isMuted: true }]);
    setLoading(false);
  }

  function setEditor(editorInstance) {
    editor.current = editorInstance;
  }

  return (
    <div
      className="h-screen overflow-hidden bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: "url('/bg-home.jpg')",
      }}
    >
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="grid grid-cols-[1fr_3fr] h-full p-4">
            <div className="text-center space-y-4 overflow-y-auto max-h-full ml-5">
              <div className="relative mb-10 mt-5">
                <button
                  onClick={() => navigate("/")}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-red-500/30 p-2 rounded-lg transition-all duration-200 border border-white/30 group"
                  title="Exit to Home"
                >
                  <img src="/exit.png" alt="Exit Icon" className="w-4 h-4" />
                </button>
                <img
                  src="/logo.png"
                  alt="Docex Logo"
                  className="w-50 mx-auto"
                />
              </div>
              {/* Room ID Display */}
              <div className="bg-white/5 backdrop-blur-3xl rounded-2xl shadow-xl border border-white/10 p-4 relative overflow-hidden">
                {/* Glass effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none rounded-2xl"></div>
                {/* Top glass reflection */}
                <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/15 to-transparent pointer-events-none rounded-t-2xl"></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <div className="bg-white/25 backdrop-blur-md rounded-xl px-3 py-2 font-mono text-sm font-bold text-black shadow-inner">
                      {roomId}
                    </div>
                    <button
                      onClick={copyRoomId}
                      className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all duration-200 border border-white/30 group"
                      title="Copy Room ID"
                    >
                      {copied ? (
                        <svg
                          className="w-4 h-4 text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4 text-white group-hover:text-blue-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-white/80 leading-relaxed">
                    📤 Share the <b>Room ID</b> with others to join the Room
                  </p>
                </div>
              </div>

              {/* Active Users */}
              <UserList
                userList={userList}
                socket={socket}
                roomId={roomId}
                iceServers={iceServers.current}
              />
            </div>
            <div className="flex flex-col h-full ml-5">
              {/* Collaborative Workspace Header */}
              <div className="mb-3 text-center relative">
                <div className="bg-white/5 backdrop-blur-3xl rounded-2xl shadow-xl border border-white/10 p-3 relative overflow-hidden max-w-md mx-auto">
                  {/* Glass effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none rounded-2xl"></div>
                  {/* Top glass reflection */}
                  <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/15 to-transparent pointer-events-none rounded-t-2xl"></div>

                  <div className="relative z-10">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
                      Collaborative Workspace
                    </h1>
                  </div>
                </div>

                {/* Save Button - Positioned at extreme right */}
                <div className="absolute right-[5rem] top-4/7 transform -translate-y-1/2">
                  <SaveFile
                    onClick={() => {
                      console.log("Save button clicked");
                    }}
                  />
                </div>
              </div>

              {/* Editor Container */}
              <div className="flex-1 flex justify-center items-center text-black">
                <TipTap ydoc={ydoc} setEditor={setEditor} />
              </div>
            </div>
          </div>

          {/* AI Chat Component - Fixed positioned in bottom right */}
          <AiChat
            getAiResponse={getAiResponse}
            insertText={insertText}
            modifyText={modifyText}
          />
        </>
      )}
    </div>
  );
};

export default Editor;
