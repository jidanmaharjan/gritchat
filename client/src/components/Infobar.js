import React from "react";

import { GoPrimitiveDot } from "react-icons/go";

const Infobar = ({ activeRoom }) => {
  if (!activeRoom) {
    return (
      <div className="hidden md:block md:w-80 bg-gradient-to-l from-emerald-500 to-emerald-600 p-4 font-semibold text-white"></div>
    );
  }
  return (
    <div className="hidden md:block md:w-80 bg-gradient-to-l from-emerald-500 to-emerald-600 p-4 font-semibold text-white">
      <div>
        <h2 className="text-lg mb-4">Members</h2>
        <div>
          <h2 className="flex items-center bg-emerald-300 mb-2 p-2 rounded-md">
            <GoPrimitiveDot className="text-yellow-400 text-xl mr-2" /> Eren
          </h2>
          <h2 className="flex items-center bg-emerald-300 mb-2 p-2 rounded-md">
            <GoPrimitiveDot className="text-yellow-400 text-xl mr-2" /> Mikasa
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Infobar;
