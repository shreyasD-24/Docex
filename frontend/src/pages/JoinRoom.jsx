import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import Loader from "../components/Loader";

const JoinRoom = ({ socket }) => {
  const [activeTab, setActiveTab] = useState("join"); // "join" or "create"
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [generatedRoomId, setGeneratedRoomId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Generate random room ID
  const generateRoomId = () => {
    const result = uuid().split("-").join("");
    setGeneratedRoomId(result);
  };

  const handleJoinRoom = () => {
    if (!roomId.trim() || !userName.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);

    if (socket.connected) {
      navigate("/collab", { state: { roomId, userName } });
    } else {
      const onConnect = () => {
        socket.off("connect", onConnect);
        navigate("/collab", { state: { roomId, userName } });
      };

      socket.on("connect", onConnect);

      setTimeout(() => {
        socket.off("connect", onConnect);
        setLoading(false);
        alert("Connection timeout. Please try again.");
      }, 10000);
    }
  };

  const handleCreateRoom = () => {
    if (!generatedRoomId.trim() || !userName.trim()) {
      alert("Please generate a room ID and enter your name");
      return;
    }

    setLoading(true);

    if (socket.connected) {
      navigate("/collab", { state: { roomId: generatedRoomId, userName } });
    } else {
      const onConnect = () => {
        socket.off("connect", onConnect);
        navigate("/collab", { state: { roomId: generatedRoomId, userName } });
      };

      socket.on("connect", onConnect);

      setTimeout(() => {
        socket.off("connect", onConnect);
        setLoading(false);
        alert("Connection timeout. Please try again.");
      }, 10000);
    }
  };

  return (
    <>
      {loading ? (
        <div
          className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
          style={{
            backgroundImage: "url('/bg-home.jpg')",
          }}
        >
          <Loader />
        </div>
      ) : (
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat bg-fixed flex items-center justify-center z-50"
          style={{
            backgroundImage: "url('/bg-home.jpg')",
          }}
        >
          {/* Modal Container */}
          <div className="bg-white/5 backdrop-blur-3xl rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/10 w-full max-w-md mx-4 p-8 relative overflow-hidden">
            {/* Glass effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/5 pointer-events-none rounded-3xl"></div>
            {/* Additional glass reflections */}
            <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/15 to-transparent pointer-events-none rounded-t-3xl"></div>
            <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-tl from-white/8 to-transparent pointer-events-none rounded-br-3xl"></div>
            <div className="relative z-10">
              {/* Tab Headers */}
              <div className="flex bg-white/5 backdrop-blur-xl rounded-2xl p-1.5 mb-8 border border-white/10 shadow-inner">
                <button
                  onClick={() => setActiveTab("join")}
                  className={`flex-1 py-4 px-6 rounded-xl text-sm font-bold transition-all duration-300 ${
                    activeTab === "join"
                      ? "bg-white/20 text-white shadow-[0_4px_16px_0_rgba(255,255,255,0.1)] backdrop-blur-xl border border-white/20"
                      : "text-white/70 hover:text-white hover:bg-white/8"
                  }`}
                >
                  Join Room
                </button>
                <button
                  onClick={() => setActiveTab("create")}
                  className={`flex-1 py-4 px-6 rounded-xl text-sm font-bold transition-all duration-300 ${
                    activeTab === "create"
                      ? "bg-white/20 text-white shadow-[0_4px_16px_0_rgba(255,255,255,0.1)] backdrop-blur-xl border border-white/20"
                      : "text-white/70 hover:text-white hover:bg-white/8"
                  }`}
                >
                  Create Room
                </button>
              </div>

              {/* Modal Content */}
              <div className="space-y-6">
                {activeTab === "join" ? (
                  <>
                    {/* Join Room Content */}
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-white mb-3 drop-shadow-lg">
                        Join Room
                      </h2>
                      <p className="text-white/80 text-sm">
                        Enter room ID and your name to join an existing room
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-white/90 mb-3">
                          Room ID
                        </label>
                        <input
                          type="text"
                          value={roomId}
                          onChange={(e) => setRoomId(e.target.value)}
                          placeholder="Enter room ID"
                          className="w-full px-5 py-4 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/30 bg-white/10 backdrop-blur-xl transition-all duration-300 text-white placeholder-white/60 font-medium shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.1)]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-white/90 mb-3">
                          Username
                        </label>
                        <input
                          type="text"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          placeholder="Enter your name"
                          className="w-full px-5 py-4 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/30 bg-white/10 backdrop-blur-xl transition-all duration-300 text-white placeholder-white/60 font-medium shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.1)]"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleJoinRoom}
                      className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl hover:shadow-3xl backdrop-blur-sm border border-white/20"
                    >
                      Join Room
                    </button>
                  </>
                ) : (
                  <>
                    {/* Create Room Content */}
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-white mb-3 drop-shadow-lg">
                        Create Room
                      </h2>
                      <p className="text-white/80 text-sm">
                        Create a new room and invite others to collaborate
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="flex items-center justify-between text-sm font-semibold text-white/90 mb-3">
                          Room ID
                          <button
                            onClick={generateRoomId}
                            className="flex items-center space-x-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 text-xs border border-white/30"
                          >
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
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              />
                            </svg>
                            <span>Generate ID</span>
                          </button>
                        </label>
                        <input
                          type="text"
                          value={generatedRoomId}
                          disabled
                          placeholder="Click generate to create room ID"
                          className="w-full px-5 py-4 border border-white/10 rounded-2xl bg-white/8 backdrop-blur-xl text-white/80 placeholder-white/50 font-medium shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.1)] cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-white/90 mb-3">
                          Username
                        </label>
                        <input
                          type="text"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          placeholder="Enter your name"
                          className="w-full px-5 py-4 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/30 bg-white/10 backdrop-blur-xl transition-all duration-300 text-white placeholder-white/60 font-medium shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.1)]"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleCreateRoom}
                      className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl hover:shadow-3xl backdrop-blur-sm border border-white/20"
                    >
                      Create Room
                    </button>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="mt-10 text-center">
                <p className="text-xs text-white/60">
                  ✨ Start collaborating on documents in real-time
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default JoinRoom;
