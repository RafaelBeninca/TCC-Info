import * as ReactDom from "react-dom/client"
import Login from './pages/Login'
import Register from './pages/Register'
import AuthDetails from './contexts/authContext/AuthDetails'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

function App() {

  return (
      <div>
        <Register/>
        <AuthDetails/>
      </div>
  )
}

export default App
