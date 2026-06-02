import { createGreeting, createStorage, fetchHealth, listCapabilities } from "@uniframe/core";

const storage = createStorage("vanilla");
const greeting = createGreeting("Vanilla Web");
const title = select("#title");
const message = select("#message");
const counter = select("#counter");
const status = select("#status");
const capabilities = select("#capabilities");

let count = storage.get("count", 0);

title.textContent = greeting.title;
message.textContent = greeting.message;

function renderCounter() {
  counter.textContent = `Sayac ${count}`;
}

counter.addEventListener("click", () => {
  count = storage.set("count", count + 1);
  renderCounter();
});

capabilities.innerHTML = listCapabilities()
  .map(
    (item) => `
      <article>
        <span></span>
        <h2>${item}</h2>
        <p>Bu yetenek ayni shared contract uzerinden gelir.</p>
      </article>
    `
  )
  .join("");

fetchHealth().then((health) => {
  if (health.ok) {
    status.textContent = "API bagli";
    status.classList.add("good");
  }
});

renderCounter();

function select(selector: string): HTMLElement {
  const element = document.querySelector(selector);

  if (!(element instanceof HTMLElement)) {
    throw new Error(`Beklenen DOM elemani bulunamadi: ${selector}`);
  }

  return element;
}
