import React from "react";
import Chatkit from "@pusher/chatkit-client";

import MessageList from "./components/MessageList";
import SendMessageForm from "./components/SendMessageForm";
import RoomList from "./components/RoomList";
import NewRoomForm from "./components/NewRoomForm";

import { tokenUrl, instanceLocator } from "./config";

class App extends React.Component {
  state = {
    messages: [],
    joinableRooms: [],
    joinedRooms: [],
    roomId: null
  };
  getRooms = () => {
    this.currentUser
      .getJoinableRooms()
      .then(joinableRooms =>
        this.setState({
          joinableRooms,
          joinedRooms: this.currentUser.rooms
        })
      )
      .catch(err => console.log("Error on joinable rooms", err));
  };

  subscribeToRoom = roomId => {
    this.setState({ messages: [] });
    this.currentUser
      .subscribeToRoom({
        roomId,
        hooks: {
          onNewMessage: message => {
            this.setState({ messages: [...this.state.messages, message] });
          }
        }
      })
      .then(room => {
        this.setState({
          roomId: room.id
        });
        this.getRooms();
      })
      .catch(err => console.log("Error on connecting", err));
  };

  componentDidMount() {
    const chatManager = new Chatkit({
      instanceLocator,
      userId: "okslutsiv",
      tokenProvider: new Chatkit.tokenProvider({
        url: tokenUrl
      })
    });
    chatManager.connect().then(currentUser => {
      this.currentUser = currentUser;

      this.getRooms();
    });
  }

  sendMessage = text => {
    this.currentUser.sendMessage({
      text,
      roomId: 19887665
    });
  };
  createRoom = roomName => {
    this.currentUser
      .createRoom({ name: roomName })
      .then(room => this.subscribeToRoom(room.id))
      .catch(err => console.log("Error with creating the room", err));
  };

  render() {
    return (
      <div className="app">
        <RoomList
          activeRoom={this.state.roomId}
          subscribeToRoom={() => this.subscribeToRoom}
          rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]}
        />
        <MessageList messages={this.state.messages} roomId={this.roomId} />
        <NewRoomForm createRoom={this.createRoom} />
        <SendMessageForm
          sendMessage={this.sendMessage}
          disabled={!this.roomId}
        />
      </div>
    );
  }
}
export default App;
