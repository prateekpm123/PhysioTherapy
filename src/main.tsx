import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Theme } from "@radix-ui/themes";
import { Provider } from "react-redux";
import userSessionStore from "./stores/userSessionStore.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Theme
      accentColor="blue"
      appearance="dark"
      radius="medium"
      panelBackground="translucent"
      grayColor="gray"
    >
      <Provider store={userSessionStore}>
        <App />
      </Provider>
    </Theme>
  </StrictMode>
);
