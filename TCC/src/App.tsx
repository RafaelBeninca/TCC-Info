import { BrowserRouter, Route, Routes } from "react-router-dom";

import Header from "./components/Header";
import { FirebaseAuthContextProvider } from "./contexts/AuthenticationProvider/FirebaseAuthContext";
import { TableUserContextProvider } from "./contexts/AuthenticationProvider/TableUserContext";
import Error from "./pages/Error";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Servicos from "./pages/Services";
import Usuario from "./pages/Usuario";

function App() {
  return (
    <BrowserRouter>
      <FirebaseAuthContextProvider>
        <TableUserContextProvider>
          <Routes>
            <Route path="/" element={<Header />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="usuario/:userId" element={<Usuario />} />
              <Route path="servicos" element={<Servicos />} />
            </Route>
            <Route path="*" element={<Error />} />
          </Routes>
        </TableUserContextProvider>
      </FirebaseAuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
