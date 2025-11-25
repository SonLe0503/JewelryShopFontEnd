import { createRoot } from "react-dom/client";
import Routers from "./layouts/Routers";
import { BrowserRouter } from "react-router-dom";
import "./styles/index.css";
import { StrictMode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <GoogleOAuthProvider clientId="931277272079-dm1kkmctv56ortffd4bi2m331vmj7m3u.apps.googleusercontent.com">
            <Routers />
          </GoogleOAuthProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>
);
