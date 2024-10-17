import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Home from './components/Home'
import Login from './components/Login'
import Tracker from './components/Tracker'
import Reports from './components/Reports'
import Investments from './components/Investments'
import FinancialEducation from './components/FinancialEducation'
import Footer from './components/Footer'
import './styles/App.css'

export default function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/investments" element={<Investments />} />
          <Route path="/financial-education" element={<FinancialEducation />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}