
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from "./pages/Login"
import Register from './pages/Register'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/Landing'

function Logout() {
  localStorage.clear()
  return <Navigate to= "login" />
}


function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/landing' element={<LandingPage/>}/>
        <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/register' element={<RegisterAndLogout />}/>
        <Route path='*' element={<NotFound />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
