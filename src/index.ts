import * as express from "express";
import * as morgan from "morgan";
import * as ws from "ws";
import * as http from "http";
import * as jsonwebtoken from "jsonwebtoken";
import * as dotenv from "dotenv";
import axios from "axios";
import Socket from "./socket";
import ZooKeeper from "./zoo_keeper";

dotenv.config();

let token: string;
async function getOauthToken() {
  try {
    const response = await axios.post(
      `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`
    );
    token = response.data.access_token;
    setTimeout(getOauthToken, Math.min(3600, response.data.expires_in) * 1000);
  } catch (_e) {
    setTimeout(getOauthToken, 6000);
  }
}
getOauthToken();

export async function getChannelNameFromId(channel_id: string) {
  try {
    const response = await axios.get(
      `https://api.twitch.tv/helix/channels?broadcaster_id=${channel_id}`,
      {
        headers: {
          "Client-ID": process.env.TWITCH_CLIENT_ID,
          authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data[0].broadcaster_name;
  } catch (e) {
    console.log(e);
    return channel_id;
  }
}

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
websocket.on(
  "connection",
  async (socket: ws, request: http.IncomingMessage) => {
    try {
      const token = jsonwebtoken.verify(
        request.headers["sec-websocket-protocol"],
        Buffer.from(process.env.JWT_SECRET, "base64")
      ) as IToken;

      const s = new Socket(socket, await keeper.get(token.channel_id));
    } catch (e) {
      socket.close();
    }
  }
);
