import * as ReactDom from "react-dom/client";
import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
  useRoutes,
} from "react-router-dom";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import AuthDetails from "./components/AuthDetails";
import Error from "./pages/Error";
import Header from "./components/Header";
import Options from "./pages/Options";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<Home />} />
          <Route path="opcoes" element={<Options />}>
            <Route index element={<AuthDetails />} />
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
