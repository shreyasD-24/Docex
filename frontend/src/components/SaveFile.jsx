import React from "react";

const SaveFile = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-emerald-500/20 hover:bg-emerald-500/30 backdrop-blur-xl px-6 py-3 rounded-xl transition-all duration-200 border border-emerald-400/30 hover:border-emerald-400/50 shadow-lg hover:shadow-xl"
      title="Save Document"
    >
      <span className="text-emerald-400 hover:text-emerald-300 font-semibold text-base">
        Save
      </span>
    </button>
  );
};

export default SaveFile;
