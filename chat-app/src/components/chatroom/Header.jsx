import React from "react";

const Header = ({ room, leaveRoom, users }) => {
  return (
    <div className="header">
      <div className="chat-room">{room}</div>
      <div className="users-container">
        <div>
          {users.map((user, index) => (
            <span key={index}>{user}</span>
          ))}
        </div>
        {" (" + users.length + ")"}
      </div>
      <button className="btn-secondary" onClick={() => leaveRoom()}>
        Leave room
      </button>
    </div>
  );
};

export default Header;
