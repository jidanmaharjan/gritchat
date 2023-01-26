import Sidebar from "./components/Sidebar";
import Infobar from "./components/Infobar";
import Chat from "./components/Chat";
import { useState } from "react";

function App() {
  const [activeRoom, setActiveRoom] = useState(null);
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  return (
    <div className="App flex w-full min-h-screen">
      <Sidebar
        socket={socket}
        activeRoom={activeRoom}
        setActiveRoom={setActiveRoom}
        setUser={setUser}
        setMessages={setMessages}
      />
      <Chat
        socket={socket}
        activeRoom={activeRoom}
        user={user}
        messages={messages}
        setMessages={setMessages}
        setSocket={setSocket}
      />
      <Infobar activeRoom={activeRoom} />
    </div>
  );
}

export default App;
