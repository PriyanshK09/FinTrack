"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, RefreshCw, Plus, X, DollarSign, Filter, BarChart } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import '../styles/Investments.css'
import { useCurrency } from '../context/CurrencyContext';
import { formatCurrency } from '../utils/currencyUtils';

const fetchInvestmentData = async () => {
  try {
    const response = await fetch('/api/investments') // API call to fetch investments
    if (!response.ok) {
      throw new Error('Failed to fetch investment data')
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching investment data:", error)
    return [] // Return an empty array if there's an error
  }
}

const generateChartData = (investments) => {
  return investments.map(inv => ({
    name: inv.name,
    value: inv.currentValue,
    returns: inv.returns
  }))
}

export default function Investments() {
  const { currency } = useCurrency();
  const [investments, setInvestments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingInvestment, setIsAddingInvestment] = useState(false)
  const [newInvestment, setNewInvestment] = useState({ name: '', type: '', amount: '' })
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' })
  const [filterType, setFilterType] = useState('All')
  const [chartData, setChartData] = useState([])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const data = await fetchInvestmentData()
      setInvestments(data)
      setChartData(generateChartData(data))
    } catch (error) {
      console.error("Error fetching investment data:", error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchData()
    const intervalId = setInterval(fetchData, 60000) // Update every minute
    return () => clearInterval(intervalId)
  }, [])

  const handleAddInvestment = async () => {
    if (newInvestment.name && newInvestment.type && newInvestment.amount) {
      const investment = {
        id: Date.now(),
        name: newInvestment.name,
        type: newInvestment.type,
        amount: parseFloat(newInvestment.amount),
        currentValue: parseFloat(newInvestment.amount),
        returns: 0
      }
      const updatedInvestments = [...investments, investment]
      setInvestments(updatedInvestments)
      setChartData(generateChartData(updatedInvestments))

      try {
        await fetch('/api/investments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(investment)
        })
      } catch (error) {
        console.error('Error adding investment:', error)
      }

      setNewInvestment({ name: '', type: '', amount: '' })
      setIsAddingInvestment(false)
    }
  }

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0)
  const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0)
  const overallReturns = ((totalCurrentValue - totalInvested) / totalInvested) * 100

  const handleSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const sortedInvestments = React.useMemo(() => {
    let sortableItems = [...investments]
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      })
    }
    return sortableItems
  }, [investments, sortConfig])

  const filteredInvestments = sortedInvestments.filter(inv => 
    filterType === 'All' || inv.type === filterType
  )

  return (
    <div className="investments-container">
      <motion.main 
        className="investments-main"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="investments-header">
          <h1 className="investments-title">Investment Portfolio</h1>
          <button className="refresh-button" onClick={fetchData} disabled={isLoading}>
            <RefreshCw className="refresh-icon" />
            Refresh Data
          </button>
        </div>
        
        <div className="investments-grid">
          <div className="investment-card">
            <h2 className="card-title">Total Invested</h2>
            <p className="card-value">
              <DollarSign className="card-icon" />
              {formatCurrency(totalInvested, currency.code, currency.symbol)}
            </p>
          </div>
          <div className="investment-card">
            <h2 className="card-title">Current Value</h2>
            <p className="card-value">
              <DollarSign className="card-icon" />
              {formatCurrency(totalCurrentValue, currency.code, currency.symbol)}
            </p>
          </div>
          <div className="investment-card">
            <h2 className="card-title">Overall Returns</h2>
            <p className={`card-value ${overallReturns >= 0 ? 'positive' : 'negative'}`}>
              {overallReturns >= 0 ? <TrendingUp className="card-icon" /> : <TrendingDown className="card-icon" />}
              {overallReturns.toFixed(2)}%
            </p>
          </div>
        </div>

        <div className="chart-container">
          <h2 className="chart-title"><BarChart className="chart-icon" /> Portfolio Composition</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line yAxisId="right" type="monotone" dataKey="returns" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <RefreshCw className="loading-icon" />
            <p className="loading-text">Loading investment data...</p>
          </div>
        ) : (
          <div className="investment-table-container">
            <div className="table-controls">
              <div className="filter-control">
                <Filter className="filter-icon" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="All">All Types</option>
                  <option value="Stock">Stocks</option>
                  <option value="ETF">ETFs</option>
                  <option value="Bonds">Bonds</option>
                  <option value="Crypto">Cryptocurrency</option>
                  <option value="Real Estate">Real Estate</option>
                </select>
              </div>
            </div>
            <table className="investment-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('name')}>Name {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}</th>
                  <th onClick={() => handleSort('type')}>Type {sortConfig.key === 'type' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}</th>
                  <th onClick={() => handleSort('amount')}>Invested Amount {sortConfig.key === 'amount' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}</th>
                  <th onClick={() => handleSort('currentValue')}>Current Value {sortConfig.key === 'currentValue' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}</th>
                  <th onClick={() => handleSort('returns')}>Returns {sortConfig.key === 'returns' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvestments.map((investment) => (
                  <tr key={investment.id}>
                    <td>{investment.name}</td>
                    <td>{investment.type}</td>
                    <td>{formatCurrency(investment.amount, currency.code, currency.symbol)}</td>
                    <td>{formatCurrency(investment.currentValue, currency.code, currency.symbol)}</td>
                    <td className={investment.returns >= 0 ? 'positive' : 'negative'}>
                      {investment.returns.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="add-investment">
          <button onClick={() => setIsAddingInvestment(!isAddingInvestment)} className="add-investment-btn">
            <Plus className="add-investment-icon" /> Add Investment
          </button>

          {isAddingInvestment && (
            <motion.div
              className="investment-form"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3>Add New Investment</h3>
              <input
                type="text"
                value={newInvestment.name}
                onChange={(e) => setNewInvestment({ ...newInvestment, name: e.target.value })}
                placeholder="Investment Name"
              />
              <input
                type="text"
                value={newInvestment.type}
                onChange={(e) => setNewInvestment({ ...newInvestment, type: e.target.value })}
                placeholder="Investment Type"
              />
              <input
                type="number"
                value={newInvestment.amount}
                onChange={(e) => setNewInvestment({ ...newInvestment, amount: e.target.value })}
                placeholder="Invested Amount"
              />
              <div className="form-buttons">
                <button onClick={handleAddInvestment}>Add Investment</button>
                <button onClick={() => setIsAddingInvestment(false)}><X className="close-icon" /></button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.main>
    </div>
  )
}
