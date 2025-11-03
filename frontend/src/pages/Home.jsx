import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FloatingNavbar from "../components/FloatingNavbar";
import Features from "../components/Features";
import AboutUs from "../components/AboutUs";
import ContactUs from "../components/ContactUs";
import Footer from "../components/Footer";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const originalBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "smooth";

    return () => {
      document.documentElement.style.scrollBehavior = originalBehavior;
    };
  }, []);

  const handleGetStarted = () => {
    navigate("/join-room");
  };

  return (
    <div
      style={{
        backgroundImage: "url('/bg-home.jpg')",
      }}
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed relative scroll-smooth"
    >
      <FloatingNavbar />
      <div id="home" />

      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-white mt-16">
          <img
            src="/logo_home.png"
            alt="Docex Logo"
            className="mx-auto mb-6 w-72"
          />
          <p className="text-xl text-white/80 drop-shadow-lg mb-8 max-w-3xl mx-auto leading-relaxed">
            Experience seamless real-time collaboration with our advanced
            document editing platform. Work together with your team from
            anywhere in the world, powered by cutting-edge AI assistance that
            enhances your productivity and creativity. Create, edit, and share
            documents with intelligent suggestions and instant synchronization.
          </p>

          <button
            onClick={handleGetStarted}
            className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-full text-lg font-bold transition-all duration-300 transform hover:scale-105 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 shadow-2xl hover:shadow-3xl mb-6"
          >
            Get Started
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400/30 via-teal-400/30 to-cyan-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 rounded-full"></div>
          </button>

          {/* Learn More Link */}
          <div>
            <a
              href="#about"
              className="group inline-flex items-center justify-center space-x-3 px-8 py-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/20 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/40 text-lg font-semibold transition-all duration-500 hover:scale-105 hover:shadow-2xl transform"
            >
              <span className="relative">
                Learn More About Us
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400 group-hover:w-full transition-all duration-500"></div>
              </span>
              <div className="relative">
                <svg
                  className="w-6 h-6 transform group-hover:translate-x-2 transition-transform duration-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features">
        <Features />
      </div>

      {/* About Section */}
      <div id="about">
        <AboutUs />
      </div>

      <div id="contact">
        <ContactUs />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
