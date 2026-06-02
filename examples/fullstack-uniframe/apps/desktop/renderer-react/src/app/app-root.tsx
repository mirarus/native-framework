import { createGreeting, listCapabilities } from "@uniframe/core";
import { useMemo } from "react";
import "../style.css";

const panels = [
  "Native pencere",
  "React renderer UI",
  "API ile ayni proje",
  "Web hedefinden bagimsiz arayuz"
];

export function AppRoot() {
  const greeting = createGreeting("Desktop React App");
  const capabilities = useMemo(() => listCapabilities().slice(0, 4), []);

  return (
    <main className="desktop-shell">
      <section className="hero">
        <p className="eyebrow">Fullstack desktop React</p>
        <h1>{greeting.title}</h1>
        <p>Bu alan desktop hedefinin React + TypeScript renderer dosyalarini temsil eder.</p>
      </section>

      <section className="grid">
        {panels.map((panel, index) => (
          <article key={panel}>
            <strong>{panel}</strong>
            <span>{capabilities[index] ?? "desktop"} adapter olarak gelistirilebilir.</span>
          </article>
        ))}
      </section>
    </main>
  );
}
