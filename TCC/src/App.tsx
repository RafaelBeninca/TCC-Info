import * as ReactDom from "react-dom/client"
import { BrowserRouter, createBrowserRouter, RouterProvider, useRoutes } from 'react-router-dom'
import { Routes, Route } from "react-router-dom"

import Login from './pages/Login'
import Register from './pages/Register'
import Home from "./pages/Home"
import AuthDetails from './components/AuthDetails'
import Error from "./pages/Error"
import Header from "./components/Header"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Header/>}>
          <Route index element={<Home/>}/>
          <Route path="login" element={<Login/>}>
            <Route index element={<AuthDetails/>}/>
          </Route>
          <Route path="register" element={<Register/>}/>
          <Route path="*" element={<Error />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
