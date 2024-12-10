import React, { useState } from "react";

const StartPage = ({ onSubmit }) => {
  const [userName, setUserName] = useState("");
  const [chatRoom, setChatRoom] = useState("");

  return (
    <>
      <div className="container">
        <h2>Join chat</h2>
        <form
          className="join-form"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(userName, chatRoom);
          }}
        >
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            type="text"
            placeholder="chatRoom"
            onChange={(e) => setChatRoom(e.target.value)}
          />
          <button type="submit" disabled={!userName || !chatRoom}>
            Join
          </button>
        </form>
      </div>
    </>
  );
};

export default StartPage;
