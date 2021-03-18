import * as express from "express";
import * as morgan from "morgan";
import * as ws from "ws";
import * as http from "http";
import * as jsonwebtoken from "jsonwebtoken";
import * as dotenv from "dotenv";
import Socket from "./socket";
import ZooKeeper from "./zoo_keeper";

dotenv.config();

const app: express.Application = express();
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));
app.use(express.static("public"));

const server = http.createServer(app);
server.listen(process.env.PORT || 8080);

const keeper = new ZooKeeper();

interface IToken {
  channel_id: string;
}
const websocket = new ws.Server({ server, path: "/ws" });
websocket.on("connection", (socket: ws, request: http.IncomingMessage) => {
  try {
    const token = jsonwebtoken.verify(
      request.headers["sec-websocket-protocol"],
      Buffer.from(process.env.JWT_SECRET, "base64")
    ) as IToken;

    const s = new Socket(socket, keeper.get(token.channel_id));
  } catch (e) {
    socket.close();
  }
});
