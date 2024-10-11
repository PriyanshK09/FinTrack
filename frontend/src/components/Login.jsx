import React, { useState } from 'react'
import { DollarSign, Mail, Lock, User, ArrowRight, Apple, Github } from 'lucide-react'
import '../styles/Login.css'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isLogin) {
      console.log('Logging in...', { email, password })
    } else {
      console.log('Signing up...', { name, email, password, confirmPassword })
    }
  }

  const handleGoogleAuth = () => {
    console.log('Authenticating with Google...')
  }

  const handleAppleAuth = () => {
    console.log('Authenticating with Apple...')
  }

  const handleGithubAuth = () => {
    console.log('Authenticating with GitHub...')
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <DollarSign size={24} />
          <h1>FinanceTrack</h1>
        </div>
        <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <User size={20} />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="input-group">
            <Mail size={20} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <Lock size={20} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {!isLogin && (
            <div className="input-group">
              <Lock size={20} />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}
          <button type="submit" className="submit-btn">
            {isLogin ? 'Login' : 'Sign Up'} <ArrowRight size={20} />
          </button>
        </form>
        <div className="auth-divider">
          <span>Or continue with</span>
        </div>
        <div className="social-auth">
          <button onClick={handleGoogleAuth} className="google-auth">
            <img src="/google-icon.svg" alt="Google" width="20" height="20" />
            Google
          </button>
          <button onClick={handleAppleAuth} className="apple-auth">
            <Apple size={20} />
            Apple
          </button>
          <button onClick={handleGithubAuth} className="github-auth">
            <Github size={20} />
            GitHub
          </button>
        </div>
        <p className="toggle-form">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button type="button" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  )
}