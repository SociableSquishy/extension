import Pet from "./pet";
import * as jsonwebtoken from "jsonwebtoken";
import axios from "axios";

class Socket {
	constructor(private pet: Pet, private channel_id: string) {
		this.pet.on("activity", this.activity.bind(this));
		this.pet.on("status", this.status.bind(this));
		this.pet.on("hello", this.hello.bind(this));
		this.pet.on("ban", this.ban.bind(this));
		this.pet.on("sub", this.sub.bind(this));
		this.send({type: "initialise", state: pet.getCurrentState()});
	}

	send(message: any) {
		// Update here to publish
		const token_content = {
			exp: 1616515580, // Math.round(Date.now() / 1000) + 1,
			user_id: this.channel_id,
			role: "external",
			channel_id: this.channel_id,
			pubsub_perms: {
				send: ["broadcast"],
			},
		};
		const token = jsonwebtoken.sign(
			token_content,
			Buffer.from(process.env.JWT_SECRET, "base64")
		);

		const body = {
			content_type: "application/json",
			message: JSON.stringify(message),
			targets: ["broadcast"],
		};

		axios.post(
			`https://api.twitch.tv/extensions/message/${this.channel_id}`,
			body,
			{headers: {authorization: `Bearer ${token}`, 'Client-Id': process.env.TWITCH_CLIENT_ID}}
		).catch(console.log);
	}

	activity(new_activity: string) {
		this.send({type: "activity", activity: new_activity});
	}

	status(new_status: string) {
		this.send({type: "status", status: new_status});
	}

	hello(username: string) {
		this.send({type: "hello", username});
	}

	ban(username: string) {
		this.send({type: "ban", username});
	}

	sub(username: string) {
		this.send({type: "sub", username});
	}
}

export default Socket;
