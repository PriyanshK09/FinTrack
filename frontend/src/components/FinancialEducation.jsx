"use client"

import React, { useState, useEffect } from 'react'
import { Book, CheckCircle, Award, BarChart, DollarSign, PieChart, TrendingUp, Briefcase, GraduationCap, Lightbulb, ArrowRight, Lock } from 'lucide-react'
import '../styles/FinancialEducation.css'

const topics = [
  { id: 1, title: "Budgeting Basics", icon: PieChart, description: "Learn how to create and stick to a budget" },
  { id: 2, title: "Understanding Credit Scores", icon: BarChart, description: "Discover what impacts your credit score and how to improve it" },
  { id: 3, title: "Introduction to Investing", icon: TrendingUp, description: "Get started with investing fundamentals" },
  { id: 4, title: "Retirement Planning 101", icon: Briefcase, description: "Plan for a secure financial future" },
  { id: 5, title: "Tax Essentials", icon: Book, description: "Understand the basics of taxes and deductions" },
  { id: 6, title: "Emergency Fund Strategies", icon: DollarSign, description: "Learn how to build and maintain an emergency fund" },
  { id: 7, title: "Debt Management", icon: Award, description: "Strategies for managing and reducing debt" },
  { id: 8, title: "Financial Goal Setting", icon: GraduationCap, description: "Set and achieve your financial goals" },
]

const quizQuestions = [
  {
    question: "What is the 50/30/20 rule in budgeting?",
    options: [
      "50% needs, 30% wants, 20% savings",
      "50% savings, 30% needs, 20% wants",
      "50% wants, 30% savings, 20% needs",
      "50% needs, 30% savings, 20% wants"
    ],
    correctAnswer: 0
  },
  {
    question: "Which factor does NOT affect your credit score?",
    options: [
      "Payment history",
      "Credit utilization",
      "Length of credit history",
      "Your salary"
    ],
    correctAnswer: 3
  },
  {
    question: "What is diversification in investing?",
    options: [
      "Investing all your money in one stock",
      "Spreading investments across various assets",
      "Only investing in bonds",
      "Investing in cryptocurrencies"
    ],
    correctAnswer: 1
  }
]

const getResourcesByScore = (score) => {
  const totalQuestions = quizQuestions.length
  const percentage = (score / totalQuestions) * 100

  if (percentage >= 80) {
    return [
      { title: "Advanced Personal Finance", link: "#", icon: Book, description: "Deep dive into complex financial concepts" },
      { title: "Investment Strategies Masterclass", link: "#", icon: BarChart, description: "Learn advanced investment techniques" },
      { title: "Tax Optimization Techniques", link: "#", icon: DollarSign, description: "Maximize your tax efficiency" },
    ]
  } else if (percentage >= 50) {
    return [
      { title: "Intermediate Budgeting Techniques", link: "#", icon: PieChart, description: "Enhance your budgeting skills" },
      { title: "Understanding Market Trends", link: "#", icon: TrendingUp, description: "Analyze and interpret market movements" },
      { title: "Retirement Planning Strategies", link: "#", icon: Briefcase, description: "Optimize your retirement savings" },
    ]
  } else {
    return [
      { title: "Personal Finance for Beginners", link: "#", icon: Book, description: "Start your financial education journey" },
      { title: "Budgeting 101", link: "#", icon: PieChart, description: "Learn the basics of budgeting" },
      { title: "Introduction to Credit Scores", link: "#", icon: BarChart, description: "Understand the importance of credit" },
    ]
  }
}

const financialTips = [
  { tip: "Start an emergency fund with 3-6 months of living expenses", icon: Lightbulb },
  { tip: "Pay yourself first by automating your savings", icon: Lightbulb },
  { tip: "Review your credit report annually for free at AnnualCreditReport.com", icon: Lightbulb },
  { tip: "Invest in low-cost index funds for long-term growth", icon: Lightbulb },
  { tip: "Create a budget and track your expenses regularly", icon: Lightbulb },
  { tip: "Set specific, measurable financial goals", icon: Lightbulb },
]

