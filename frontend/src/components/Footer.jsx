import React from 'react'
import { Facebook, Twitter, Instagram, Linkedin, DollarSign } from 'lucide-react'
import '../styles/Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section brand">
          <div className="logo">
            <DollarSign size={28} />
            <h3>FinTrack</h3>
          </div>
          <p>Empowering your financial journey</p>
          <div className="social-icons">
            <a href="/" aria-label="Facebook"><Facebook size={20} /></a>
            <a href="/" aria-label="Twitter"><Twitter size={20} /></a>
            <a href="https://www.instagram.com/mrpriyanshuniverse/" aria-label="Instagram"><Instagram size={20} /></a>
            <a href="https://www.linkedin.com/in/priyanshk09/" aria-label="LinkedIn"><Linkedin size={20} /></a>
          </div>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#features">Features</a></li>
            <li><a href="#testimonials">Testimonials</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Legal</h3>
          <ul>
            <li><a href="/">Privacy Policy</a></li>
            <li><a href="/">Terms of Service</a></li>
            <li><a href="/">Cookie Policy</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: support@financetrack.com</p>
          <p>Phone: (555) 123-4567</p>
          <p>Address: 123 Finance St, Money City, FC 12345</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 FinanceTrack. All rights reserved.</p>
      </div>
    </footer>
  )
}