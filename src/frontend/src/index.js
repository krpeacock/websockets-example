const socket = new WebSocket("ws://localhost:3000");

socket.onopen = () => {
  console.log("open");
};

const decoder = new TextDecoder();

let events = [];

socket.addEventListener("message", (msg) => {
  const newEvents = JSON.parse(msg.data);
  if (newEvents.length) {
    events = [...newEvents, ...events];
    render();
  }
});

function render() {
  console.log(events);
  const root = document.getElementById("root");
  root.innerHTML = "";
  events.forEach((event) => {
    const p = document.createElement("p");
    p.innerText = JSON.stringify(event);
    root.appendChild(p);
  });
}
