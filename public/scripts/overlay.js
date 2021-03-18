const twitch = window.Twitch.ext;

const pet_sprite = document.getElementById("pet-sprite");
const pet_container = document.getElementById("pet");
const pet_speech = document.getElementById("pet-speech");
const voice = new Audio("voice.mp3");

let activity;
function setActivity(newActivity) {
  activity = newActivity;
  pet_sprite.src = `sprites/${newActivity.name}.gif`;
}

function setStats(newStats) {
  let html = "";
  for (let statName in newStats) {
    const stat = newStats[statName];
    html += `<p>${statName}</p>`;
    html += "<div>";
    html += '<img src="images/filled-heart.png" />'.repeat(stat.current);
    html += '<img src="images/empty-heart.png" />'.repeat(
      stat.max - stat.current
    );
    html += "</div>";
  }

  document.getElementById("stats").innerHTML = html;
}

const message_queue = [];
function speak(message) {
  message_queue.push(message);
}

function sayHello(username) {
  speak(`YAY! ${username} is here`);
}
function sayBan(username) {
  speak(`You've been naughty, ${username}! You're outta here!`);
}

let direction = "1";
let speaking = false;
let speaking_since;
function loop() {
  if (!speaking && message_queue.length) {
    speaking = true;
    pet_speech.innerText = message_queue.shift();
    pet_speech.style.opacity = 1;
    voice.play();
    setTimeout(() => {
      speaking = false;
      pet_speech.innerText = "";
      pet_speech.style.opacity = 0;
    }, 5000);
  }
  if (speaking) {
    activity.speed = 0;
    pet_sprite.src = "sprites/sitting.gif";
  }
  const delta = activity.speed * direction;
  const position = parseInt(pet_container.style.left || "0");
  if (delta + position < 0) direction = 1;
  if (delta + position + pet_container.clientWidth >= window.innerWidth)
    direction = -1;
  pet_container.style.left = `${position + delta}px`;
  if (delta < 0) {
    pet_sprite.style.transform = `scaleX(-1)`;
  } else {
    pet_sprite.style.transform = `scaleX(1)`;
  }

  if (position + delta > window.innerWidth / 2) {
    pet_speech.style.right = 0;
    pet_speech.style.left = "auto";
  } else {
    pet_speech.style.left = 0;
    pet_speech.style.right = "auto";
  }

  requestAnimationFrame(loop);
}

let ws;
function connect(token) {
  ws = new WebSocket(`ws://localhost:8080/ws`, [token]);
  ws.addEventListener("message", (msg) => {
    const message = JSON.parse(msg.data);

    switch (message.type) {
      case "initialise":
        setActivity(message.state.activity);
        setStats(message.state.stats);
        document.getElementById("stats").style.opacity = 1;
        loop();
        break;
      case "activity":
        setActivity(message.activity);
        break;
      case "status":
        setStats(message.status);
        break;
      case "hello":
        sayHello(message.username);
        break;
      case "ban":
        sayBan(message.username);
        break;
    }
  });
  ws.addEventListener("close", () => {
    setTimeout(() => connect(token), 1000);
    ws = undefined;
  });
}
twitch.onAuthorized((auth) => {
  connect(auth.token);
});
