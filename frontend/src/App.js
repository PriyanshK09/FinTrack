import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Home from './components/Home'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Tracker from './components/Tracker'
import Reports from './components/Reports'
import Investments from './components/Investments'
import FinancialEducation from './components/FinancialEducation'
import Premium from './components/Premium'
import PremiumFeatures from './components/PremiumFeatures'
import ContactSales from './components/ContactSales'
import Footer from './components/Footer'
import './styles/App.css'
import { CurrencyProvider } from './context/CurrencyContext';
import { AuthProvider } from './context/AuthContext';
import Checkout from './components/Checkout';
import ComingSoon from './components/ComingSoon';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CurrencyProvider>
          <div className="app">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tracker" element={<Tracker />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/investments" element={<Investments />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/financial-education" element={<FinancialEducation />} />
              <Route path="/premium-features" element={<PremiumFeatures />} />
              <Route path="/contact" element={<ContactSales />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/coming-soon" element={<ComingSoon />} />
            </Routes>
            <Footer />
          </div>
        </CurrencyProvider>
      </AuthProvider>
    </Router>
  )
}