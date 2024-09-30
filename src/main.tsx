import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

const container = document.getElementById("root");
const root = createRoot(container as Element);

root.render(
  <Suspense fallback={<div>loader needed</div>}>
    <App />
  </Suspense>
);
