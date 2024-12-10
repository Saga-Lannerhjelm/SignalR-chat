import React, { useEffect, useState } from "react";
import Message from "./Message";
import TypingIndicator from "./TypingIndicator";
import MsgForm from "./MsgForm";
import Header from "./Header";

const ChatRoom = ({
  messages,
  sendMessage,
  users,
  userTyping,
  room,
  leaveRoom,
  typingUser,
}) => {
  return (
    <div>
      <Header room={room} leaveRoom={leaveRoom} users={users} />
      {/* Messages */}
      <div className="msg-container">
        {messages.map((item, index) => {
          return item.sender !== "system" ? (
            <Message item={item} key={index} />
          ) : (
            <div key={index}>
              <small>
                {item.msg} - {item.sender}
              </small>
            </div>
          );
        })}
      </div>
      <div className="bottom-section">
        <div>{typingUser && <TypingIndicator typingUser={typingUser} />}</div>
        <div>
          <MsgForm sendMessage={sendMessage} userTyping={userTyping} />
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
