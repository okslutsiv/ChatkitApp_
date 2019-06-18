import React from "react";

export default function Message({ username, text, myId }) {
  const myMsg = myId === username ? "my-msg" : "";
  return (
    <div className={`message ${myMsg}`}>
      <div className="message-username">{username}</div>
      <div className="message-text">{text}</div>
    </div>
  );
}
