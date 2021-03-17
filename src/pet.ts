import { EventEmitter } from "events";

interface Activity {
  name: string;
  speed: number;
}
interface Stat {
  max: number;
  current: number;
}

const activities: Activity[] = [
  { name: "walking", speed: 2 },
  { name: "sleeping", speed: 0 },
  { name: "running", speed: 4 },
  { name: "sitting", speed: 0 },
];
const defaultStats = {
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
    this.timer = setInterval(this.newActivity.bind(this), 5000);
    this.currentActivity = activities[0];
  }

  getCurrentState() {
    return { activity: this.currentActivity, stats: this.stats };
  }

  newActivity() {
    this.emit(
      "activity",
      activities[Math.floor(Math.random() * activities.length)]
    );
  }
}

export default Pet;
