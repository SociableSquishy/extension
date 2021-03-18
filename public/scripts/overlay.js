const twitch = window.Twitch.ext;

const pet_sprite = document.getElementById("pet-sprite");
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

let direction = "1";
function loop() {
  const delta = activity.speed * direction;
  const position = parseInt(pet_sprite.style.left || "0");
  if (delta + position < 0) direction = 1;
  if (delta + position + pet_sprite.clientWidth >= window.innerWidth)
    direction = -1;
  pet_sprite.style.left = `${position + delta}px`;
  if (delta < 0) {
    pet_sprite.style.transform = `scaleX(-1)`;
  } else {
    pet_sprite.style.transform = `scaleX(1)`;
  }
  requestAnimationFrame(loop);
}

twitch.onAuthorized((auth) => {
  let url = new URL(document.location.href);
  const ws = new WebSocket(
    `${url.protocol.replace("http", "ws")}//${url.hostname}:${url.port}/ws`,
    [auth.token]
  );
  ws.addEventListener("open", console.log("connected"));
  ws.addEventListener("error", console.log);
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
    }
  });
});
