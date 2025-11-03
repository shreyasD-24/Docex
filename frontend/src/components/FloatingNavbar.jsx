import React, { useState } from "react";

const FloatingNavbar = () => {
  const [activeItem, setActiveItem] = useState("Home");

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Features", href: "#features" },
    { name: "About", href: "#about" },
    { name: "Contact Us", href: "#contact" },
  ];

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <nav className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-6 py-3 shadow-2xl">
        <div className="flex items-center space-x-8">
          {navItems.map((item, index) => (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setActiveItem(item.name)}
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                activeItem === item.name
                  ? "text-white bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              {item.name}

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </a>
          ))}
        </div>

        {/* Floating particles effect */}
        <div className="absolute -top-1 -left-1 w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute -top-2 right-4 w-1 h-1 bg-pink-400 rounded-full animate-ping opacity-40"></div>
        <div className="absolute -bottom-1 left-8 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse opacity-50"></div>
      </nav>
    </div>
  );
};

export default FloatingNavbar;
