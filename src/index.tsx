import ReactDOM from "react-dom/client";
import { Provider } from "react-redux/es/exports";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import "./index.css";
import { initializeTokenSet } from "./slices/user";
import store from "./store";

const container = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(container);

store.dispatch(initializeTokenSet());

root.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
);
