import React, {
  useCallback,
  useDebugValue,
  useEffect,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";

import ScrollToBottom from "react-scroll-to-bottom";

import { BsThreeDotsVertical } from "react-icons/bs";
import { FaBell, FaBellSlash, FaPaperPlane } from "react-icons/fa";

import quack from "../assets/audio/quack_5.mp3";
import wow from "../assets/audio/wow.mp3";
import nogod from "../assets/audio/no-god.mp3";

const Chat = ({
  socket,
  setSocket,
  user,
  activeRoom,
  messages,
  setMessages,
}) => {
  const newMessageRef = useRef();
  const lastIndex = useCallback((node) => {
    if (node) {
      node.scrollIntoView({ smooth: true });
    }
  }, []);
  const [activeusers, setActiveusers] = useState(1);
  const notiRef = useRef();
  const [silent, setSilent] = useState(false);

  const sendMessage = (e) => {
    e.preventDefault();
    const body = newMessageRef.current.value;
    if (body === "") return;
    const message = {
      room: activeRoom,
      user,
      body,
      id: socket.id,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    };
    socket.emit("sendMessage", message);
    newMessageRef.current.value = "";
    setMessages((list) => [...list, message]);
  };

  const pushMessage = (message) => {
    setMessages((list) => [...list, message]);
  };

  useEffect(() => {
    if (socket === null) {
      setSocket(io("http://192.168.0.107:4000"));
    }
    if (socket) {
      socket.on("receiveMessage", (message) => {
        pushMessage(message);
        notificationHandler();
      });
      socket.on("joinRoom", (room) => {
        room = { ...room, body: `${room.user} has entered the chat.` };
        setMessages((list) => [...list, room]);
        setActiveusers((prev) => prev + 1);
        joinHandler();
      });
      socket.on("leaveRoom", (room) => {
        room = { ...room, body: `${room.user} has left the chat.` };
        setMessages((list) => [...list, room]);
        setActiveusers((prev) => prev - 1);
        leaveHandler();
      });
    }
  }, [socket]);

  function leaveHandler() {
    const leave = new Audio(nogod);
    if (!silent) {
      leave.play();
    }
  }
  function joinHandler() {
    const join = new Audio(wow);
    if (!silent) {
      join.play();
    }
  }
  function notificationHandler() {
    if (!silent) {
      notiRef.current.play();
    }
  }

  if (!activeRoom) {
    return (
      <div className="flex-grow flex flex-col min-h-screen">
        <div className="flex items-center justify-center h-screen p-4 bg-emerald-100 rounded-b-lg font-semibold text-slate-500">
          <h2 className="text-2xl">Enter a room to start chatting</h2>
        </div>
      </div>
    );
  }
  return (
    <div className="flex-grow flex flex-col max-h-screen">
      <audio ref={notiRef} className="hidden" controls>
        <source src={quack} type="audio/mp3" />
      </audio>
      <div className="flex p-4 bg-emerald-100 rounded-b-lg font-semibold text-slate-500">
        <h2 className="flex-grow grid capitalize">
          {activeRoom}
          <span className="text-xs font-mono">{activeusers} online</span>
        </h2>
        <button
          onClick={() => setSilent(!silent)}
          className="p-2 bg-emerald-200 rounded-md mx-2 w-10 h-10 grid place-content-center hover:bg-emerald-300"
        >
          {silent ? <FaBellSlash /> : <FaBell />}
        </button>
        <button className="p-2 bg-emerald-200 rounded-md mx-2 w-10 h-10 grid place-content-center hover:bg-emerald-300">
          <BsThreeDotsVertical />
        </button>
      </div>
      <div className="flex-grow flex flex-col p-4 min-w-full text-gray-500 overflow-y-hidden hover:overflow-y-scroll">
        {messages.length > 0 &&
          messages.map((unit, index) => {
            return (
              <div
                ref={messages.length - 1 === index ? lastIndex : null}
                key={unit.body + unit.time + index}
                className={`p-4 relative grid mt-4 max-w-[75%] ${
                  unit.id === socket.id
                    ? "self-end rounded-t-lg rounded-bl-lg text-white bg-emerald-300"
                    : "self-start ml-12 rounded-t-lg rounded-br-lg bg-emerald-50"
                }`}
              >
                {unit.id !== socket.id &&
                  unit.id !== messages[index + 1]?.id && (
                    <div className="absolute text-lg font-semibold text-white rounded-full left-[-3rem] bottom-0  capitalize bg-teal-300 p-2 grid place-content-center w-8 h-8">
                      {unit.user[0]}
                    </div>
                  )}
                {unit.body}
                <span className="text-xs text-gray-400/90 font-mono">
                  {unit.time}
                </span>
              </div>
            );
          })}
      </div>
      <form
        className="flex p-4 bg-emerald-100 rounded-t-lg font-semibold text-slate-500"
        onSubmit={sendMessage}
      >
        <input
          ref={newMessageRef}
          className="flex-grow p-4 rounded-md outline-none"
          type="text"
          placeholder="Enter message"
        />
        <button className="p-2 bg-emerald-200 rounded-md ml-4 flex items-center gap-2  hover:bg-emerald-300">
          Send <FaPaperPlane />
        </button>
      </form>
    </div>
  );
};

export default Chat;
