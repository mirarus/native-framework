import { createRoot } from "react-dom/client";
import { AppRoot } from "./app/app-root";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Mobile root elementi bulunamadi.");
}

createRoot(rootElement).render(<AppRoot />);
