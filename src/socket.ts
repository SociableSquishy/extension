import * as ws from "ws";
import Pet from "./pet";

class Socket {
  constructor(private socket: ws, private pet: Pet) {
    this.pet.on("activity", this.activity.bind(this));
    this.send({ type: "initialise", state: pet.getCurrentState() });
  }

  send(message: any) {
    this.socket.send(JSON.stringify(message));
  }

  activity(new_activity: string) {
    this.send({ type: "activity", activity: new_activity });
  }
}

export default Socket;
