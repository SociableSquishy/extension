import { EventEmitter } from "events";

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

  constructor(private stats = { ...defaultStats }) {
    super();
    this.timer = setInterval(this.doTick.bind(this), 5000);
    this.currentActivity = activities[0];
  }

  getCurrentState() {
    return { activity: this.currentActivity, stats: this.stats };
  }
  doTick() {
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
    this.stats.Social.current = Math.floor(
      Math.random() * this.stats.Social.max
    );
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
