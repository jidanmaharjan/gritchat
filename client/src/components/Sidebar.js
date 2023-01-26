import React, { useRef, useState } from "react";

import Lottie from "react-lottie-player";
import pochita from "../assets/68737-pochita-improved.json";
import general from "../assets/59839-commnet-animation.json";
import music from "../assets/52679-music-loader.json";

import { HiChevronDown, HiChevronUp } from "react-icons/hi";

const Sidebar = ({
  activeRoom,
  setActiveRoom,
  socket,
  user,
  setUser,
  setMessages,
}) => {
  const nickNameRef = useRef();
  const [sideToggle, setSideToggle] = useState(true);

  const roomHandler = (room) => {
    if (nickNameRef.current.value === "") {
      return;
    }
    if (activeRoom === room) {
      return;
    }
    const joinData = {
      room: room,
      user: nickNameRef.current.value,
      id: socket.id,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    };
    setUser(nickNameRef.current.value);
    if (activeRoom) {
      socket.emit("leaveRoom", {
        room: activeRoom,
        user: nickNameRef.current.value,
        id: socket.id,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      });
    }
    setActiveRoom(room);
    setMessages([]);
    socket.emit("joinRoom", joinData);
    setSideToggle(false);
  };

  return (
    <div
      className={`fixed top-0 z-50 ${
        !sideToggle && "translate-y-[-100%]"
      } transition-transform ease-in-out duration-200 md:translate-y-0 max-w-full md:static md:w-80 bg-gradient-to-r from-emerald-400 to-emerald-300 p-4 font-semibold text-white`}
    >
      <button
        onClick={() => setSideToggle(!sideToggle)}
        className="absolute md:hidden bottom-[-2.5rem] left-[50%] translate-x-[-50%] h-10 py-1 px-2 rounded-b-lg bg-teal-100/50 border z-50"
      >
        {sideToggle ? (
          <HiChevronUp className="text-3xl text-teal-400" />
        ) : (
          <HiChevronDown className="text-3xl text-teal-400" />
        )}
      </button>
      <div className="mb-4 ">
        <label className="text-lg" htmlFor="nickname">
          Enter ChatName
        </label>
        <input
          className="py-3 px-4 w-full mt-2 rounded-md outline-none text-gray-400"
          type="text"
          placeholder="Enter Nickname"
          id="nickname"
          ref={nickNameRef}
        />
      </div>
      <div>
        <h1 className="text-lg mb-2">Rooms</h1>
        <div className="grid grid-cols-4 md:grid-cols-2 gap-4">
          <button
            onClick={() => roomHandler("general")}
            className={`hover:bg-emerald-500 rounded-md p-1 ${
              activeRoom === "general" && "bg-emerald-500"
            }`}
          >
            <Lottie loop animationData={general} play />
            General
          </button>
          <button
            onClick={() => roomHandler("anime")}
            className={`hover:bg-emerald-500 rounded-md p-1 ${
              activeRoom === "anime" && "bg-emerald-500"
            }`}
          >
            <Lottie loop animationData={pochita} play />
            Anime
          </button>
          <button
            onClick={() => roomHandler("music")}
            className={`hover:bg-emerald-500 rounded-md p-1 ${
              activeRoom === "music" && "bg-emerald-500"
            }`}
          >
            <Lottie loop animationData={music} play />
            Music
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