export default function FinancialEducation() {
  const [completedTopics, setCompletedTopics] = useState([])
  const [currentQuiz, setCurrentQuiz] = useState(0)
  const [quizScore, setQuizScore] = useState(null)
  const [showScore, setShowScore] = useState(false)
  const [resources, setResources] = useState([])
  const [activeTip, setActiveTip] = useState(0)
  const [quizAttempted, setQuizAttempted] = useState(false)

  useEffect(() => {
    const savedProgress = localStorage.getItem('financialEducationProgress')
    if (savedProgress) {
      setCompletedTopics(JSON.parse(savedProgress))
    }
    const savedScore = localStorage.getItem('financialEducationScore')
    if (savedScore) {
      setQuizScore(parseInt(savedScore))
      setShowScore(true)
      setResources(getResourcesByScore(parseInt(savedScore)))
      setQuizAttempted(true)
    }

    const tipInterval = setInterval(() => {
      setActiveTip((prevTip) => (prevTip + 1) % financialTips.length)
    }, 5000)

    return () => clearInterval(tipInterval)
  }, [])

  const markTopicComplete = (topicId) => {
    const updatedTopics = [...completedTopics, topicId]
    setCompletedTopics(updatedTopics)
    localStorage.setItem('financialEducationProgress', JSON.stringify(updatedTopics))
  }

  const startQuiz = () => {
    setCurrentQuiz(0)
    setQuizScore(0)
    setShowScore(false)
    setQuizAttempted(true)
  }

  const handleAnswer = (selectedAnswer) => {
    const newScore = selectedAnswer === quizQuestions[currentQuiz].correctAnswer ? (quizScore || 0) + 1 : (quizScore || 0)

    if (currentQuiz < quizQuestions.length - 1) {
      setCurrentQuiz(currentQuiz + 1)
      setQuizScore(newScore)
    } else {
      setQuizScore(newScore)
      setShowScore(true)
      setResources(getResourcesByScore(newScore))
      localStorage.setItem('financialEducationScore', newScore.toString())
    }
  }

  return (
    <div className="financial-education-container">
      <main className="financial-education-main">
        <h1 className="page-title">Financial Education Center</h1>
        
        <section className="intro-section">
          <h2 className="section-title">Empower Your Financial Future</h2>
          <p>Welcome to your journey towards financial literacy. Explore our curated topics, test your knowledge, and access tailored resources to boost your financial well-being.</p>
          <div className="progress-overview">
            <div className="progress-bar">
              <div className="progress" style={{ width: `${(completedTopics.length / topics.length) * 100}%` }}></div>
            </div>
            <p>{completedTopics.length} of {topics.length} topics completed</p>
          </div>
        </section>

        <section className="topics-section">
          <h2 className="section-title">Learning Topics</h2>
          <div className="topics-grid">
            {topics.map((topic) => (
              <div 
                key={topic.id} 
                className={`topic-card ${completedTopics.includes(topic.id) ? 'completed' : ''}`}
              >
                <topic.icon className="topic-icon" />
                <h3 className="topic-title">{topic.title}</h3>
                <p className="topic-description">{topic.description}</p>
                <div className="topic-card-footer">
                  {completedTopics.includes(topic.id) ? (
                    <div className="completed-badge">
                      <CheckCircle className="completed-icon" />
                      Completed
                    </div>
                  ) : (
                    <button className="btn secondary-btn mark-complete-btn" onClick={() => markTopicComplete(topic.id)}>
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="quiz-section">
          <h2 className="section-title">Test Your Knowledge</h2>
          {!showScore ? (
            <div className="quiz-container">
              <div className="quiz-progress">
                Question {currentQuiz + 1} of {quizQuestions.length}
              </div>
              <div className="quiz-question">
                <h3>{quizQuestions[currentQuiz].question}</h3>
                <ul className="quiz-options">
                  {quizQuestions[currentQuiz].options.map((option, index) => (
                    <li key={index}>
                      <button className="btn quiz-option-btn" onClick={() => handleAnswer(index)}>{option}</button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="quiz-result">
              <h3>Quiz Completed!</h3>
              <p>Your score: {quizScore} out of {quizQuestions.length}</p>
              <div className="score-bar-container">
                <div 
                  className="score-bar" 
                  style={{ width: `${(quizScore / quizQuestions.length) * 100}%` }}
                ></div>
              </div>
              <button className="btn primary-btn" onClick={startQuiz}>Retake Quiz</button>
            </div>
          )}
        </section>

        <section className="resources-section">
          <h2 className="section-title">Recommended Resources</h2>
          {quizAttempted ? (
            <div className="resources-grid">
              {resources.map((resource, index) => (
                <div key={index} className="resource-card">
                  <resource.icon className="resource-icon" />
                  <h3 className="resource-title">{resource.title}</h3>
                  <p className="resource-description">{resource.description}</p>
                  <a href={resource.link} className="resource-link">Learn More <ArrowRight className="arrow-icon" /></a>
                </div>
              ))}
            </div>
          ) : (
            <div className="resources-locked">
              <Lock className="locked-icon" />
              <p>Attempt quiz to unlock this section</p>
              <button className="btn primary-btn" onClick={startQuiz}>Start Quiz</button>
            </div>
          )}
        </section>

        <section className="financial-tips-section">
          <h2 className="section-title">Financial Tip of the Day</h2>
          <div className="tip-carousel">
            {financialTips.map((tip, index) => (
              <div key={index} className={`tip-item ${index === activeTip ? 'active' : ''}`}>
                <tip.icon className="tip-icon" />
                <p className="tip-text">{tip.tip}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Take Control of Your Finances?</h2>
            <p>Join our community of financially savvy individuals and start your journey to financial freedom today!</p>
            <button className="btn primary-btn cta-btn">Get Started Now</button>
          </div>
        </section>
      </main>
    </div>
  )
}