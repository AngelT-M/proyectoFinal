import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import { Route, Router, Routes } from 'react-router-dom'
import Sesion from './assets/pages.jsx/Sesion'
import Inicio from './assets/pages.jsx/Inicio'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes >
      <Route path='/sesion' element={<Sesion/>}  ></Route>
      <Route path='/' element={<Inicio/>} ></Route>
    </Routes>
  )
}

export default App
