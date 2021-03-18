import * as ws from "ws";
import Pet from "./pet";

class Socket {
  constructor(private socket: ws, private pet: Pet) {
    this.pet.on("activity", this.activity.bind(this));
    this.pet.on("status", this.status.bind(this));
    this.pet.on("hello", this.hello.bind(this));
    this.pet.on("ban", this.ban.bind(this));
    this.pet.on("sub", this.sub.bind(this));
    this.send({ type: "initialise", state: pet.getCurrentState() });
  }

  send(message: any) {
    this.socket.send(JSON.stringify(message));
  }

  activity(new_activity: string) {
    this.send({ type: "activity", activity: new_activity });
  }

  status(new_status: string) {
    this.send({ type: "status", status: new_status });
  }

  hello(username: string) {
    this.send({ type: "hello", username });
  }

  ban(username: string) {
    this.send({ type: "ban", username });
  }

  sub(username: string) {
    this.send({ type: "sub", username });
  }
}

export default Socket;
