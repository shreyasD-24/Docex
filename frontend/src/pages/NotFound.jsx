import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";
import animation from "../animations/notFound.json";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('/bg-home.jpg')",
      }}
    >
      <div className="text-center max-w-md">
        {/* Animation with white background */}
        <div className="mb-8 flex justify-center">
          <div className="bg-white rounded-3xl p-6">
            <Lottie
              animationData={animation}
              style={{ width: 200, height: 200 }}
            />
          </div>
        </div>

        {/* 404 Text */}
        <h1 className="text-8xl font-black text-white mb-4">404</h1>

        {/* Message */}
        <h2 className="text-2xl font-bold text-white mb-4">Page Not Found !</h2>

        <p className="text-white/70 mb-8">
          The page you're looking for doesn't exist.
        </p>

        {/* Button */}
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors duration-200"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
