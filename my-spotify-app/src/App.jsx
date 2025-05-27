import React from 'react'
import Home from './components/Home.JSX'
import GenerationSongDisplay from './components/GenerationSongDisplay'
import './components/Login'
import Login from './components/Login'
import Dashboard from './components/Dashboard'

const App = () => {
  return (
    <div>
      <Home />
      <GenerationSongDisplay />
      <Login />
      <Dashboard />
    </div>
  )
}

export default App

