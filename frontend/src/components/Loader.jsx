import animation from "../animations/loader.json";
import Lottie from "lottie-react";

const Loader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <Lottie animationData={animation} style={{ width: 200, height: 200 }} />
    </div>
  );
};

export default Loader;
