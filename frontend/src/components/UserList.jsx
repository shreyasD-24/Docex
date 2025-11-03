import { useRef, useEffect, useState } from "react";
import { ACTIONS } from "../../socket";

function UserList({ userList, socket, roomId }) {
  let [isMicOn, setIsMicOn] = useState(false); // false = red (muted), true = green (active)
  let peersRef = useRef({});
  let localStreamRef = useRef();
  const [remoteAudios, setRemoteAudios] = useState([]);
  let [audioPermissionsGranted, setAudioPermissionsGranted] = useState(false);

  const ICE_SERVERS = [
    { urls: "stun:stun.l.google.com:19302" }, // STUN
    {
      urls: "turn:openrelay.metered.ca:80",
      username: "openrelayproject",
      credentials: "openrelayproject",
    }, // TURN
  ];

  // Toggle microphone state
  const toggleMicrophone = () => {
    if (!isMicOn) {
      if (!audioPermissionsGranted) {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((stream) => {
            localStreamRef.current = stream;
            setAudioPermissionsGranted(true);
            setIsMicOn(true);

            Object.keys(peersRef.current).forEach((userId) => {
              const pc = peersRef.current[userId];
              pc.onnegotiationneeded = async () => {
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                socket.emit(ACTIONS.OFFER, { target: userId, sdp: offer });
              };
              stream.getAudioTracks().forEach((track) => {
                pc.addTrack(track, stream);
              });
            });

            socket.emit(ACTIONS.UNMUTE, { socketId: socket.id, roomId });
          })
          .catch((err) => {
            alert(
              "Microphone access denied. Please allow microphone access to use this feature."
            );
            console.error("Error accessing microphone:", err);
          });
      } else {
        localStreamRef.current.getAudioTracks().forEach((track) => {
          track.enabled = true;
        });
        setIsMicOn(true);
        socket.emit(ACTIONS.UNMUTE, { socketId: socket.id, roomId });
      }
    } else {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = false;
      });
      setIsMicOn(false);
      socket.emit(ACTIONS.MUTE, { socketId: socket.id, roomId });
    }
  };

  useEffect(() => {
    socket.on(ACTIONS.JOINED, async ({ socketId }) => {
      createPeerConnection(socketId, false);
    });

    socket.on(ACTIONS.GETUSERS, ({ users }) => {
      users.forEach(({ socketId }) => {
        createPeerConnection(socketId, true);
      });
    });

    socket.on(ACTIONS.OFFER, async ({ caller, sdp }) => {
      const peerConnection = createPeerConnection(caller, false);
      await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
      let answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit(ACTIONS.ANSWER, { sdp: answer, target: caller });
      console.log("Answered offer from ", caller);
    });

    socket.on(ACTIONS.ANSWER, async ({ caller, sdp }) => {
      const peerConnection = peersRef.current[caller];
      await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
    });

    socket.on(ACTIONS.ICE_CANDIDATE, async ({ caller, candidate }) => {
      const peerConnection = peersRef.current[caller];
      if (peerConnection)
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    });

    return () => {
      socket.off(ACTIONS.OFFER);
      socket.off(ACTIONS.ANSWER);
      socket.off(ACTIONS.ICE_CANDIDATE);
      Object.values(peersRef.current).forEach((pc) => pc.close());
    };
  }, [socket]);

  //Function to create a new peer connection
  const createPeerConnection = (userId, isInitiator) => {
    if (peersRef.current[userId]) return peersRef.current[userId];

    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    peersRef.current[userId] = pc;

    if (localStreamRef.current) {
      localStreamRef.current
        .getTracks()
        .forEach((track) => pc.addTrack(track, localStreamRef.current));
    }

    pc.ontrack = (event) => {
      setRemoteAudios((prev) => [
        ...prev,
        { id: userId, stream: event.streams[0] },
      ]);
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit(ACTIONS.ICE_CANDIDATE, {
          target: userId,
          candidate: event.candidate,
        });
      }
    };

    if (isInitiator) {
      pc.onnegotiationneeded = async () => {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit(ACTIONS.OFFER, { target: userId, sdp: offer });
      };
    }

    return pc;
  };

  return (
    <>
      <div className="bg-white/5 backdrop-blur-3xl rounded-3xl shadow-xl border border-white/10 p-6 relative overflow-hidden flex-1 min-h-0 mt-8">
        {/* Glass effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none rounded-3xl"></div>
        {/* Top glass reflection */}
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/15 to-transparent pointer-events-none rounded-t-3xl"></div>

        <div className="relative z-10 flex flex-col h-80">
          <h2 className="text-xl font-bold bg-white bg-clip-text text-transparent mb-4 drop-shadow-lg text-center">
            Active Users
          </h2>

          {/* Scrollable user list */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-400/50 scrollbar-track-transparent">
            <ul className="space-y-1 pr-2">
              {userList.map((user) => (
                <li
                  key={user.socketId}
                  className={`bg-white/40 backdrop-blur-md rounded-lg px-3 py-2 text-gray-800 text-base font-medium shadow-inner flex items-center justify-center border-2 ${
                    user.isMuted ? "border-red-500" : "border-green-500"
                  }`}
                >
                  <span>{user.userName}</span>
                </li>
              ))}
            </ul>
          </div>

          <audio
            autoPlay
            muted
            ref={(el) => el && (el.srcObject = localStreamRef.current)}
          />

          {remoteAudios.map((r) => (
            <audio
              key={r.id}
              autoPlay
              ref={(el) => el && (el.srcObject = r.stream)}
            />
          ))}

          {/* Current user microphone button */}
          <div className="mt-3 pt-3 border-t border-white/20 flex justify-center">
            <button
              onClick={toggleMicrophone}
              className={`transition-all duration-300 rounded-xl px-4 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 ${
                isMicOn
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              }`}
              title={
                isMicOn
                  ? "Microphone On - Click to Mute"
                  : "Microphone Off - Click to Unmute"
              }
            >
              <img
                src="/microphone.png"
                alt="microphone"
                className="w-6 h-6"
                style={{
                  filter:
                    "brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)",
                }}
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserList;
