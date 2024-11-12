"use client"

import React, { useState, useEffect } from 'react'
import { Book, CheckCircle, Award, BarChart, DollarSign, PieChart, TrendingUp, Briefcase, Lightbulb, ArrowRight, Lock, Clock, Shield, Home } from 'lucide-react'
import '../styles/FinancialEducation.css'

const topics = [
  {
    id: 1,
    title: "Budgeting Basics",
    icon: PieChart,
    description: "Learn how to create and stick to a budget",
    content: {
      sections: [
        {
          title: "Understanding Income & Expenses",
          points: [
            "Track your monthly income sources (salary, investments, side gigs)",
            "Categorize your essential expenses (housing, utilities, food)",
            "Identify discretionary spending (entertainment, shopping)",
            "Calculate your net income after taxes and deductions"
          ]
        },
        {
          title: "50/30/20 Rule",
          points: [
            "50% for needs (housing, food, utilities, insurance)",
            "30% for wants (entertainment, shopping, dining out)",
            "20% for savings and debt repayment (emergency fund, investments)",
            "Adjust percentages based on your financial situation"
          ]
        },
        {
          title: "Creating Your Budget",
          points: [
            "Use budgeting apps or spreadsheets to track expenses",
            "Set realistic spending limits for each category",
            "Review and adjust your budget monthly",
            "Plan for irregular expenses and annual costs"
          ]
        }
      ],
      estimatedTime: "15 mins",
      exercises: [
        "Track all expenses for one week",
        "Categorize your last month's spending",
        "Create a basic monthly budget plan"
      ]
    }
  },
  {
    id: 2,
    title: "Understanding Credit Scores",
    icon: BarChart,
    description: "Discover what impacts your credit score and how to improve it",
    content: {
      sections: [
        {
          title: "Credit Score Factors",
          points: [
            "Payment history (35%) - Most important factor",
            "Credit utilization (30%) - Amount of credit used",
            "Length of credit history (15%) - Account age matters",
            "Credit mix (10%) - Different types of credit",
            "New credit (10%) - Recent applications"
          ]
        },
        {
          title: "Improvement Strategies",
          points: [
            "Pay bills on time, every time",
            "Keep credit utilization below 30%",
            "Maintain older credit accounts",
            "Limit new credit applications",
            "Monitor your credit report regularly"
          ]
        },
        {
          title: "Common Credit Myths",
          points: [
            "Checking your score doesn't hurt it",
            "You don't need to carry a balance",
            "Closing old accounts can hurt your score",
            "Co-signing makes you equally responsible"
          ]
        }
      ],
      estimatedTime: "20 mins",
      exercises: [
        "Check your credit score",
        "Review your credit report",
        "Calculate your credit utilization"
      ]
    }
  },
  {
    id: 3,
    title: "Introduction to Investing",
    icon: TrendingUp,
    description: "Get started with investing fundamentals",
    content: {
      sections: [
        {
          title: "Investment Basics",
          points: [
            "Understanding different investment types (stocks, bonds, ETFs)",
            "Risk vs. return relationship",
            "Power of compound interest",
            "Dollar-cost averaging strategy"
          ]
        },
        {
          title: "Building a Portfolio",
          points: [
            "Asset allocation basics",
            "Diversification principles",
            "Risk tolerance assessment",
            "Long-term vs. short-term investing"
          ]
        },
        {
          title: "Getting Started",
          points: [
            "Choose a brokerage account",
            "Research investment options",
            "Start with index funds",
            "Monitor and rebalance periodically"
          ]
        }
      ],
      estimatedTime: "25 mins",
      exercises: [
        "Calculate compound interest scenarios",
        "Create a sample portfolio allocation",
        "Compare different index funds"
      ]
    }
  },
  {
    id: 4,
    title: "Retirement Planning 101",
    icon: Briefcase,
    description: "Plan for a secure financial future",
    content: {
      sections: [
        {
          title: "Retirement Accounts",
          points: [
            "Traditional IRA vs. Roth IRA",
            "401(k) and employer matching",
            "Contribution limits and deadlines",
            "Tax advantages and implications"
          ]
        },
        {
          title: "Calculating Needs",
          points: [
            "Estimate retirement expenses",
            "Consider inflation impact",
            "Account for healthcare costs",
            "Social Security benefits overview"
          ]
        },
        {
          title: "Investment Strategy",
          points: [
            "Age-based asset allocation",
            "Target date funds explained",
            "Risk adjustment over time",
            "Required minimum distributions"
          ]
        }
      ],
      estimatedTime: "30 mins",
      exercises: [
        "Calculate retirement savings need",
        "Review current retirement accounts",
        "Create retirement timeline"
      ]
    }
  },
  {
    id: 5,
    title: "Tax Essentials",
    icon: Book,
    description: "Understand the basics of taxes and deductions",
    content: {
      sections: [
        {
          title: "Tax Basics",
          points: [
            "Understanding tax brackets and marginal rates",
            "Different types of taxable income",
            "Standard vs. itemized deductions",
            "Filing status options and implications"
          ]
        },
        {
          title: "Common Deductions",
          points: [
            "Mortgage interest and property taxes",
            "Charitable contributions",
            "Business expenses and home office",
            "Education-related deductions"
          ]
        },
        {
          title: "Tax Planning",
          points: [
            "Tax-advantaged accounts (401k, IRA, HSA)",
            "Tax loss harvesting strategies",
            "Quarterly estimated payments",
            "Record keeping best practices"
          ]
        }
      ],
      estimatedTime: "25 mins",
      exercises: [
        "Review last year's tax return",
        "Identify potential deductions",
        "Create tax document organization system"
      ]
    }
  },
  {
    id: 6,
    title: "Emergency Fund Strategies",
    icon: DollarSign,
    description: "Build and maintain your financial safety net",
    content: {
      sections: [
        {
          title: "Fund Basics",
          points: [
            "Why you need 3-6 months of expenses saved",
            "Where to keep emergency funds (high-yield savings)",
            "What constitutes a true emergency",
            "How to determine your target amount"
          ]
        },
        {
          title: "Building Your Fund",
          points: [
            "Start small with achievable goals",
            "Automate regular contributions",
            "Find extra money in your budget",
            "Use windfalls wisely (tax returns, bonuses)"
          ]
        },
        {
          title: "Managing Your Fund",
          points: [
            "When to use emergency funds",
            "How to replenish after using",
            "Regular review and adjustment",
            "Avoiding common pitfalls"
          ]
        }
      ],
      estimatedTime: "20 mins",
      exercises: [
        "Calculate your target emergency fund amount",
        "Set up automatic savings transfers",
        "Create emergency fund usage guidelines"
      ]
    }
  },
  {
    id: 7,
    title: "Debt Management",
    icon: Award,
    description: "Strategies for managing and reducing debt",
    content: {
      sections: [
        {
          title: "Understanding Debt",
          points: [
            "Good debt vs. bad debt",
            "Interest rates and compound interest",
            "Credit utilization impact",
            "Debt-to-income ratio importance"
          ]
        },
        {
          title: "Repayment Strategies",
          points: [
            "Avalanche method (highest interest first)",
            "Snowball method (smallest balance first)",
            "Debt consolidation options",
            "Balance transfer considerations"
          ]
        },
        {
          title: "Avoiding Future Debt",
          points: [
            "Creating a debt prevention plan",
            "Emergency fund importance",
            "Lifestyle inflation awareness",
            "Using credit responsibly"
          ]
        }
      ],
      estimatedTime: "30 mins",
      exercises: [
        "List all debts with interest rates",
        "Create a debt payoff timeline",
        "Calculate potential interest savings"
      ]
    }
  },
  {
    id: 8,
    title: "Insurance Planning",
    icon: Shield,
    description: "Protect yourself and your assets",
    content: {
      sections: [
        {
          title: "Types of Insurance",
          points: [
            "Health insurance essentials",
            "Life insurance options",
            "Property and casualty coverage",
            "Disability insurance importance"
          ]
        },
        {
          title: "Coverage Assessment",
          points: [
            "Evaluating insurance needs",
            "Understanding policy terms",
            "Deductibles and premiums",
            "Gap coverage considerations"
          ]
        },
        {
          title: "Cost Management",
          points: [
            "Shopping for better rates",
            "Bundling policies",
            "Maintaining good records",
            "Regular policy reviews"
          ]
        }
      ],
      estimatedTime: "25 mins",
      exercises: [
        "Review current insurance policies",
        "Identify coverage gaps",
        "Compare insurance quotes"
      ]
    }
  },
  {
    id: 9,
    title: "Real Estate Basics",
    icon: Home,
    description: "Understanding property investment and ownership",
    content: {
      sections: [
        {
          title: "Home Buying Process",
          points: [
            "Mortgage types and requirements",
            "Down payment considerations",
            "Property assessment factors",
            "Closing costs and processes"
          ]
        },
        {
          title: "Property Investment",
          points: [
            "Rental property economics",
            "REITs and real estate funds",
            "Property appreciation factors",
            "Tax implications and benefits"
          ]
        },
        {
          title: "Property Management",
          points: [
            "Maintenance and repairs",
            "Insurance requirements",
            "Tenant relationships",
            "Property tax considerations"
          ]
        }
      ],
      estimatedTime: "35 mins",
      exercises: [
        "Calculate home affordability",
        "Compare rent vs. buy scenarios",
        "Research local property markets"
      ]
    }
  },
  {
    id: 10,
    title: "Personal Finance Security",
    icon: Lock,
    description: "Protect your financial information and identity",
    content: {
      sections: [
        {
          title: "Digital Security",
          points: [
            "Strong password practices",
            "Two-factor authentication",
            "Secure online banking",
            "Safe shopping habits"
          ]
        },
        {
          title: "Identity Protection",
          points: [
            "Credit monitoring services",
            "Fraud alerts and freezes",
            "Document security",
            "Privacy best practices"
          ]
        },
        {
          title: "Scam Prevention",
          points: [
            "Common financial scams",
            "Red flags to watch for",
            "Reporting suspicious activity",
            "Recovery steps if compromised"
          ]
        }
      ],
      estimatedTime: "20 mins",
      exercises: [
        "Security audit of financial accounts",
        "Set up credit monitoring",
        "Create secure password system"
      ]
    }
  }
];

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
  const [selectedTopic, setSelectedTopic] = useState(null)

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

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
  };

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
                onClick={() => handleTopicClick(topic)}
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
      {selectedTopic && (
        <div className="modal-overlay" onClick={() => setSelectedTopic(null)}>
          <div className="topic-modal" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedTopic(null)}>×</button>
            <div className="modal-header">
              <selectedTopic.icon className="modal-icon" />
              <h2>{selectedTopic.title}</h2>
            </div>
            <p className="modal-description">{selectedTopic.description}</p>
            
            {selectedTopic.content && (
              <div className="modal-content">
                <div className="time-indicator">
                  <Clock size={16} />
                  <span>{selectedTopic.content.estimatedTime}</span>
                </div>
                
                <div className="content-sections">
                  {selectedTopic.content.sections?.map((section, idx) => (
                    <div key={idx} className="content-section">
                      <h3>{section.title}</h3>
                      <ul>
                        {section.points.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="modal-footer">
              {!completedTopics.includes(selectedTopic.id) && (
                <button 
                  className="btn primary-btn"
                  onClick={() => {
                    markTopicComplete(selectedTopic.id);
                    setSelectedTopic(null);
                  }}
                >
                  Mark as Complete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}