import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Home from './components/Home'
import Login from './components/Login'
import Tracker from './components/Tracker'
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
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}