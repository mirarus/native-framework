import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { createGreeting, listCapabilities } from "../../../shared/contracts.js";
import { createStorage, fetchHealth } from "../../../shared/platform.js";
import "./style.css";

const storage = createStorage("react");

function App() {
  const [health, setHealth] = useState({ ok: false, service: "api" });
  const [count, setCount] = useState(() => storage.get("count", 0));
  const greeting = createGreeting("React Web");

  useEffect(() => {
    fetchHealth().then(setHealth);
  }, []);

  function increment() {
    setCount((current) => storage.set("count", current + 1));
  }

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">React hedefi</p>
        <h1>{greeting.title}</h1>
        <p>{greeting.message}</p>
        <div className="actions">
          <button onClick={increment}>Sayaç {count}</button>
          <span className={health.ok ? "status good" : "status"}>
            {health.ok ? "API bagli" : "API bekleniyor"}
          </span>
        </div>
      </section>

      <section className="grid">
        {listCapabilities().map((item) => (
          <article key={item}>
            <span />
            <h2>{item}</h2>
            <p>Bu yetenek ortak proje modelinin bir parcasi olarak calisir.</p>
          </article>
        ))}
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
