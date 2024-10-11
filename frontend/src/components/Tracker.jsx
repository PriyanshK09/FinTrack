import React, { useState } from 'react'
import { PieChart, TrendingUp, Plus, Trash2, Calendar, Tag, Target, AlertCircle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts'
import '../styles/Tracker.css'

const mockData = [
  { name: 'Jan', income: 4000, expenses: 2400 },
  { name: 'Feb', income: 3000, expenses: 1398 },
  { name: 'Mar', income: 2000, expenses: 9800 },
  { name: 'Apr', income: 2780, expenses: 3908 },
  { name: 'May', income: 1890, expenses: 4800 },
  { name: 'Jun', income: 2390, expenses: 3800 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function Tracker() {
  const [transactions, setTransactions] = useState([
    { id: 1, description: 'Salary', amount: 5000, type: 'income', date: '2023-10-01', category: 'Work' },
    { id: 2, description: 'Rent', amount: 1200, type: 'expense', date: '2023-10-05', category: 'Housing' },
    { id: 3, description: 'Groceries', amount: 300, type: 'expense', date: '2023-10-10', category: 'Food' },
  ])

  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    type: 'expense',
    date: '',
    category: '',
  })

  const [goals, setGoals] = useState([
    { id: 1, description: 'Emergency Fund', target: 10000, current: 5000 },
    { id: 2, description: 'Vacation Savings', target: 5000, current: 2000 },
  ])

  const [newGoal, setNewGoal] = useState({
    description: '',
    target: '',
    current: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewTransaction(prev => ({ ...prev, [name]: value }))
  }

  const handleGoalInputChange = (e) => {
    const { name, value } = e.target
    setNewGoal(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newTransaction.description && newTransaction.amount && newTransaction.date && newTransaction.category) {
      setTransactions(prev => [
        ...prev,
        {
          id: Date.now(),
          description: newTransaction.description,
          amount: parseFloat(newTransaction.amount),
          type: newTransaction.type,
          date: newTransaction.date,
          category: newTransaction.category,
        },
      ])
      setNewTransaction({ description: '', amount: '', type: 'expense', date: '', category: '' })
    }
  }

  const handleGoalSubmit = (e) => {
    e.preventDefault()
    if (newGoal.description && newGoal.target && newGoal.current) {
      setGoals(prev => [
        ...prev,
        {
          id: Date.now(),
          description: newGoal.description,
          target: parseFloat(newGoal.target),
          current: parseFloat(newGoal.current),
        },
      ])
      setNewGoal({ description: '', target: '', current: '' })
    }
  }

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id))
  }

  const deleteGoal = (id) => {
    setGoals(prev => prev.filter(goal => goal.id !== id))
  }

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpenses

  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {})

  const pieChartData = Object.entries(categoryData).map(([name, value]) => ({ name, value }))

  return (
    <div className="tracker-container">
      <main className="tracker-main">
        <section className="summary-section">
          <div className="summary-card">
            <h2>Balance</h2>
            <p className={`balance ${balance >= 0 ? 'positive' : 'negative'}`}>
              ${balance.toFixed(2)}
            </p>
          </div>
          <div className="summary-card">
            <h2>Income</h2>
            <p className="income">${totalIncome.toFixed(2)}</p>
          </div>
          <div className="summary-card">
            <h2>Expenses</h2>
            <p className="expenses">${totalExpenses.toFixed(2)}</p>
          </div>
        </section>
        <section className="chart-section">
          <h2><TrendingUp size={20} /> Income vs Expenses</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#27ae60" strokeWidth={2} />
              <Line type="monotone" dataKey="expenses" stroke="#e74c3c" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </section>
        <div className="bottom-sections">
          <section className="transactions-section">
            <h2><PieChart size={20} /> Recent Transactions</h2>
            <ul className="transaction-list">
              {transactions.map(transaction => (
                <li key={transaction.id} className={`transaction-item ${transaction.type}`}>
                  <div className="transaction-info">
                    <span className="transaction-description">{transaction.description}</span>
                    <span className="transaction-category"><Tag size={14} /> {transaction.category}</span>
                    <span className="transaction-date"><Calendar size={14} /> {transaction.date}</span>
                  </div>
                  <span className="transaction-amount">${transaction.amount.toFixed(2)}</span>
                  <button onClick={() => deleteTransaction(transaction.id)} className="delete-btn">
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </section>
          <section className="add-transaction-section">
            <h2><Plus size={20} /> Add New Transaction</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={newTransaction.description}
                onChange={handleInputChange}
                required
              />
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={newTransaction.amount}
                onChange={handleInputChange}
                required
              />
              <select
                name="type"
                value={newTransaction.type}
                onChange={handleInputChange}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              <input
                type="date"
                name="date"
                value={newTransaction.date}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={newTransaction.category}
                onChange={handleInputChange}
                required
              />
              <button type="submit">Add Transaction</button>
            </form>
          </section>
        </div>
        <section className="goals-section">
          <h2><Target size={20} /> Financial Goals</h2>
          <ul className="goals-list">
            {goals.map(goal => (
              <li key={goal.id} className="goal-item">
                <div className="goal-info">
                  <span className="goal-description">{goal.description}</span>
                  <progress value={goal.current} max={goal.target}></progress>
                  <span className="goal-progress">${goal.current} / ${goal.target}</span>
                </div>
                <button onClick={() => deleteGoal(goal.id)} className="delete-btn">
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
          <form onSubmit={handleGoalSubmit} className="add-goal-form">
            <input
              type="text"
              name="description"
              placeholder="Goal Description"
              value={newGoal.description}
              onChange={handleGoalInputChange}
              required
            />
            <input
              type="number"
              name="target"
              placeholder="Target Amount"
              value={newGoal.target}
              onChange={handleGoalInputChange}
              required
            />
            <input
              type="number"
              name="current"
              placeholder="Current Amount"
              value={newGoal.current}
              onChange={handleGoalInputChange}
              required
            />
            <button type="submit">Add Goal</button>
          </form>
        </section>
        <section className="insights-section">
          <h2><AlertCircle size={20} /> Financial Insights</h2>
          <div className="insights-content">
            <div className="insight-card">
              <h3>Spending by Category</h3>
              <ResponsiveContainer width="100%" height={200}>
                <RePieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="insight-card">
              <h3>Quick Tips</h3>
              <ul className="tips-list">
                <li>Try to save at least 20% of your income</li>
                <li>Review your subscriptions and cancel unused ones</li>
                <li>Set up automatic transfers to your savings account</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}