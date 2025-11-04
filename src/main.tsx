import { createRoot } from "react-dom/client";
import Routers from "./layouts/Routers";
import { BrowserRouter } from "react-router-dom";
import "./styles/index.css";
import { StrictMode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Routers />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>
);
