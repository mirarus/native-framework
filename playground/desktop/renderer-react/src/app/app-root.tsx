import { createGreeting, createStorage, listCapabilities } from "@uniframe/core";
import { useMemo, useState } from "react";
import "../style.css";

const storage = createStorage("desktop-react");

export function AppRoot() {
  const [launchCount, setLaunchCount] = useState(() => storage.get("launchCount", 1));
  const greeting = createGreeting("Desktop React Renderer");
  const capabilities = useMemo(() => listCapabilities().slice(0, 6), []);

  function markLaunch() {
    setLaunchCount((current) => storage.set("launchCount", current + 1));
  }

  return (
    <main className="desktop-shell">
      <section className="workspace">
        <p className="eyebrow">React desktop UI</p>
        <h1>{greeting.title}</h1>
        <p>{greeting.message}</p>
        <div className="toolbar">
          <button onClick={markLaunch}>Oturum {launchCount}</button>
          <span>Electron renderer icinde React + TypeScript calisiyor.</span>
        </div>
      </section>

      <section className="panel-grid">
        {capabilities.map((item) => (
          <article key={item}>
            <strong>{item}</strong>
            <span>Bu yetenek desktop React tarafindan ortak core paketinden okunur.</span>
          </article>
        ))}
      </section>
    </main>
  );
}
