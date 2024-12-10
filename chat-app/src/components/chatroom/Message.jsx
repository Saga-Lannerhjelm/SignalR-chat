import React from "react";

const Message = ({ item }) => {
  return (
    <div>
      <span
        style={!item.sender ? { float: "right" } : { float: "left" }}
        className={!item.sender ? "outlined" : "filled"}
      >
        <small className="small">
          {!item.sender ? "" : " " + item.sender + ""}
        </small>
        {item.msg}
      </span>
    </div>
  );
};

export default Message;
