import { checkOnline, getChannelNameFromId } from ".";
import Pet from "./pet";

class ZooKeeper {
  pets: Map<string, Pet> = new Map();

  async get(channel_id: string) {
    // If pet does not exist, create the pet
    if (!this.pets.has(channel_id)) {
      const channel_name = await getChannelNameFromId(channel_id);
      this.pets.set(
        channel_id,
        new Pet(channel_name, await checkOnline(channel_name))
      );
    }

    // Fetch pet
    return this.pets.get(channel_id);
  }
}

export default ZooKeeper;
