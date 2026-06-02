import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { createGreeting, listCapabilities } from "../../../shared/contracts.js";
import { fetchHealth } from "../../../shared/platform.js";
import "./style.css";

function App() {
  const [health, setHealth] = useState({ ok: false });
  const greeting = createGreeting("Mobile");

  useEffect(() => {
    fetchHealth().then(setHealth);
  }, []);

  return (
    <main className="phone">
      <header>
        <p>Mobile hedefi</p>
        <h1>{greeting.title}</h1>
      </header>
      <section className="panel">
        <p>{greeting.message}</p>
        <strong>{health.ok ? "API bagli" : "API bekleniyor"}</strong>
      </section>
      <nav>
        {listCapabilities().slice(0, 4).map((item) => (
          <button key={item}>{item}</button>
        ))}
      </nav>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
