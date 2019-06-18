import React, { useState } from "react";

function SendMessageForm(props) {
  const { sendMessage, disabled } = props;
  const [message, setMessage] = useState("");

  const handleChange = e => setMessage(e.target.value);

  const handleSubmit = e => {
    e.preventDefault();
    sendMessage(message);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="send-message-form">
      <input
        disabled={disabled}
        onChange={handleChange}
        value={message}
        placeholder="Type your message and hit ENTER"
        type="text"
      />
    </form>
  );
}

export default SendMessageForm;
