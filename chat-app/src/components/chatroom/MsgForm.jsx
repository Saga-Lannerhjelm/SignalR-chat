import React, { useState } from "react";

const MsgForm = ({ sendMessage, userTyping }) => {
  const [message, setMessage] = useState("");
  return (
    <div className="form-container">
      <form
        className="msg-form"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(message);
          setMessage("");
        }}
      >
        <input
          type="text"
          placeholder="Message"
          onChange={(e) => {
            setMessage(e.target.value);
            userTyping();
          }}
          value={message}
        />
        <button type="submit" className="btn" disabled={!message}>
          Send
        </button>
      </form>
    </div>
  );
};

export default MsgForm;
