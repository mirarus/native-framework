import { createRoot } from "react-dom/client";
import { App } from "./app/App";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("React root elementi bulunamadi.");
}

createRoot(rootElement).render(<App />);
