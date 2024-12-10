import "./App.css";
import StartPage from "./components/startpage/StartPage";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useRef, useState } from "react";
import ChatRoom from "./components/chatroom/ChatRoom";

function App() {
  const [connection, setConnection] = useState(undefined);
  const [room, setRoom] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUser, setTypingUser] = useState("");

  const typingTimeoutRef = useRef(null);

  async function joinChatRoom(UserName, ChatRoom) {
    try {
      const newConnection = new HubConnectionBuilder()
        .withUrl("http://localhost:5114/chat")
        .configureLogging(LogLevel.Information)
        .withAutomaticReconnect()
        .build();

      newConnection.on("UsersInRoom", (users) => {
        setUsers(users);
      });

      newConnection.on("ReceiveMessage", (msg) => {
        setMessages((messages) => [...messages, { msg, sender: "system" }]);
      });

      newConnection.on("ReceiveMessageFromUser", (msg, userName) => {
        setMessages((messages) => [...messages, { msg, sender: userName }]);
      });

      newConnection.on("Typing", (userName) => {
        setTypingUser(userName);

        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
          setTypingUser("");
          typingTimeoutRef.current = null;
        }, 1000);
      });

      newConnection.onclose((e) => {
        setConnection();
        setMessages([]);
        setMessages([]);
      });

      await newConnection.start();
      await newConnection.invoke("JoinRoom", { UserName, ChatRoom });
      setConnection(newConnection);
      setRoom(ChatRoom);
    } catch (error) {
      console.error(error);
    }
  }

  const sendMessage = async (msg) => {
    if (connection.state === "Connected") {
      try {
        await connection.invoke("SendMessage", msg);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const userIsTyping = async () => {
    if (connection) {
      try {
        await connection.invoke("UserIsTyping");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const leaveRoom = async () => {
    if (connection) {
      try {
        connection.stop();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <main>
        {!connection ? (
          <StartPage onSubmit={joinChatRoom} />
        ) : (
          <>
            <ChatRoom
              messages={messages}
              sendMessage={sendMessage}
              users={users}
              userTyping={userIsTyping}
              room={room}
              leaveRoom={leaveRoom}
              typingUser={typingUser}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
