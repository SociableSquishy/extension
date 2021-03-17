import Pet from "./pet";

class ZooKeeper {
  pets: Map<string, Pet> = new Map();

  get(channel_id: string) {
    // If pet does not exist, create the pet
    if (!this.pets.has(channel_id)) {
      this.pets.set(channel_id, new Pet());
    }

    // Fetch pet
    return this.pets.get(channel_id);
  }
}

export default ZooKeeper;
