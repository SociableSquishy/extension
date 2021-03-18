import { EventEmitter } from "events";
import * as tmi from "tmi.js";

interface Activity {
  name: string;
  speed: number;
}
interface Stat {
  max: number;
  current: number;
}
interface StatList {
  Happiness: Stat;
  Hunger: Stat;
  Health: Stat;
  Social: Stat;
}

// Seconds until drop at levels 2, 3, 4, 5
const socialRates = [600, 300, 60, 30];

const activities: Activity[] = [
  { name: "walking", speed: 2 },
  { name: "sleeping", speed: 0 },
  { name: "running", speed: 4 },
  { name: "sitting", speed: 0 },
];
const defaultStats: StatList = {
  Happiness: { max: 5, current: 4 },
  Hunger: { max: 5, current: 3 },
  Health: { max: 5, current: 2 },
  Social: { max: 5, current: 1 },
};
class Pet extends EventEmitter {
  timer: NodeJS.Timer;
  currentActivity: Activity;
  chatClient: tmi.Client;
  saidHelloTo: Set<string> = new Set();
  lastMessage: number;

  constructor(
    private owner: string,
    private online: boolean,
    private stats = { ...defaultStats }
  ) {
    super();
    this.lastMessage = Date.now();
    this.timer = setInterval(this.doTick.bind(this), 5000);
    this.currentActivity = activities[0];

    this.chatClient = new tmi.Client({
      connection: { reconnect: true },
      channels: [this.owner.toLowerCase()],
    });
    this.chatClient.on("message", this.handleChatMessage.bind(this));
    this.chatClient.on("ban", this.handleBanMessage.bind(this));
    this.chatClient.connect().then(() => console.log("connected"));
  }

  handleChatMessage(
    _channel: string,
    userstate: tmi.ChatUserstate,
    _message: string
  ) {
    this.lastMessage = Date.now();
    this.stats.Social.current = Math.min(
      this.stats.Social.current + 1,
      this.stats.Social.max
    );
    const user = userstate["display-name"];
    if (!this.saidHelloTo.has(user)) {
      this.emit("hello", user);
      this.saidHelloTo.add(user);
    }
  }

  handleBanMessage(_channel: string, username: string) {
    this.emit("ban", username);
  }

  getCurrentState() {
    return { activity: this.currentActivity, stats: this.stats };
  }
  doTick() {
    // if (!this.online) return;

    this.newActivity();
    this.updateSocial();
    this.updateFood();
    this.updateHappiness();
    this.updateHealth();
    this.emit("status", this.stats);
  }

  newActivity() {
    this.emit(
      "activity",
      activities[Math.floor(Math.random() * activities.length)]
    );
  }

  updateSocial() {
    if (this.stats.Social.current <= 1) return;

    if (
      socialRates[this.stats.Social.current - 2] <=
      Math.floor((Date.now() - this.lastMessage) / 1000)
    ) {
      this.stats.Social.current--;
    }
  }

  updateFood() {
    this.stats.Hunger.current = Math.floor(
      Math.random() * this.stats.Hunger.max
    );
  }

  updateHappiness() {
    this.stats.Happiness.current = Math.floor(
      Math.random() * this.stats.Happiness.max
    );
  }

  updateHealth() {
    this.stats.Health.current = Math.floor(
      Math.random() * this.stats.Health.max
    );
  }
}

export default Pet;
