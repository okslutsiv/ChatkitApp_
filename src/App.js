import React from "react";
import Chatkit from "@pusher/chatkit-client";
import MessageList from "./components/MessageList";
import SendMessageForm from "./components/SendMessageForm";
import RoomList from "./components/RoomList";
import NewRoomForm from "./components/NewRoomForm";

// import { tokenUrl, instanceLocator } from './config'

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      myId: "",
      roomId: null,
      messages: [],
      joinableRooms: [],
      joinedRooms: [],
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.subscribeToRoom = this.subscribeToRoom.bind(this);
    this.getRooms = this.getRooms.bind(this);
    this.createRoom = this.createRoom.bind(this);
  }

  componentDidMount() {
    const chatManager = new Chatkit.ChatManager({
      instanceLocator: "v1:us1:8bd10ce1-bc88-410c-a0a9-9803b45b82f3",
      userId: "okslutsiv",
      tokenProvider: new Chatkit.TokenProvider({
        url:
          "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/8bd10ce1-bc88-410c-a0a9-9803b45b82f3/token",
      }),
    });

    chatManager
      .connect()
      .then(currentUser => {
        console.log("Successful connection", currentUser);
        this.currentUser = currentUser;
        this.setState({
          myId: this.currentUser.id,
        });
        console.log(this.currentUser.rooms);
        this.getRooms();
      })
      .catch(err => console.log("error on connecting: ", err));
  }

  getRooms() {
    this.currentUser
      .getJoinableRooms()
      .then(joinableRooms =>
        this.setState({
          joinableRooms,
          joinedRooms: this.currentUser.rooms,
        }),
      )
      .catch(err => console.log("Error on joinable rooms", err));
  }

  subscribeToRoom(roomId) {
    this.setState({ messages: [] });
    this.currentUser
      .subscribeToRoomMultipart({
        roomId: roomId,
        hooks: {
          onMessage: message => {
            console.log("received message", message);
            this.setState({
              messages: [...this.state.messages, message],
            });
          },
        },
      })
      .then(room => {
        this.setState({
          roomId: room.id,
        });
        this.getRooms();
      })
      .catch(err => console.log("error on subscribing to room: ", err));
  }

  sendMessage(text) {
    this.currentUser.sendMessage({
      text,
      roomId: this.state.roomId,
    });
  }

  createRoom(name) {
    this.currentUser
      .createRoom({
        name,
      })
      .then(room => this.subscribeToRoom(room.id))
      .catch(err => console.log("error with createRoom: ", err));
  }

  render() {
    return (
      <div className="app">
        <RoomList
          subscribeToRoom={this.subscribeToRoom}
          rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]}
          roomId={this.state.roomId}
        />
        <MessageList
          roomId={this.state.roomId}
          messages={this.state.messages}
          myId={this.state.myId}
        />
        <SendMessageForm
          disabled={!this.state.roomId}
          sendMessage={this.sendMessage}
        />
        <NewRoomForm createRoom={this.createRoom} />
      </div>
    );
  }
}

export default App;
