"use client"

import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts'
import { motion } from 'framer-motion'
import { TrendingUp, DollarSign, PieChart as PieChartIcon, BarChart as BarChartIcon, Calendar, ArrowUpCircle, ArrowDownCircle, TrendingDown, Target } from 'lucide-react'
import '../styles/Reports.css'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658']

export default function Reports() {
  const [timeRange, setTimeRange] = useState('month')
  const [categoryData, setCategoryData] = useState([])
  const [timeSeriesData, setTimeSeriesData] = useState([])
  const [savingsRate, setSavingsRate] = useState(0)
  const [topExpenseCategories, setTopExpenseCategories] = useState([])
  const [netWorthData, setNetWorthData] = useState([])
  const [budgetPerformance, setBudgetPerformance] = useState([])
  const [cashFlowData, setCashFlowData] = useState([])
  const [debtToIncomeRatio, setDebtToIncomeRatio] = useState(0)

  useEffect(() => {
    fetchData(timeRange)
  }, [timeRange])

  const fetchData = (range) => {
    const data = generateMockData(range)
    setCategoryData(data.categoryData)
    setTimeSeriesData(data.timeSeriesData)
    setSavingsRate(data.savingsRate)
    setTopExpenseCategories(data.topExpenseCategories)
    setNetWorthData(data.netWorthData)
    setBudgetPerformance(data.budgetPerformance)
    setCashFlowData(data.cashFlowData)
    setDebtToIncomeRatio(data.debtToIncomeRatio)
  }

  const generateMockData = (range) => {
    const categories = ['Housing', 'Food', 'Transportation', 'Utilities', 'Entertainment', 'Healthcare', 'Savings']
    let timeLabels = []
    let dataPoints = 0

    if (range === 'year') {
      timeLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      dataPoints = 12
    } else if (range === 'quarter') {
      timeLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10', 'Week 11', 'Week 12']
      dataPoints = 12
    } else {
      timeLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4']
      dataPoints = 4
    }

    const categoryData = categories.map(category => ({
      name: category,
      value: Math.floor(Math.random() * 1000) + 500
    }))

    const timeSeriesData = timeLabels.map(label => ({
      name: label,
      income: Math.floor(Math.random() * 5000) + 3000,
      expenses: Math.floor(Math.random() * 3000) + 1000
    }))

    const savingsRate = Math.floor(Math.random() * 30) + 10

    const topExpenseCategories = categories
      .map(category => ({ name: category, amount: Math.floor(Math.random() * 500) + 100 }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)

    const netWorthData = timeLabels.map((label, index) => ({
      name: label,
      netWorth: 50000 + Math.floor(Math.random() * 10000) * (index + 1)
    }))

    const budgetPerformance = categories.map(category => ({
      name: category,
      budget: Math.floor(Math.random() * 1000) + 500,
      actual: Math.floor(Math.random() * 1000) + 500
    }))

    const cashFlowData = timeLabels.map(label => ({
      name: label,
      cashFlow: Math.floor(Math.random() * 2000) - 1000
    }))

    const debtToIncomeRatio = (Math.random() * 0.5 + 0.1).toFixed(2)

    return { categoryData, timeSeriesData, savingsRate, topExpenseCategories, netWorthData, budgetPerformance, cashFlowData, debtToIncomeRatio }
  }

  return (
    <div className="reports-container">
      <motion.main 
        className="reports-main"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="reports-title">Financial Reports</h1>
        
        <div className="time-range-selector">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-range-select"
          >
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>

        <div className="reports-grid">
          <div className="report-card">
            <h2 className="card-title">Spending by Category</h2>
            <p className="card-description">Breakdown of your expenses</p>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="report-card">
            <h2 className="card-title">Income vs Expenses</h2>
            <p className="card-description">Comparison over time</p>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" fill="#27ae60" />
                  <Bar dataKey="expenses" fill="#e74c3c" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="report-card">
            <h2 className="card-title">Savings Rate</h2>
            <p className="card-description">Percentage of income saved</p>
            <div className="savings-rate">
              <DollarSign size={48} />
              <span className="savings-percentage">{savingsRate}%</span>
            </div>
            <p className="savings-description">
              You're saving {savingsRate}% of your income. {savingsRate >= 20 ? "Great job!" : "Aim for 20% or more."}
            </p>
          </div>

          <div className="report-card">
            <h2 className="card-title">Top Expense Categories</h2>
            <p className="card-description">Your biggest spending areas</p>
            <ul className="top-expenses-list">
              {topExpenseCategories.map((category, index) => (
                <li key={index} className="top-expense-item">
                  <span className="category-name">{category.name}</span>
                  <span className="category-amount">${category.amount}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="report-card">
            <h2 className="card-title">Net Worth Trend</h2>
            <p className="card-description">Your financial growth over time</p>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={netWorthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="netWorth" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="report-card">
            <h2 className="card-title">Budget vs Actual Spending</h2>
            <p className="card-description">How well you're sticking to your budget</p>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={budgetPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="budget" fill="#3498db" />
                  <Bar dataKey="actual" fill="#e67e22" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="report-card">
            <h2 className="card-title">Financial Health Score</h2>
            <p className="card-description">Overall assessment of your finances</p>
            <div className="financial-health-score">
              <div className="score-circle">
                <span className="score">78</span>
              </div>
              <p className="score-description">Your financial health is good. Keep up the good work!</p>
            </div>
            <ul className="financial-health-tips">
              <li><ArrowUpCircle size={16} /> Increase your emergency fund</li>
              <li><ArrowDownCircle size={16} /> Reduce high-interest debt</li>
              <li><ArrowUpCircle size={16} /> Boost your retirement savings</li>
            </ul>
          </div>

          <div className="report-card">
            <h2 className="card-title">Cash Flow Analysis</h2>
            <p className="card-description">Your cash inflows and outflows over time</p>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="cashFlow" stroke="#2ecc71" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="report-card">
            <h2 className="card-title">Debt-to-Income Ratio</h2>
            <p className="card-description">Your debt payments relative to your income</p>
            <div className="debt-to-income">
              <div className="ratio-circle">
                <span className="ratio">{debtToIncomeRatio}</span>
              </div>
              <p className="ratio-description">
                Your debt-to-income ratio is {debtToIncomeRatio}. 
                {parseFloat(debtToIncomeRatio) <= 0.35 ? 
                  "This is considered good. Keep it up!" : 
                  "This is higher than recommended. Try to reduce your debt or increase your income."}
              </p>
            </div>
            <div className="debt-to-income-tips">
              <h3>Tips to Improve:</h3>
              <ul>
                <li><Target size={16} /> Aim for a ratio of 0.35 or lower</li>
                <li><TrendingDown size={16} /> Pay down high-interest debt first</li>
                <li><TrendingUp size={16} /> Look for ways to increase your income</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.main>
    </div>
  )
}