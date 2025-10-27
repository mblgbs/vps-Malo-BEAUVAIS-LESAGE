import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClickerGame } from "./screens/ClickerGame";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <ClickerGame />
  </StrictMode>,
);
