import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import GenerationChart from './components/GenerationChart';
import GenerationSelector from './components/GenerationSelector';
import Header from './components/Header';


const App = () => {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/onboarding" element={<GenerationSelector />} />
          <Route path="/charts/:generation" element={<GenerationChart />} />
        </Routes>
      </Router>
    </>
  )
}


export default App