"use client"

import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts'
import { motion } from 'framer-motion'
import { TrendingUp, DollarSign, Calendar, ArrowUpCircle, ArrowDownCircle, TrendingDown, Target, ChevronDown, ChevronUp } from 'lucide-react'
import axios from 'axios'
import { format } from 'date-fns'
import '../styles/Reports.css'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658']

// LoadingChart Component
const LoadingChart = () => (
  <motion.div 
    className="loading-chart"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="loading-chart-content" />
  </motion.div>
);

export default function Reports() {
  const [timeRange, setTimeRange] = useState('month')
  const [categoryData, setCategoryData] = useState([])
  const [timeSeriesData, setTimeSeriesData] = useState([])
  const [savingsRate, setSavingsRate] = useState(0)
  const [topExpenseCategories, setTopExpenseCategories] = useState([])
  const [netWorthData, setNetWorthData] = useState([])
  const [cashFlowData, setCashFlowData] = useState([])
  const [debtToIncomeRatio, setDebtToIncomeRatio] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isBudgetSummaryOpen, setIsBudgetSummaryOpen] = useState(false)
  const [isChartReady, setIsChartReady] = useState(false);

  useEffect(() => {
    const fetchData = async (range) => {
      setIsLoading(true)
      setError(null)
      
      try {
        const token = localStorage.getItem('authToken')
        const dateRange = getDateRange(range)
        
        const response = await axios.get(
          `http://localhost:5000/api/reports`, {
            params: {
              timeRange: range,
              startDate: dateRange.startDate,
              endDate: dateRange.endDate
            },
            headers: { Authorization: `Bearer ${token}` }
          }
        )

        const data = response.data
        setCategoryData(formatCategoryData(data.categoryData))
        setTimeSeriesData(formatTimeSeriesData(data.timeSeriesData))
        setSavingsRate(data.savingsRate)
        setTopExpenseCategories(data.topExpenseCategories)
        setNetWorthData(data.netWorthData)
        setCashFlowData(data.cashFlowData)
        setDebtToIncomeRatio(data.debtToIncomeRatio)
        
      } catch (error) {
        setError(error.message || 'Failed to fetch report data')
        console.error('Error fetching report data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData(timeRange)
  }, [timeRange])

  useEffect(() => {
    // Add artificial delay for smooth transition
    const timer = setTimeout(() => {
      setIsChartReady(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const getDateRange = (range) => {
    const now = new Date()
    const start = new Date()
    
    switch(range) {
      case 'month':
        start.setMonth(now.getMonth() - 1)
        break
      case 'quarter':
        start.setMonth(now.getMonth() - 3)
        break
      case 'year':
        start.setFullYear(now.getFullYear() - 1)
        break
      default:
        start.setMonth(now.getMonth() - 1)
    }
    
    return {
      startDate: format(start, 'yyyy-MM-dd'),
      endDate: format(now, 'yyyy-MM-dd')
    }
  }

  const formatCategoryData = (data) => {
    return data.map(item => ({
      ...item,
      value: Number(item.value.toFixed(2))
    }))
  }

  const formatTimeSeriesData = (data) => {
    return data.map(item => ({
      ...item,
      income: Number(item.income.toFixed(2)),
      expenses: Number(item.expenses.toFixed(2))
    }))
  }

  const getBudgetComparison = () => {
    // Preset monthly budget targets
    const monthlyBudgets = {
      'Housing': 1500,
      'Transportation': 500,
      'Food': 600,
      'Utilities': 300,
      'Entertainment': 200,
      'Healthcare': 400,
      'Shopping': 300,
      'Other': 200
    };

    // Calculate actual spending by category
    const actualSpending = categoryData.reduce((acc, item) => {
      acc[item.name] = item.value;
      return acc;
    }, {});

    // Combine budget and actual data
    return Object.entries(monthlyBudgets).map(([category, budget]) => ({
      category,
      budget,
      actual: actualSpending[category] || 0
    }));
  };

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
          <div className="select-wrapper">
            <Calendar className="select-icon" />
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="time-range-select"
              disabled={isLoading}
            >
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 3 Months</option>
              <option value="year">Last 12 Months</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="loading-spinner">Loading reports...</div>
        ) : (
          <div className="reports-grid">
            <div className="report-card">
              <h2 className="card-title">Spending by Category</h2>
              <p className="card-description">Breakdown of your expenses</p>
              <div className="chart-container">
                {!isChartReady ? (
                  <LoadingChart />
                ) : (
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
                        label={({ name, percent }) => 
                          `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="report-card">
              <h2 className="card-title">Income vs Expenses</h2>
              <p className="card-description">Comparison over time</p>
              <div className="chart-container">
                {!isChartReady ? (
                  <LoadingChart />
                ) : (
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
                )}
              </div>
            </div>

            <div className="report-card">
              <h2 className="card-title">Savings Rate</h2>
              <p className="card-description">Percentage of income saved</p>
              <div className="savings-rate">
                <DollarSign size={48} />
                <span className="savings-percentage">{savingsRate.toFixed(2)}%</span>
              </div>
              <p className="savings-description">
                You're saving {savingsRate.toFixed(2)}% of your income. {savingsRate >= 20 ? "Great job!" : "Aim for 20% or more."}
              </p>
            </div>

            <div className="report-card">
              <h2 className="card-title">Top Expense Categories</h2>
              <p className="card-description">Your biggest spending areas</p>
              <ul className="top-expenses-list">
                {topExpenseCategories.map((category, index) => (
                  <li key={index} className="top-expense-item">
                    <span className="category-name">{category.name}</span>
                    <span className="category-amount">${category.value.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="report-card">
              <h2 className="card-title">Net Worth Trend</h2>
              <p className="card-description">Your financial growth over time</p>
              <div className="chart-container">
                {!isChartReady ? (
                  <LoadingChart />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={netWorthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="netWorth" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="report-card">
              <h2 className="card-title">Budget vs Actual Spending</h2>
              <p className="card-description">Monthly spending against budget targets</p>
              <div className="chart-container">
                {!isChartReady ? (
                  <LoadingChart />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getBudgetComparison()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => `$${value.toFixed(2)}`}
                        labelFormatter={(label) => `Category: ${label}`}
                      />
                      <Legend />
                      <Bar 
                        name="Monthly Budget" 
                        dataKey="budget" 
                        fill="#3498db" 
                      />
                      <Bar 
                        name="Actual Spending" 
                        dataKey="actual" 
                        fill="#e67e22" 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="budget-summary">
                <button 
                  className="budget-summary-toggle"
                  onClick={() => setIsBudgetSummaryOpen(!isBudgetSummaryOpen)}
                >
                  <h3>Budget Summary</h3>
                  {isBudgetSummaryOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                <motion.div 
                  className="budget-metrics"
                  initial={false}
                  animate={{ 
                    height: isBudgetSummaryOpen ? 'auto' : 0,
                    opacity: isBudgetSummaryOpen ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {getBudgetComparison().map((category) => (
                    <div key={category.category} className="budget-metric">
                      <span className="category-name">{category.category}</span>
                      <div className="budget-values">
                        <span className="budget-planned">
                          Budget: ${category.budget.toFixed(2)}
                        </span>
                        <span className={`budget-actual ${
                          category.actual > category.budget ? 'over-budget' : 'under-budget'
                        }`}>
                          Actual: ${category.actual.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </motion.div>
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
                {!isChartReady ? (
                  <LoadingChart />
                ) : (
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
                )}
              </div>
            </div>

            <div className="report-card">
              <h2 className="card-title">Debt-to-Income Ratio</h2>
              <p className="card-description">Your debt payments relative to your income</p>
              <div className="debt-to-income">
                <div className="ratio-circle">
                  <span className="ratio">{debtToIncomeRatio.toFixed(2)}</span>
                </div>
                <p className="ratio-description">
                  Your debt-to-income ratio is {debtToIncomeRatio.toFixed(2)}. 
                  {debtToIncomeRatio <= 0.35 ? 
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
        )}
      </motion.main>
    </div>
  )
}