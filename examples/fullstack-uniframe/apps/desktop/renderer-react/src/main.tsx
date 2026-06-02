import { createRoot } from "react-dom/client";
import { AppRoot } from "./app/app-root";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Fullstack desktop React root elementi bulunamadi.");
}

createRoot(rootElement).render(<AppRoot />);
